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
        'registration_number',
        'email',
        'phone',
        'website',
        'logo',
        'country',
        'city',
        'street_address',
        'operating_region',
        'mission_statement',
        'focus_area',
        'target_beneficiary',
    ];

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
}
