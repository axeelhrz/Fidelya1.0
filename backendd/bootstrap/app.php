<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->api(prepend: [
            \Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class,
        ]);

        $middleware->alias([
            'verified' => \App\Http\Middleware\EnsureEmailIsVerified::class,
        ]);

        // For SPA authentication, we rely on Sanctum's middleware to handle CSRF
        // The EnsureFrontendRequestsAreStateful middleware will handle CSRF validation
        $middleware->validateCsrfTokens(except: [
            'stripe/*',
            'api/*', // Disable Laravel's default CSRF for API routes - Sanctum handles this
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();