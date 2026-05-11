<?php

namespace Database\Factories;

use App\Models\Site;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Site>
 */
class SiteFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->company(),
            'code' => fake()->unique()->regexify('[A-Z]{3}[0-9]{2}'),
            'type' => fake()->randomElement(['ferme_avicole', 'ferme_porcine', 'usine_transformation', 'entrepot', 'bureau']),
            'address' => fake()->address(),
            'is_active' => true,
        ];
    }
}
