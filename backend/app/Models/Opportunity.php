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
        $applications = Application::where('opportunity_id', $this->id)->count();
        $participations = Participation::where('opportunity_id', $this->id)->count();
        $attendanceRate = $applications > 0 ? ($participations / $applications) * 100 : 0;
        return $attendanceRate;
    }
}
