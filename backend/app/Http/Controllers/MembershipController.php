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

    /**
     * Store a newly created resource in storage.
     */
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'role' => 'required|string|in:organisation,volunteer',
        ]);
        $name = $request->name;
        $email = $request->email;
        $phone = $request->phone;
        $gender = $request->gender;
        $password = $request->password;
        $role = $request->role;

        $user = User::create([
            'name' => $name,
            'email' => $email,
            'password' => bcrypt($password),
            'gender' => $gender,
            'role' => $role,
        ]);

        if (!$user) {
            return response()->json(['message' => 'Registration failed'], 500);
        }

        if ($role == 'admin'){
            return response()->json(['message' => 'Admin registration successful.'], 201);
        }

        if ($role === 'organisation') {
            $org_name = $request->org_name;
            $org_type = $request->org_type;
            $registration_number = $request->registration_number;
            $phone = $request->phone;
            $website = $request->website ?? null;
            $logo = $request->logo ?? null;
            $country = $request->country;
            $city = $request->city;
            $street_address = $request->street_address;
            $operating_region = $request->operating_region;
            $mission_statement = $request->mission_statement ?? null;
            $focus_area = $request->focus_area ?? null;
            $target_beneficiary = $request->target_beneficiary ?? null;

            Organisation::create([
                'user_id' => $user->id,
                'org_name' => $org_name ,
                'org_type' => $org_type,
                'registration_number' => $registration_number,
                'email' => $email,
                'phone' => $phone,
                'website' => $website,
                'logo' => $logo,
                'country' => $country,
                'city' => $city,
                'street_address' => $street_address,
                'operating_region' => $operating_region,
                'mission_statement' => $mission_statement,
                'focus_area' => $focus_area,
                'target_beneficiary' => $target_beneficiary,
            ]);
        } elseif ($role === 'volunteer') {
            $country = $request->country;
            $bio = $request->bio ?? null;
            $skills = $request->skills ?? null;
            $location = $request->location;
            $profile_image = $request->profile_image ?? null;

            Volunteer::create([
                'user_id' => $user->id,
                'country' => $country,
                'bio' => $bio,
                'skills' => $skills,
                'location' => $location,
                'profile_image' => $profile_image,
            ]);
        }
        else{
            return response()->json(['message' => 'Invalid role'], 400);
        }

        $link = url("/api/verify/{$user->id}"); 
        Mail::to($email)->send(new VerificationEmail($link));   
        return response()->json(['user' => $user, 'message' => 'Registration successful. Please check your email for verification instructions.'], 201);

    }

    public function verifyUser(Request $request, $id)
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }
        $user->is_verified = true;
        $user->save();
        return response()->json(['message' => 'User verified successfully'], 200);
    }



    public function login()
    {
        $email = request->email;
        $password = request->password;
        $Userobj = User::where('email',$email)->firstOrFail();
        if(!$Userobj || !Hash::check($password, $Userobj->password)){
            return response()->json(['message'=>'Invalid Credentials'],401);
        }
        if (! $Userobj->is_active) {
            return response()->json(['message' => 'Account is inactive. Please contact support.'], 403);
        }
        if (! $Userobj->is_verified) {
            $link = url("/api/verify/{$Userobj->id}");
            Mail::to($email)->send(new VerificationEmail($link));
            return response()->json(['message' => 'Account is not verified. Please check your email for verification instructions.'], 403);
        }   
        if ($Userobj->role == 'admin'){
            $token = $Userobj->createToken('auth_token')->plainTextToken;
            return response()->json([
                'user' => $Userobj,
                'token' => $token,
            ], 200);
        }
        $membership = MembershipService::getMembership($Userobj);
        if ($membership && !$membership->is_active){
            return response()->json(['message' => 'Account is not active. Please contact support.'], 403);
        }
        $otp = rand(100000, 999999);
        $OtpCode = OtpCode::create([
            'user_id' => $Userobj->id,
            'code' => $otp,
        ]);
        Mail::to($email)->send(new OtpEmail($otp));
        return response()->json(['message' => 'OTP sent to email'], 200);
    }

    function verifyOtp(Request $request){
        $otp = $request->otp;
        $OtpObj = OtpCode::where('otp_code', $otp)->first();


        $Userobj = User::where('id',$OtpObj->user_id)->first();
        if(!$Userobj){
            return response()->json(['message'=>'User not found'],404);
        }

        $OtpRecord = OtpCode::where('user_id', $Userobj->id)
                            ->where('otp_code', $otp)
                            ->where('is_used', false)
                            ->where('expires_at', '>', now())
                            ->first();

        if(!$OtpRecord){
            return response()->json(['message'=>'Invalid or expired OTP'],400);
        }

        // Mark OTP as used
        $OtpRecord->is_used = true;
        $OtpRecord->save();

        $membership = MembershipService::getMembership($Userobj);
        $token = $Userobj->createToken('auth_token')->plainTextToken;
        return response()->json([
            'user' => $Userobj,
            'token' => $token,
            'membership' => $membership,
        ], 200);
    }


    public function show(Request $request, string $id)
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

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id, string $type)
    {
        if ($type == 'user'){
            $user = User::find($id);
            if (!$user) {
                return response()->json(['message' => 'User not found'], 404);
            }
            $user->update($request->all());
            return response()->json($user, 200);
        }
        else if ($type == 'organisation'){
            $organisation = Organisation::find($id);
            if (!$organisation) {
                return response()->json(['message' => 'Organisation not found'], 404);
            }
            $organisation->update($request->all());
            return response()->json($organisation, 200);
        }
        else if ($type == 'volunteer'){
            $volunteer = Volunteer::find($id);
            if (!$volunteer) {
                return response()->json(['message' => 'Volunteer not found'], 404);
            }
            $volunteer->update($request->all());
            return response()->json($volunteer, 200);
        }
        else{
            return response()->json(['message' => 'Invalid type'], 400);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, string $id, string $type)
    {
        if ($type == 'organisation'){
            $organisation = Organisation::find($id);
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
            $volunteer = Volunteer::find($id);
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

    function passwordResetOtp(Request $request){
        $email = $request->email;
        $Userobj = User::where('email',$email)->first();
        if(!$Userobj){
            return response()->json(['message'=>'User not found'],404);
        }
        $otp = rand(100000, 999999);
        $OtpCode = OtpCode::create([
            'user_id' => $Userobj->id,
            'otp_code' => $otp,
            'expires_at' => now()->addMinutes(5),
        ]);
        Mail::to($email)->send(new PasswordResetEmail($otp));
        return response()->json(['message' => 'OTP sent to your email. Please verify to proceed.'], 200);
    }

    function passwordReset(Request $request){
        $otp = $request->otp;
        $newPassword = $request->new_password;

        $OTP_OBJ = OtpCode::where('otp_code', $otp)->first();
        $Userobj = $OTP_OBJ ? User::find($OTP_OBJ->user_id) : null;
        if(!$Userobj){
            return response()->json(['message'=>'User not found'],404);
        }

        $OtpRecord = OtpCode::where('otp_code', $otp)
                            ->where('is_used', false)
                            ->first();
                          


        if(!$OtpRecord){
            return response()->json(['message'=>'Invalid or expired OTP'],400);
        }

        // Mark OTP as used
        $OtpRecord->is_used = true;
        $OtpRecord->save();

        // Update password
        $Userobj->password = bcrypt($newPassword);
        $Userobj->save();

        return response()->json(['message'=>'Password reset successful'],200);
    }

    function logout(Request $request){
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message'=>'Logged out'],200);
    }
}
