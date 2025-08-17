<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Category;
use App\Models\Task;
use App\Models\Habit;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create test user
        $user = User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);

        // Create categories for the test user
        $categories = Category::factory()
            ->count(5)
            ->create(['user_id' => $user->id]);

        // Create tasks for the test user
        Task::factory()
            ->count(15)
            ->create([
                'user_id' => $user->id,
                'category_id' => $categories->random()->id,
            ]);

        // Create some tasks due today
        Task::factory()
            ->count(3)
            ->dueToday()
            ->create([
                'user_id' => $user->id,
                'category_id' => $categories->random()->id,
            ]);

        // Create habits for the test user
        Habit::factory()
            ->count(6)
            ->create([
                'user_id' => $user->id,
                'category_id' => $categories->random()->id,
            ]);

        // Create some habits completed today
        Habit::factory()
            ->count(2)
            ->completedToday()
            ->create([
                'user_id' => $user->id,
                'category_id' => $categories->random()->id,
            ]);
    }
}
