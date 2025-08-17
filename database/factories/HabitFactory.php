<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\Category;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Habit>
 */
class HabitFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $habitNames = [
            'Drink 8 glasses of water',
            'Exercise for 30 minutes',
            'Read for 20 minutes',
            'Meditate for 10 minutes',
            'Write in journal',
            'Take vitamins',
            'Go for a walk',
            'Practice gratitude',
            'Stretch for 15 minutes',
            'Learn something new',
            'Listen to a podcast',
            'Call a friend or family member',
            'Tidy up living space',
            'Eat a healthy breakfast',
            'Get 8 hours of sleep'
        ];

        // Generate some completion dates for the past few days
        $completionDates = [];
        $streak = fake()->numberBetween(0, 7);
        
        for ($i = 0; $i < $streak; $i++) {
            $completionDates[] = now()->subDays($i)->format('Y-m-d');
        }

        return [
            'user_id' => User::factory(),
            'category_id' => fake()->optional(0.6)->randomElement(Category::pluck('id')->toArray()),
            'name' => fake()->randomElement($habitNames),
            'description' => fake()->optional(0.5)->sentence(8),
            'target_frequency' => fake()->numberBetween(1, 3),
            'completion_dates' => array_reverse($completionDates), // Most recent first
        ];
    }

    /**
     * Indicate that the habit should be completed today.
     */
    public function completedToday(): static
    {
        return $this->state(function (array $attributes) {
            $dates = $attributes['completion_dates'] ?? [];
            $today = now()->format('Y-m-d');
            
            if (!in_array($today, $dates)) {
                $dates[] = $today;
            }
            
            return ['completion_dates' => $dates];
        });
    }
}