<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Volunteer extends Model
{
    use HasFactory;
    protected $fillable = [
        'id',
        'user_id',   
        'country',
        'phone',      
        'bio',
        'skills',
        'location',     
        'profile_image',
    ];

    protected $appends = ['total_applications', 'total_hours','total_completed_opportunities'];
    public function getTotalApplicationsAttribute()
    {
        return $this->totalApplications();
    }
    public function totalApplications()
    {
        return $this->hasMany(Application::class, 'volunteer_id')->count();
    }

    public function getTotalHoursAttribute()
    {
        return $this->totalHours();
    }
    public function totalHours()
    {
        return $this->hasMany(Participation::class, 'volunteer_id')->sum('total_hours');
    }

    public function getTotalCompletedOpportunitiesAttribute()
    {
        return $this->totalCompletedOpportunities();
    }
    public function totalCompletedOpportunities()
    {
        $Participations = Participations::where('volunteer_id', $this->id)->get();
        $Opportunities = Opportunity::whereIn('id', $Participations->pluck('opportunity_id'))->get();
        $Completed = $Opportunities->filter(function ($opportunity) {
            return $opportunity->end_date < now();
        });
        return $Completed->count();
    }
}
