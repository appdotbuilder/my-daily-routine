<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Habit;
use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HabitController extends Controller
{
    /**
     * Display a listing of the habits.
     */
    public function index(Request $request)
    {
        $user = $request->user();
        
        $habits = Habit::where('user_id', $user->id)
            ->with('category')
            ->orderBy('name')
            ->get();

        $categories = Category::where('user_id', $user->id)->get();

        return Inertia::render('habits/index', [
            'habits' => $habits,
            'categories' => $categories,
        ]);
    }

    /**
     * Store a newly created habit in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'category_id' => 'nullable|exists:categories,id',
            'target_frequency' => 'required|integer|min:1|max:10',
        ]);

        $habit = Habit::create([
            ...$validated,
            'user_id' => $request->user()->id,
            'completion_dates' => [],
        ]);

        return redirect()->route('habits.index')
            ->with('success', 'Habit created successfully.');
    }

    /**
     * Update the specified habit in storage.
     */
    public function update(Request $request, Habit $habit)
    {
        // Ensure user can only update their own habits
        if ($habit->user_id !== $request->user()->id) {
            abort(404);
        }
        
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'category_id' => 'nullable|exists:categories,id',
            'target_frequency' => 'required|integer|min:1|max:10',
        ]);

        $habit->update($validated);

        return redirect()->route('habits.index')
            ->with('success', 'Habit updated successfully.');
    }

    /**
     * Remove the specified habit from storage.
     */
    public function destroy(Request $request, Habit $habit)
    {
        // Ensure user can only delete their own habits
        if ($habit->user_id !== $request->user()->id) {
            abort(404);
        }
        
        $habit->delete();

        return redirect()->route('habits.index')
            ->with('success', 'Habit deleted successfully.');
    }
}