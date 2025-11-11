<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;
use App\Models\Volunteer;
use App\Models\Organisation;
use App\Models\Opportunity;
use App\Models\Participation;
use App\Models\Evidence;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class EvidenceTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function volunteer_can_upload_evidence()
    {
        $user = User::factory()->create(['role' => 'volunteer']);
        $volunteer = Volunteer::factory()->create(['user_id' => $user->id]);
        $organisation = Organisation::factory()->create();
        $opportunity = Opportunity::factory()->create(['organisation_id' => $organisation->id]);
        $participation = Participation::factory()->create([
            'volunteer_id' => $volunteer->id,
            'opportunity_id' => $opportunity->id
        ]);
        $token = $user->createToken('test')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token
        ])->postJson('/api/create-evidence', [
            'org_id' => $organisation->id,
            'rating' => 4,
            'comment' => 'Great volunteer work!'
        ]);

        $response->assertStatus(201)
                ->assertJson([
                    'message' => 'Created Successfully',
                    'evidence' => [
                        'org_id' => $organisation->id,
                        'volunteer_id' => $volunteer->id,
                        'rating' => 4,
                        'comment' => 'Great volunteer work!'
                    ]
                ]);

        $this->assertDatabaseHas('evidence', [
            'org_id' => $organisation->id,
            'volunteer_id' => $volunteer->id,
            'rating' => 4,
            'comment' => 'Great volunteer work!'
        ]);
    }

    /** @test */
    public function volunteer_can_view_own_evidence()
    {
        $user = User::factory()->create(['role' => 'volunteer']);
        $volunteer = Volunteer::factory()->create(['user_id' => $user->id]);
        $evidence = Evidence::factory()->count(2)->create(['volunteer_id' => $volunteer->id]);
        $token = $user->createToken('test')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token
        ])->postJson('/api/my-evidences');

        $response->assertStatus(200)
                ->assertJsonCount(2);
    }

    /** @test */
    public function organisation_can_view_evidence_for_opportunity()
    {
        $user = User::factory()->create(['role' => 'organisation']);
        $organisation = Organisation::factory()->create(['user_id' => $user->id]);
        $opportunity = Opportunity::factory()->create(['organisation_id' => $organisation->id]);
        $evidence = Evidence::factory()->count(2)->create(['org_id' => $organisation->id]);
        $token = $user->createToken('test')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token
        ])->getJson('/api/organisation-evidences/' . $organisation->id);

        $response->assertStatus(200)
                ->assertJsonCount(2);
    }

    /** @test */
    public function volunteer_can_delete_own_evidence()
    {
        Storage::fake('public');
        $user = User::factory()->create(['role' => 'volunteer']);
        $volunteer = Volunteer::factory()->create(['user_id' => $user->id]);
        $evidence = Evidence::factory()->create(['volunteer_id' => $volunteer->id]);
        $token = $user->createToken('test')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token
        ])->deleteJson('/api/delete-evidence/' . $evidence->id);

        $response->assertStatus(200)
                ->assertJson([
                    'message' => 'Deleted Successfully'
                ]);

        $this->assertDatabaseMissing('evidence', ['id' => $evidence->id]);
    }

    /** @test */
    public function admin_can_list_all_evidence()
    {
        $admin = User::factory()->create(['role' => 'admin']);
        Evidence::factory()->count(3)->create();
        $token = $admin->createToken('test')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token
        ])->getJson('/api/all-evidences');

        $response->assertStatus(200)
                ->assertJsonCount(3);
    }
}