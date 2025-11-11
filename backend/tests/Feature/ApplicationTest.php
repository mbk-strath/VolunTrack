<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;
use App\Models\Volunteer;
use App\Models\Organisation;
use App\Models\Opportunity;
use App\Models\Application;

class ApplicationTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function volunteer_can_apply_for_opportunity()
    {
        $user = User::factory()->create(['role' => 'volunteer']);
        $volunteer = Volunteer::factory()->create(['user_id' => $user->id]);
        $opportunity = Opportunity::factory()->create();
        $token = $user->createToken('test')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token
        ])->postJson('/api/apply', [
            'opportunity_id' => $opportunity->id,
            'application_date' => '2025-11-01'
        ]);

        $response->assertStatus(201)
                ->assertJsonStructure([
                    'application' => [
                        'id', 'volunteer_id', 'opportunity_id', 'status', 'volunteer_name', 'opportunity_title'
                    ],
                    'message'
                ]);

        $this->assertDatabaseHas('applications', [
            'volunteer_id' => $user->id,
            'opportunity_id' => $opportunity->id,
            'status' => 'pending'
        ]);
    }

    /** @test */
    public function organisation_cannot_apply_for_opportunity()
    {
        $user = User::factory()->create(['role' => 'organisation']);
        $token = $user->createToken('test')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token
        ])->postJson('/api/apply', [
            'opportunity_id' => 1,
            'application_date' => '2025-11-01'
        ]);

        $response->assertStatus(403);
    }

    /** @test */
    public function volunteer_can_view_own_applications()
    {
        $user = User::factory()->create(['role' => 'volunteer']);
        $volunteer = Volunteer::factory()->create(['user_id' => $user->id]);
        $applications = Application::factory()->count(2)->create(['volunteer_id' => $volunteer->id]);
        $token = $user->createToken('test')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token
        ])->getJson('/api/my-applications');

        $response->assertStatus(200)
                ->assertJsonStructure([
                    'applications' => [
                        '*' => ['id', 'volunteer_id', 'opportunity_id', 'status', 'volunteer_name', 'opportunity_title']
                    ],
                    'message'
                ])
                ->assertJsonCount(2, 'applications');
    }

    /** @test */
    public function organisation_can_view_applicants_for_own_opportunity()
    {
        $user = User::factory()->create(['role' => 'organisation']);
        $organisation = Organisation::factory()->create(['user_id' => $user->id]);
        $opportunity = Opportunity::factory()->create(['organisation_id' => $organisation->id]);
        $applications = Application::factory()->count(3)->create(['opportunity_id' => $opportunity->id]);
        $token = $user->createToken('test')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token
        ])->getJson('/api/my-applicants/' . $opportunity->id);

        $response->assertStatus(200)
                ->assertJsonStructure([
                    'applications' => [
                        '*' => ['id', 'volunteer_id', 'opportunity_id', 'status', 'volunteer_name', 'opportunity_title']
                    ],
                    'message'
                ])
                ->assertJsonCount(3, 'applications');
    }

    /** @test */
    public function organisation_can_update_application_status()
    {
        $user = User::factory()->create(['role' => 'organisation']);
        $organisation = Organisation::factory()->create(['user_id' => $user->id]);
        $opportunity = Opportunity::factory()->create(['organisation_id' => $organisation->id]);
        $application = Application::factory()->create([
            'opportunity_id' => $opportunity->id,
            'status' => 'pending'
        ]);
        $token = $user->createToken('test')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token
        ])->patchJson('/api/update-application/' . $application->id, [
            'status' => 'accepted'
        ]);

        $response->assertStatus(200)
                ->assertJson([
                    'message' => 'Application Status Updated Successfully'
                ]);

        $this->assertDatabaseHas('applications', [
            'id' => $application->id,
            'status' => 'accepted'
        ]);
    }

    /** @test */
    public function volunteer_can_delete_own_application()
    {
        $user = User::factory()->create(['role' => 'volunteer']);
        $volunteer = Volunteer::factory()->create(['user_id' => $user->id]);
        $application = Application::factory()->create(['volunteer_id' => $volunteer->id]);
        $token = $user->createToken('test')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token
        ])->deleteJson('/api/delete-application/' . $application->id);

        $response->assertStatus(200);

        $this->assertDatabaseMissing('applications', ['id' => $application->id]);
    }

    /** @test */
    public function admin_can_list_all_applications()
    {
        $admin = User::factory()->create(['role' => 'admin']);
        Application::factory()->count(3)->create();
        $token = $admin->createToken('test')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token
        ])->getJson('/api/all-applications');

        $response->assertStatus(200)
                ->assertJsonStructure([
                    'applications' => [],
                    'message'
                ])
                ->assertJsonCount(3, 'applications');
    }
}