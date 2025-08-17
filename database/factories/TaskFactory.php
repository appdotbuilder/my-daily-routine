<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\Category;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Task>
 */
class TaskFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $taskTitles = [
            'Review project proposal',
            'Call client about meeting',
            'Update website content',
            'Prepare presentation slides',
            'Send weekly report',
            'Schedule dentist appointment',
            'Buy groceries',
            'Pay utility bills',
            'Exercise for 30 minutes',
            'Read chapter 5',
            'Plan weekend trip',
            'Organize desk workspace',
            'Reply to important emails',
            'Backup computer files',
            'Research new tools'
        ];

        $priorities = ['low', 'medium', 'high'];
        $dueDate = fake()->optional(0.7)->dateTimeBetween('now', '+2 weeks');
        $completed = fake()->boolean(30); // 30% chance of being completed

        return [
            'user_id' => User::factory(),
            'category_id' => fake()->optional(0.6)->randomElement(Category::pluck('id')->toArray()),
            'title' => fake()->randomElement($taskTitles),
            'description' => fake()->optional(0.6)->sentence(12),
            'priority' => fake()->randomElement($priorities),
            'due_date' => $dueDate,
            'reminder_at' => fake()->optional(0.4)->dateTimeBetween('now', '+1 day'),
            'completed_at' => $completed ? fake()->dateTimeBetween('-1 week', 'now') : null,
        ];
    }

    /**
     * Indicate that the task should be completed.
     */
    public function completed(): static
    {
        return $this->state(fn (array $attributes) => [
            'completed_at' => fake()->dateTimeBetween('-1 week', 'now'),
        ]);
    }

    /**
     * Indicate that the task should be pending.
     */
    public function pending(): static
    {
        return $this->state(fn (array $attributes) => [
            'completed_at' => null,
        ]);
    }

    /**
     * Indicate that the task should be due today.
     */
    public function dueToday(): static
    {
        return $this->state(fn (array $attributes) => [
            'due_date' => now()->addHours(fake()->numberBetween(1, 23)),
            'completed_at' => null,
        ]);
    }
}