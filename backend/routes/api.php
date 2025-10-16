<?php

use App\Http\Controllers\Posts\PostController;
use App\Http\Controllers\Admin\AdminController;

Route::prefix('posts')->group(function () {
    Route::get('/', [PostController::class, 'index']);
    Route::get('/{post:slug}', [PostController::class, 'show']);
    Route::post('/', [PostController::class, 'store'])->middleware('editor');
    Route::put('/{post:slug}', [PostController::class, 'update'])->middleware('editor');
    Route::delete('/{post:slug}', [PostController::class, 'destroy'])->middleware('admin');
});

Route::get('/admin/dashboard', [AdminController::class, 'dashboard'])->middleware('admin');
