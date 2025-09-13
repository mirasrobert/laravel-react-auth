<?php

namespace App\Http\Controllers;

use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $throttleKey = Str::lower($request->email) . '|' . $request->ip();
        $maxAttempts = 5;
        $decaySeconds = 60;

        // Check if user is rate-limited
        if (RateLimiter::tooManyAttempts($throttleKey, $maxAttempts)) {
            $seconds = RateLimiter::availableIn($throttleKey);
            return response()->error('Too many login attempts. Please try again in ' . $seconds . ' seconds.', 429);
        }

        if (!auth()->attempt($request->only('email', 'password'))) {
            // Increment failed attempts
            RateLimiter::hit($throttleKey, $decaySeconds);
            return response()->error('Invalid credentials', 401);
        }

        RateLimiter::clear($throttleKey); // Reset attempts on success
        $request->session()->regenerate();
        return response()->success(['user' => auth()->user()], 'Login successful');
    }

    public function logout()
    {
        auth()->logout();
        request()->session()->invalidate();
        request()->session()->regenerateToken();
        return response()->success([], 'Logout successful');
    }
}
