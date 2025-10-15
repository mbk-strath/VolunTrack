<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Volunteer extends Model
{
    use HasFactory;
    protected $fillable = [
        'id',
        'user_id',
        'full_name',
        'gender',
        'country',
        'phone',
        'bio',
        'skills',
        'location',     
        'profile_image',
    ];
}
