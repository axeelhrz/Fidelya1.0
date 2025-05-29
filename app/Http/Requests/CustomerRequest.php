<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CustomerRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $customerId = $this->route('customer')?->id;

        return [
            'name' => 'required|string|max:150',
            'last_name' => 'nullable|string|max:150',
            'business_name' => 'nullable|string|max:200',
            'customer_type' => 'required|in:individual,business',
            'tax_id' => [
                'nullable',
                'string',
                'max:20',
                Rule::unique('customers')->ignore($customerId)
            ],
            'phone' => [
                'nullable',
                'string',
                'max:20',
                Rule::unique('customers')->ignore($customerId)
            ],
            'email' => [
                'nullable',
                'email',
                'max:100',
                Rule::unique('customers')->ignore($customerId)
            ],
            'address' => 'nullable|string|max:500',
            'city' => 'nullable|string|max:100',
            'birth_date' => 'nullable|date|before:today',
            'preferred_payment' => 'required|in:efectivo,tarjeta,transferencia',
            'credit_limit' => 'nullable|numeric|min:0',
            'notes' => 'nullable|string|max:1000',
            'is_active' => 'boolean',
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'El nombre es obligatorio.',
            'name.max' => 'El nombre no puede exceder 150 caracteres.',
            'business_name.max' => 'La razón social no puede exceder 200 caracteres.',
            'customer_type.required' => 'Debe seleccionar el tipo de cliente.',
            'customer_type.in' => 'El tipo de cliente seleccionado no es válido.',
            'tax_id.unique' => 'Este CUIT/DNI ya está registrado.',
            'phone.unique' => 'Este teléfono ya está registrado.',
            'email.email' => 'El formato del email no es válido.',
            'email.unique' => 'Este email ya está registrado.',
            'birth_date.before' => 'La fecha de nacimiento debe ser anterior a hoy.',
            'preferred_payment.required' => 'Debe seleccionar un método de pago preferido.',
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

    public function withValidator($validator): void
    {
        $validator->after(function ($validator) {
            // Si es empresa, validar que tenga razón social
            if ($this->customer_type === 'business' && empty($this->business_name)) {
                $validator->errors()->add('business_name', 'La razón social es obligatoria para empresas.');
            }

            // Si es empresa, validar que tenga CUIT
            if ($this->customer_type === 'business' && empty($this->tax_id)) {
                $validator->errors()->add('tax_id', 'El CUIT es obligatorio para empresas.');
            }
        });
    }
}