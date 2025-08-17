<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\HabitController;
use App\Http\Controllers\HabitCompletionController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/health-check', function () {
    return response()->json([
        'status' => 'ok',
        'timestamp' => now()->toISOString(),
    ]);
})->name('health-check');

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    // Dashboard
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
    
    // Tasks
    Route::resource('tasks', TaskController::class);
    
    // Habits
    Route::resource('habits', HabitController::class)->only(['index', 'store', 'update', 'destroy']);
    Route::post('habits/{habit}/completion', [HabitCompletionController::class, 'store'])->name('habits.completion');
    
    // Placeholder routes for schedules and notes (to be implemented)
    Route::get('schedules', function () {
        return Inertia::render('coming-soon', ['feature' => 'Schedules']);
    })->name('schedules.index');
    
    Route::get('schedules/create', function () {
        return Inertia::render('coming-soon', ['feature' => 'Schedule Creation']);
    })->name('schedules.create');
    
    Route::get('daily-notes', function () {
        return Inertia::render('coming-soon', ['feature' => 'Daily Notes']);
    })->name('daily-notes.index');
    
    Route::post('daily-notes', function () {
        return redirect()->back()->with('info', 'Daily Notes feature coming soon!');
    })->name('daily-notes.store');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
