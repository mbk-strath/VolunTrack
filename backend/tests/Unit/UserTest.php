<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Models\User;
use App\Models\Notification;
use App\Models\Volunteer;
use App\Models\Organisation;
use Illuminate\Foundation\Testing\RefreshDatabase;

class UserTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function user_has_correct_fillable_attributes()
    {
        $user = new User();

                $expectedFillable = [
            'id',
            'name',
            'email',
            'gender',
            'phone',
            'password',
            'role',
            'is_active',
            'is_verified',
        ];

        $this->assertEquals($expectedFillable, $user->getFillable());
    }

    /** @test */
    public function user_has_correct_hidden_attributes()
    {
        $user = new User();

        $expectedHidden = [
            'password',
            'remember_token',
        ];

        $this->assertEquals($expectedHidden, $user->getHidden());
    }

    /** @test */
    public function user_has_correct_casts()
    {
        $user = new User();

        $expectedCasts = [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_verified' => 'boolean',
            'is_active' => 'boolean',
            'id' => 'int',
        ];

        $this->assertEquals($expectedCasts, $user->getCasts());
    }

    /** @test */
    public function user_has_many_received_notifications()
    {
        $user = User::factory()->create();
        $notification = Notification::factory()->create(['receiver_id' => $user->id]);

        $this->assertCount(1, $user->receivedNotifications);
        $this->assertEquals($user->id, $user->receivedNotifications->first()->receiver_id);
    }

    /** @test */
    public function user_has_many_sent_notifications()
    {
        $user = User::factory()->create();
        $notification = Notification::factory()->create(['sender_id' => $user->id]);

        $this->assertCount(1, $user->sentNotifications);
        $this->assertEquals($user->id, $user->sentNotifications->first()->sender_id);
    }

    /** @test */
    public function user_has_correct_role_values()
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $organisation = User::factory()->create(['role' => 'organisation']);
        $volunteer = User::factory()->create(['role' => 'volunteer']);

        $this->assertEquals('admin', $admin->role);
        $this->assertEquals('organisation', $organisation->role);
        $this->assertEquals('volunteer', $volunteer->role);
    }

    /** @test */
    public function user_is_verified_scope_works()
    {
        User::factory()->count(3)->create(['is_verified' => true]);
        User::factory()->count(2)->create(['is_verified' => false]);

        $verifiedUsers = User::verified()->get();

        $this->assertGreaterThan(0, $verifiedUsers->count());
        $verifiedUsers->each(function ($user) {
            $this->assertTrue($user->is_verified);
        });
    }

    /** @test */
    public function user_role_scope_works()
    {
        User::factory()->count(2)->create(['role' => 'admin']);
        User::factory()->count(3)->create(['role' => 'organisation']);
        User::factory()->count(4)->create(['role' => 'volunteer']);

        $this->assertCount(2, User::role('admin')->get());
        $this->assertCount(3, User::role('organisation')->get());
        $this->assertCount(4, User::role('volunteer')->get());
    }
}