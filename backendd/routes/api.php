<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\LeagueController;
use App\Http\Controllers\ClubController;
use App\Http\Controllers\MemberController;
use App\Http\Controllers\SportController;
use App\Http\Controllers\SportParameterController;
use App\Http\Controllers\TournamentController;
use App\Http\Controllers\InvitationController;

// Test endpoint for debugging
Route::get('/test', function () {
    return response()->json([
        'message' => 'API is working',
        'timestamp' => now(),
        'cors_test' => 'success'
    ]);
});

// Test registration endpoint without CSRF for debugging
Route::post('/test-register', function (Request $request) {
    return response()->json([
        'message' => 'Test registration endpoint working',
        'data' => $request->all(),
        'timestamp' => now()
    ]);
});

// Authentication routes (no middleware)
Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
    Route::get('/me', [AuthController::class, 'me'])->middleware('auth:sanctum');
    
    // Registration helper endpoints
    Route::get('/leagues', [AuthController::class, 'getAvailableLeagues']);
    Route::get('/clubs', [AuthController::class, 'getAvailableClubs']);
});

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // Leagues
    Route::apiResource('leagues', LeagueController::class);
    
    // Clubs
    Route::apiResource('clubs', ClubController::class);
    
    // Club-League management routes
    Route::post('/clubs/{club}/add-to-league', [ClubController::class, 'addToLeague']);
    Route::post('/clubs/{club}/remove-from-league', [ClubController::class, 'removeFromLeague']);
    
    // Members equipment data (must be before apiResource to avoid route conflicts)
    Route::get('/members/equipment-data', [MemberController::class, 'getEquipmentData']);
    
    // Members
    Route::apiResource('members', MemberController::class);
    
    // Sports
    Route::apiResource('sports', SportController::class);
    
    // Sport Parameters
    Route::prefix('sports/{sport}')->group(function () {
        Route::get('/parameters', [SportParameterController::class, 'index']);
        Route::post('/parameters', [SportParameterController::class, 'store']);
        Route::put('/parameters/{parameter}', [SportParameterController::class, 'update']);
        Route::delete('/parameters/{parameter}', [SportParameterController::class, 'destroy']);
    });
    
    // Tournaments
    Route::apiResource('tournaments', TournamentController::class);
    
    // Tournament-specific routes
    Route::prefix('tournaments')->group(function () {
        Route::get('/league/{league}', [TournamentController::class, 'getByLeague']);
        Route::get('/league/{league}/stats', [TournamentController::class, 'getLeagueStats']);
    });
    
    // Invitations
    Route::apiResource('invitations', InvitationController::class)->except(['update', 'destroy']);
    
    // Invitation-specific routes
    Route::prefix('invitations')->group(function () {
        Route::post('/{invitation}/accept', [InvitationController::class, 'accept']);
        Route::post('/{invitation}/reject', [InvitationController::class, 'reject']);
        Route::post('/{invitation}/cancel', [InvitationController::class, 'cancel']);
        Route::get('/available-clubs', [InvitationController::class, 'getAvailableClubs']);
        Route::get('/available-leagues', [InvitationController::class, 'getAvailableLeagues']);
        Route::get('/available-entities', [InvitationController::class, 'getAvailableEntities']);
    });
});

// Health check endpoint
Route::get('/health', function () {
    return response()->json(['status' => 'ok', 'timestamp' => now()]);
});