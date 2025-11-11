<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Notification;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Notification>
 */
class NotificationFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Notification::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'receiver_id' => \App\Models\User::factory(),
            'sender_id' => \App\Models\User::factory(),
            'message' => $this->faker->sentence(),
            'sent_at' => now(),
            'is_read' => $this->faker->boolean(30), // 30% chance of being read
            'read_at' => $this->faker->optional(0.3)->dateTime(), // 30% chance of having read_at
            'channel' => $this->faker->randomElement(['email', 'sms', 'push', 'in_app']),
        ];
    }
}