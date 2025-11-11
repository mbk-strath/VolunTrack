<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Report extends Model
{
    use HasFactory;
    protected $fillable = [
        'user_id',
        'title',
        'description',
        'status',
    ];

    protected $appends = [
        'user_name',
        'user_email',
        'user_role',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function getUserNameAttribute()
    {
        $user = $this->user;
        return $user ? $user->name : null;
    }
    public function getUserEmailAttribute()
    {
        $user = $this->user;
        return $user ? $user->email : null;
    }
    public function getUserRoleAttribute()
    {
        $user = $this->user;
        return $user ? $user->role : null;
    }

}
