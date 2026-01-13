<?php

return [

    'paths' => ['api/*', 'health', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],
    'allowed_headers' => ['*'],

    'allowed_origins' => [
        'http://localhost:5173',
        'http://127.0.0.1:5173',
        'https://cloud-fullstack-app.vercel.app',
    ],

    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => false,
];
