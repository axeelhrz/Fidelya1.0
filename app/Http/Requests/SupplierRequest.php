<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class SupplierRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $supplierId = $this->route('supplier')?->id;

        return [
            'name' => 'required|string|max:150',
            'business_name' => 'nullable|string|max:200',
            'tax_id' => [
                'nullable',
                'string',
                'max:20',
                Rule::unique('suppliers')->ignore($supplierId)
            ],
            'contact_person' => 'nullable|string|max:100',
            'phone' => 'nullable|string|max:20',
            'email' => [
                'nullable',
                'email',
                'max:100',
                Rule::unique('suppliers')->ignore($supplierId)
            ],
            'address' => 'nullable|string|max:500',
            'city' => 'nullable|string|max:100',
            'state' => 'nullable|string|max:100',
            'postal_code' => 'nullable|string|max:10',
            'payment_terms' => 'required|in:contado,30_dias,60_dias,90_dias',
            'credit_limit' => 'nullable|numeric|min:0',
            'notes' => 'nullable|string|max:1000',
            'is_active' => 'boolean',
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'El nombre del proveedor es obligatorio.',
            'name.max' => 'El nombre no puede exceder 150 caracteres.',
            'business_name.max' => 'La razón social no puede exceder 200 caracteres.',
            'tax_id.unique' => 'Este CUIT ya está registrado.',
            'contact_person.max' => 'El nombre del contacto no puede exceder 100 caracteres.',
            'email.email' => 'El formato del email no es válido.',
            'email.unique' => 'Este email ya está registrado.',
            'payment_terms.required' => 'Debe seleccionar los términos de pago.',
            'payment_terms.in' => 'Los términos de pago seleccionados no son válidos.',
            'credit_limit.min' => 'El límite de crédito no puede ser negativo.',
            'notes.max' => 'Las notas no pueden exceder 1000 caracteres.',
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'is_active' => $this->boolean('is_active', true),
            'credit_limit' => $this->input('credit_limit', 0),
        ]);
    }
}