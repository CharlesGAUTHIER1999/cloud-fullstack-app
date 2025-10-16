<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Post extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'body',
        'published',
        'slug',
        'author',
        'views',
        'published_at',
    ];

    protected $casts = [
        'published' => 'boolean',
        'published_at' => 'datetime',
    ];

    protected $attributes = [
        'views' => 0,
    ];

    protected static function booted(): void
    {
        // 🟢 Generate slug before creation
        static::creating(static function (Post $post) {
            if (empty($post->slug)) {
                $post->slug = static::uniqueSlug($post->title);
            }
        });

        // 🟡 Update slug if title changes
        static::updating(static function (Post $post) {
            if ($post->isDirty('title')) {
                $post->slug = static::uniqueSlug($post->title, $post->id);
            }
        });

        // 🟣 Automatically set published_at when post becomes published
        static::saving(static function (Post $post) {
            if ($post->published && !$post->published_at && $post->isDirty('published')) {
                $post->published_at = now();
            }
        });
    }

    /**
     * Generate a unique slug from a given title.
     */
    protected static function uniqueSlug(string $title, ?int $ignore_id = null): string
    {
        $base = Str::slug($title) ?: 'post';
        $slug = $base;
        $i = 1;

        while (
        static::where('slug', $slug)
            ->when($ignore_id, fn($q) => $q->where('id', '!=', $ignore_id))
            ->exists()
        ) {
            $slug = sprintf('%s-%d', $base, $i++);
        }

        return $slug;
    }

    /**
     * Use slug instead of ID for route binding.
     */
    public function getRouteKeyName(): string
    {
        return 'slug';
    }
}
