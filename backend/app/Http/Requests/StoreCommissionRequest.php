<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreCommissionRequest extends FormRequest
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
            'rules' => 'present|array',
            'rules.*.all_origins' => 'boolean',
            'rules.*.all_destinations' => 'boolean',
            'rules.*.origins' => 'nullable|array',
            'rules.*.destinations' => 'nullable|array',
            'rules.*.rate' => 'required|numeric|min:0',
            'rules.*.rate_type' => 'required|in:percentage,flat',
        ];
    }
    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            $rules = $this->input('rules', []);

            foreach ($rules as $index => $rule) {
                $allOrigins = $rule['all_origins'] ?? false;
                $allDests   = $rule['all_destinations'] ?? false;

                if ($allOrigins || $allDests) {
                    continue;
                }

                $origins = $rule['origins'] ?? [];
                $dests   = $rule['destinations'] ?? [];

                $normalize = fn($items) => array_map(fn($i) => is_array($i) ? ($i['code'] ?? '') : $i, $items);

                $originCodes = $normalize($origins);
                $destCodes   = $normalize($dests);

                if (!empty(array_intersect($originCodes, $destCodes))) {
                    $validator->errors()->add(
                        "rules.{$index}.destinations",
                        "Origin and Destination cannot be the same."
                    );
                }
            }
        });
    }
    /**
     * Rename the ugly "rules.0.rate" to readable names
     */
    public function attributes(): array
    {
        return [
            'rules.*.rate' => 'Commission Rate',
            'rules.*.rate_type' => 'Rate Type',
            'rules.*.origins' => 'Origins',
            'rules.*.destinations' => 'Destinations',
        ];
    }
    /**
     * Customize the specific error messages
     */
    public function messages(): array
    {
        return [
            'rules.present' => 'You must send a list of rules.',
            'rules.array' => 'The rules data format is invalid.',

            'rules.*.rate.required' => 'The Commission Rate is required for all rules.',
            'rules.*.rate.numeric' => 'The Commission Rate must be a valid number (e.g. 10.5).',
            'rules.*.rate_type.in' => 'The Rate Type must be either "percentage" or "flat".',
        ];
    }
}
