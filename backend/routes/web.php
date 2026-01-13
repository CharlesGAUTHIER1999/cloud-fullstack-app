<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json([
        'message' => 'Welcome to AppCloud API 🚀',
        'frontend' => 'https://cloud-fullstack-app.vercel.app',
    ]);
});

Route::get('/health', function () {
    return response()->json(['status' => 'ok'], 200);
});
