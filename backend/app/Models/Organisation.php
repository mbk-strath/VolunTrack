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
        'reg_no',
        'website',
        'logo',
        'country',
        'city',
        'focus_area',
    ];

    // Computed attributes - these will be included in JSON responses but not stored in DB
    protected $appends = ['total_volunteers', 'opportunities_count'];

    // Accessor for total_volunteers - makes it read-only
    public function getTotalVolunteersAttribute()
    {
        return $this->uniqueVolunteerCount();
    }

    // Accessor for opportunities_count - makes it read-only
    public function getOpportunitiesCountAttribute()
    {
        return $this->opportunities()->count();
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // returns the count of unique volunteers across all opportunities of this organisation
    public function uniqueVolunteerCount()
    {
        $opportunityIds = Opportunity::where('organisation_id', $this->id)->pluck('id');
        if ($opportunityIds->isEmpty()) {
            return 0;
        }
        return Participation::whereIn('opportunity_id', $opportunityIds)
                            ->distinct()
                            ->count('volunteer_id');
    }

    public function opportunities()
    {
        return $this->hasMany(Opportunity::class, 'organisation_id');
    }

    public function gallery()
    {
        return $this->hasMany(Gallery::class, 'org_id');
    }
}
