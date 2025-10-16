<?php

namespace App\Console\Commands;

use App\Models\Post;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class PostsImport extends Command
{
    protected $signature = 'post:import
        {path : Path to the JSON file to import (example: storage/exports/posts.json}
        {--update : Update if the slug already exists (otherwise, skip)}
        {--dry-run : Simulate without writing to the database}
        {--only: Columns to take into account (example: title,body,published,slug)}';

    protected $description = 'Import posts from a JSON file (upsert by slug, dry-run supported)';

    public function handle(): int
    {
        $pathArg = $this->argument('path');

        $only = $this->option('only')
            ? array_map('trim', explode(',', $this->option('only')))
            : null;

        if (is_file($pathArg)) {
            $json = file_get_contents($pathArg); // direct read
            $displayPath = $pathArg;
        } else {
            if (!Storage::disk('local')->exists($pathArg)) {
                $this->error("File not found: $pathArg");
                return self::INVALID;
            }
            $json = Storage::disk('local')->get($pathArg);
            $displayPath = storage_path("app/$pathArg");
        }

        try {
            $rows = json_decode($json, true, flags: JSON_THROW_ON_ERROR);
            if (!is_array($rows)) {
                $this->error('Invalid JSON: root is not an array.');
                return self::INVALID;
            }
        } catch (\JsonException $e) {
            $this->error('JSON error: ' . $e->getMessage());
            return self::INVALID;
        }

        $dryRun = (bool)$this->option('dry-run'); // if true, only simulate
        $allowUpdate = (bool)$this->option('update'); // if true, update existing slugs
        $created = $updated = $skipped = $errors = 0;

        foreach ($rows as $i => $row) {
            try {
                if (!is_array($row)) {
                    $this->line("skip #$i (non-object entry)");
                    $skipped++;
                    continue;
                }

                if ($only) {
                    $row = array_intersect_key($row, array_flip($only));
                }

                $title = trim((string)($row['title'] ?? ''));
                $body = array_key_exists('body', $row) ? (string)($row['body'] ?? '') : null;
                $published = array_key_exists('published', $row) && $row['published'];

                $slug = isset($row['slug']) && $row['slug'] !== ''
                    ? Str::slug((string)$row['slug'])
                    : Str::slug($title);

                if ($slug === '') {
                    $slug = 'post';
                }

                $base = $slug;
                $j = 1;
                while (Post::where('slug', $slug)->exists() &&
                    !($allowUpdate && Post::where('slug', $slug)->exists())) {
                    $slug = $base . '-' . ($j++);
                }

                $existing = Post::where('slug', $slug)->first();

                $data = [
                    'title' => $title !== '' ? $title : 'Untitled',
                    'body' => $body,
                    'published' => $published,
                    'slug' => $slug,
                ];

                if (!$existing) {
                    // CREATE
                    $dryRun
                        ? $this->line("[dry-run] create $slug")
                        : Post::create($data) && $this->line("create $slug");
                    $created++;
                } elseif (!$allowUpdate) {
                    // SKIP
                    $this->line("skip $slug (already exists)");
                    $skipped++;
                } else {
                    // UPDATE
                    $dryRun
                        ? $this->line("[dry-run] update $slug")
                        : $existing->update($data) && $this->line("update $slug");
                    $updated++;
                }
            } catch (\Throwable $e) {
                $this->error("Error line #$i: " . $e->getMessage());
                $errors++;
            }
        }
        $this->info("Import finished from: $displayPath");
        $this->line("Created: $created | Updated: $updated | Skipped: $skipped | Errors: $errors");
        return $errors ? self::FAILURE : self::SUCCESS;
    }
}

