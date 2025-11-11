<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;
use App\Models\OtpCode;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function user_can_register()
    {
        $userData = [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => 'password123',
            'role' => 'volunteer',
            'phone' => '+1234567890',
            'gender' => 'male'
        ];

        $response = $this->postJson('/api/register', $userData);

        $response->assertStatus(201)
                ->assertJsonStructure([
                    'user' => [
                        'id', 'name', 'email', 'role'
                    ],
                    'message'
                ]);

        $this->assertDatabaseHas('users', [
            'email' => 'test@example.com',
            'role' => 'volunteer'
        ]);
    }

    /** @test */
    public function user_can_login_and_get_otp_for_non_admin()
    {
        $user = User::factory()->create([
            'email' => 'volunteer@example.com',
            'password' => bcrypt('password123'),
            'role' => 'volunteer',
            'is_verified' => true
        ]);

        $response = $this->postJson('/api/login', [
            'email' => 'volunteer@example.com',
            'password' => 'password123'
        ]);

        $response->assertStatus(200)
                ->assertJson([
                    'message' => 'OTP sent to email'
                ]);
    }

    /** @test */
    public function admin_can_login_directly()
    {
        $user = User::factory()->create([
            'email' => 'admin@example.com',
            'password' => bcrypt('password123'),
            'role' => 'admin',
            'is_verified' => true
        ]);

        $response = $this->postJson('/api/login', [
            'email' => 'admin@example.com',
            'password' => 'password123'
        ]);

        $response->assertStatus(200)
                ->assertJsonStructure([
                    'user' => [
                        'id', 'name', 'email', 'role'
                    ],
                    'token'
                ]);
    }

    /** @test */
    public function user_can_verify_otp_and_login()
    {
        $user = User::factory()->create([
            'role' => 'volunteer',
            'is_verified' => true
        ]);

        $otp = OtpCode::create([
            'user_id' => $user->id,
            'otp_code' => '123456',
            'expires_at' => now()->addMinutes(10)
        ]);

        $response = $this->postJson('/api/verify-otp', [
            'otp' => '123456'
        ]);

        $response->assertStatus(200)
                ->assertJsonStructure([
                    'user' => [
                        'id', 'name', 'email', 'role'
                    ],
                    'token',
                    'membership'
                ]);
    }

    /** @test */
    public function user_can_logout()
    {
        $user = User::factory()->create();
        $token = $user->createToken('test')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token
        ])->postJson('/api/logout');

        $response->assertStatus(200)
                ->assertJson([
                    'message' => 'Logged out'
                ]);
    }

    /** @test */
    public function authenticated_user_can_get_profile()
    {
        $user = User::factory()->create();
        $token = $user->createToken('test')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token
        ])->getJson('/api/user');

        $response->assertStatus(200)
                ->assertJson([
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email
                ]);
    }
}