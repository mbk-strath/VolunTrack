<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Volunteer extends Model
{
    use HasFactory;
    protected $fillable = [
        'user_id',
        'country',
        'bio',
        'skills',
        'location',
        'profile_image',
        'is_active',
    ];

    protected $appends = ['total_applications', 'total_hours','total_completed_opportunities'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function getTotalApplicationsAttribute()
    {
        return $this->totalApplications();
    }
    public function totalApplications()
    {
        return Application::where('volunteer_id', $this->user_id)->count();
    }

    public function getTotalHoursAttribute()
    {
        return $this->totalHours();
    }
    public function totalHours()
    {
        return Participation::where('volunteer_id', $this->user_id)->sum('total_hours');
    }

    public function getTotalCompletedOpportunitiesAttribute()
    {
        return $this->totalCompletedOpportunities();
    }
    public function totalCompletedOpportunities()
    {
        $Participations = Participation::where('volunteer_id', $this->id)->get();
        $Opportunities = Opportunity::whereIn('id', $Participations->pluck('opportunity_id'))->get();
        $Completed = $Opportunities->filter(function ($opportunity) {
            return $opportunity->end_date < now();
        });
        return $Completed->count();
    }
}
