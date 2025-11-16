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

class UserController extends Controller
{
    public function list()
    {
        $users = User::all();
        return response()->json($users);
    }

    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'gender' => 'sometimes|string|max:255',
            'role' => 'required|string|in:organisation,volunteer,admin',
        ]);
        $name = $request->name;
        $email = $request->email;
        $phone = $request->phone;
        $gender = $request->gender ?? null;
        $password = $request->password;
        $role = $request->role;

        $user = User::create([
            'name' => $name,
            'email' => $email,
            'password' => bcrypt($password),
            'gender' => $gender,
            'phone' => $phone,
            'role' => $role,
        ]);

        if (!$user) {
            return response()->json(['message' => 'Registration failed'], 500);
        }

        if ($role === 'admin'){
            $user->is_verified = true;
            $user->is_active = true;
            $user->save();
            return response()->json(['message' => 'Admin registration successful.'], 201);
        }

       if ($role === 'organisation') {


            Organisation::create([
                'user_id' => $user->id,
            ]);

        } elseif ($role === 'volunteer') {

            Volunteer::create([
                'user_id' => $user->id,
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
    
    
    public function login(Request $request)
    {
        $email = $request->email;
        $password = $request->password;
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
            'otp_code' => $otp,
            'expires_at' => now()->addMinutes(5),
        ]);
        Mail::to($email)->send(new OtpEmail($otp));
        return response()->json(['message' => 'OTP sent to email'], 200);
    }

    public function verifyOtp(Request $request)
    {
        $otp = $request->otp;
        $OtpObj = OtpCode::where('otp_code', $otp)->first();

        if (!$OtpObj) {
            return response()->json(['message' => 'Invalid OTP'], 400);
        }

        $Userobj = User::where('id', $OtpObj->user_id)->first();
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

        // Validate only allowed fields
        $data = $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|string|email|max:255|unique:users,email,' . $id,
            'phone' => 'sometimes|string|max:20',
            'gender' => 'sometimes|string|in:Male,Female,Other,Prefer not to say',
            'password' => 'sometimes|string|min:8|confirmed',
        ]);

        // Only admin can update these fields
        if ($authenticatedUser->role === 'admin') {
            $data += $request->validate([
                'role' => 'sometimes|string|in:organisation,volunteer,admin',
                'is_verified' => 'sometimes|boolean',
                'is_active' => 'sometimes|boolean',
            ]);
        }

        // Hash password if provided
        if (isset($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        }

        $user->update($data);
        return response()->json(['message' => 'User updated successfully', 'user' => $user], 200);
    }

    public function passwordResetOtp(Request $request){
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

    public function passwordReset(Request $request){
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

    public function logout(Request $request){
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message'=>'Logged out'],200);
    }

}
