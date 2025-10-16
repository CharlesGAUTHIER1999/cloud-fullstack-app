<?php

namespace App\Console\Commands;

use App\Models\Post;
use Illuminate\Console\Command;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Storage;

class PostsExport extends Command
{
    // Def of artisan command and possible options
    protected $signature = 'posts:export
        {--path= : Json path (example : storage/export/posts.json)}
        {--published-only : only published posts exportation}
        {--since= : export created post since YYYY-MM-DD}
        {--limit= : restrict posts number}
        {--columns= : id, slug, title, body, published, created_at, updated_at}';

    protected $description = 'Export posts with JSON (filters and columns configurable)';

    public function handle(): int
    {
        $path = $this->option('path') ?: ('export/posts-' . now()->format('Ymd_His') . '.json');

        $cols = $this->option('columns')
            ? array_map('trim', explode(',', $this->option('columns')))
            : ['id', 'slug', 'title', 'body', 'published', 'created_at', 'updated_at'];

        $q = Post::query()->orderBy('id');

        if ($this->option('published-only')) { $q->where('published', true); }

        if ($since = $this->option('since')) {
            try {
                $dt = Carbon::parse($since)->startOfDay();
                $q->where('created_at', '>=', $dt);
            } catch (\Throwable) {
                $this->error("Invalid date for --since: $since");
                return self::INVALID;
            }
        }

        if ($limit = $this->option('limit')) { $q->limit((int)$limit); }

        $rows = $q->get($cols)
            ->map(function (Post $p) use ($cols) {
                $row = $p->only($cols);

                if (array_key_exists('published', $row)) {
                    $row['published'] = (bool) $row['published'];
                }

                foreach (['created_at', 'updated_at'] as $key) {
                    if (array_key_exists($key, $row) && !is_null($row[$key])){
                        $row[$key] = ($row[$key] instanceof Carbon)
                            ? $row[$key]->toIso8601String()
                            : Carbon::parse($row[$key])->toIso8601String();
                    }
                }

                return $row;
            })
            ->values()
            ->all();

        try {
            Storage::disk('local')->put(
                $path,
                json_encode($rows, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR)
            );
        } catch (\JsonException $e) {
            $this->error('JSON Error : ' . $e->getMessage());
            return self::FAILURE;
        }
        $this->info('Export OK : ' . storage_path("app/$path"));
        $this->line('Total : ' . count($rows) . ' post(s).');
        return self::SUCCESS;
    }
}


