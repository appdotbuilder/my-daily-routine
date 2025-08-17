import React, { useState } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { 
    Target, 
    CheckCircle2, 
    Circle, 
    Plus,
    Flame,
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

interface Category {
    id: number;
    name: string;
    color: string;
    icon: string | null;
}

interface Props {
    habits: Habit[];
    categories: Category[];
    [key: string]: unknown;
}



export default function HabitsIndex({ habits, categories }: Props) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingHabit, setEditingHabit] = useState<Habit | null>(null);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: '',
        description: '',
        category_id: '',
        target_frequency: '1',
    });

    const toggleHabitCompletion = (habit: Habit) => {
        router.post(`/habits/${habit.id}/completion`, {}, {
            preserveState: true,
            preserveScroll: true
        });
    };

    const deleteHabit = (habit: Habit) => {
        if (confirm('Are you sure you want to delete this habit? This will remove all your progress.')) {
            router.delete(`/habits/${habit.id}`, {
                preserveState: true,
                preserveScroll: true
            });
        }
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        if (editingHabit) {
            put(`/habits/${editingHabit.id}`, {
                onSuccess: () => {
                    setIsDialogOpen(false);
                    setEditingHabit(null);
                    reset();
                }
            });
        } else {
            post('/habits', {
                onSuccess: () => {
                    setIsDialogOpen(false);
                    reset();
                }
            });
        }
    };

    const openEditDialog = (habit: Habit) => {
        setEditingHabit(habit);
        setData({
            name: habit.name,
            description: habit.description || '',
            category_id: habit.category?.id.toString() || '',
            target_frequency: habit.target_frequency.toString(),
        });
        setIsDialogOpen(true);
    };

    const openCreateDialog = () => {
        setEditingHabit(null);
        reset();
        setIsDialogOpen(true);
    };

    const completedHabits = habits.filter(habit => habit.is_completed_today);
    const pendingHabits = habits.filter(habit => !habit.is_completed_today);

    return (
        <AppShell>
            <Head title="Habits - My Daily Routine" />
            
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                            <Target className="w-8 h-8 text-green-600" />
                            Habit Tracker
                        </h1>
                        <p className="text-gray-600 mt-1">
                            Build lasting habits and track your progress
                        </p>
                    </div>
                    
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button onClick={openCreateDialog} className="bg-green-600 hover:bg-green-700">
                                <Plus className="w-4 h-4 mr-2" />
                                Add Habit
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>
                                    {editingHabit ? 'Edit Habit' : 'Create New Habit'}
                                </DialogTitle>
                                <DialogDescription>
                                    {editingHabit ? 'Update your habit details' : 'Add a new habit to track daily'}
                                </DialogDescription>
                            </DialogHeader>
                            
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">
                                        Habit Name <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        placeholder="e.g., Drink 8 glasses of water"
                                        className={errors.name ? 'border-red-300' : ''}
                                    />
                                    {errors.name && (
                                        <p className="text-sm text-red-600">{errors.name}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea
                                        id="description"
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        placeholder="Add description (optional)..."
                                        rows={2}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="category">Category</Label>
                                        <Select
                                            value={data.category_id}
                                            onValueChange={(value) => setData('category_id', value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select category..." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="">No Category</SelectItem>
                                                {categories.map((category) => (
                                                    <SelectItem key={category.id} value={category.id.toString()}>
                                                        <span className="flex items-center gap-2">
                                                            <div 
                                                                className="w-3 h-3 rounded-full" 
                                                                style={{ backgroundColor: category.color }}
                                                            ></div>
                                                            {category.name}
                                                        </span>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="target_frequency">Daily Target</Label>
                                        <Select
                                            value={data.target_frequency}
                                            onValueChange={(value) => setData('target_frequency', value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {[1, 2, 3, 4, 5].map(num => (
                                                    <SelectItem key={num} value={num.toString()}>
                                                        {num} time{num > 1 ? 's' : ''} per day
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="flex justify-end gap-3 pt-4">
                                    <Button 
                                        type="button" 
                                        variant="outline" 
                                        onClick={() => setIsDialogOpen(false)}
                                    >
                                        Cancel
                                    </Button>
                                    <Button 
                                        type="submit" 
                                        disabled={processing}
                                        className="bg-green-600 hover:bg-green-700"
                                    >
                                        {processing ? 'Saving...' : (editingHabit ? 'Update Habit' : 'Create Habit')}
                                    </Button>
                                </div>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Progress Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="border-green-200 bg-green-50/50">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <CheckCircle2 className="w-8 h-8 text-green-600" />
                                <div>
                                    <p className="text-2xl font-bold text-green-700">{completedHabits.length}</p>
                                    <p className="text-sm text-green-600">Completed Today</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    
                    <Card className="border-blue-200 bg-blue-50/50">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <Circle className="w-8 h-8 text-blue-600" />
                                <div>
                                    <p className="text-2xl font-bold text-blue-700">{pendingHabits.length}</p>
                                    <p className="text-sm text-blue-600">Still To Do</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    
                    <Card className="border-orange-200 bg-orange-50/50">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <Flame className="w-8 h-8 text-orange-600" />
                                <div>
                                    <p className="text-2xl font-bold text-orange-700">{habits.length}</p>
                                    <p className="text-sm text-orange-600">Total Habits</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Habits List */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Target className="w-5 h-5 text-green-600" />
                            Today's Habits
                        </CardTitle>
                        <CardDescription>
                            Mark your habits as complete for today
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {habits.length === 0 ? (
                            <div className="text-center py-12 text-gray-500">
                                <Target className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                                <h3 className="text-lg font-medium mb-2">No habits yet</h3>
                                <p className="mb-4">Start building positive habits by adding your first one.</p>
                                <Button onClick={openCreateDialog}>
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add Your First Habit
                                </Button>
                            </div>
                        ) : (
                            habits.map((habit) => (
                                <div 
                                    key={habit.id} 
                                    className={`flex items-center justify-between p-4 rounded-lg border ${
                                        habit.is_completed_today 
                                            ? 'bg-green-50 border-green-200' 
                                            : 'bg-white border-gray-200'
                                    } hover:shadow-md transition-all duration-200`}
                                >
                                    <div className="flex items-center space-x-3">
                                        <button 
                                            onClick={() => toggleHabitCompletion(habit)}
                                            className="flex-shrink-0 transition-colors"
                                        >
                                            {habit.is_completed_today ? (
                                                <CheckCircle2 className="w-6 h-6 text-green-600" />
                                            ) : (
                                                <Circle className="w-6 h-6 text-gray-400 hover:text-green-600" />
                                            )}
                                        </button>
                                        
                                        <div className="flex-1">
                                            <h3 className={`font-medium ${
                                                habit.is_completed_today ? 'text-green-700' : 'text-gray-900'
                                            }`}>
                                                {habit.name}
                                            </h3>
                                            {habit.description && (
                                                <p className="text-sm text-gray-600 mt-1">
                                                    {habit.description}
                                                </p>
                                            )}
                                            <div className="flex items-center gap-2 mt-2">
                                                {habit.category && (
                                                    <Badge 
                                                        variant="outline" 
                                                        className="text-xs"
                                                        style={{ borderColor: habit.category.color, color: habit.category.color }}
                                                    >
                                                        {habit.category.name}
                                                    </Badge>
                                                )}
                                                <Badge variant="outline" className="text-xs">
                                                    {habit.target_frequency}x daily
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-3">
                                        {habit.current_streak > 0 && (
                                            <div className="flex items-center gap-1 text-orange-600">
                                                <Flame className="w-4 h-4" />
                                                <span className="font-medium text-sm">
                                                    {habit.current_streak} day{habit.current_streak > 1 ? 's' : ''}
                                                </span>
                                            </div>
                                        )}
                                        
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="sm">
                                                    <MoreHorizontal className="w-4 h-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => openEditDialog(habit)}>
                                                    <Edit className="w-4 h-4 mr-2" />
                                                    Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem 
                                                    onClick={() => deleteHabit(habit)}
                                                    className="text-red-600"
                                                >
                                                    <Trash2 className="w-4 h-4 mr-2" />
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </div>
                            ))
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppShell>
    );
}