<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class AdminController extends Controller
{
    public function dashboard(Request $request): JsonResponse
    {
        $query = Post::query();

        if ($search = $request->query('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%$search%")
                    ->orWhere('author', 'like', "%$search%");
            });
        }

        if ($status = $request->query('status')) {
            if ($status === 'published') {
                $query->where('published', true);
            } elseif ($status === 'drafted') {
                $query->where('published', false);
            }
        }

        $sortBy = $request->query('sort_by', 'id');
        $sortDir = $request->query('sort_dir', 'asc');

        if (!in_array($sortBy, ['id', 'author'])) { $sortBy = 'id'; }
        if (!in_array($sortDir, ['asc', 'desc'])) { $sortDir = 'asc'; }

        $perPage = (int) $request->query('per_page', 10);
        if (!in_array($perPage, [10, 25, 50, 100], true)) { $perPage = 10; }

        $posts = $query->orderBy($sortBy, $sortDir)->paginate($perPage);

        return response()->json([
            'data' => $posts->items(),
            'meta' => [
                'total' => $posts->total(),
                'per_page' => $posts->perPage(),
                'current_page' => $posts->currentPage(),
                'last_page' => $posts->lastPage(),
                'sort_by' => $sortBy,
                'sort_dir' => $sortDir,
                'filters' => $request->only(['search', 'status']),
            ],
        ]);
    }
}
