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

    public function getUserNameAttribute()
    {
        $user = $this->belongsTo(User::class, 'user_id');
        return $user ? $user->name : null;
    }
    public function getUserEmailAttribute()
    {
        $user = $this->belongsTo(User::class, 'user_id');
        return $user ? $user->email : null;
    }
    public function getUserRoleAttribute()
    {
        $user = $this->belongsTo(User::class, 'user_id');
        return $user ? $user->role : null;
    }

}
