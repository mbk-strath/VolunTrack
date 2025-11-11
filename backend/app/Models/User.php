<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'id',
        'name',
        'email',
        'gender',
        'phone',
        'password',
        'role',
        'is_active',
        'is_verified',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
        'is_verified' => 'boolean',
        'is_active' => 'boolean',
    ];

    /**
     * Get the notifications received by the user.
     */
    public function receivedNotifications()
    {
        $user = $this;
        $notifications = Notification::where('receiver_id', $user->id);
        return $notifications;
    }

    /**
     * Get the notifications sent by the user.
     */
    public function sentNotifications()
    {
        $user = $this;
        return Notification::where('sender_id', $user->id);
    }

    /**
     * Get all notifications for the user (both sent and received).
     */
    public function notifications()
    {
        return Notification::where('receiver_id', $this->id)
                          ->orWhere('sender_id', $this->id);
    }

    /**
     * Scope a query to only include verified users.
     */
    public function scopeVerified($query)
    {
        return $query->where('is_verified', true);
    }

    /**
     * Scope a query to only include users with a specific role.
     */
    public function scopeRole($query, $role)
    {
        return $query->where('role', $role);
    }
}
