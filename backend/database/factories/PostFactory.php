<?php

namespace Database\Factories;

use App\Models\Post;
use Faker\Generator;
use Illuminate\Database\Eloquent\Factories\Factory;
use Faker\Factory as FakerFactory;

class PostFactory extends Factory
{
    protected $model = Post::class;
    protected Generator $customFaker;

    public function __construct(...$args)
    {
        parent::__construct(...$args);
        $this->customFaker = FakerFactory::create('fr_FR');
    }

    public function definition(): array
    {
        return [
            'title' => $this->customFaker->sentence(5),
            'body' => $this->customFaker->paragraph(2, true),
            'published' => $this->customFaker->boolean(60),
        ];
    }
}
