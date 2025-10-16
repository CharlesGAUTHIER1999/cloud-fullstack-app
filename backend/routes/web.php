<?php

use Illuminate\Support\Facades\Route;

Route::get('/', static function () {
    return response()->json([
        'message' => 'Welcome to AppCloud API 🚀',
        'frontend' => 'http://localhost:5173',
    ]);
});

