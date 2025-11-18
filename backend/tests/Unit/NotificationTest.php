<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Models\Notification;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

class NotificationTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function notification_can_be_created()
    {
        $sender = User::factory()->create();
        $receiver = User::factory()->create();
        $notification = Notification::factory()->create([
            'sender_id' => $sender->id,
            'receiver_id' => $receiver->id,
            'message' => 'This is a test notification',
        ]);

        $this->assertInstanceOf(Notification::class, $notification);
        $this->assertEquals('This is a test notification', $notification->message);
    }

    /** @test */
    public function notification_belongs_to_receiver()
    {
        $receiver = User::factory()->create();
        $sender = User::factory()->create();
        $notification = Notification::factory()->create([
            'sender_id' => $sender->id,
            'receiver_id' => $receiver->id,
        ]);

        $this->assertNotNull($notification->receiver_id);
    }

    /** @test */
    public function notification_can_be_marked_as_read()
    {
        $sender = User::factory()->create();
        $receiver = User::factory()->create();
        $notification = Notification::factory()->create([
            'sender_id' => $sender->id,
            'receiver_id' => $receiver->id,
            'is_read' => false,
        ]);

        $this->assertFalse($notification->is_read);
    }
}
