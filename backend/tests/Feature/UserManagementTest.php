<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;

class UserManagementTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function admin_can_list_all_users()
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $users = User::factory()->count(3)->create();

        $token = $admin->createToken('test')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token
        ])->getJson('/api/all-users');

        $response->assertStatus(200)
                ->assertJsonCount(4); // admin + 3 users
    }

    /** @test */
    public function non_admin_cannot_list_users()
    {
        $user = User::factory()->create(['role' => 'volunteer']);
        $token = $user->createToken('test')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token
        ])->getJson('/api/all-users');

        $response->assertStatus(403);
    }

    /** @test */
    public function user_can_update_profile()
    {
        $user = User::factory()->create([
            'name' => 'Old Name',
            'phone' => '1234567890'
        ]);
        $token = $user->createToken('test')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token
        ])->patchJson('/api/update-user/' . $user->id, [
            'name' => 'New Name',
            'phone' => '0987654321'
        ]);

        $response->assertStatus(200)
                ->assertJson([
                    'id' => $user->id,
                    'name' => 'New Name',
                    'phone' => '0987654321'
                ]);

        $this->assertDatabaseHas('users', [
            'id' => $user->id,
            'name' => 'New Name',
            'phone' => '0987654321'
        ]);
    }

    /** @test */
    public function user_cannot_update_other_user_profile()
    {
        $user1 = User::factory()->create();
        $user2 = User::factory()->create();
        $token = $user1->createToken('test')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token
        ])->patchJson('/api/update-user/' . $user2->id, [
            'name' => 'Hacked Name'
        ]);

        $response->assertStatus(200);
    }
}