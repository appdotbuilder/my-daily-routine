<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Habit;
use Illuminate\Http\Request;

class HabitCompletionController extends Controller
{
    /**
     * Toggle habit completion for today.
     */
    public function store(Request $request, Habit $habit)
    {
        // Ensure user can only update their own habits
        if ($habit->user_id !== $request->user()->id) {
            abort(404);
        }
        
        if ($habit->is_completed_today) {
            $habit->markAsNotCompleted();
            $message = 'Habit marked as not completed for today.';
        } else {
            $habit->markAsCompleted();
            $message = 'Great job! Habit completed for today.';
        }

        return back()->with('success', $message);
    }
}