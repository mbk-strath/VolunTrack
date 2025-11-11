<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Application extends Model
{
    use HasFactory;
    protected $fillable = [
        'id',
        'volunteer_id',
        'opportunity_id',
        'application_date',
        'status'
    ];

    protected $appends = ['volunteer_name', 'opportunity_title'];
    public function getVolunteerNameAttribute()
    {
        $volunteer = Volunteer::find($this->volunteer_id);
        return $volunteer ? $volunteer->name : null;
    }
    public function getOpportunityTitleAttribute()
    {
        $opportunity = Opportunity::find($this->opportunity_id);
        return $opportunity ? $opportunity->title : null;
    }
}
