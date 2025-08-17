import React from 'react';
import { Head, router } from '@inertiajs/react';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
    CheckCircle2, 
    Circle, 
    Calendar, 
    Target, 
    BookOpen, 
    Plus,
    Clock,
    AlertCircle,
    Flame
} from 'lucide-react';

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

interface Schedule {
    id: number;
    title: string;
    description: string | null;
    start_time: string;
    end_time: string | null;
    duration: string;
    category: {
        id: number;
        name: string;
        color: string;
    } | null;
}

interface Habit {
    id: number;
    name: string;
    description: string | null;
    target_frequency: number;
    is_completed_today: boolean;
    current_streak: number;
    category: {
        id: number;
        name: string;
        color: string;
    } | null;
}

interface DailyNote {
    id: number;
    title: string;
    content: string;
    note_date: string;
    category: {
        id: number;
        name: string;
        color: string;
    } | null;
}



interface Props {
    todayTasks: Task[];
    todaySchedules: Schedule[];
    habits: Habit[];
    todayNote: DailyNote | null;
    pendingTasksCount: number;
    completedHabitsToday: number;
    totalHabits: number;
    [key: string]: unknown;
}

export default function Dashboard({ 
    todayTasks, 
    todaySchedules, 
    habits, 
    todayNote, 
    pendingTasksCount,
    completedHabitsToday,
    totalHabits
}: Props) {
    const toggleTaskCompletion = (task: Task) => {
        router.patch(`/tasks/${task.id}`, {
            completed_at: task.is_completed ? null : new Date().toISOString()
        }, {
            preserveState: true,
            preserveScroll: true
        });
    };

    const toggleHabitCompletion = (habit: Habit) => {
        router.post(`/habits/${habit.id}/completion`, {}, {
            preserveState: true,
            preserveScroll: true
        });
    };

    const createQuickTask = () => {
        router.get('/tasks/create');
    };

    const createTodayNote = () => {
        router.post('/daily-notes', {
            title: `Today's Notes - ${new Date().toLocaleDateString()}`,
            content: '',
            note_date: new Date().toISOString().split('T')[0]
        });
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high': return 'text-red-600 bg-red-50 border-red-200';
            case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
            case 'low': return 'text-green-600 bg-green-50 border-green-200';
            default: return 'text-gray-600 bg-gray-50 border-gray-200';
        }
    };

    const formatTime = (dateString: string) => {
        return new Date(dateString).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    };

    const habitProgress = totalHabits > 0 ? (completedHabitsToday / totalHabits) * 100 : 0;

    return (
        <AppShell>
            <Head title="Dashboard - My Daily Routine" />
            
            <div className="space-y-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'}! 👋
                        </h1>
                        <p className="text-gray-600 mt-1">
                            {new Date().toLocaleDateString([], { 
                                weekday: 'long', 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric' 
                            })}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button onClick={createQuickTask} className="bg-blue-600 hover:bg-blue-700">
                            <Plus className="w-4 h-4 mr-2" />
                            Quick Task
                        </Button>
                    </div>
                </div>

                {/* Overview Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card className="border-blue-200 bg-blue-50/50">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-blue-600">Today's Tasks</CardTitle>
                            <CheckCircle2 className="h-4 w-4 text-blue-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-blue-700">
                                {todayTasks.filter(t => t.is_completed).length}/{todayTasks.length}
                            </div>
                            <p className="text-xs text-blue-600">
                                {pendingTasksCount} pending overall
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-green-200 bg-green-50/50">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-green-600">Habits Today</CardTitle>
                            <Target className="h-4 w-4 text-green-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-700">
                                {completedHabitsToday}/{totalHabits}
                            </div>
                            <div className="mt-2">
                                <Progress value={habitProgress} className="h-2" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-purple-200 bg-purple-50/50">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-purple-600">Today's Events</CardTitle>
                            <Calendar className="h-4 w-4 text-purple-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-purple-700">
                                {todaySchedules.length}
                            </div>
                            <p className="text-xs text-purple-600">
                                scheduled events
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-orange-200 bg-orange-50/50">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-orange-600">Daily Note</CardTitle>
                            <BookOpen className="h-4 w-4 text-orange-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-orange-700">
                                {todayNote ? '✅' : '➕'}
                            </div>
                            <p className="text-xs text-orange-600">
                                {todayNote ? 'Created' : 'Not started'}
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Content Grid */}
                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Today's Tasks */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="flex items-center gap-2">
                                        <CheckCircle2 className="w-5 h-5 text-blue-600" />
                                        Today's Tasks
                                    </CardTitle>
                                    <CardDescription>
                                        {todayTasks.length} tasks for today
                                    </CardDescription>
                                </div>
                                <Button variant="outline" size="sm" onClick={() => router.get('/tasks')}>
                                    View All
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {todayTasks.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                    <Circle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                                    <p>No tasks scheduled for today</p>
                                    <Button 
                                        variant="outline" 
                                        size="sm" 
                                        className="mt-3"
                                        onClick={createQuickTask}
                                    >
                                        <Plus className="w-4 h-4 mr-2" />
                                        Add Task
                                    </Button>
                                </div>
                            ) : (
                                todayTasks.slice(0, 5).map((task) => (
                                    <div 
                                        key={task.id} 
                                        className={`flex items-center space-x-3 p-3 rounded-lg border ${
                                            task.is_completed ? 'bg-green-50 border-green-200' : 
                                            task.is_overdue ? 'bg-red-50 border-red-200' : 'bg-white border-gray-200'
                                        }`}
                                    >
                                        <button 
                                            onClick={() => toggleTaskCompletion(task)}
                                            className="flex-shrink-0"
                                        >
                                            {task.is_completed ? (
                                                <CheckCircle2 className="w-5 h-5 text-green-600" />
                                            ) : (
                                                <Circle className="w-5 h-5 text-gray-400 hover:text-blue-600" />
                                            )}
                                        </button>
                                        
                                        <div className="flex-1 min-w-0">
                                            <p className={`font-medium ${task.is_completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                                                {task.title}
                                            </p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <Badge className={`text-xs ${getPriorityColor(task.priority)}`}>
                                                    {task.priority}
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
                                                {task.is_overdue && (
                                                    <AlertCircle className="w-4 h-4 text-red-500" />
                                                )}
                                            </div>
                                        </div>
                                        
                                        {task.due_date && (
                                            <div className="text-sm text-gray-500">
                                                <Clock className="w-4 h-4 inline mr-1" />
                                                {formatTime(task.due_date)}
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}
                        </CardContent>
                    </Card>

                    {/* Today's Schedule */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="flex items-center gap-2">
                                        <Calendar className="w-5 h-5 text-purple-600" />
                                        Today's Schedule
                                    </CardTitle>
                                    <CardDescription>
                                        {todaySchedules.length} events scheduled
                                    </CardDescription>
                                </div>
                                <Button variant="outline" size="sm" onClick={() => router.get('/schedules')}>
                                    View All
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {todaySchedules.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                    <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                                    <p>No events scheduled for today</p>
                                    <Button 
                                        variant="outline" 
                                        size="sm" 
                                        className="mt-3"
                                        onClick={() => router.get('/schedules/create')}
                                    >
                                        <Plus className="w-4 h-4 mr-2" />
                                        Add Event
                                    </Button>
                                </div>
                            ) : (
                                todaySchedules.slice(0, 5).map((schedule) => (
                                    <div key={schedule.id} className="flex items-center space-x-3 p-3 rounded-lg bg-purple-50 border border-purple-200">
                                        <div className="w-2 h-12 rounded-full bg-purple-500 flex-shrink-0"></div>
                                        
                                        <div className="flex-1">
                                            <p className="font-medium text-gray-900">{schedule.title}</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-sm text-gray-600">
                                                    {formatTime(schedule.start_time)}
                                                    {schedule.end_time && ` - ${formatTime(schedule.end_time)}`}
                                                </span>
                                                <Badge variant="outline" className="text-xs">
                                                    {schedule.duration}
                                                </Badge>
                                                {schedule.category && (
                                                    <Badge 
                                                        variant="outline" 
                                                        className="text-xs"
                                                        style={{ borderColor: schedule.category.color, color: schedule.category.color }}
                                                    >
                                                        {schedule.category.name}
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </CardContent>
                    </Card>

                    {/* Habit Tracker */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="flex items-center gap-2">
                                        <Target className="w-5 h-5 text-green-600" />
                                        Habit Tracker
                                    </CardTitle>
                                    <CardDescription>
                                        Daily habits progress
                                    </CardDescription>
                                </div>
                                <Button variant="outline" size="sm" onClick={() => router.get('/habits')}>
                                    View All
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {habits.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                    <Target className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                                    <p>No habits tracked yet</p>
                                    <Button 
                                        variant="outline" 
                                        size="sm" 
                                        className="mt-3"
                                        onClick={() => router.get('/habits')}
                                    >
                                        <Plus className="w-4 h-4 mr-2" />
                                        Add Habit
                                    </Button>
                                </div>
                            ) : (
                                habits.slice(0, 5).map((habit) => (
                                    <div 
                                        key={habit.id} 
                                        className={`flex items-center justify-between p-3 rounded-lg border ${
                                            habit.is_completed_today ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'
                                        }`}
                                    >
                                        <div className="flex items-center space-x-3">
                                            <button 
                                                onClick={() => toggleHabitCompletion(habit)}
                                                className="flex-shrink-0"
                                            >
                                                {habit.is_completed_today ? (
                                                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                                                ) : (
                                                    <Circle className="w-5 h-5 text-gray-400 hover:text-green-600" />
                                                )}
                                            </button>
                                            
                                            <div>
                                                <p className={`font-medium ${habit.is_completed_today ? 'text-green-700' : 'text-gray-900'}`}>
                                                    {habit.name}
                                                </p>
                                                <div className="flex items-center gap-2">
                                                    {habit.category && (
                                                        <Badge 
                                                            variant="outline" 
                                                            className="text-xs"
                                                            style={{ borderColor: habit.category.color, color: habit.category.color }}
                                                        >
                                                            {habit.category.name}
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {habit.current_streak > 0 && (
                                            <div className="flex items-center gap-1 text-sm text-orange-600">
                                                <Flame className="w-4 h-4" />
                                                <span className="font-medium">{habit.current_streak}</span>
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}
                        </CardContent>
                    </Card>

                    {/* Daily Notes */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="flex items-center gap-2">
                                        <BookOpen className="w-5 h-5 text-orange-600" />
                                        Today's Note
                                    </CardTitle>
                                    <CardDescription>
                                        Daily reflection & notes
                                    </CardDescription>
                                </div>
                                <Button variant="outline" size="sm" onClick={() => router.get('/daily-notes')}>
                                    View All
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {todayNote ? (
                                <div className="p-4 rounded-lg bg-orange-50 border border-orange-200">
                                    <h4 className="font-medium text-orange-800 mb-2">{todayNote.title}</h4>
                                    <p className="text-sm text-orange-700 line-clamp-3">{todayNote.content}</p>
                                    <Button 
                                        variant="outline" 
                                        size="sm" 
                                        className="mt-3"
                                        onClick={() => router.get(`/daily-notes/${todayNote.id}/edit`)}
                                    >
                                        Edit Note
                                    </Button>
                                </div>
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    <BookOpen className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                                    <p>No note created for today</p>
                                    <Button 
                                        variant="outline" 
                                        size="sm" 
                                        className="mt-3"
                                        onClick={createTodayNote}
                                    >
                                        <Plus className="w-4 h-4 mr-2" />
                                        Start Today's Note
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppShell>
    );
}