<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Evidence;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Evidence>
 */
class EvidenceFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Evidence::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'org_id' => \App\Models\Organisation::factory(),
            'volunteer_id' => \App\Models\Volunteer::factory(),
            'rating' => $this->faker->numberBetween(1, 5),
            'comment' => $this->faker->optional(0.7)->sentence(),
        ];
    }
}