<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Participation extends Model
{
    use HasFactory;
    protected $fillable = [
        'id',
        'volunteer_id',
        'opportunity_id',
        'check_in',
        'check_out',
        'total_hours'
    ];

    protected $appends = ['total_hours'];
    public function getTotalHoursAttribute()
    {
        if ($this->check_in && $this->check_out) {
            $checkIn = \Carbon\Carbon::parse($this->check_in);
            $checkOut = \Carbon\Carbon::parse($this->check_out);
            return $checkOut->diffInHours($checkIn);
        }
        return 0;
    }
}
