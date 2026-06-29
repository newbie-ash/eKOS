<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;

class IsAdmin
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Cek apakah ada user yang sedang login DAN apakah dia seorang admin
        if (Auth::check() && Auth::user()->isAdmin()) {
            // Jika ya, persilakan masuk (lanjutkan request)
            return $next($request);
        }

        // Jika bukan admin (atau belum login), tendang kembali ke dashboard!
        return redirect()->route('dashboard')->with('error', 'Maaf, Anda tidak memiliki akses ke halaman Admin.');
    }
}