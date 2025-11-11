<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;
use App\Models\Volunteer;
use App\Models\Organisation;
use App\Models\Opportunity;
use App\Models\Participation;

class ParticipationTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function organisation_can_add_participation()
    {
        $user = User::factory()->create(['role' => 'organisation']);
        $organisation = Organisation::factory()->create(['user_id' => $user->id]);
        $opportunity = Opportunity::factory()->create(['organisation_id' => $organisation->id]);
        $volunteer = Volunteer::factory()->create();
        $token = $user->createToken('test')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token
        ])->postJson('/api/add-participation', [
            'volunteer_id' => $volunteer->id,
            'opportunity_id' => $opportunity->id,
            'check_in' => '2025-12-01 09:00:00',
            'check_out' => '2025-12-01 17:00:00'
        ]);

        $response->assertStatus(200)
                ->assertJsonStructure([
                    'message',
                    'participation' => [
                        'id', 'volunteer_id', 'opportunity_id', 'check_in', 'check_out', 'total_hours'
                    ]
                ]);

        $this->assertDatabaseHas('participations', [
            'volunteer_id' => $volunteer->id,
            'opportunity_id' => $opportunity->id,
            'total_hours' => 8
        ]);
    }

    /** @test */
    public function volunteer_can_view_own_participations()
    {
        $user = User::factory()->create(['role' => 'volunteer']);
        $volunteer = Volunteer::factory()->create(['user_id' => $user->id]);
        $participations = Participation::factory()->count(2)->create(['volunteer_id' => $volunteer->id]);
        $token = $user->createToken('test')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token
        ])->getJson('/api/my-participations');

        $response->assertStatus(200)
                ->assertJsonStructure([
                    'participations' => [
                        '*' => ['id', 'volunteer_id', 'opportunity_id', 'total_hours']
                    ],
                    'total_hours'
                ])
                ->assertJsonCount(2, 'participations');
    }

    /** @test */
    public function organisation_can_view_opportunity_participations()
    {
        $user = User::factory()->create(['role' => 'organisation']);
        $organisation = Organisation::factory()->create(['user_id' => $user->id]);
        $opportunity = Opportunity::factory()->create(['organisation_id' => $organisation->id]);
        $participations = Participation::factory()->count(3)->create(['opportunity_id' => $opportunity->id]);
        $token = $user->createToken('test')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token
        ])->getJson('/api/opportunity-participations/' . $opportunity->id);

        $response->assertStatus(200)
                ->assertJsonCount(3);
    }

    /** @test */
    public function organisation_can_delete_participation()
    {
        $user = User::factory()->create(['role' => 'organisation']);
        $organisation = Organisation::factory()->create(['user_id' => $user->id]);
        $opportunity = Opportunity::factory()->create(['organisation_id' => $organisation->id]);
        $participation = Participation::factory()->create(['opportunity_id' => $opportunity->id]);
        $token = $user->createToken('test')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token
        ])->deleteJson('/api/delete-participation/' . $participation->id);

        $response->assertStatus(200)
                ->assertJson([
                    'message' => 'Participation deleted'
                ]);

        $this->assertDatabaseMissing('participations', ['id' => $participation->id]);
    }

    /** @test */
    public function admin_can_list_all_participations()
    {
        $admin = User::factory()->create(['role' => 'admin']);
        Participation::factory()->count(3)->create();
        $token = $admin->createToken('test')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token
        ])->getJson('/api/all-participations');

        $response->assertStatus(200)
                ->assertJsonCount(3);
    }
}