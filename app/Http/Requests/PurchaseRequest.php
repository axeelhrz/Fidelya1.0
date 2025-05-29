<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PurchaseRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'supplier_id' => 'required|exists:suppliers,id',
            'supplier_invoice_number' => 'nullable|string|max:50',
            'supplier_invoice_date' => 'nullable|date',
            'expected_date' => 'nullable|date|after_or_equal:today',
            'payment_method' => 'required|in:efectivo,transferencia,cheque,cuenta_corriente',
            'discount_amount' => 'nullable|numeric|min:0',
            'notes' => 'nullable|string|max:1000',
            
            // Items de la compra
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|numeric|min:0.001',
            'items.*.unit_cost' => 'required|numeric|min:0',
            'items.*.discount_percentage' => 'nullable|numeric|min:0|max:100',
            'items.*.expiry_date' => 'nullable|date|after:today',
            'items.*.batch_number' => 'nullable|string|max:50',
        ];
    }

    public function messages(): array
    {
        return [
            'supplier_id.required' => 'Debe seleccionar un proveedor.',
            'supplier_id.exists' => 'El proveedor seleccionado no es válido.',
            'supplier_invoice_date.date' => 'La fecha de factura del proveedor no es válida.',
            'expected_date.after_or_equal' => 'La fecha esperada debe ser hoy o posterior.',
            'payment_method.required' => 'Debe seleccionar un método de pago.',
            'payment_method.in' => 'El método de pago seleccionado no es válido.',
            'discount_amount.min' => 'El descuento no puede ser negativo.',
            'notes.max' => 'Las notas no pueden exceder 1000 caracteres.',
            
            'items.required' => 'Debe agregar al menos un producto a la compra.',
            'items.min' => 'Debe agregar al menos un producto a la compra.',
            'items.*.product_id.required' => 'Debe seleccionar un producto.',
            'items.*.product_id.exists' => 'El producto seleccionado no es válido.',
            'items.*.quantity.required' => 'La cantidad es obligatoria.',
            'items.*.quantity.min' => 'La cantidad debe ser mayor a 0.',
            'items.*.unit_cost.required' => 'El costo unitario es obligatorio.',
            'items.*.unit_cost.min' => 'El costo unitario no puede ser negativo.',
            'items.*.discount_percentage.max' => 'El descuento no puede ser mayor al 100%.',
            'items.*.expiry_date.after' => 'La fecha de vencimiento debe ser posterior a hoy.',
            'items.*.batch_number.max' => 'El número de lote no puede exceder 50 caracteres.',
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'discount_amount' => $this->input('discount_amount', 0),
        ]);
    }

    public function withValidator($validator): void
    {
        $validator->after(function ($validator) {
            // Validar que productos perecederos tengan fecha de vencimiento
            foreach ($this->items as $index => $item) {
                $product = \App\Models\Product::find($item['product_id']);
                if ($product && $product->is_perishable && empty($item['expiry_date'])) {
                    $validator->errors()->add(
                        "items.{$index}.expiry_date",
                        "La fecha de vencimiento es obligatoria para {$product->name} (producto perecedero)."
                    );
                }
            }
        });
    }
}