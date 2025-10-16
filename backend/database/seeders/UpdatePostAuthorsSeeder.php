<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Post;
use Faker\Factory as Faker;

/*
|--------------------------------------------------------------------------
| UpdatePostAuthorsSeeder
|--------------------------------------------------------------------------
| This seeder updates all existing posts by assigning a random author name
| generated using Faker (in French locale). It loops through every post
| in the database and updates the 'author' field.
|--------------------------------------------------------------------------
*/

class UpdatePostAuthorsSeeder extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create('fr_FR');

        // Loop through each post and assign a random author name
        foreach (Post::all() as $post) {
            $post->author = $faker->unique()->name;
            $post->save();
        }
    }
}
