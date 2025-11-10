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
        'country',
        'phone',      
        'bio',
        'skills',
        'location',     
        'profile_image',
    ];

    protected $appends = ['total_applications'];
    public function getTotalApplicationsAttribute()
    {
        return $this->totalApplications();
    }
    public function totalApplications()
    {
        return $this->hasMany(Application::class, 'volunteer_id')->count();
    }
}
