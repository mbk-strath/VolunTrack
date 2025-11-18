<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Models\Volunteer;
use App\Models\User;
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
    public function volunteer_belongs_to_user()
    {
        $user = User::factory()->create(['role' => 'volunteer']);
        $volunteer = Volunteer::factory()->create(['user_id' => $user->id]);

        $this->assertInstanceOf(User::class, $volunteer->user);
        $this->assertEquals($user->id, $volunteer->user->id);
    }

    /** @test */
    public function volunteer_can_be_created()
    {
        $user = User::factory()->create(['role' => 'volunteer']);
        $volunteer = Volunteer::factory()->create([
            'user_id' => $user->id,
            'country' => 'Kenya',
            'bio' => 'Passionate volunteer',
            'skills' => 'Teaching, Mentoring'
        ]);

        $this->assertInstanceOf(Volunteer::class, $volunteer);
        $this->assertEquals('Kenya', $volunteer->country);
        $this->assertEquals('Passionate volunteer', $volunteer->bio);
    }

    /** @test */
    public function volunteer_has_correct_appended_attributes()
    {
        $volunteer = new Volunteer();
        $expectedAppends = ['total_applications', 'total_hours', 'total_completed_opportunities'];
        $this->assertEquals($expectedAppends, $volunteer->getAppends());
    }
}
