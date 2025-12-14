<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateCommissionRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'all_origins' => 'sometimes|boolean',
            'all_destinations' => 'sometimes|boolean',
            'origins' => 'sometimes|nullable|array',
            'destinations' => 'sometimes|nullable|array',
            'rate' => 'sometimes|required|numeric|min:0',
            'rate_type' => 'sometimes|required|in:percentage,flat',
        ];
    }
    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            if ($this->boolean('all_origins') || $this->boolean('all_destinations')) {
                return;
            }

            $origins = $this->input('origins', []);
            $dests   = $this->input('destinations', []);

            $normalize = fn($items) => array_map(fn($i) => is_array($i) ? ($i['code'] ?? '') : $i, $items);

            $originCodes = $normalize($origins);
            $destCodes   = $normalize($dests);

            if (!empty(array_intersect($originCodes, $destCodes))) {
                $validator->errors()->add(
                    'destinations',
                    'Origin and Destination cannot be the same.'
                );
            }
        });
    }
    public function attributes(): array
    {
        return [
            'rate' => 'Commission Rate',
            'rate_type' => 'Rate Type',
            'origins' => 'Origins',
            'destinations' => 'Destinations',
        ];
    }

    public function messages(): array
    {
        return [
            'rate.required' => 'The Commission Rate is required.',
            'rate.numeric' => 'The Commission Rate must be a valid number.',
            'rate_type.in' => 'The Rate Type must be either "percentage" or "flat".',
        ];
    }
}
