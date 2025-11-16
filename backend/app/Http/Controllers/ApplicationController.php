<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

//Databases
use App\Models\User;
use App\Models\Organisation;
use App\Models\Volunteer;
use App\Models\Application;
use App\Models\Opportunity;
use App\Models\OtpCode;

//Resources
use App\Services\MembershipService;
use Illuminate\Support\Facades\Mail;
use App\Mail\ApplicationAcceptedEmail;
use App\Mail\ApplicationRejectedEmail;

class ApplicationController extends Controller
{
    public function list(Request $request)
    {
        $applications = Application::all();
        return response()->json(['applications'=>$applications,"message"=>"Fetch Successlful"],200);
    }

    public function myApplications(Request $request){
        $user = request()->user();
        $volunteer = MembershipService::getMembership($user);

        if($user->role !== 'volunteer' || !$volunteer){
            return response()->json(['message'=>"Unauthorized"],403);
        }

        $applications = Application::where('volunteer_id', $volunteer->id)->get();
        $total_applications = $applications->count();

        return response()->json([
            'applications' => $applications,
            'total_applications' => $total_applications,
            'message' => 'Fetch Successful'
        ], 200);
    }


    public function myApplicants(Request $request, $id){
        $user = request()->user();
        $organisation = MembershipService::getMembership($user);
        if($user->role !== 'organisation' || !$organisation){
            return response()->json(['message'=>"Unauthorized"],403);
        }
        $applications = Application::where('opportunity_id',$id)->get();
        $total_applications = $applications->count();
        return response()->json(['applications'=>$applications, 'total_applications' => $total_applications, "message"=>"Fetch Successlful"],200);
    }

    public function apply(Request $request){
        $user = request()->user();
        $volunteer = MembershipService::getMembership($user);
        if($user->role !== 'volunteer' || !$volunteer){
            return response()->json(['message'=>"Unauthorized"],403);
        }
        $data = $request->validate([
            'opportunity_id'=>'required|exists:opportunities,id',
            'application_date'=>'required|date',
            'CV'=>'nullable|file|mimes:pdf,doc,docx|max:5120',
        ]);
        
        $opportunity = Opportunity::find($data['opportunity_id']);
        if(!$opportunity){
            return response()->json(['message'=>"Opportunity Not Found"],404);
        }

        // Validate application date
        if ($data['application_date'] > $opportunity->application_deadline) {
            return response()->json(['message' => 'Application deadline has passed'], 400);
        }

        if ($opportunity->start_date <= now()) {
            return response()->json(['message' => 'Opportunity has already started'], 400);
        }

        // Check if opportunity has reached max volunteers
        $applicationsCount = Application::where('opportunity_id', $opportunity->id)->count();
        if ($applicationsCount >= $opportunity->num_volunteers_needed) {
            return response()->json(['message' => 'Opportunity has reached maximum applications'], 400);
        }

        // Check for existing application
        $existingApplication = Application::where('volunteer_id',$volunteer->id)
            ->where('opportunity_id',$data['opportunity_id'])
            ->first();
        if($existingApplication){   
            return response()->json(['message'=>"You have already applied for this opportunity"],400);
        }
        
        // Handle CV file upload - store as relative path
        $cvPath = null;
        if ($request->hasFile('CV')) {
            $cvPath = $request->file('CV')->store('applications/cvs', 'public');
            // Store only relative path, not full URL
        } elseif ($opportunity->cv_required) {
            return response()->json(['message' => 'CV is required for this opportunity'], 400);
        }
        
        $application = Application::create([
            'volunteer_id'=>$volunteer->id,
            'opportunity_id'=>$data['opportunity_id'],
            'application_date'=>$data['application_date'],
            'CV_path'=>$cvPath,
            'status'=>'pending',
        ]);

        // Append full URL to response for immediate use by frontend
        $responseData = $application->toArray();
        if ($application->CV_path) {
            $responseData['CV_path_url'] = asset('storage/' . $application->CV_path);
        }

        return response()->json(['application'=>$responseData,"message"=>"Application Created Successfully"],201);
    }

    public function updateStatus(Request $request, $applicationId){
        $user = request()->user();
        $organisation = MembershipService::getMembership($user);
        if($user->role !== 'organisation' || !$organisation){
            return response()->json(['message'=>"Unauthorized"],403);
        }
        $data = $request->validate([
            'status'=>'required|in:pending,accepted,rejected',
        ]);
        $application = Application::find($applicationId);
        if(!$application){
            return response()->json(['message'=>"Application Not Found"],404);
        }

        // Verify this application belongs to one of this organisation's opportunities
        $opportunity = Opportunity::find($application->opportunity_id);
        if (!$opportunity || $opportunity->organisation_id !== $organisation->id) {
            return response()->json(['message' => 'Unauthorized - This is not your opportunity'], 403);
        }

        // Get volunteer and user information for email
        $volunteer = Volunteer::find($application->volunteer_id);
        $volunteerUser = User::find($volunteer->user_id);

        $application->status = $data['status'];
        $application->save();

        // Send email notification based on status
        if ($data['status'] === 'accepted') {
            Mail::to($volunteerUser->email)->send(new ApplicationAcceptedEmail(
                $volunteerUser->name,
                $opportunity->title,
                $organisation->org_name ?? 'Our Organization',
                $application->id
            ));
        } elseif ($data['status'] === 'rejected') {
            Mail::to($volunteerUser->email)->send(new ApplicationRejectedEmail(
                $volunteerUser->name,
                $opportunity->title,
                $organisation->org_name ?? 'Our Organization',
                $application->id
            ));
        }

        return response()->json(['application'=>$application,"message"=>"Application Status Updated Successfully"],200);
    }

    public function downloadCV(Request $request, $applicationId){
        $application = Application::find($applicationId);
        if(!$application){
            return response()->json(['message'=>"Application Not Found"],404);
        }

        if(!$application->CV_path){
            return response()->json(['message'=>"No CV found for this application"],404);
        }

        // Verify user has access (volunteer who applied or organisation who posted opportunity)
        $user = $request->user();
        $volunteer = Volunteer::where('user_id', $user->id)->first();
        $organisation = Organisation::where('user_id', $user->id)->first();

        // Check if volunteer owns the application
        if ($volunteer && $application->volunteer_id != $volunteer->id) {
            return response()->json(['message'=>"Unauthorized"],403);
        }

        // Check if organisation owns the opportunity
        if ($organisation) {
            $opportunity = Opportunity::find($application->opportunity_id);
            if (!$opportunity || $opportunity->organisation_id !== $organisation->id) {
                return response()->json(['message'=>"Unauthorized"],403);
            }
        }

        // Download the file
        $filePath = $application->CV_path;
        
        if (!\Storage::disk('public')->exists($filePath)) {
            return response()->json(['message'=>"CV file not found"],404);
        }

        return \Storage::disk('public')->download($filePath);
    }

    public function delete(Request $request, $id){
        $user = request()->user();
        $volunteer = MembershipService::getMembership($user);
        if($user->role !== 'volunteer' || !$volunteer){
            return response()->json(['message'=>"Unauthorized"],403);
        }
        $application = Application::find($id);
        if(!$application || $application->volunteer_id != $volunteer->id){
            return response()->json(['message'=>"Application Not Found"],404);
        }
        
        // Delete CV file if it exists (handle both relative paths and full URLs)
        if ($application->CV_path) {
            $filePath = $application->CV_path;
            
            // If it's a full URL, extract the relative path
            if (filter_var($filePath, FILTER_VALIDATE_URL)) {
                $filePath = str_replace(asset('storage/'), '', $filePath);
            }
            
            \Storage::disk('public')->delete($filePath);
        }
        
        $application->delete();
        return response()->json(["message"=>"Application Deleted Successfully"],200);
    }
}
