<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Organisation extends Model
{
    use HasFactory;
    protected $fillable = [
        'id',
        'user_id',
        'org_name',
        'org_type',
        'registration_number',
        'email',
        'phone',
        'website',
        'logo',
        'country',
        'city',
        'street_address',
        'operating_region',
        'mission_statement',
        'focus_area',
        'target_beneficiary',
    ];
}
