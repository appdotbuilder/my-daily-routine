<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Category>
 */
class CategoryFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $colors = [
            '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6',
            '#EC4899', '#06B6D4', '#84CC16', '#F97316', '#6366F1'
        ];

        $categoryNames = [
            'Work', 'Personal', 'Health', 'Finance', 'Learning',
            'Home', 'Family', 'Fitness', 'Hobbies', 'Goals'
        ];

        return [
            'user_id' => User::factory(),
            'name' => fake()->randomElement($categoryNames),
            'color' => fake()->randomElement($colors),
            'icon' => null,
        ];
    }
}