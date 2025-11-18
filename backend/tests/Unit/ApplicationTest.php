<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Models\Application;
use App\Models\Volunteer;
use App\Models\Opportunity;
use App\Models\Organisation;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

class ApplicationTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function application_can_be_created()
    {
        $user = User::factory()->create(['role' => 'volunteer']);
        $volunteer = Volunteer::factory()->create(['user_id' => $user->id]);
        $orgUser = User::factory()->create(['role' => 'organisation']);
        $organisation = Organisation::factory()->create(['user_id' => $orgUser->id]);
        $opportunity = Opportunity::factory()->create(['organisation_id' => $organisation->id]);
        
        $application = Application::factory()->create([
            'volunteer_id' => $volunteer->id,
            'opportunity_id' => $opportunity->id,
            'status' => 'pending',
        ]);

        $this->assertInstanceOf(Application::class, $application);
        $this->assertEquals('pending', $application->status);
    }

    /** @test */
    public function application_has_correct_appends()
    {
        $application = new Application();
        $expectedAppends = ['volunteer_name', 'opportunity_title'];
        $this->assertEquals($expectedAppends, $application->getAppends());
    }

    /** @test */
    public function application_volunteer_name_accessor_works()
    {
        $user = User::factory()->create(['role' => 'volunteer', 'name' => 'Jane Doe']);
        $volunteer = Volunteer::factory()->create(['user_id' => $user->id]);
        $orgUser = User::factory()->create(['role' => 'organisation']);
        $organisation = Organisation::factory()->create(['user_id' => $orgUser->id]);
        $opportunity = Opportunity::factory()->create(['organisation_id' => $organisation->id]);
        
        $application = Application::factory()->create([
            'volunteer_id' => $volunteer->id,
            'opportunity_id' => $opportunity->id,
        ]);

        $this->assertEquals('Jane Doe', $application->volunteer_name);
    }

    /** @test */
    public function application_opportunity_title_accessor_works()
    {
        $user = User::factory()->create(['role' => 'volunteer']);
        $volunteer = Volunteer::factory()->create(['user_id' => $user->id]);
        $orgUser = User::factory()->create(['role' => 'organisation']);
        $organisation = Organisation::factory()->create(['user_id' => $orgUser->id]);
        $opportunity = Opportunity::factory()->create(['organisation_id' => $organisation->id, 'title' => 'Beach Cleanup']);
        
        $application = Application::factory()->create([
            'volunteer_id' => $volunteer->id,
            'opportunity_id' => $opportunity->id,
        ]);

        $this->assertEquals('Beach Cleanup', $application->opportunity_title);
    }
}
