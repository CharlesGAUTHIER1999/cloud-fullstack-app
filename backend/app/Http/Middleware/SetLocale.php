<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Session;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SetLocale
{
    public function handle(Request $request, Closure $next): Response
    {
        if ($lang = $request->query('lang')) {
            Session::put('locale', $lang);
            App::setLocale($lang);
        }
        elseif (Session::has('locale')) {
            App::setLocale(Session::get('locale'));
        }
        else {
            $default = config('app.locale', 'en');
            Session::put('locale', $default);
            App::setLocale($default);
        }
        if (!Session::has('role')) {
            Session::put('role', 'guest');
        }
        return $next($request);
    }
}

