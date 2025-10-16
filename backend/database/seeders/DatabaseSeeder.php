<?php

namespace Database\Seeders;

use App\Models\Post;
use App\Models\User;
use Illuminate\Database\Seeder;

/*
|--------------------------------------------------------------------------
| DatabaseSeeder
|--------------------------------------------------------------------------
| This is the main seeder executed when running `php artisan db:seed`.
| It populates the database with sample data using the Post factory.
|--------------------------------------------------------------------------
*/
class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::factory()->count(10)->create([]);
        // Generate 50 fake posts using the Post factory
        Post::factory()->count(50)->create();
    }
}
