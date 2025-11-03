<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    use HasFactory;
    protected $fillable = [
        'id',
        'message',
        'sent_at',
        'is_read',
        'read_at',
        'channel',
        'receiver_id',
        'sender_id'
        
    ];

    /**
     * Get the user who sent the notification.
     */
    public function sender()
    {
        return $this->belongsTo(User::class, 'sender_id');
    }

    /**
     * Get the user who received the notification.
     */
    public function receiver()
    {
        return $this->belongsTo(User::class, 'receiver_id');
    }
}