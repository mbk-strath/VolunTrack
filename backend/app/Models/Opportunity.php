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

    protected $appends = ['attendance_rate'];

    public function getAttendanceRateAttribute()
    {
        // Calculate total hours for this opportunity using start_date/start_time and end_date/end_time
        $startDateTime = \Carbon\Carbon::parse("{$this->start_date} {$this->start_time}");
        $endDateTime = \Carbon\Carbon::parse("{$this->end_date} {$this->end_time}");
        $totalOpportunityHours = $startDateTime->diffInHours($endDateTime);
        
        if ($totalOpportunityHours <= 0) {
            return 0;
        }
        
        // Get all participations for this opportunity
        $participations = Participation::where('opportunity_id', $this->id)->get();
        
        // Sum total hours attended (from all participations)
        $totalHoursAttended = 0;
        foreach ($participations as $participation) {
            if (!empty($participation->check_in) && !empty($participation->check_out)) {
                $checkIn = \Carbon\Carbon::parse($participation->check_in);
                $checkOut = \Carbon\Carbon::parse($participation->check_out);
                $totalHoursAttended += $checkOut->diffInHours($checkIn);
            }
        }
        
        // Calculate expected total hours (num_volunteers_needed * opportunity hours)
        $expectedTotalHours = $this->num_volunteers_needed * $totalOpportunityHours;
        
        // Calculate attendance rate as percentage
        $attendanceRate = $expectedTotalHours > 0 ? ($totalHoursAttended / $expectedTotalHours) * 100 : 0;
        
        return round($attendanceRate, 2);
    }
}
