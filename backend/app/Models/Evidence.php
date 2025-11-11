<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Evidence extends Model
{
    use HasFactory;
    protected $fillable = [
        'org_id',
        'volunteer_id',
        'rating',
        'comment',
    ];

    protected $appends = [
        'organisation_name',
        'volunteer_name',
    ];

    public function getOrganisationNameAttribute()
    {
        return $this->organisation ? $this->organisation->name : null;
    }
    public function organisation()
    {
        return $this->belongsTo(Organisation::class, 'org_id');
    }
    public function getVolunteerNameAttribute()
    {
        $volunteer = $this->volunteer;
        $user = $volunteer ? $volunteer->user : null;
        return $user ? $user->name : null;
    }
 
}
