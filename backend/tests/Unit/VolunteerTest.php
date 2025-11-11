<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Models\User;
use App\Models\Volunteer;
use App\Models\Application;
use App\Models\Participation;
use App\Models\Evidence;
use Illuminate\Foundation\Testing\RefreshDatabase;

class VolunteerTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function volunteer_has_correct_fillable_attributes()
    {
        $volunteer = new Volunteer();

        $expectedFillable = [
            'user_id',
            'country',
            'bio',
            'skills',
            'location',
            'profile_image',
            'is_active',
        ];

        $this->assertEquals($expectedFillable, $volunteer->getFillable());
    }

    /** @test */
    public function volunteer_has_correct_casts()
    {
        $volunteer = new Volunteer();

        $expectedCasts = [
            'id' => 'int',
        ];

        $this->assertEquals($expectedCasts, $volunteer->getCasts());
    }

        /** @test */
    public function volunteer_belongs_to_user()
    {
        $user = User::factory()->create();
        $volunteer = Volunteer::factory()->create(['user_id' => $user->id]);

        $this->assertInstanceOf(User::class, $volunteer->user);
        $this->assertEquals($user->id, $volunteer->user->id);
    }

        /** @test */
    public function volunteer_total_applications_attribute()
    {
        $user = User::factory()->create();
        $applications = Application::factory()->count(3)->create(['volunteer_id' => $user->id]);
        $volunteer = Volunteer::factory()->create(['user_id' => $user->id]);

        $this->assertEquals(3, $volunteer->total_applications);
    }

    /** @test */
    public function volunteer_total_hours_attribute()
    {
        $user = User::factory()->create();
        $participations = Participation::factory()->count(2)->create(['volunteer_id' => $user->id]);
        $volunteer = Volunteer::factory()->create(['user_id' => $user->id]);

        $totalHours = $participations->sum('total_hours');
        $this->assertEquals($totalHours, $volunteer->total_hours);
    }

    /** @test */
    public function volunteer_has_correct_appended_attributes()
    {
        $volunteer = new Volunteer();

        $expectedAppends = [
            'total_applications',
            'total_hours',
            'total_completed_opportunities',
        ];

        $this->assertEquals($expectedAppends, $volunteer->getAppends());
    }
}