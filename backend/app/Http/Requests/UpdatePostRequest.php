<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdatePostRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $postId = $this->route('post')?->id ?? null;

        return [
            'title' => ['required', 'string', 'max:255', Rule::unique('posts')->ignore($postId)],
            'body' => ['nullable', 'string'],
            'published' => ['required', 'boolean'],
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'published' => filter_var($this->input('published'), FILTER_VALIDATE_BOOL),
        ]);
    }

    public function messages(): array
    {
        return [
            'title.required' => 'The title is required.',
            'title.unique' => 'A post with this title already exists.',
            'body.string' => 'The body must be a valid text.',
            'published.boolean' => 'The published field must be true or false.',
        ];
    }
}
