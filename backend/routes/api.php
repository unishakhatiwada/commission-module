<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CommissionController;
use Illuminate\Support\Facades\Route;

Route::post('/login', [AuthController::class, 'login']);
Route::middleware('auth:sanctum')->group(function () {

    Route::post('/logout', [AuthController::class, 'logout']);

    Route::get('/airports', [CommissionController::class, 'getAirports']);

    // Commission Rules (CRUD)
    Route::get('/rules', [CommissionController::class, 'index']);
    Route::post('/rules', [CommissionController::class, 'store']);
    Route::match(['put', 'patch'], '/rules/{id}', [CommissionController::class, 'update']);
});
