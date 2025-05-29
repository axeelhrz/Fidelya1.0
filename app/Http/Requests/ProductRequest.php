<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $productId = $this->route('product')?->id;

        return [
            'name' => 'required|string|max:200',
            'description' => 'nullable|string|max:1000',
            'category_id' => 'required|exists:categories,id',
            'supplier_id' => 'nullable|exists:suppliers,id',
            'code' => [
                'nullable',
                'string',
                'max:50',
                Rule::unique('products')->ignore($productId)
            ],
            'barcode' => [
                'nullable',
                'string',
                'max:50',
                Rule::unique('products')->ignore($productId)
            ],
            'cost_price' => 'required|numeric|min:0',
            'sale_price' => 'required|numeric|min:0|gt:cost_price',
            'wholesale_price' => 'nullable|numeric|min:0',
            'stock_quantity' => 'required|numeric|min:0',
            'min_stock' => 'required|numeric|min:0',
            'max_stock' => 'nullable|numeric|min:0|gte:min_stock',
            'unit' => 'required|in:kg,g,unidad,caja,bolsa,litro,ml',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'is_perishable' => 'boolean',
            'shelf_life_days' => 'nullable|integer|min:1|required_if:is_perishable,true',
            'expiry_date' => 'nullable|date|after:today|required_if:is_perishable,true',
            'is_active' => 'boolean',
            'track_stock' => 'boolean',
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'El nombre del producto es obligatorio.',
            'name.max' => 'El nombre no puede exceder 200 caracteres.',
            'category_id.required' => 'Debe seleccionar una categoría.',
            'category_id.exists' => 'La categoría seleccionada no es válida.',
            'code.unique' => 'Este código ya está en uso por otro producto.',
            'barcode.unique' => 'Este código de barras ya está en uso.',
            'cost_price.required' => 'El precio de costo es obligatorio.',
            'cost_price.min' => 'El precio de costo debe ser mayor a 0.',
            'sale_price.required' => 'El precio de venta es obligatorio.',
            'sale_price.gt' => 'El precio de venta debe ser mayor al precio de costo.',
            'stock_quantity.required' => 'La cantidad en stock es obligatoria.',
            'stock_quantity.min' => 'La cantidad en stock no puede ser negativa.',
            'min_stock.required' => 'El stock mínimo es obligatorio.',
            'min_stock.min' => 'El stock mínimo no puede ser negativo.',
            'max_stock.gte' => 'El stock máximo debe ser mayor o igual al stock mínimo.',
            'unit.required' => 'Debe seleccionar una unidad de medida.',
            'unit.in' => 'La unidad de medida seleccionada no es válida.',
            'image.image' => 'El archivo debe ser una imagen.',
            'image.mimes' => 'La imagen debe ser de tipo: jpeg, png, jpg o gif.',
            'image.max' => 'La imagen no puede exceder 2MB.',
            'shelf_life_days.required_if' => 'Los días de vida útil son obligatorios para productos perecederos.',
            'expiry_date.required_if' => 'La fecha de vencimiento es obligatoria para productos perecederos.',
            'expiry_date.after' => 'La fecha de vencimiento debe ser posterior a hoy.',
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'is_perishable' => $this->boolean('is_perishable'),
            'is_active' => $this->boolean('is_active', true),
            'track_stock' => $this->boolean('track_stock', true),
        ]);
    }
}