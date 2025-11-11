<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

//Databases
use App\Models\User;
use App\Models\Organisation;
use App\Models\Volunteer;
use App\Models\OtpCode;

//Resources
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use App\Mail\VerificationEmail;
use App\Mail\OtpEmail;
use App\Mail\PasswordResetEmail;
use App\Services\MembershipService;


class MembershipController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function list()
    {
        // Get all Memberships
        $organisations = Organisation::all();
        $volunteers = Volunteer::all();
        return response()->json([
            'organisations' => $organisations,
            'volunteers' => $volunteers
        ], 200);
    }

    public function listActive()
    {
        // Get all Memberships
        $organisations = Organisation::where('is_active', true)->get();
        $volunteers = Volunteer::where('is_active', true)->get();
        return response()->json([
            'organisations' => $organisations,
            'volunteers' => $volunteers
        ], 200);
    }


    public function get(Request $request, string $id)
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }
        $membership = MembershipService::getMembership($user);
        if ($membership === null && $user->role !== 'admin') {
            return response()->json(['message' => 'Membership not found'], 404);
        }
        if ($user->role === 'admin') {
            return response()->json(['message' => 'Admin does not have a membership', 'user' => $user], 404);
        }

        return response()->json($membership, 200);
    }

    public function update(Request $request, string $id)
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }
        $type = $user->role;
        $membership = MembershipService::getMembership($user);

        if ($type == 'organisation') {
            $organisation = $membership;
            if (!$organisation) {
                return response()->json(['message' => 'Organisation not found'], 404);
            }

            // Handle logo upload
            if ($request->hasFile('logo')) {
                $request->validate([
                    'logo' => 'image|mimes:jpeg,png,jpg,gif|max:2048',
                ]);

                // Delete old logo if exists
                if ($organisation->logo) {
                    $oldPath = str_replace(asset('storage/'), '', $organisation->logo);
                    \Storage::disk('public')->delete($oldPath);
                }

                $logoPath = $request->file('logo')->store('organisation_logos', 'public');
                $organisation->logo = asset('storage/' . $logoPath);
            }

            $organisation->update($request->except('logo'));
            return response()->json($organisation, 200);
        }
        else if ($type == 'volunteer'){
            $volunteer = $membership;
            if (!$volunteer) {
                return response()->json(['message' => 'Volunteer not found'], 404);
            }

            // Handle profile_image upload
            if ($request->hasFile('profile_image')) {
                $request->validate([
                    'profile_image' => 'image|mimes:jpeg,png,jpg,gif|max:2048',
                ]);

                // Delete old profile_image if exists
                if ($volunteer->profile_image) {
                    $oldPath = str_replace(asset('storage/'), '', $volunteer->profile_image);
                    \Storage::disk('public')->delete($oldPath);
                }

                $profileImagePath = $request->file('profile_image')->store('profile_images', 'public');
                $volunteer->profile_image = asset('storage/' . $profileImagePath);
            }

            $volunteer->update($request->except('profile_image'));
            return response()->json($volunteer, 200);
        }
        else{
            return response()->json(['message' => 'Invalid type'], 400);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, string $id)
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }
        $type = $user->role;
        $membership = MembershipService::getMembership($user);
        if ($type == 'organisation') {
            $organisation = $membership;
            if (!$organisation) {
                return response()->json(['message' => 'Organisation not found'], 404);
            }
            $user = User::find($organisation->user_id);
            $user->is_active = false;
            $user->save();
            $organisation->is_active = false;
            $organisation->save();
            return response()->json(['message' => 'Organisation deleted'], 200);
        }
        else if ($type == 'volunteer'){
            $volunteer = $membership;
            if (!$volunteer) {
                return response()->json(['message' => 'Volunteer not found'], 404);
            }
            $user = User::find($volunteer->user_id);
            $user->is_active = false;
            $user->save();
            $volunteer->is_active = false;
            $volunteer->save();
            return response()->json(['message' => 'Volunteer deleted'], 200);
        }
        else{
            return response()->json(['message' => 'Invalid type'], 400);
        }
    }

    public function verifiedOrganisations()
    {
        $organisations = Organisation::where('is_verified', true)->get();
        return response()->json($organisations, 200);
    }

    public function totalVolunteers(Request $request)
    {
        $user = $request->user();
        if ($user->role !== 'organisation') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        $organisation = MembershipService::getMembership($user);
        $myOpportunities = Opportunity::where('organisation_id', $organisation->id)->pluck('id')->toArray();
        $myParticipants = Application::whereIn('opportunity_id', $myOpportunities)
            ->pluck('volunteer_id')
            ->unique()
            ->toArray();

        $totalVolunteers = empty($myParticipants)
            ? 0
            : Volunteer::whereIn('id', $myParticipants)->count();
        return response()->json(['total_volunteers' => $totalVolunteers], 200);
    }
}
