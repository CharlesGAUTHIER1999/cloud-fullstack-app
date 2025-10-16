<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureAdmin
{
    public function handle(Request $request, Closure $next): Response
    {
        $role = session('role', 'guest');
        if ($role !== 'admin') {
            return response()->json([
                'error' => 'Forbidden: Admins only',
                'message' => 'You do not have permission to access this resource.'
            ], 403);
        }
        return $next($request);
    }
}
