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
        $existingApplication = Application::where('volunteer_id',$volunteer->id)
            ->where('opportunity_id',$data['opportunity_id'])
            ->first();
        if($existingApplication){   
            return response()->json(['message'=>"You have already applied for this opportunity"],400);
        }
        
        // Handle CV file upload
        $cvPath = null;
        if ($request->hasFile('CV')) {
            $cvPath = $request->file('CV')->store('applications/cvs', 'public');
            $cvPath = asset('storage/' . $cvPath);
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
        return response()->json(['application'=>$application,"message"=>"Application Created Successfully"],201);
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
        $application->status = $data['status'];
        $application->save();
        return response()->json(['application'=>$application,"message"=>"Application Status Updated Successfully"],200);
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
        
        // Delete CV file if it exists
        if ($application->CV_path) {
            $filePath = str_replace(asset('storage/'), '', $application->CV_path);
            \Storage::disk('public')->delete($filePath);
        }
        
        $application->delete();
        return response()->json(["message"=>"Application Deleted Successfully"],200);
    }
}
