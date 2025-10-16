<?php

namespace Database\Factories;

use App\Models\Post;
use Illuminate\Database\Eloquent\Factories\Factory;

class PostFactory extends Factory
{
    protected $model = Post::class;

    public function definition(): array
    {
        return [
            'title' => $this->faker->sentence(5),
            'body' => $this->faker->paragraph(2, true),
            'published' => $this->faker->boolean(60),
        ];
    }
}
