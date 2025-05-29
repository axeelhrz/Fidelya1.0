<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CategoryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $categoryId = $this->route('category')?->id;

        return [
            'name' => [
                'required',
                'string',
                'max:100',
                Rule::unique('categories')->ignore($categoryId)
            ],
            'description' => 'nullable|string|max:500',
            'color' => 'required|string|regex:/^#[0-9A-Fa-f]{6}$/',
            'icon' => 'required|string|max:50',
            'is_active' => 'boolean',
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'El nombre de la categoría es obligatorio.',
            'name.unique' => 'Ya existe una categoría con este nombre.',
            'name.max' => 'El nombre no puede exceder 100 caracteres.',
            'description.max' => 'La descripción no puede exceder 500 caracteres.',
            'color.required' => 'Debe seleccionar un color para la categoría.',
            'color.regex' => 'El color debe estar en formato hexadecimal (#RRGGBB).',
            'icon.required' => 'Debe seleccionar un ícono para la categoría.',
            'icon.max' => 'El ícono no puede exceder 50 caracteres.',
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'is_active' => $this->boolean('is_active', true),
        ]);
    }
}