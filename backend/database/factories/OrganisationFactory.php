<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Organisation;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Organisation>
 */
class OrganisationFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Organisation::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => \App\Models\User::factory(),
            'org_name' => $this->faker->company(),
            'org_type' => $this->faker->randomElement(['NGO', 'Non-profit', 'Charity', 'Foundation']),
            'reg_no' => $this->faker->unique()->numerify('REG#####'),
            'website' => $this->faker->url(),
            'logo' => null,
            'country' => $this->faker->country(),
            'city' => $this->faker->city(),
            'focus_area' => $this->faker->randomElement(['education', 'environment', 'healthcare', 'community', 'animal_welfare']),
            'is_active' => true,
        ];
    }
}