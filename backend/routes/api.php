<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Posts\PostController;
use App\Http\Controllers\Admin\AdminController;

Route::get('/health/db', function () {
    try {
        DB::select('SELECT 1');
        return response()->json([
            'ok' => true,
            'db' => 'connected'
        ]);
    } catch (Throwable $e) {
        return response()->json([
            'ok' => false,
            'error' => $e->getMessage()
        ], 500);
    }
});

Route::prefix('posts')->group(function () {
    Route::get('/', [PostController::class, 'index']);
    Route::get('/{post:slug}', [PostController::class, 'show']);
    Route::post('/', [PostController::class, 'store'])->middleware('editor');
    Route::put('/{post:slug}', [PostController::class, 'update'])->middleware('editor');
    Route::delete('/{post:slug}', [PostController::class, 'destroy'])->middleware('admin');
});

Route::get('/admin/dashboard', [AdminController::class, 'dashboard'])->middleware('admin');