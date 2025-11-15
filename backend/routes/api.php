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
use App\Http\Controllers\EvidenceController;
use App\Http\Controllers\ReportController;

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
    Route::get('/active-memberships', [MembershipController::class, 'listActive']);
    Route::get('/verified-organisations', [MembershipController::class, 'verifiedOrganisations']);
    Route::get('/all-images', [GalleryController::class, 'list']);
    Route::get('/all-applications', [ApplicationController::class, 'list']);
    Route::get('/all-participations', [ParticipationController::class, 'list']);
    Route::get('/all-notifications', [NotificationController::class, 'list']);
    Route::get('/all-evidences', [EvidenceController::class, 'list']);
    Route::get('/ongoing-opportunities', [OpportunityController::class, 'ongoing']);
    Route::get('/all-reports', [ReportController::class, 'list']);
    Route::patch('/update-report-status/{id}', [ReportController::class, 'updateStatus']);
    
});

////Admin And Organisation Routes
Route::middleware('auth:sanctum', 'role:admin,organisation')->group(function(){
    //Total Volunteers
    Route::get('/total-volunteers', [MembershipController::class, 'totalVolunteers']);
    //Gallery Controller
    Route::post('/add-image', [GalleryController::class, 'addImage']);
    Route::patch('/update-image/{id}', [GalleryController::class, 'updateImage']);
    Route::delete('/delete-image/{id}', [GalleryController::class, 'deleteImage']);
    //Opportunity Controller
    Route::post('/create-opportunity', [OpportunityController::class, 'create']);
    Route::get('/my-opportunities', [OpportunityController::class, 'myOpportunities']);
    Route::patch('/update-opportunity/{id}', [OpportunityController::class, 'update']);
    Route::delete('/delete-opportunity/{id}', [OpportunityController::class, 'delete']);
    //Application Controller
    Route::get('/my-applicants/{id}', [ApplicationController::class, 'myApplicants']);
    Route::patch('/update-application/{id}', [ApplicationController::class, 'updateStatus']);
    //Participation Controller
    Route::get('/opportunity-participations/{id}', [ParticipationController::class, 'oppParticipations']);
    Route::post('/add-participation', [ParticipationController::class, 'create']);
    Route::delete('/delete-participation/{id}', [ParticipationController::class, 'delete']);
    //Evidence Controller
    Route::get('/organisation-evidences/{id}', [EvidenceController::class, 'getByOrganisation']);
}); 

///Admin and Volunteer Routes
Route::middleware('auth:sanctum', 'role:admin,volunteer')->group(function(){
    //Application Controller
    Route::get('/my-applications', [ApplicationController::class, 'myApplications']);
    Route::post('/apply', [ApplicationController::class, 'apply']);
    Route::delete('/delete-application/{id}', [ApplicationController::class, 'delete']);
    //Participation Controller
    Route::get('/my-participations', [ParticipationController::class, 'myParticipations']);
    Route::get('/my-trends', [ParticipationController::class, 'dailyHourTrends']);
    //Evidence Controller
    Route::post('my-evidences', [EvidenceController::class, 'getByVolunteer']);
    Route::post('/create-evidence', [EvidenceController::class, 'create']);
    Route::patch('/update-evidence/{id}', [EvidenceController::class, 'update']);
    Route::delete('/delete-evidence/{id}', [EvidenceController::class, 'delete']);
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
    //Evidence Controller
    Route::get('get-evidence/{id}', [EvidenceController::class, 'getById']);
    //Report Controller
    Route::post('/create-report', [ReportController::class, 'create']);
    Route::patch('/update-report/{id}', [ReportController::class, 'update']);
    Route::delete('/delete-report/{id}', [ReportController::class, 'delete']);
    Route::get('/get-report/{id}', [ReportController::class, 'get']);
    Route::get('/my-reports', [ReportController::class, 'MyReports']);

    //Logout Route
    Route::post('/logout', [\App\Http\Controllers\UserController::class, 'logout']);
    
});



