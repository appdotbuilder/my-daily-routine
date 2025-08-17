<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTaskRequest;
use App\Http\Requests\UpdateTaskRequest;
use App\Models\Task;
use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TaskController extends Controller
{
    /**
     * Display a listing of the tasks.
     */
    public function index(Request $request)
    {
        $user = $request->user();
        
        $tasks = Task::where('user_id', $user->id)
            ->with('category')
            ->orderBy('completed_at', 'asc')
            ->orderBy('due_date', 'asc')
            ->orderBy('priority', 'desc')
            ->paginate(10);

        $categories = Category::where('user_id', $user->id)->get();

        return Inertia::render('tasks/index', [
            'tasks' => $tasks,
            'categories' => $categories,
        ]);
    }

    /**
     * Show the form for creating a new task.
     */
    public function create(Request $request)
    {
        $categories = Category::where('user_id', $request->user()->id)->get();

        return Inertia::render('tasks/create', [
            'categories' => $categories,
        ]);
    }

    /**
     * Store a newly created task in storage.
     */
    public function store(StoreTaskRequest $request)
    {
        $task = Task::create([
            ...$request->validated(),
            'user_id' => $request->user()->id,
        ]);

        return redirect()->route('tasks.index')
            ->with('success', 'Task created successfully.');
    }

    /**
     * Display the specified task.
     */
    public function show(Request $request, Task $task)
    {
        // Ensure user can only view their own tasks
        if ($task->user_id !== $request->user()->id) {
            abort(404);
        }
        
        $task->load('category');

        return Inertia::render('tasks/show', [
            'task' => $task,
        ]);
    }

    /**
     * Show the form for editing the specified task.
     */
    public function edit(Request $request, Task $task)
    {
        // Ensure user can only edit their own tasks
        if ($task->user_id !== $request->user()->id) {
            abort(404);
        }
        
        $categories = Category::where('user_id', $request->user()->id)->get();

        return Inertia::render('tasks/edit', [
            'task' => $task,
            'categories' => $categories,
        ]);
    }

    /**
     * Update the specified task in storage.
     */
    public function update(UpdateTaskRequest $request, Task $task)
    {
        // Ensure user can only update their own tasks
        if ($task->user_id !== $request->user()->id) {
            abort(404);
        }
        
        $task->update($request->validated());

        return redirect()->route('tasks.show', $task)
            ->with('success', 'Task updated successfully.');
    }

    /**
     * Remove the specified task from storage.
     */
    public function destroy(Request $request, Task $task)
    {
        // Ensure user can only delete their own tasks
        if ($task->user_id !== $request->user()->id) {
            abort(404);
        }
        
        $task->delete();

        return redirect()->route('tasks.index')
            ->with('success', 'Task deleted successfully.');
    }
}