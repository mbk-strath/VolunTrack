<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;
use App\Models\Organisation;
use App\Models\Opportunity;

class OpportunityTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function organisation_can_create_opportunity()
    {
        $user = User::factory()->create(['role' => 'organisation']);
        $organisation = Organisation::factory()->create(['user_id' => $user->id]);
        $token = $user->createToken('test')->plainTextToken;

        $opportunityData = [
            'title' => 'Community Clean-up',
            'description' => 'Help clean up the local park',
            'required_skills' => 'Physical labor, teamwork',
            'num_volunteers_needed' => 10,
            'start_date' => '2025-12-01',
            'end_date' => '2025-12-01',
            'schedule' => '9 AM - 5 PM',
            'benefits' => 'Free lunch',
            'application_deadline' => '2025-11-25',
            'location' => 'Central Park'
        ];

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token
        ])->postJson('/api/create-opportunity', $opportunityData);

        $response->assertStatus(201)
                ->assertJsonStructure([
                    'message',
                    'opportunity' => [
                        'id', 'title', 'description', 'organisation_id', 'attendance_rate'
                    ]
                ]);

        $this->assertDatabaseHas('opportunities', [
            'title' => 'Community Clean-up',
            'organisation_id' => $organisation->id
        ]);
    }

    /** @test */
    public function volunteer_cannot_create_opportunity()
    {
        $user = User::factory()->create(['role' => 'volunteer']);
        $token = $user->createToken('test')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token
        ])->postJson('/api/create-opportunity', [
            'title' => 'Test Opportunity'
        ]);

        $response->assertStatus(403);
    }

    /** @test */
    public function anyone_can_list_opportunities()
    {
        $user = User::factory()->create();
        $token = $user->createToken('test')->plainTextToken;
        Opportunity::factory()->count(3)->create();

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token
        ])->getJson('/api/all-opportunities');

        $response->assertStatus(200)
                ->assertJsonCount(3);
    }

    /** @test */
    public function anyone_can_get_opportunity_by_id()
    {
        $user = User::factory()->create();
        $token = $user->createToken('test')->plainTextToken;
        $opportunity = Opportunity::factory()->create();

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token
        ])->getJson('/api/get-opportunity/' . $opportunity->id);

        $response->assertStatus(200)
                ->assertJson([
                    'id' => $opportunity->id,
                    'title' => $opportunity->title
                ]);
    }

    /** @test */
    public function organisation_can_update_own_opportunity()
    {
        $user = User::factory()->create(['role' => 'organisation']);
        $organisation = Organisation::factory()->create(['user_id' => $user->id]);
        $opportunity = Opportunity::factory()->create(['organisation_id' => $organisation->id]);
        $token = $user->createToken('test')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token
        ])->patchJson('/api/update-opportunity/' . $opportunity->id, [
            'title' => 'Updated Title'
        ]);

        $response->assertStatus(200)
                ->assertJson([
                    'message' => 'Opportunity Updated Successfuly'
                ]);

        $this->assertDatabaseHas('opportunities', [
            'id' => $opportunity->id,
            'title' => 'Updated Title'
        ]);
    }

    /** @test */
    public function organisation_cannot_update_other_opportunity()
    {
        $user1 = User::factory()->create(['role' => 'organisation']);
        $user2 = User::factory()->create(['role' => 'organisation']);
        $org1 = Organisation::factory()->create(['user_id' => $user1->id]);
        $org2 = Organisation::factory()->create(['user_id' => $user2->id]);
        $opportunity = Opportunity::factory()->create(['organisation_id' => $org2->id]);
        $token = $user1->createToken('test')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token
        ])->patchJson('/api/update-opportunity/' . $opportunity->id, [
            'title' => 'Hacked Title'
        ]);

        $response->assertStatus(404);
    }

    /** @test */
    public function organisation_can_delete_own_opportunity()
    {
        $user = User::factory()->create(['role' => 'organisation']);
        $organisation = Organisation::factory()->create(['user_id' => $user->id]);
        $opportunity = Opportunity::factory()->create(['organisation_id' => $organisation->id]);
        $token = $user->createToken('test')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token
        ])->deleteJson('/api/delete-opportunity/' . $opportunity->id);

        $response->assertStatus(200)
                ->assertJson([
                    'message' => 'Opportunity Deleted Successfuly'
                ]);

        $this->assertDatabaseMissing('opportunities', ['id' => $opportunity->id]);
    }
}