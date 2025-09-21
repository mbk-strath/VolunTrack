<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use App\Mail\VerificationEmail;

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
        $token = $Userobj->createToken('auth_token')->plainTextToken;
        return response()->json([
            'user' => $Userobj,
            'token' => $token,
        ], 200);

    }

    function logout(Request $request){
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message'=>'Logged out'],200);
    }
}
