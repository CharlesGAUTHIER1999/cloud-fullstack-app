<?php

namespace App\Http\Controllers\Posts;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePostRequest;
use App\Http\Requests\UpdatePostRequest;
use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class PostController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $perPage = (int) $request->query('per_page', 10);
        if (!in_array($perPage, [10, 25, 50, 100])) {
            $perPage = 10;
        }

        $posts = Post::latest()->paginate($perPage);

        return response()->json([
            'data' => $posts->items(),
            'meta' => [
                'total' => $posts->total(),
                'per_page' => $posts->perPage(),
                'current_page' => $posts->currentPage(),
                'last_page' => $posts->lastPage(),
            ],
        ], 200);
    }

    public function store(StorePostRequest $request): JsonResponse
    {
        $post = Post::create($request->validated());

        return response()->json([
            'message' => '✅ Post created successfully',
            'post' => $post,
        ], 201);
    }

    public function show(Post $post): JsonResponse
    {
        return response()->json($post, 200);
    }

    public function update(UpdatePostRequest $request, Post $post): JsonResponse
    {
        $post->update($request->validated());

        return response()->json([
            'message' => "✅ Post #{$post->getKey()} updated successfully",
            'post' => $post,
        ], 200);
    }

    public function destroy(Post $post): JsonResponse
    {
        $id = $post->getKey();
        $post->delete();

        return response()->json([
            'message' => "🗑️ Post #$id deleted successfully",
        ], 200);
    }

    public function health(): JsonResponse
    {
        return response()->json([
            'status' => '✅ API is working fine!',
            'timestamp' => now()->toDateTimeString(),
            'available_endpoints' => [
                'GET /api/posts',
                'GET /api/posts/{id}',
                'POST /api/posts',
                'PUT /api/posts/{id}',
                'DELETE /api/posts/{id}',
            ],
        ], 200);
    }
}
