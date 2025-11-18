<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Models\Opportunity;
use App\Models\Organisation;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

class OpportunityTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function opportunity_belongs_to_organisation()
    {
        $user = User::factory()->create(['role' => 'organisation']);
        $organisation = Organisation::factory()->create(['user_id' => $user->id]);
        $opportunity = Opportunity::factory()->create(['organisation_id' => $organisation->id]);

        $this->assertInstanceOf(Organisation::class, $opportunity->organisation);
        $this->assertEquals($organisation->id, $opportunity->organisation->id);
    }

    /** @test */
    public function opportunity_can_be_created()
    {
        $user = User::factory()->create(['role' => 'organisation']);
        $organisation = Organisation::factory()->create(['user_id' => $user->id]);
        $opportunity = Opportunity::factory()->create([
            'organisation_id' => $organisation->id,
            'title' => 'Beach Cleanup',
            'description' => 'Help clean the beach',
            'location' => 'Mombasa',
        ]);

        $this->assertInstanceOf(Opportunity::class, $opportunity);
        $this->assertEquals('Beach Cleanup', $opportunity->title);
        $this->assertEquals('Mombasa', $opportunity->location);
    }

    /** @test */
    public function opportunity_has_start_and_end_times()
    {
        $user = User::factory()->create(['role' => 'organisation']);
        $organisation = Organisation::factory()->create(['user_id' => $user->id]);
        $opportunity = Opportunity::factory()->create([
            'organisation_id' => $organisation->id,
            'start_time' => '09:00',
            'end_time' => '17:00',
        ]);

        $this->assertEquals('09:00', $opportunity->start_time);
        $this->assertEquals('17:00', $opportunity->end_time);
    }

    /** @test */
    public function opportunity_has_start_and_end_dates()
    {
        $user = User::factory()->create(['role' => 'organisation']);
        $organisation = Organisation::factory()->create(['user_id' => $user->id]);
        $opportunity = Opportunity::factory()->create([
            'organisation_id' => $organisation->id,
            'start_date' => '2025-12-01',
            'end_date' => '2025-12-31',
        ]);

        $this->assertNotNull($opportunity->start_date);
        $this->assertNotNull($opportunity->end_date);
    }
}
