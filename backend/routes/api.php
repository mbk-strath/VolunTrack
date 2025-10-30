<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// middleware
use App\Http\Middleware\RoleMiddleware;

//controllers
use App\Http\Controllers\MembershipController;
use App\Http\Controllers\galleryController;
use App\Http\Controllers\OpportunityController;
use App\Http\Controllers\ApplicationController;
use App\Http\Controllers\ParticipationController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\ReviewController;
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
    Route::get('/all-memberships', [MembershipController::class, 'list']);
    Route::get('/all-galleries', [GalleryController::class, 'listGalleries']);
    Route::get('/all-applications', [ApplicationController::class, 'list']);
    Route::get('/all-participations', [ParticipationController::class, 'list']);
    Route::get('/all-notifications', [NotificationController::class, 'list']);
    Route::get('/all-reviews', [ReviewController::class, 'list']);
    
});

Route::middleware('auth:sanctum', 'role:admin,organisation')->group(function(){
    Route::post('/add-gallery', [GalleryController::class, 'addGallery']);
    Route::put('/update-gallery/{id}', [GalleryController::class, 'updateGallery']);
    Route::delete('/delete-gallery/{id}', [GalleryController::class, 'deleteGallery']);
    Route::post('/create-opportunity', [OpportunityController::class, 'create']);
    Route::put('/update-opportunity/{id}', [OpportunityController::class, 'update']);
    Route::delete('/delete-opportunity/{id}', [OpportunityController::class, 'delete']);
    Route::get('/my-applicants/{id}', [ApplicationController::class, 'myApplicants']);
    Route::put('/update-application/{id}', [ApplicationController::class, 'updateStatus']);
    Route::get('/opportunity-participations/{id}', [ParticipationController::class, 'oppParticipations']);
    Route::post('/add-participation', [ParticipationController::class, 'create']);
    Route::delete('/delete-participation/{id}', [ParticipationController::class, 'delete']);
    Route::get('/organisation-reviews/{id}', [ReviewController::class, 'getByOrganisation']);
}); 

Route::middleware('auth:sanctum', 'role:admin,volunteer')->group(function(){
    Route::get('/my-applications', [ApplicationController::class, 'myApplications']);
    Route::post('/apply', [ApplicationController::class, 'apply']);
    Route::delete('/delete-application/{id}', [ApplicationController::class, 'delete']);
    Route::get('/my-participations', [ParticipationController::class, 'myParticipations']);
    Route::post('my-reviews', [ReviewController::class, 'getByVolunteer']);
    Route::post('/create-review', [ReviewController::class, 'create']);
    Route::put('/update-review/{id}', [ReviewController::class, 'update']);
    Route::delete('/delete-review/{id}', [ReviewController::class, 'delete']);

});

Route::middleware('auth:sanctum', 'role:admin,organisation,volunteer')->group(function(){
    Route::get('/show/{id}', [MembershipController::class, 'show']);
    Route::put('/update/{id}/{type}', [MembershipController::class, 'update']);
    Route::delete('/delete/{id}/{type}', [MembershipController::class, 'destroy']);

    Route::get('/my-gallery/{id}', [GalleryController::class, 'myGallery']);
    Route::get('/get-gallery/{id}', [GalleryController::class, 'get']);
    
    Route::get('/get-opportunity/{id}', [OpportunityController::class, 'get']);
    Route::get('/all-opportunities', [OpportunityController::class, 'list']);

    Route::post('/send-notification', [NotificationController::class, 'create']);
    Route::get('/my-notifications', [NotificationController::class, 'myNotifications']);
    Route::get('/unread-notifications', [NotificationController::class, 'unread']);
    Route::put('/mark-as-read/{id}', [NotificationController::class, 'markAsRead']);

    Route::get('get-review/{id}', [ReviewController::class, 'getById']);


    Route::post('/logout', [\App\Http\Controllers\MembershipController::class, 'logout']);
    
});



