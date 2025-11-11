<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Services\MembershipService;
use App\Models\User;
use App\Models\Organisation;
use App\Models\Volunteer;
use App\Models\Opportunity;
use App\Models\Participation;
use Illuminate\Foundation\Testing\RefreshDatabase;

class MembershipServiceTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function get_membership_returns_organisation_for_organisation_user()
    {
        $user = User::factory()->create(['role' => 'organisation']);
        $organisation = Organisation::factory()->create(['user_id' => $user->id]);

        $membership = MembershipService::getMembership($user);

        $this->assertInstanceOf(Organisation::class, $membership);
        $this->assertEquals($organisation->id, $membership->id);
    }

    /** @test */
    public function get_membership_returns_volunteer_for_volunteer_user()
    {
        $user = User::factory()->create(['role' => 'volunteer']);
        $volunteer = Volunteer::factory()->create(['user_id' => $user->id]);

        $membership = MembershipService::getMembership($user);

        $this->assertInstanceOf(Volunteer::class, $membership);
        $this->assertEquals($volunteer->id, $membership->id);
    }

    /** @test */
    public function get_membership_returns_null_for_admin_user()
    {
        $user = User::factory()->create(['role' => 'admin']);

        $membership = MembershipService::getMembership($user);

        $this->assertNull($membership);
    }

    /** @test */
    public function get_membership_returns_null_for_unknown_role()
    {
        $user = User::factory()->create(['role' => 'unknown']);

        $membership = MembershipService::getMembership($user);

        $this->assertNull($membership);
    }

    /** @test */
    public function organisation_membership_includes_total_volunteers()
    {
        $user = User::factory()->create(['role' => 'organisation']);
        $organisation = Organisation::factory()->create(['user_id' => $user->id]);
        $opportunity = Opportunity::factory()->create(['organisation_id' => $organisation->id]);

        // Create participations (volunteers)
        Participation::factory()->count(3)->create(['opportunity_id' => $opportunity->id]);

        $membership = MembershipService::getMembership($user);

        $this->assertEquals(3, $membership->total_volunteers);
    }

    /** @test */
    public function organisation_membership_includes_opportunities_count()
    {
        $user = User::factory()->create(['role' => 'organisation']);
        $organisation = Organisation::factory()->create(['user_id' => $user->id]);

        // Create opportunities
        Opportunity::factory()->count(4)->create(['organisation_id' => $organisation->id]);

        $membership = MembershipService::getMembership($user);

        $this->assertEquals(4, $membership->opportunities);
    }

    /** @test */
    public function organisation_membership_calculates_unique_volunteers_across_opportunities()
    {
        $user = User::factory()->create(['role' => 'organisation']);
        $organisation = Organisation::factory()->create(['user_id' => $user->id]);
        $opportunity1 = Opportunity::factory()->create(['organisation_id' => $organisation->id]);
        $opportunity2 = Opportunity::factory()->create(['organisation_id' => $organisation->id]);

        $volunteer1 = Volunteer::factory()->create();
        $volunteer2 = Volunteer::factory()->create();

        // Same volunteer in both opportunities (should count as 1 unique)
        Participation::factory()->create([
            'volunteer_id' => $volunteer1->user_id,
            'opportunity_id' => $opportunity1->id
        ]);
        Participation::factory()->create([
            'volunteer_id' => $volunteer1->user_id,
            'opportunity_id' => $opportunity2->id
        ]);

        // Different volunteer
        Participation::factory()->create([
            'volunteer_id' => $volunteer2->user_id,
            'opportunity_id' => $opportunity1->id
        ]);

        $membership = MembershipService::getMembership($user);

        $this->assertEquals(2, $membership->total_volunteers);
    }
}