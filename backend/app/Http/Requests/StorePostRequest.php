<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePostRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255', 'unique:posts,title'],
            'body' => ['nullable', 'string'],
            'published' => ['required', 'boolean'],
        ];
    }

    public function messages(): array
    {
        return [
            'title.required' => 'The title is required.',
            'title.string' => 'The title must be a valid string.',
            'title.max' => 'The title cannot exceed 255 characters.',
            'title.unique' => 'A post with this title already exists.',
            'body.string' => 'The body must be valid text.',
            'published.required' => 'The publication status is required.',
            'published.boolean' => 'The published field must be true or false.',
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'published' => filter_var($this->input('published'), FILTER_VALIDATE_BOOL),
        ]);
    }
}
