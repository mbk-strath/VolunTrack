<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Participation;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Participation>
 */
class ParticipationFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Participation::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $checkIn = $this->faker->dateTimeBetween('-30 days', '-1 day');
        $hours = $this->faker->numberBetween(2, 8);
        $checkOut = (clone $checkIn)->modify("+{$hours} hours");

        return [
            'volunteer_id' => \App\Models\Volunteer::factory(),
            'opportunity_id' => \App\Models\Opportunity::factory(),
            'check_in' => $checkIn,
            'check_out' => $checkOut,
            'total_hours' => $hours,
        ];
    }
}