<?php

namespace Database\Factories;
use Illuminate\Database\Eloquent\Factories\Factory;

/*
|--------------------------------------------------------------------------
| PostFactory
|--------------------------------------------------------------------------
| Defines how fake Post model data is generated for testing or seeding.
| Each post has a random title, body content, and publication status.
|--------------------------------------------------------------------------
*/

class PostFactory extends Factory
{
    public function definition(): array
    {
        return [
            // Generate a random title of about 5 words
            'title' => fake()->sentence(5),

            // Generate a short paragraph for the post body
            'body' => fake()->paragraph(2, true),

            // Randomly decide if the post is published (60% chance)
            'published' => fake()->boolean(60),
        ];
    }
}
