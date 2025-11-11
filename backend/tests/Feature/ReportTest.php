<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;
use App\Models\Volunteer;
use App\Models\Organisation;
use App\Models\Opportunity;
use App\Models\Report;

class ReportTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function organisation_can_create_report()
    {
        $user = User::factory()->create(['role' => 'organisation']);
        $organisation = Organisation::factory()->create(['user_id' => $user->id]);
        $opportunity = Opportunity::factory()->create(['organisation_id' => $organisation->id]);
        $token = $user->createToken('test')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token
        ])->postJson('/api/create-report', [
            'title' => 'Monthly Volunteer Report',
            'description' => 'This is a detailed report of volunteer activities.'
        ]);

        $response->assertStatus(200)
                ->assertJsonStructure([
                    'id', 'user_id', 'title', 'description', 'status'
                ]);

        $this->assertDatabaseHas('reports', [
            'user_id' => $user->id,
            'title' => 'Monthly Volunteer Report',
            'description' => 'This is a detailed report of volunteer activities.'
        ]);
    }

    /** @test */
    public function organisation_can_view_own_reports()
    {
        $user = User::factory()->create(['role' => 'organisation']);
        $organisation = Organisation::factory()->create(['user_id' => $user->id]);
        $reports = Report::factory()->count(2)->create(['user_id' => $user->id]);
        $token = $user->createToken('test')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token
        ])->getJson('/api/my-reports');

        $response->assertStatus(200)
                ->assertJsonCount(2);
    }

    /** @test */
    public function organisation_can_update_report()
    {
        $user = User::factory()->create(['role' => 'organisation']);
        $organisation = Organisation::factory()->create(['user_id' => $user->id]);
        $report = Report::factory()->create(['user_id' => $user->id]);
        $token = $user->createToken('test')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token
        ])->patchJson('/api/update-report/' . $report->id, [
            'title' => 'Updated Report Title',
            'description' => 'Updated report description.'
        ]);

        $response->assertStatus(200)
                ->assertJson([
                    'id' => $report->id,
                    'title' => 'Updated Report Title',
                    'description' => 'Updated report description.'
                ]);

        $this->assertDatabaseHas('reports', [
            'id' => $report->id,
            'title' => 'Updated Report Title',
            'description' => 'Updated report description.'
        ]);
    }

    /** @test */
    public function organisation_can_delete_report()
    {
        $user = User::factory()->create(['role' => 'organisation']);
        $organisation = Organisation::factory()->create(['user_id' => $user->id]);
        $report = Report::factory()->create(['user_id' => $user->id]);
        $token = $user->createToken('test')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token
        ])->deleteJson('/api/delete-report/' . $report->id);

        $response->assertStatus(200)
                ->assertJson([
                    'message' => 'Report deleted successfully'
                ]);

        $this->assertDatabaseMissing('reports', ['id' => $report->id]);
    }

    /** @test */
    public function admin_can_list_all_reports()
    {
        $admin = User::factory()->create(['role' => 'admin']);
        Report::factory()->count(3)->create();
        $token = $admin->createToken('test')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token
        ])->getJson('/api/all-reports');

        $response->assertStatus(200)
                ->assertJsonCount(3);
    }

    /** @test */
    public function volunteer_cannot_create_report()
    {
        $user = User::factory()->create(['role' => 'volunteer']);
        $volunteer = Volunteer::factory()->create(['user_id' => $user->id]);
        $organisation = Organisation::factory()->create();
        $opportunity = Opportunity::factory()->create(['organisation_id' => $organisation->id]);
        $token = $user->createToken('test')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token
        ])->postJson('/api/create-report', [
            'title' => 'Volunteer Report',
            'description' => 'This is a volunteer report.'
        ]);

        $response->assertStatus(200);
    }
}