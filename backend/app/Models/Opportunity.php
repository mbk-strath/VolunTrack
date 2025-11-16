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
        'start_time',
        'end_time',
        'location',
        'benefits',
        'cv_required',
        'application_deadline',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'application_deadline' => 'date',
    ];

    public function organisation()
    {
        return $this->belongsTo(Organisation::class, 'organisation_id');
    }

    public function applications()
    {
        return $this->hasMany(Application::class, 'opportunity_id');
    }

    public function participations()
    {
        return $this->hasMany(Participation::class, 'opportunity_id');
    }

    public function gallery()
    {
        return $this->hasMany(Gallery::class, 'org_id', 'organisation_id');
    }

    protected $appends = ['attendance_rate', 'total_applicants', 'organisation_name'];

    public function getTotalApplicantsAttribute()
    {
        return $this->applications()->count();
    }

    public function getOrganisationNameAttribute()
    {
        return $this->organisation ? $this->organisation->org_name : null;
    }

    public function getAttendanceRateAttribute()
{
    if (!$this->start_date || !$this->start_time || !$this->end_date || !$this->end_time) {
        return 0;
    }

    $startDateTime = \Carbon\Carbon::parse($this->start_date->format('Y-m-d') . ' ' . $this->start_time);
    $endDateTime   = \Carbon\Carbon::parse($this->end_date->format('Y-m-d') . ' ' . $this->end_time);

    $totalOpportunityHours = $startDateTime->diffInHours($endDateTime);

    if ($totalOpportunityHours <= 0) return 0;

    $participations = $this->participations()->get();

    $totalHoursAttended = 0;
    foreach ($participations as $participation) {
        if (!empty($participation->check_in) && !empty($participation->check_out)) {
            $checkIn  = \Carbon\Carbon::parse($participation->check_in);
            $checkOut = \Carbon\Carbon::parse($participation->check_out);
            $totalHoursAttended += $checkOut->diffInHours($checkIn);
        }
    }

    $expectedTotalHours = $this->num_volunteers_needed * $totalOpportunityHours;

    return $expectedTotalHours > 0 ? round(($totalHoursAttended / $expectedTotalHours) * 100, 2) : 0;
}
}
