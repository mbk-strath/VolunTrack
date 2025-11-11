<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Volunteer;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Volunteer>
 */
class VolunteerFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Volunteer::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => \App\Models\User::factory(),
            'country' => $this->faker->country(),
            'bio' => $this->faker->paragraph(),
            'skills' => json_encode($this->faker->randomElements(['communication', 'leadership', 'technical', 'organizational'], $this->faker->numberBetween(1, 4), false)),
            'location' => $this->faker->city(),
            'profile_image' => null,
            'is_active' => true,
        ];
    }
}