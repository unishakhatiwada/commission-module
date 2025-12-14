<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CommissionController;

Route::get('/airports', [CommissionController::class, 'getAirports']);

Route::apiResource('rules', CommissionController::class);
