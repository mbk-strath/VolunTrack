<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

class UserTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function user_can_be_created()
    {
        $user = User::factory()->create([
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'role' => 'volunteer'
        ]);

        $this->assertInstanceOf(User::class, $user);
        $this->assertEquals('John Doe', $user->name);
        $this->assertEquals('john@example.com', $user->email);
    }

    /** @test */
    public function user_password_is_hashed()
    {
        $user = User::factory()->create(['password' => 'password']);
        
        $this->assertNotEquals('password', $user->password);
    }

    /** @test */
    public function user_has_correct_hidden_attributes()
    {
        $user = new User();
        $this->assertIsArray($user->getHidden());
    }
}
