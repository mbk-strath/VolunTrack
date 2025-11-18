<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

//Databases
use App\Models\User;
use App\Models\Organisation;
use App\Models\Opportunity;
use App\Models\Application;
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

        // Authorization: User can only update themselves unless they're admin
        $authenticatedUser = $request->user();
        if ($authenticatedUser->id !== (int)$id && $authenticatedUser->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized - You can only update your own profile'], 403);
        }

        $type = $user->role;
        $membership = MembershipService::getMembership($user);

        if ($type == 'organisation') {
            $organisation = $membership;
            if (!$organisation) {
                return response()->json(['message' => 'Organisation not found'], 404);
            }

            // Validate organisation fields
            $data = $request->validate([
                'org_name' => 'sometimes|string|max:255',
                'org_type' => 'sometimes|string|max:255',
                'reg_no' => 'sometimes|string|max:255|unique:organisations,reg_no,' . $organisation->id,
                'website' => 'sometimes|string|max:255|url',
                'country' => 'sometimes|string|max:255',
                'city' => 'sometimes|string|max:255',
                'focus_area' => 'sometimes|string|max:255',
                'logo' => 'sometimes|image|mimes:jpeg,png,jpg,gif|max:2048',
            ]);

            // Handle logo upload
            if ($request->hasFile('logo')) {
                // Delete old logo if exists
                if ($organisation->logo) {
                    // Extract filename from path (logo is stored as relative path or full URL)
                    $oldPath = (filter_var($organisation->logo, FILTER_VALIDATE_URL))
                        ? str_replace(asset('storage/'), '', $organisation->logo)
                        : $organisation->logo;
                    \Storage::disk('public')->delete($oldPath);
                }

                // Store new logo and save only relative path
                $logoPath = $request->file('logo')->store('organisation_logos', 'public');
                $data['logo'] = $logoPath; // Store relative path, not full URL
            }

            // Remove logo key from validation data if we handled it
            unset($data['logo']);
            
            // Update organisation with validated data and logo
            $organisation->update($data);
            
            // Add logo to response if it exists
            if ($organisation->logo) {
                $organisation->logo_url = asset('storage/' . $organisation->logo);
            }
            
            return response()->json(['message' => 'Organisation updated successfully', 'organisation' => $organisation], 200);
        }
        else if ($type == 'volunteer') {
            $volunteer = $membership;
            if (!$volunteer) {
                return response()->json(['message' => 'Volunteer not found'], 404);
            }

            // Validate volunteer fields
            $data = $request->validate([
                'country' => 'sometimes|string|max:255',
                'bio' => 'sometimes|string|max:1000',
                'skills' => 'sometimes|string|max:255',
                'location' => 'sometimes|string|max:255',
                'profile_image' => 'sometimes|image|mimes:jpeg,png,jpg,gif|max:2048',
            ]);

            // Handle profile_image upload
            if ($request->hasFile('profile_image')) {
                // Delete old profile_image if exists
                if ($volunteer->profile_image) {
                    // Extract filename from path (profile_image is stored as relative path or full URL)
                    $oldPath = (filter_var($volunteer->profile_image, FILTER_VALIDATE_URL))
                        ? str_replace(asset('storage/'), '', $volunteer->profile_image)
                        : $volunteer->profile_image;
                    \Storage::disk('public')->delete($oldPath);
                }

                // Store new image and save only relative path
                $profileImagePath = $request->file('profile_image')->store('profile_images', 'public');
                $data['profile_image'] = $profileImagePath; // Store relative path, not full URL
            }

            // Remove profile_image key from validation data if we handled it
            unset($data['profile_image']);
            
            // Update volunteer with validated data and profile_image
            $volunteer->update($data);
            
            // Add profile_image_url to response if it exists
            if ($volunteer->profile_image) {
                $volunteer->profile_image_url = asset('storage/' . $volunteer->profile_image);
            }
            
            return response()->json(['message' => 'Volunteer updated successfully', 'volunteer' => $volunteer], 200);
        }
        else {
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
        $volunteerObjs = Volunteer::whereIn('id', $myParticipants)->get();

        $totalVolunteers = empty($myParticipants)
            ? 0
            : Volunteer::whereIn('id', $myParticipants)->count();
        return response()->json(['total_volunteers' => $totalVolunteers, 'volunteers' => $volunteerObjs], 200);
    }
}
