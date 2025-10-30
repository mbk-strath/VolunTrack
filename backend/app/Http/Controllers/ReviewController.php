<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

//Databases
use App\Models\User;
use App\Models\Organisation;
use App\Models\Volunteer;
use App\Models\Review;
use App\Models\OtpCode;

//Resources
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use App\Mail\VerificationEmail;
use App\Mail\OtpEmail;
use App\Mail\PasswordResetEmail;
use App\Services\MembershipService;
use Carbon\Carbon;

class ReviewController extends Controller
{
    public function list()
    {
        $reviews = Review::all();
        return response()->json($reviews, 200);
    }

    public function create(Request $request)
    {
        $volunteer = MembershipService::getMembership($request->user());
        $request->validate([
            'org_id' => 'required|exists:organisations,id',
            'rating' => 'required',
            'comment' => 'nullable|string',
        ]);

        $review = Review::create([
            'org_id' => $request->org_id,
            'volunteer_id' => $volunteer->id,
            'rating' => $request->rating,
            'comment' => $request->comment,
        ]);

        return response()->json(["message"=>"Created Successfully", "review" => $review], 201);
    }

    public function update(Request $request, $id)
    {
        $review = Review::find($id);
        if (!$review) {
            return response()->json(["message" => "Review not found"], 404);
        }

        $request->validate([
            'rating' => 'sometimes|required',
            'comment' => 'sometimes|nullable|string',
        ]);

        if ($request->has('rating')) {
            $review->rating = $request->rating;
        }
        if ($request->has('comment')) {
            $review->comment = $request->comment;
        }
        $review->save();

        return response()->json(["message"=>"Updated Successfully", "review" => $review], 200);
    }

    public function delete($id)
    {
        $review = Review::find($id);
        if (!$review) {
            return response()->json(["message" => "Review not found"], 404);
        }
        $review->delete();
        return response()->json(["message" => "Deleted Successfully"], 200);
    }

    public function getByOrganisation($org_id)
    {
        $reviews = Review::where('org_id', $org_id)->get();
        return response()->json($reviews, 200);
    }
    
    public function getById($id)
    {
        $user = request()->user();
        $membership = MembershipService::getMembership($user);
        $review = Review::find($id);
        if (!$review) {
            return response()->json(["message" => "Review not found"], 404);
        }
        if ($membership instanceof Volunteer && $review->volunteer_id != $membership->id) {
            return response()->json(["message" => "Unauthorized"], 403);
        }
        if ($membership instanceof Organisation && $review->org_id != $membership->id) {
            return response()->json(["message" => "Unauthorized"], 403);
        }
        return response()->json($review, 200);
    }

    public function getByVolunteer($volunteer_id)
    {
        $reviews = Review::where('volunteer_id', $volunteer_id)->get();
        return response()->json($reviews, 200);
    }
}
