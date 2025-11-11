<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Application;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Application>
 */
class ApplicationFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Application::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'volunteer_id' => \App\Models\Volunteer::factory(),
            'opportunity_id' => \App\Models\Opportunity::factory(),
            'status' => $this->faker->randomElement(['pending', 'approved', 'rejected']),
            'application_date' => $this->faker->dateTimeBetween('-30 days', 'now'),
        ];
    }
}