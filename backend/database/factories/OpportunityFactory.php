<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Opportunity;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Opportunity>
 */
class OpportunityFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Opportunity::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $startDate = $this->faker->dateTimeBetween('now', '+30 days');
        $endDate = $this->faker->dateTimeBetween($startDate, $startDate->format('Y-m-d H:i:s') . ' +8 hours');
        $deadline = $this->faker->dateTimeBetween('now', $startDate);

        return [
            'organisation_id' => \App\Models\Organisation::factory(),
            'title' => $this->faker->sentence(6),
            'description' => $this->faker->paragraphs(2, true),
            'required_skills' => json_encode($this->faker->randomElements(['communication', 'leadership', 'technical', 'organizational'], $this->faker->numberBetween(1, 3), false)),
            'num_volunteers_needed' => $this->faker->numberBetween(5, 50),
            'start_date' => $startDate->format('Y-m-d'),
            'end_date' => $endDate->format('Y-m-d'),
            'schedule' => $this->faker->randomElement(['full-time', 'part-time', 'weekends', 'flexible']),
            'benefits' => $this->faker->optional(0.7)->sentence(),
            'application_deadline' => $deadline->format('Y-m-d'),
            'location' => $this->faker->address(),
        ];
    }
}