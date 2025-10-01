<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\OtpCode;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use App\Mail\VerificationEmail;
use App\Mail\OtpEmail;

class AuthController extends Controller
{
    function register(Request $request){
        $name = $request->name;
        $email = $request->email;
        $password = $request->password;
        $role = $request->role;

        $user = User::create([
            'name' => $name,
            'email' => $email,
            'password' => bcrypt($password),
            'role' => $role,
        ]);

        $link = url("/api/verify/{$user->id}");

        Mail::to($email)->send(new VerificationEmail($link));

        return response()->json(['user' => $user, 'message' => 'Registration successful. Please check your email for verification instructions.'], 201);

    }

    function verify(Request $request, $id){
        $user = User::find($id);
        if(!$user){
            return response()->json(['message'=>'User not found'],404);
        }
        $user->is_verified = true;
        $user->save();
        return response()->json(['message'=>'User verified successfully'],200);
    }

    function login(Request $request){
        $email = $request->email;
        $password = $request->password;

        $Userobj = User::where('email',$email)->first();
        if(!$Userobj || !Hash::check($password, $Userobj->password)){
            return response()->json(['message'=>'Invalid'],401);
        }
        if (! $Userobj->is_active) {
            return response()->json(['message' => 'Account is inactive. Please contact support.'], 403);
        }
        if (! $Userobj->is_verified) {
            $link = url("/api/verify/{$Userobj->id}");
            Mail::to($email)->send(new VerificationEmail($link));
            return response()->json(['message' => 'Account is not verified. Please check your email for verification instructions.'], 403);
        }
        // $token = $Userobj->createToken('auth_token')->plainTextToken;
        // return response()->json([
        //     'user' => $Userobj,
        //     'token' => $token,
        // ], 200);
        $otp = rand(100000, 999999);
        $OtpCode = OtpCode::create([
            'user_id' => $Userobj->id,
            'otp_code' => $otp,
            'expires_at' => now()->addMinutes(5),
        ]);
        Mail::to($email)->send(new OtpEmail($otp));
        return response()->json(['message' => 'OTP sent to your email. Please verify to proceed.'], 200);
    }

    function verifyOtp(Request $request){
        $email = $request->email;
        $otp = $request->otp;

        $Userobj = User::where('email',$email)->first();
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

        $token = $Userobj->createToken('auth_token')->plainTextToken;
        return response()->json([
            'user' => $Userobj,
            'token' => $token,
        ], 200);
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
        Mail::to($email)->send(new OtpEmail($otp));
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
