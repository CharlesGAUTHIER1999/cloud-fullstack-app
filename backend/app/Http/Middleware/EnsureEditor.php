<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureEditor
{
    public function handle(Request $request, Closure $next): Response
    {
        $role = session('role', 'guest');
        if (!in_array($role, ['editor', 'admin'])) {
            return response()->json([
                'error' => 'Forbidden: Editors or Admins only',
                'message' => 'You do not have permission to access this resource.'
            ], 403);
        }
        return $next($request);
    }
}

