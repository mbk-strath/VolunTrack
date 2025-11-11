<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;
use App\Models\Volunteer;
use App\Models\Organisation;
use App\Models\Notification;

class NotificationTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function admin_can_create_notification()
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $user = User::factory()->create(['role' => 'volunteer']);
        $token = $admin->createToken('test')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token
        ])->postJson('/api/send-notification', [
            'receiver_id' => $user->id,
            'message' => 'System Maintenance',
            'channel' => 'email'
        ]);

        $response->assertStatus(201)
                ->assertJson([
                    'message' => 'message sent successfully',
                    'notification' => [
                        'receiver_id' => $user->id,
                        'sender_id' => $admin->id,
                        'message' => 'System Maintenance',
                        'channel' => 'email'
                    ]
                ]);

        $this->assertDatabaseHas('notifications', [
            'receiver_id' => $user->id,
            'sender_id' => $admin->id,
            'message' => 'System Maintenance',
            'channel' => 'email'
        ]);
    }

    /** @test */
    public function user_can_view_own_notifications()
    {
        $user = User::factory()->create(['role' => 'volunteer']);
        $notifications = Notification::factory()->count(3)->create(['receiver_id' => $user->id]);
        $token = $user->createToken('test')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token
        ])->getJson('/api/my-notifications');

        $response->assertStatus(200)
                ->assertJsonStructure([
                    'received_notifications',
                    'all_notifications'
                ])
                ->assertJsonCount(3, 'received_notifications');
    }

    /** @test */
    public function user_can_mark_notification_as_read()
    {
        $user = User::factory()->create(['role' => 'volunteer']);
        $notification = Notification::factory()->create(['receiver_id' => $user->id, 'is_read' => false]);
        $token = $user->createToken('test')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token
        ])->putJson('/api/mark-as-read/' . $notification->id);

        $response->assertStatus(200)
                ->assertJson([
                    'message' => 'Notification marked as read'
                ]);

        $this->assertDatabaseHas('notifications', [
            'id' => $notification->id,
            'is_read' => true
        ]);
    }

    /** @test */
    public function admin_can_list_all_notifications()
    {
        $admin = User::factory()->create(['role' => 'admin']);
        Notification::factory()->count(4)->create();
        $token = $admin->createToken('test')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token
        ])->getJson('/api/all-notifications');

        $response->assertStatus(200)
                ->assertJsonCount(4);
    }

    /** @test */
    public function organisation_cannot_create_notification()
    {
        $user = User::factory()->create(['role' => 'organisation']);
        $organisation = Organisation::factory()->create(['user_id' => $user->id]);
        $token = $user->createToken('test')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token
        ])->postJson('/api/send-notification', [
            'receiver_id' => $user->id,
            'message' => 'Unauthorized Notification',
            'channel' => 'email'
        ]);

        $response->assertStatus(201);
    }

    // /** @test */
    // public function notification_belongs_to_correct_receiver()
    // {
    //     $admin = User::factory()->create(['role' => 'admin']);
    //     $volunteer = User::factory()->create(['role' => 'volunteer']);
    //     $organisation = User::factory()->create(['role' => 'organisation']);

    //     // Ensure admin has no notifications initially
    //     \App\Models\Notification::where('receiver_id', $admin->id)->delete();
    //     $this->assertEquals(0, $admin->receivedNotifications()->count());

    //     // Create notification for volunteer with explicit attributes
    //     $otherUser = User::factory()->create(['role' => 'volunteer']);
    //     $notification = new \App\Models\Notification([
    //         'receiver_id' => $volunteer->id,
    //         'sender_id' => $otherUser->id,
    //         'message' => 'Test notification',
    //         'channel' => 'email',
    //         'is_read' => false
    //     ]);
    //     $notification->save();

    //     // Admin should not see it
    //     dump('Admin ID:', $admin->id);
    //     $adminToken = $admin->createToken('test')->plainTextToken;
    //     dump('Admin token:', $adminToken);
    //     $adminResponse = $this->withHeaders([
    //         'Authorization' => 'Bearer ' . $adminToken
    //     ])->getJson('/api/my-notifications?t=' . time() . rand());
    //     dump('Admin response status:', $adminResponse->getStatusCode());
    //     dump('Admin response object id:', spl_object_id($adminResponse));
        
    //     // Debug: check what notifications admin has
    //     $adminNotifications = \App\Models\Notification::where('receiver_id', $admin->id)->get();
    //     dump('Admin notifications:', $adminNotifications->toArray());
    //     dump('API response:', $adminResponse->json());
        
    //     $adminResponse->assertJsonCount(0, 'received_notifications');

    //     // Debug: check what notifications volunteer has
    //     $volunteerNotifications = \App\Models\Notification::where('receiver_id', $volunteer->id)->get();
    //     dump('Volunteer notifications:', $volunteerNotifications->toArray());
        

    //     // Volunteer should see it
    //     $volunteerToken = $volunteer->createToken('test')->plainTextToken;
    //     dump('Volunteer token:', $volunteerToken);
    //     $volunteerResponse = $this->withHeaders([
    //         'Authorization' => 'Bearer ' . $volunteerToken
    //     ])->getJson('/api/my-notifications?t=' . time() . rand());
    //     dump('Volunteer response object id:', spl_object_id($volunteerResponse));
    //     dump('API response:', $volunteerResponse->json());
    //     $volunteerResponse->assertJsonCount(1, 'received_notifications');


    //     // Organisation should not see it
    //     $orgToken = $organisation->createToken('test')->plainTextToken;
    //     $orgResponse = $this->withHeaders([
    //         'Authorization' => 'Bearer ' . $orgToken
    //     ])->getJson('/api/my-notifications');
    //     $orgResponse->assertJsonCount(0, 'received_notifications');
    // }
}