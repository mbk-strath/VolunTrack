<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\MembershipController;
use App\Http\Middleware\RoleMiddleware;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});


/////////////////////////////////////////////////////////////////
// Unprotected Unauthenticated Routes:
Route::post('/register', [\App\Http\Controllers\MembershipController::class, 'register']);
Route::post('/login', [\App\Http\Controllers\MembershipController::class, 'login']);
Route::get('/verify/{id}', [\App\Http\Controllers\MembershipController::class, 'verify']);
Route::post('/verify-otp', [\App\Http\Controllers\MembershipController::class, 'verifyOtp']);
Route::post('/reset-otp', [\App\Http\Controllers\MembershipController::class, 'passwordResetOtp']);
Route::post('/reset-password', [\App\Http\Controllers\MembershipController::class, 'passwordReset']);

Route::middleware('auth:sanctum', 'role:admin')->group(function(){

});

Route::middleware('auth:sanctum', 'role:admin,organisation')->group(function(){

});

Route::middleware('auth:sanctum', 'role:admin,volunteer')->group(function(){

});

Route::middleware('auth:sanctum', 'role:admin,organisation,volunteer')->group(function(){
    Route::get('/show/{id}', [MembershipController::class, 'show']);
    Route::put('/update/{id}/{type}', [MembershipController::class, 'update']);
    Route::delete('/delete/{id}/{type}', [MembershipController::class, 'destroy']);
    Route::get('/all-memberships', [MembershipController::class, 'list']);
    Route::post('/logout', [\App\Http\Controllers\MembershipController::class, 'logout']);
    
});



// ///////////////////////////////////////////////  OLD AUTH ROUTES ///////////////////////
// Route::post('/register', [\App\Http\Controllers\AuthController::class, 'register']);
// Route::post('/login', [\App\Http\Controllers\AuthController::class, 'login']);
// Route::get('/verify/{id}', [\App\Http\Controllers\AuthController::class, 'verify']);
// Route::post('/verify-otp', [AuthController::class, 'verifyOtp']);
// Route::post('/reset-otp', [AuthController::class, 'passwordResetOtp']);
// Route::post('/reset-password', [AuthController::class, 'passwordReset']);