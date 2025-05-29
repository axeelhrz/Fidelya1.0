<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SaleRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'invoice_type' => 'required|in:ticket,factura_a,factura_b,factura_c',
            'customer_id' => 'nullable|exists:customers,id',
            'payment_method' => 'required|in:efectivo,tarjeta_debito,tarjeta_credito,transferencia,cheque,cuenta_corriente',
            'discount_percentage' => 'nullable|numeric|min:0|max:100',
            'discount_amount' => 'nullable|numeric|min:0',
            'amount_paid' => 'required|numeric|min:0',
            'notes' => 'nullable|string|max:500',
            'is_tax_exempt' => 'boolean',
            'tax_condition' => 'nullable|string|max:50',
            
            // Items de la venta
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|numeric|min:0.001',
            'items.*.unit_price' => 'nullable|numeric|min:0',
            'items.*.discount_percentage' => 'nullable|numeric|min:0|max:100',
        ];
    }

    public function messages(): array
    {
        return [
            'invoice_type.required' => 'Debe seleccionar un tipo de comprobante.',
            'invoice_type.in' => 'El tipo de comprobante seleccionado no es válido.',
            'customer_id.exists' => 'El cliente seleccionado no es válido.',
            'payment_method.required' => 'Debe seleccionar un método de pago.',
            'payment_method.in' => 'El método de pago seleccionado no es válido.',
            'discount_percentage.max' => 'El descuento no puede ser mayor al 100%.',
            'amount_paid.required' => 'El monto pagado es obligatorio.',
            'amount_paid.min' => 'El monto pagado no puede ser negativo.',
            'notes.max' => 'Las notas no pueden exceder 500 caracteres.',
            
            'items.required' => 'Debe agregar al menos un producto a la venta.',
            'items.min' => 'Debe agregar al menos un producto a la venta.',
            'items.*.product_id.required' => 'Debe seleccionar un producto.',
            'items.*.product_id.exists' => 'El producto seleccionado no es válido.',
            'items.*.quantity.required' => 'La cantidad es obligatoria.',
            'items.*.quantity.min' => 'La cantidad debe ser mayor a 0.',
            'items.*.unit_price.min' => 'El precio unitario no puede ser negativo.',
            'items.*.discount_percentage.max' => 'El descuento por ítem no puede ser mayor al 100%.',
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'is_tax_exempt' => $this->boolean('is_tax_exempt'),
            'discount_percentage' => $this->input('discount_percentage', 0),
            'discount_amount' => $this->input('discount_amount', 0),
        ]);
    }

    public function withValidator($validator): void
    {
        $validator->after(function ($validator) {
            // Validar que el monto pagado sea suficiente
            $totalAmount = $this->calculateTotalAmount();
            if ($this->amount_paid < $totalAmount) {
                $validator->errors()->add('amount_paid', 'El monto pagado es insuficiente.');
            }

            // Validar stock disponible para cada producto
            foreach ($this->items as $index => $item) {
                $product = \App\Models\Product::find($item['product_id']);
                if ($product && $product->track_stock && $product->stock_quantity < $item['quantity']) {
                    $validator->errors()->add(
                        "items.{$index}.quantity",
                        "Stock insuficiente para {$product->name}. Disponible: {$product->stock_quantity}"
                    );
                }
            }
        });
    }

    private function calculateTotalAmount(): float
    {
        $subtotal = 0;
        
        foreach ($this->items as $item) {
            $product = \App\Models\Product::find($item['product_id']);
            $unitPrice = $item['unit_price'] ?? $product->sale_price;
            $itemSubtotal = $item['quantity'] * $unitPrice;
            $itemDiscount = $itemSubtotal * ($item['discount_percentage'] ?? 0) / 100;
            $subtotal += $itemSubtotal - $itemDiscount;
        }

        $generalDiscount = $this->discount_percentage > 0 
            ? ($subtotal * $this->discount_percentage / 100) 
            : $this->discount_amount;

        $taxableAmount = $subtotal - $generalDiscount;
        $taxAmount = $this->is_tax_exempt ? 0 : ($taxableAmount * 0.21);
        
        return $taxableAmount + $taxAmount;
    }
}