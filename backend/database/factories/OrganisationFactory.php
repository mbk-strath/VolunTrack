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
            'registration_number' => $this->faker->unique()->numerify('REG#####'),
            'email' => $this->faker->companyEmail(),
            'phone' => $this->faker->phoneNumber(),
            'website' => $this->faker->url(),
            'logo' => null,
            'country' => $this->faker->country(),
            'city' => $this->faker->city(),
            'street_address' => $this->faker->streetAddress(),
            'operating_region' => $this->faker->state(),
            'mission_statement' => $this->faker->sentence(10),
            'focus_area' => $this->faker->randomElement(['education', 'environment', 'healthcare', 'community', 'animal_welfare']),
            'target_beneficiary' => $this->faker->randomElement(['children', 'elderly', 'disabled', 'refugees', 'general_public']),
            'is_active' => true,
        ];
    }
}