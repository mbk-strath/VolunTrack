<?php
namespace App\Services;

use App\Models\User;
use App\Models\Organisation;
use App\Models\Volunteer;

class MembershipService
{
    public static function getMembership($user)
    {
        if ($user->role === 'organisation') {
            return Organisation::where('user_id', $user->id)->first();
        } elseif ($user->role === 'volunteer') {
            return Volunteer::where('user_id', $user->id)->first();
        } elseif($user->role === 'admin') {
            return null; // Admins do not have a separate membership model
        }
        return null;
    }
}