import React from 'react';
import { Head, router } from '@inertiajs/react';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
    CheckCircle2, 
    Circle, 
    Plus,
    AlertCircle,
    Clock,
    MoreHorizontal,
    Edit,
    Trash2
} from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Task {
    id: number;
    title: string;
    description: string | null;
    priority: 'low' | 'medium' | 'high';
    due_date: string | null;
    completed_at: string | null;
    is_completed: boolean;
    is_overdue: boolean;
    category: {
        id: number;
        name: string;
        color: string;
    } | null;
}



interface Props {
    tasks: {
        data: Task[];
        links: unknown[];
        meta: unknown;
    };
    [key: string]: unknown;
}

export default function TasksIndex({ tasks }: Props) {
    const toggleTaskCompletion = (task: Task) => {
        router.patch(`/tasks/${task.id}`, {
            completed_at: task.is_completed ? null : new Date().toISOString()
        }, {
            preserveState: true,
            preserveScroll: true
        });
    };

    const deleteTask = (task: Task) => {
        if (confirm('Are you sure you want to delete this task?')) {
            router.delete(`/tasks/${task.id}`, {
                preserveState: true,
                preserveScroll: true
            });
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high': return 'text-red-600 bg-red-50 border-red-200';
            case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
            case 'low': return 'text-green-600 bg-green-50 border-green-200';
            default: return 'text-gray-600 bg-gray-50 border-gray-200';
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
        
        if (date.toDateString() === today.toDateString()) {
            return 'Today';
        } else if (date.toDateString() === tomorrow.toDateString()) {
            return 'Tomorrow';
        } else {
            return date.toLocaleDateString();
        }
    };

    const pendingTasks = tasks.data.filter(task => !task.is_completed);
    const completedTasks = tasks.data.filter(task => task.is_completed);

    return (
        <AppShell>
            <Head title="Tasks - My Daily Routine" />
            
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                            <CheckCircle2 className="w-8 h-8 text-blue-600" />
                            Tasks
                        </h1>
                        <p className="text-gray-600 mt-1">
                            Manage your daily tasks and stay organized
                        </p>
                    </div>
                    <Button onClick={() => router.get('/tasks/create')} className="bg-blue-600 hover:bg-blue-700">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Task
                    </Button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="border-blue-200 bg-blue-50/50">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <Circle className="w-8 h-8 text-blue-600" />
                                <div>
                                    <p className="text-2xl font-bold text-blue-700">{pendingTasks.length}</p>
                                    <p className="text-sm text-blue-600">Pending Tasks</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    
                    <Card className="border-green-200 bg-green-50/50">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <CheckCircle2 className="w-8 h-8 text-green-600" />
                                <div>
                                    <p className="text-2xl font-bold text-green-700">{completedTasks.length}</p>
                                    <p className="text-sm text-green-600">Completed Tasks</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    
                    <Card className="border-red-200 bg-red-50/50">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <AlertCircle className="w-8 h-8 text-red-600" />
                                <div>
                                    <p className="text-2xl font-bold text-red-700">
                                        {pendingTasks.filter(t => t.is_overdue).length}
                                    </p>
                                    <p className="text-sm text-red-600">Overdue Tasks</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Pending Tasks */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Circle className="w-5 h-5 text-blue-600" />
                            Pending Tasks ({pendingTasks.length})
                        </CardTitle>
                        <CardDescription>
                            Tasks that need to be completed
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {pendingTasks.length === 0 ? (
                            <div className="text-center py-12 text-gray-500">
                                <CheckCircle2 className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                                <h3 className="text-lg font-medium mb-2">All caught up! 🎉</h3>
                                <p className="mb-4">You have no pending tasks.</p>
                                <Button onClick={() => router.get('/tasks/create')}>
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add New Task
                                </Button>
                            </div>
                        ) : (
                            pendingTasks.map((task) => (
                                <div 
                                    key={task.id} 
                                    className={`flex items-center space-x-3 p-4 rounded-lg border ${
                                        task.is_overdue ? 'bg-red-50 border-red-200' : 'bg-white border-gray-200'
                                    } hover:shadow-md transition-shadow`}
                                >
                                    <button 
                                        onClick={() => toggleTaskCompletion(task)}
                                        className="flex-shrink-0"
                                    >
                                        <Circle className="w-6 h-6 text-gray-400 hover:text-blue-600" />
                                    </button>
                                    
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <h3 className="font-medium text-gray-900 mb-1">
                                                    {task.title}
                                                </h3>
                                                {task.description && (
                                                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                                                        {task.description}
                                                    </p>
                                                )}
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <Badge className={`text-xs ${getPriorityColor(task.priority)}`}>
                                                        {task.priority} priority
                                                    </Badge>
                                                    {task.category && (
                                                        <Badge 
                                                            variant="outline" 
                                                            className="text-xs"
                                                            style={{ borderColor: task.category.color, color: task.category.color }}
                                                        >
                                                            {task.category.name}
                                                        </Badge>
                                                    )}
                                                    {task.due_date && (
                                                        <Badge variant="outline" className="text-xs">
                                                            <Clock className="w-3 h-3 mr-1" />
                                                            Due {formatDate(task.due_date)}
                                                        </Badge>
                                                    )}
                                                    {task.is_overdue && (
                                                        <Badge className="text-xs bg-red-100 text-red-700 border-red-300">
                                                            <AlertCircle className="w-3 h-3 mr-1" />
                                                            Overdue
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>
                                            
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="sm">
                                                        <MoreHorizontal className="w-4 h-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={() => router.get(`/tasks/${task.id}/edit`)}>
                                                        <Edit className="w-4 h-4 mr-2" />
                                                        Edit
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem 
                                                        onClick={() => deleteTask(task)}
                                                        className="text-red-600"
                                                    >
                                                        <Trash2 className="w-4 h-4 mr-2" />
                                                        Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </CardContent>
                </Card>

                {/* Completed Tasks */}
                {completedTasks.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <CheckCircle2 className="w-5 h-5 text-green-600" />
                                Completed Tasks ({completedTasks.length})
                            </CardTitle>
                            <CardDescription>
                                Well done! These tasks are complete.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {completedTasks.slice(0, 5).map((task) => (
                                <div 
                                    key={task.id} 
                                    className="flex items-center space-x-3 p-4 rounded-lg bg-green-50 border border-green-200 opacity-75"
                                >
                                    <button 
                                        onClick={() => toggleTaskCompletion(task)}
                                        className="flex-shrink-0"
                                    >
                                        <CheckCircle2 className="w-6 h-6 text-green-600" />
                                    </button>
                                    
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-medium text-green-800 line-through">
                                            {task.title}
                                        </h3>
                                        <div className="flex items-center gap-2 mt-1">
                                            <Badge className="text-xs bg-green-100 text-green-700 border-green-300">
                                                Completed
                                            </Badge>
                                            {task.category && (
                                                <Badge 
                                                    variant="outline" 
                                                    className="text-xs"
                                                    style={{ borderColor: task.category.color, color: task.category.color }}
                                                >
                                                    {task.category.name}
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                    
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="sm">
                                                <MoreHorizontal className="w-4 h-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem 
                                                onClick={() => deleteTask(task)}
                                                className="text-red-600"
                                            >
                                                <Trash2 className="w-4 h-4 mr-2" />
                                                Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            ))}
                            
                            {completedTasks.length > 5 && (
                                <div className="text-center pt-4">
                                    <p className="text-sm text-gray-600">
                                        And {completedTasks.length - 5} more completed tasks...
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppShell>
    );
}