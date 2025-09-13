<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Response;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Custom response macros for consistent API responses
        // Usage: return response()->success($data, 'Optional message', 200);
        // Usage: return response()->error('Error message', 400, $data);
        Response::macro('success', function ($data, $message = null, $status = 200) {
            return response()->json([
                'status' => 'success',
                'message' => $message,
                'data' => $data,
            ], $status);
        });

        Response::macro('error', function ($message = null, $status = 400, $data = null) {
            return response()->json([
                'status' => 'error',
                'message' => $message,
                'data' => $data,
            ], $status);
        });
    }
}
