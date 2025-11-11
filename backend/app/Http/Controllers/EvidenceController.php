<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

//Databases
use App\Models\User;
use App\Models\Organisation;
use App\Models\Volunteer;
use App\Models\Evidence;
use App\Models\OtpCode;

//Resources
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use App\Mail\VerificationEmail;
use App\Mail\OtpEmail;
use App\Mail\PasswordResetEmail;
use App\Services\MembershipService;
use Carbon\Carbon;

class EvidenceController extends Controller
{
    public function list()
    {
        $evidences = Evidence::all();
        return response()->json($evidences, 200);
    }

    public function create(Request $request)
    {
        $volunteer = MembershipService::getMembership($request->user());
        $request->validate([
            'org_id' => 'required|exists:organisations,id',
            'rating' => 'required',
            'comment' => 'nullable|string',
        ]);

        $evidence = Evidence::create([
            'org_id' => $request->org_id,
            'volunteer_id' => $volunteer->id,
            'rating' => $request->rating,
            'comment' => $request->comment,
        ]);

        return response()->json(["message"=>"Created Successfully", "evidence" => $evidence], 201);
    }

    public function update(Request $request, $id)
    {
        $evidence = Evidence::find($id);
        if (!$evidence) {
            return response()->json(["message" => "Evidence not found"], 404);
        }

        $request->validate([
            'rating' => 'sometimes|required',
            'comment' => 'sometimes|nullable|string',
        ]);

        if ($request->has('rating')) {
            $evidence->rating = $request->rating;
        }
        if ($request->has('comment')) {
            $evidence->comment = $request->comment;
        }
        $evidence->save();

        return response()->json(["message"=>"Updated Successfully", "evidence" => $evidence], 200);
    }

    public function delete($id)
    {
        $evidence = Evidence::find($id);
        if (!$evidence) {
            return response()->json(["message" => "Evidence not found"], 404);
        }
        $evidence->delete();
        return response()->json(["message" => "Deleted Successfully"], 200);
    }

    public function getByOrganisation($org_id)
    {
        $evidences = Evidence::where('org_id', $org_id)->get();
        return response()->json($evidences, 200);
    }
    
    public function getById($id)
    {
        $user = request()->user();
        $membership = MembershipService::getMembership($user);
        $evidence = Evidence::find($id);
        if (!$evidence) {
            return response()->json(["message" => "Evidence not found"], 404);
        }
        if ($membership instanceof Volunteer && $evidence->volunteer_id != $membership->id) {
            return response()->json(["message" => "Unauthorized"], 403);
        }
        if ($membership instanceof Organisation && $evidence->org_id != $membership->id) {
            return response()->json(["message" => "Unauthorized"], 403);
        }
        return response()->json($evidence, 200);
    }

    public function getByVolunteer(Request $request)
    {
        $volunteer = MembershipService::getMembership($request->user());
        $evidences = Evidence::where('volunteer_id', $volunteer->id)->get();
        return response()->json($evidences, 200);
    }
}
