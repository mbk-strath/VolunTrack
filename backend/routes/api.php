<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// middleware
use App\Http\Middleware\RoleMiddleware;

//controllers
use App\Http\Controllers\UserController;
use App\Http\Controllers\MembershipController;
use App\Http\Controllers\GalleryController;
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
Route::post('/register', [\App\Http\Controllers\UserController::class, 'register']);
Route::post('/login', [\App\Http\Controllers\UserController::class, 'login']);
Route::get('/verify/{id}', [\App\Http\Controllers\UserController::class, 'verifyUser']);
Route::post('/verify-otp', [\App\Http\Controllers\UserController::class, 'verifyOtp']);
Route::post('/reset-otp', [\App\Http\Controllers\UserController::class, 'passwordResetOtp']);
Route::post('/reset-password', [\App\Http\Controllers\UserController::class, 'passwordReset']);


//Admin Only
Route::middleware('auth:sanctum', 'role:admin')->group(function(){
    Route::get('/all-users', [UserController::class, 'list']);
    Route::get('/all-memberships', [MembershipController::class, 'list']);
    Route::get('/all-images', [GalleryController::class, 'list']);
    Route::get('/all-applications', [ApplicationController::class, 'list']);
    Route::get('/all-participations', [ParticipationController::class, 'list']);
    Route::get('/all-notifications', [NotificationController::class, 'list']);
    Route::get('/all-reviews', [ReviewController::class, 'list']);
    Route::get('/ongoing-opportunities', [OpportunityController::class, 'ongoing']);
    
});

////Admin And Organisation Routes
Route::middleware('auth:sanctum', 'role:admin,organisation')->group(function(){
    //Gallery Controller
    Route::post('/add-image', [GalleryController::class, 'addImage']);
    Route::patch('/update-image/{id}', [GalleryController::class, 'updateImage']);
    Route::delete('/delete-image/{id}', [GalleryController::class, 'deleteImage']);
    //Opportunity Controller
    Route::post('/create-opportunity', [OpportunityController::class, 'create']);
    Route::patch('/update-opportunity/{id}', [OpportunityController::class, 'update']);
    Route::delete('/delete-opportunity/{id}', [OpportunityController::class, 'delete']);
    //Application Controller
    Route::get('/my-applicants/{id}', [ApplicationController::class, 'myApplicants']);
    Route::patch('/update-application/{id}', [ApplicationController::class, 'updateStatus']);
    //Participation Controller
    Route::get('/opportunity-participations/{id}', [ParticipationController::class, 'oppParticipations']);
    Route::post('/add-participation', [ParticipationController::class, 'create']);
    Route::delete('/delete-participation/{id}', [ParticipationController::class, 'delete']);
    //Review Controller
    Route::get('/organisation-reviews/{id}', [ReviewController::class, 'getByOrganisation']);
}); 

///Admin and Volunteer Routes
Route::middleware('auth:sanctum', 'role:admin,volunteer')->group(function(){
    //Application Controller
    Route::get('/my-applications', [ApplicationController::class, 'myApplications']);
    Route::post('/apply', [ApplicationController::class, 'apply']);
    Route::delete('/delete-application/{id}', [ApplicationController::class, 'delete']);
    //Participation Controller
    Route::get('/my-participations', [ParticipationController::class, 'myParticipations']);
    //Review Controller
    Route::post('my-reviews', [ReviewController::class, 'getByVolunteer']);
    Route::post('/create-review', [ReviewController::class, 'create']);
    Route::patch('/update-review/{id}', [ReviewController::class, 'update']);
    Route::delete('/delete-review/{id}', [ReviewController::class, 'delete']);

});


///Authenticated Routes for all roles
Route::middleware('auth:sanctum', 'role:admin,organisation,volunteer')->group(function(){
    //User Controller
    Route::patch('/update-user/{id}', [UserController::class, 'update']);
    //Membership Controller
    Route::get('/get/{id}', [MembershipController::class, 'get']);
    Route::patch('/update/{id}/', [MembershipController::class, 'update']);
    Route::delete('/delete/{id}/', [MembershipController::class, 'destroy']);
    //Gallery Controller
    Route::get('/my-gallery/{id}', [GalleryController::class, 'myGallery']);
    Route::get('/get-image/{id}', [GalleryController::class, 'getImage']);
    //Opportunity Controller
    Route::get('/get-opportunity/{id}', [OpportunityController::class, 'get']);
    Route::get('/all-opportunities', [OpportunityController::class, 'list']);
    //Notification Controller
    Route::post('/send-notification', [NotificationController::class, 'create']);
    Route::get('/my-notifications', [NotificationController::class, 'myNotifications']);
    Route::get('/unread-notifications', [NotificationController::class, 'unread']);
    Route::put('/mark-as-read/{id}', [NotificationController::class, 'markAsRead']);
    //Review Controller
    Route::get('get-review/{id}', [ReviewController::class, 'getById']);

    //Logout Route
    Route::post('/logout', [\App\Http\Controllers\UserController::class, 'logout']);
    
});



