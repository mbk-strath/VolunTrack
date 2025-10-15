<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Opportunity extends Model
{
    use HasFactory;
    protected $fillable = [
        'id',
        'organisation_id',
        'title',
        'description',
        'required_skills',
        'num_volunteers_needed',
        'start_date',
        'end_date',
        'schedule',
        'location',
        'benefits',
        'application_deadline',
    ];
}
