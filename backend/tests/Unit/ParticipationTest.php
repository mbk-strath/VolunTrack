<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Models\Participation;
use App\Models\Volunteer;
use App\Models\Opportunity;
use App\Models\Organisation;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

class ParticipationTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function participation_can_be_created_with_check_in()
    {
        $user = User::factory()->create(['role' => 'volunteer']);
        $volunteer = Volunteer::factory()->create(['user_id' => $user->id]);
        $orgUser = User::factory()->create(['role' => 'organisation']);
        $organisation = Organisation::factory()->create(['user_id' => $orgUser->id]);
        $opportunity = Opportunity::factory()->create(['organisation_id' => $organisation->id]);
        
        $participation = Participation::factory()->create([
            'volunteer_id' => $volunteer->id,
            'opportunity_id' => $opportunity->id,
            'check_in' => now(),
        ]);

        $this->assertInstanceOf(Participation::class, $participation);
        $this->assertNotNull($participation->check_in);
    }

    /** @test */
    public function participation_has_correct_appended_attributes()
    {
        $participation = new Participation();
        $expectedAppends = [
            'volunteer_name',
            'opportunity_title',
            'opportunity_start_date',
            'opportunity_start_time',
            'opportunity_end_date',
            'opportunity_end_time',
        ];
        $this->assertEquals($expectedAppends, $participation->getAppends());
    }

    /** @test */
    public function participation_can_store_total_hours()
    {
        $user = User::factory()->create(['role' => 'volunteer']);
        $volunteer = Volunteer::factory()->create(['user_id' => $user->id]);
        $orgUser = User::factory()->create(['role' => 'organisation']);
        $organisation = Organisation::factory()->create(['user_id' => $orgUser->id]);
        $opportunity = Opportunity::factory()->create(['organisation_id' => $organisation->id]);
        
        $checkIn = now();
        $checkOut = $checkIn->copy()->addHours(2)->addMinutes(30);
        
        $participation = Participation::factory()->create([
            'volunteer_id' => $volunteer->id,
            'opportunity_id' => $opportunity->id,
            'check_in' => $checkIn,
            'check_out' => $checkOut,
            'total_hours' => 2.5,
        ]);

        $this->assertEquals(2.5, $participation->total_hours);
    }

    /** @test */
    public function participation_volunteer_name_accessor_works()
    {
        $user = User::factory()->create(['role' => 'volunteer', 'name' => 'John Volunteer']);
        $volunteer = Volunteer::factory()->create(['user_id' => $user->id]);
        $orgUser = User::factory()->create(['role' => 'organisation']);
        $organisation = Organisation::factory()->create(['user_id' => $orgUser->id]);
        $opportunity = Opportunity::factory()->create(['organisation_id' => $organisation->id]);
        
        $participation = Participation::factory()->create([
            'volunteer_id' => $volunteer->id,
            'opportunity_id' => $opportunity->id,
        ]);

        $this->assertEquals('John Volunteer', $participation->volunteer_name);
    }

    /** @test */
    public function participation_opportunity_title_accessor_works()
    {
        $user = User::factory()->create(['role' => 'volunteer']);
        $volunteer = Volunteer::factory()->create(['user_id' => $user->id]);
        $orgUser = User::factory()->create(['role' => 'organisation']);
        $organisation = Organisation::factory()->create(['user_id' => $orgUser->id]);
        $opportunity = Opportunity::factory()->create([
            'organisation_id' => $organisation->id,
            'title' => 'Tree Planting Drive'
        ]);
        
        $participation = Participation::factory()->create([
            'volunteer_id' => $volunteer->id,
            'opportunity_id' => $opportunity->id,
        ]);

        $this->assertEquals('Tree Planting Drive', $participation->opportunity_title);
    }
}
