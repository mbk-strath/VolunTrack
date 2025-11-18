<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Models\Evidence;
use App\Models\Organisation;
use App\Models\Volunteer;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

class EvidenceTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function evidence_can_be_created()
    {
        $orgUser = User::factory()->create(['role' => 'organisation']);
        $organisation = Organisation::factory()->create(['user_id' => $orgUser->id]);
        $volUser = User::factory()->create(['role' => 'volunteer']);
        $volunteer = Volunteer::factory()->create(['user_id' => $volUser->id]);
        
        $evidence = Evidence::factory()->create([
            'org_id' => $organisation->id,
            'volunteer_id' => $volunteer->id,
            'rating' => 5,
            'comment' => 'Great work',
        ]);

        $this->assertInstanceOf(Evidence::class, $evidence);
        $this->assertEquals(5, $evidence->rating);
        $this->assertEquals('Great work', $evidence->comment);
    }

    /** @test */
    public function evidence_has_correct_appends()
    {
        $evidence = new Evidence();
        $expectedAppends = ['organisation_name', 'volunteer_name'];
        $this->assertEquals($expectedAppends, $evidence->getAppends());
    }

    /** @test */
    public function evidence_belongs_to_organisation()
    {
        $orgUser = User::factory()->create(['role' => 'organisation']);
        $organisation = Organisation::factory()->create(['user_id' => $orgUser->id]);
        $volUser = User::factory()->create(['role' => 'volunteer']);
        $volunteer = Volunteer::factory()->create(['user_id' => $volUser->id]);
        
        $evidence = Evidence::factory()->create([
            'org_id' => $organisation->id,
            'volunteer_id' => $volunteer->id,
        ]);

        $this->assertInstanceOf(Organisation::class, $evidence->organisation);
        $this->assertEquals($organisation->id, $evidence->organisation->id);
    }
}
