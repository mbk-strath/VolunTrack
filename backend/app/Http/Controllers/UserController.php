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
            'gender' => 'required|string|max:255',
            'role' => 'required|string|in:organisation,volunteer,admin',
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

}
