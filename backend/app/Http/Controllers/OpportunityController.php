<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

//Databases
use App\Models\User;
use App\Models\Organisation;
use App\Models\Volunteer;
use App\Models\Opportunity;
use App\Models\Participation;
use App\Models\OtpCode;

//Resources
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use App\Mail\VerificationEmail;
use App\Mail\OtpEmail;
use App\Mail\PasswordResetEmail;
use App\Services\MembershipService;


class OpportunityController extends Controller
{

    public function list(Request $request){
        $opportunities = Opportunity::all();
        return response()->json($opportunities, 200);
    }

    public function get(Request $request, $id){
        $opportunity = Opportunity::find($id);
        if(!$opportunity){
            return response()->json(['message' => 'Opportunity not found'], 404);
        }
        return response()->json($opportunity, 200);
    }

    public function myOpportunities(Request $request){
        $user = $request->user();
        $organisation = MembershipService::getMembership($user);
        if($user->role !== 'organisation' || !$organisation){
            return response()->json(['message' => 'Only organisations can view their opportunities'], 403);
        }

        $opportunities = Opportunity::where('organisation_id', $organisation->id)->get();
        $total_opportunities = $opportunities->count();
        return response()->json(['opportunities' => $opportunities, 'total_opportunities' => $total_opportunities], 200);
    }

    public function create(Request $request){
        $user = $request->user();
        $organisation = MembershipService::getMembership($user);
        if($user->role !== 'organisation' || !$organisation){
            return response()->json(['message' => 'Only organisations can create opportunities'], 403);
        }

        $data = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'required_skills' => 'required|string',
            'num_volunteers_needed' => 'required|integer|min:1',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'schedule' => 'required|string|max:255',
            'benefits' => 'nullable|string|max:255',
            'application_deadline' => 'required|date|before_or_equal:start_date',
            'location' => 'required|string|max:255',
            'cv_required' => 'sometimes|boolean',
        ]);
        $data ['organisation_id'] = $organisation->id;

        $opportunity = Opportunity::create($data);
        return response()->json(['message'=>'Opportunity Created Successfuly','opportunity'=>$opportunity], 201);
    }

    public function update(Request $request, $id){
        $user = $request->user();
        $organisation = MembershipService::getMembership($user);
        if($user->role !== 'organisation' || !$organisation){
            return response()->json(['message' => 'Only organisations can update opportunities'], 403);
        }

        $opportunity = Opportunity::find($id);
        if(!$opportunity || $opportunity->organisation_id !== $organisation->id){
            return response()->json(['message' => 'Opportunity not found or access denied'], 404);
        }

        $data = $request->validate([
            'title' => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'required_skills' => 'sometimes|string',
            'num_volunteers_needed' => 'sometimes|integer|min:1',
            'start_date' => 'sometimes|date',
            'end_date' => 'sometimes|date|after_or_equal:start_date',
            'schedule' => 'sometimes|string|max:255',
            'benefits' => 'nullable|string|max:255',
            'application_deadline' => 'sometimes|date|before_or_equal:start_date',
            'location' => 'sometimes|string|max:255',
            'cv_required' => 'sometimes|boolean',
        ]);

        $opportunity->update($data);
        return response()->json(['message'=>'Opportunity Updated Successfuly','opportunity'=>$opportunity], 200);
    }

    public function delete(Request $request, $id){
        $user = $request->user();
        $organisation = MembershipService::getMembership($user);
        if($user->role !== 'organisation' || !$organisation){
            return response()->json(['message' => 'Only organisations can delete opportunities'], 403);
        }

        $opportunity = Opportunity::find($id);
        if(!$opportunity || $opportunity->organisation_id !== $organisation->id){
            return response()->json(['message' => 'Opportunity not found or access denied'], 404);
        }

        $opportunity->delete();
        return response()->json(['message'=>'Opportunity Deleted Successfuly'], 200);
    }

    public function ongoing(Request $request){
        $currentDate = now();
        $opportunities = Opportunity::where('start_date', '<=', $currentDate)
                                    ->where('end_date', '>=', $currentDate)
                                    ->get();
        return response()->json($opportunities, 200);
    }

    public function totalAttendanceRate(Request $request){
        $user = $request->user();
        $organisation = MembershipService::getMembership($user);
        if($user->role !== 'organisation' || !$organisation){
            return response()->json(['message' => 'Only organisations can view attendance rates'], 403);
        }

        $opportunities = Opportunity::where('organisation_id', $organisation->id)->get();
        $totalExpectedHours = 0;
        $totalHoursAttended = 0;

        foreach($opportunities as $opportunity){
            // Calculate total hours for this opportunity using start_date/start_time and end_date/end_time
            $startDateTime = \Carbon\Carbon::parse("{$opportunity->start_date} {$opportunity->start_time}");
            $endDateTime = \Carbon\Carbon::parse("{$opportunity->end_date} {$opportunity->end_time}");
            $opportunityHours = $startDateTime->diffInHours($endDateTime);
            
            // Expected hours for this opportunity
            $expectedHours = $opportunity->num_volunteers_needed * $opportunityHours;
            $totalExpectedHours += $expectedHours;
            
            // Get all participations and sum attended hours
            $participations = Participation::where('opportunity_id', $opportunity->id)->get();
            foreach ($participations as $participation) {
                if (!empty($participation->check_in) && !empty($participation->check_out)) {
                    $checkIn = \Carbon\Carbon::parse($participation->check_in);
                    $checkOut = \Carbon\Carbon::parse($participation->check_out);
                    $totalHoursAttended += $checkOut->diffInHours($checkIn);
                }
            }
        }

        $attendanceRate = $totalExpectedHours > 0 ? ($totalHoursAttended / $totalExpectedHours) * 100 : 0;

        return response()->json(['attendance_rate' => round($attendanceRate, 2)], 200);
    }
}
