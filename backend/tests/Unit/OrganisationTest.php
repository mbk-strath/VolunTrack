<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Models\Organisation;
use App\Models\User;
use App\Models\Opportunity;
use Illuminate\Foundation\Testing\RefreshDatabase;

class OrganisationTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function organisation_belongs_to_user()
    {
        $user = User::factory()->create(['role' => 'organisation']);
        $organisation = Organisation::factory()->create(['user_id' => $user->id]);

        $this->assertInstanceOf(User::class, $organisation->user);
        $this->assertEquals($user->id, $organisation->user->id);
    }

    /** @test */
    public function organisation_has_many_opportunities()
    {
        $user = User::factory()->create(['role' => 'organisation']);
        $organisation = Organisation::factory()->create(['user_id' => $user->id]);
        $opportunities = Opportunity::factory(3)->create(['organisation_id' => $organisation->id]);

        $this->assertEquals(3, $organisation->opportunities->count());
        $this->assertInstanceOf(Opportunity::class, $organisation->opportunities->first());
    }

    /** @test */
    public function organisation_has_correct_appended_attributes()
    {
        $organisation = new Organisation();
        $expectedAppends = ['total_volunteers', 'opportunities_count'];
        $this->assertEquals($expectedAppends, $organisation->getAppends());
    }

    /** @test */
    public function organisation_can_be_created()
    {
        $user = User::factory()->create(['role' => 'organisation']);
        $organisation = Organisation::factory()->create([
            'user_id' => $user->id,
            'org_name' => 'Test NGO',
            'org_type' => 'NGO',
            'country' => 'Kenya',
            'city' => 'Nairobi'
        ]);

        $this->assertInstanceOf(Organisation::class, $organisation);
        $this->assertEquals('Test NGO', $organisation->org_name);
        $this->assertEquals('NGO', $organisation->org_type);
    }

    /** @test */
    public function organisation_total_volunteers_accessor_works()
    {
        $user = User::factory()->create(['role' => 'organisation']);
        $organisation = Organisation::factory()->create(['user_id' => $user->id]);
        
        $total = $organisation->total_volunteers;
        $this->assertIsInt($total);
    }

    /** @test */
    public function organisation_opportunities_count_accessor_works()
    {
        $user = User::factory()->create(['role' => 'organisation']);
        $organisation = Organisation::factory()->create(['user_id' => $user->id]);
        Opportunity::factory(2)->create(['organisation_id' => $organisation->id]);

        $this->assertEquals(2, $organisation->opportunities_count);
    }
}
