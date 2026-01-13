<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Posts\PostController;
use App\Http\Controllers\Admin\AdminController;

Route::prefix('posts')->group(function () {
    Route::get('/', [PostController::class, 'index']); // Liste
    Route::get('/{post:slug}', [PostController::class, 'show']); // Détail
    Route::post('/', [PostController::class, 'store'])->middleware('editor'); // Création
    Route::put('/{post:slug}', [PostController::class, 'update'])->middleware('editor'); // Modification
    Route::delete('/{post:slug}', [PostController::class, 'destroy'])->middleware('admin'); // Suppression
});

Route::get('/admin/dashboard', [AdminController::class, 'dashboard'])->middleware('admin');
