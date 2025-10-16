<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/*
|--------------------------------------------------------------------------
| UserFactory
|--------------------------------------------------------------------------
| Defines how fake User model data is generated for testing or seeding.
| Creates random users with unique emails, a default password, and
| optional email verification state.
|--------------------------------------------------------------------------
*/

class UserFactory extends Factory
{
    // Shared password used by all generated users
    protected static ?string $password;

    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'email_verified_at' => now(),
            'password' => static::$password ??= Hash::make('password'), // Default password
            'remember_token' => Str::random(10),
        ];
    }

    // State for users with unverified emails
    public function unverified(): static
    {
        return $this->state(fn(array $attributes) => [
            'email_verified_at' => null,
        ]);
    }
}

