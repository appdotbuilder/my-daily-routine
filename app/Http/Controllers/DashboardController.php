<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Task;
use App\Models\Schedule;
use App\Models\Habit;
use App\Models\DailyNote;
use App\Models\Category;
use Inertia\Inertia;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    /**
     * Display the dashboard with today's overview.
     */
    public function index(Request $request)
    {
        $user = $request->user();
        
        // Get today's data
        $todayTasks = Task::where('user_id', $user->id)
            ->whereDate('due_date', today())
            ->with('category')
            ->orderBy('priority', 'desc')
            ->orderBy('created_at')
            ->get();

        $todaySchedules = Schedule::where('user_id', $user->id)
            ->whereDate('start_time', today())
            ->with('category')
            ->orderBy('start_time')
            ->get();

        $habits = Habit::where('user_id', $user->id)
            ->with('category')
            ->get();

        $todayNote = DailyNote::where('user_id', $user->id)
            ->whereDate('note_date', today())
            ->with('category')
            ->first();

        $categories = Category::where('user_id', $user->id)->get();

        // Get pending tasks count
        $pendingTasksCount = Task::where('user_id', $user->id)
            ->pending()
            ->count();

        // Get completed habits count for today
        $completedHabitsToday = $habits->filter(fn($habit) => $habit->is_completed_today)->count();

        return Inertia::render('dashboard', [
            'todayTasks' => $todayTasks,
            'todaySchedules' => $todaySchedules,
            'habits' => $habits,
            'todayNote' => $todayNote,
            'categories' => $categories,
            'pendingTasksCount' => $pendingTasksCount,
            'completedHabitsToday' => $completedHabitsToday,
            'totalHabits' => $habits->count(),
        ]);
    }
}