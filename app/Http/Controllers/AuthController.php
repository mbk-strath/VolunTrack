<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

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

        return response()->json(['user' => $user], 201);

    }

    function login(Request $request){
        $email = $request->email;
        $password = $request->password;

        $Userobj = User::where('email',$email)->first();
        if(!$Userobj || !Hash::check($password, $Userobj->password)){
            return response()->json(['message'=>'Invalid'],401);
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
