<?php

namespace Database\Factories;

use App\Models\Project;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Project>
 */
class ProjectFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Project::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $title = $this->faker->sentence(3, false);

        return [
            'title' => $title,
            'slug' => Str::slug($title) . '-' . $this->faker->unique()->numberBetween(1, 1000),
            'description' => $this->faker->paragraphs(3, true),
            'date' => $this->faker->dateTimeBetween('-2 years', '+6 months'),
            'is_active' => $this->faker->boolean(70), // 70% chance of being active
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }

    /**
     * Indicate that the project should be visible.
     */
    public function visible(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => true,
        ]);
    }

    /**
     * Indicate that the project should be hidden.
     */
    public function hidden(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => false,
        ]);
    }

    /**
     * Indicate that the project should be recent.
     */
    public function recent(): static
    {
        return $this->state(fn (array $attributes) => [
            'date' => $this->faker->dateTimeBetween('-30 days', 'now'),
            'created_at' => $this->faker->dateTimeBetween('-30 days', 'now'),
        ]);
    }

    /**
     * Indicate that the project should be upcoming.
     */
    public function upcoming(): static
    {
        return $this->state(fn (array $attributes) => [
            'date' => $this->faker->dateTimeBetween('now', '+6 months'),
        ]);
    }

    /**
     * Indicate that the project should have minimal content.
     */
    public function minimal(): static
    {
        return $this->state(fn (array $attributes) => [
            'description' => $this->faker->sentence(),
        ]);
    }

    /**
     * Indicate that the project should have rich content.
     */
    public function rich(): static
    {
        return $this->state(fn (array $attributes) => [
            'description' => $this->faker->paragraphs(5, true),
        ]);
    }
}
