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

    protected $appends = ['volunteer_name', 'opportunity_title', 'opportunity_start_date', 'opportunity_start_time', 'opportunity_end_date', 'opportunity_end_time'];
    
    public function getVolunteerNameAttribute()
    {
        $volunteer = Volunteer::find($this->volunteer_id);
        $user = User::find($volunteer->user_id);
        return $user ? $user->name : null;
    }
    
    public function getOpportunityTitleAttribute()
    {
        $opportunity = Opportunity::find($this->opportunity_id);
        return $opportunity ? $opportunity->title : null;
    }

    public function getOpportunityStartDateAttribute()
    {
        $opportunity = Opportunity::find($this->opportunity_id);
        return $opportunity ? $opportunity->start_date : null;
    }

    public function getOpportunityStartTimeAttribute()
    {
        $opportunity = Opportunity::find($this->opportunity_id);
        return $opportunity ? $opportunity->start_time : null;
    }

    public function getOpportunityEndDateAttribute()
    {
        $opportunity = Opportunity::find($this->opportunity_id);
        return $opportunity ? $opportunity->end_date : null;
    }

    public function getOpportunityEndTimeAttribute()
    {
        $opportunity = Opportunity::find($this->opportunity_id);
        return $opportunity ? $opportunity->end_time : null;
    }
}
