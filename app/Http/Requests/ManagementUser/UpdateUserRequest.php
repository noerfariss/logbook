<?php

namespace App\Http\Requests\ManagementUser;

use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'username' => ['required', 'string', 'max:255', Rule::unique(User::class)->ignore($this->route('user'))],
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique(User::class)->ignore($this->route('user'))],
            'password' => ['nullable', 'string', 'min:6', 'confirmed'],
            'roles' => ['array'],
            'roles.*' => ['string', Rule::exists(Role::class, 'name')],
        ];
    }
}
