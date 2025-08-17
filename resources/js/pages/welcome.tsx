import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Calendar, Target, BookOpen, Plus, ArrowRight, Star } from 'lucide-react';

interface Props {
    auth: {
        user: unknown;
    };
    [key: string]: unknown;
}

export default function Welcome({ auth }: Props) {
    const features = [
        {
            icon: <CheckCircle2 className="w-8 h-8 text-blue-500" />,
            title: "📋 Task Management",
            description: "Create, organize, and track your daily tasks with priorities and due dates",
            highlight: "Never miss a deadline"
        },
        {
            icon: <Calendar className="w-8 h-8 text-green-500" />,
            title: "📅 Schedule Planning",
            description: "Plan your day with time-blocked events and recurring appointments",
            highlight: "Stay organized"
        },
        {
            icon: <Target className="w-8 h-8 text-purple-500" />,
            title: "🎯 Habit Tracking",
            description: "Build positive habits with streak tracking and completion monitoring",
            highlight: "Build consistency"
        },
        {
            icon: <BookOpen className="w-8 h-8 text-orange-500" />,
            title: "📝 Daily Notes",
            description: "Capture thoughts, reflections, and important moments in daily journal entries",
            highlight: "Reflect & grow"
        }
    ];

    const stats = [
        { label: "Daily Tasks", value: "∞", color: "text-blue-600" },
        { label: "Habit Streaks", value: "∞", color: "text-green-600" },
        { label: "Categories", value: "∞", color: "text-purple-600" },
        { label: "Notes", value: "∞", color: "text-orange-600" }
    ];

    return (
        <>
            <Head title="My Daily Routine - Organize Your Perfect Day" />
            
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
                {/* Header */}
                <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center h-16">
                            <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                                    <Calendar className="w-5 h-5 text-white" />
                                </div>
                                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                    My Daily Routine
                                </span>
                            </div>
                            
                            <div className="flex items-center space-x-4">
                                {auth.user ? (
                                    <Link href="/dashboard">
                                        <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                                            Go to Dashboard
                                        </Button>
                                    </Link>
                                ) : (
                                    <div className="flex space-x-3">
                                        <Link href="/login">
                                            <Button variant="outline" className="border-blue-300 text-blue-600 hover:bg-blue-50">
                                                Login
                                            </Button>
                                        </Link>
                                        <Link href="/register">
                                            <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                                                Get Started Free
                                            </Button>
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Hero Section */}
                <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-7xl mx-auto text-center">
                        <div className="mb-8">
                            <Badge className="mb-4 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 border-blue-200">
                                ✨ Your Personal Productivity Companion
                            </Badge>
                            <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-6">
                                Organize Your
                                <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                    Perfect Day 🌟
                                </span>
                            </h1>
                            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                                Transform your daily routine with smart task management, habit tracking, 
                                and mindful planning. Everything you need to stay organized and achieve your goals.
                            </p>
                        </div>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
                            {auth.user ? (
                                <Link href="/dashboard">
                                    <Button size="lg" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 px-8 py-4 text-lg">
                                        <Calendar className="w-5 h-5 mr-2" />
                                        Open Dashboard
                                        <ArrowRight className="w-5 h-5 ml-2" />
                                    </Button>
                                </Link>
                            ) : (
                                <>
                                    <Link href="/register">
                                        <Button size="lg" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 px-8 py-4 text-lg">
                                            <Plus className="w-5 h-5 mr-2" />
                                            Start Your Journey
                                            <ArrowRight className="w-5 h-5 ml-2" />
                                        </Button>
                                    </Link>
                                    <Link href="/login">
                                        <Button variant="outline" size="lg" className="border-2 border-blue-300 text-blue-600 hover:bg-blue-50 px-8 py-4 text-lg">
                                            Sign In
                                        </Button>
                                    </Link>
                                </>
                            )}
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
                            {stats.map((stat, index) => (
                                <div key={index} className="text-center">
                                    <div className={`text-2xl font-bold ${stat.color} mb-1`}>
                                        {stat.value}
                                    </div>
                                    <div className="text-sm text-gray-500">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl font-bold text-gray-900 mb-4">
                                Everything You Need 🚀
                            </h2>
                            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                                Powerful features designed to help you stay organized, build habits, and achieve your goals
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {features.map((feature, index) => (
                                <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white/80 backdrop-blur-sm">
                                    <CardHeader className="text-center">
                                        <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl flex items-center justify-center">
                                            {feature.icon}
                                        </div>
                                        <CardTitle className="text-lg text-gray-800">
                                            {feature.title}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="text-center">
                                        <CardDescription className="text-gray-600 mb-3">
                                            {feature.description}
                                        </CardDescription>
                                        <Badge variant="secondary" className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 border-0">
                                            {feature.highlight}
                                        </Badge>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>

                {/* How It Works */}
                <section className="py-20 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">
                            Simple & Effective 💪
                        </h2>
                        <p className="text-xl text-gray-600 mb-12">
                            Get started in minutes and see results immediately
                        </p>

                        <div className="grid md:grid-cols-3 gap-8">
                            <div className="text-center">
                                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                                    1
                                </div>
                                <h3 className="text-lg font-semibold mb-2">📝 Plan Your Day</h3>
                                <p className="text-gray-600">Add tasks, schedule events, and set up habits that matter to you</p>
                            </div>
                            <div className="text-center">
                                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                                    2
                                </div>
                                <h3 className="text-lg font-semibold mb-2">✅ Stay On Track</h3>
                                <p className="text-gray-600">Check off completed items and build momentum with streak tracking</p>
                            </div>
                            <div className="text-center">
                                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                                    3
                                </div>
                                <h3 className="text-lg font-semibold mb-2">🎯 Achieve Goals</h3>
                                <p className="text-gray-600">Reflect on progress and celebrate your daily wins</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-600">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="text-4xl font-bold text-white mb-4">
                            Ready to Transform Your Routine? 🌟
                        </h2>
                        <p className="text-xl text-blue-100 mb-8">
                            Join thousands of users who've already improved their daily productivity
                        </p>
                        
                        {auth.user ? (
                            <Link href="/dashboard">
                                <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-50 px-8 py-4 text-lg font-semibold">
                                    <Calendar className="w-5 h-5 mr-2" />
                                    Go to Your Dashboard
                                </Button>
                            </Link>
                        ) : (
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link href="/register">
                                    <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-50 px-8 py-4 text-lg font-semibold">
                                        <Star className="w-5 h-5 mr-2" />
                                        Start Free Today
                                    </Button>
                                </Link>
                                <Link href="/login">
                                    <Button variant="outline" size="lg" className="border-2 border-white text-white hover:bg-white/10 px-8 py-4 text-lg">
                                        Sign In
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </div>
                </section>

                {/* Footer */}
                <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-7xl mx-auto text-center">
                        <div className="flex items-center justify-center space-x-3 mb-4">
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                                <Calendar className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xl font-bold">My Daily Routine</span>
                        </div>
                        <p className="text-gray-400 mb-4">
                            Your personal productivity companion for a better daily routine
                        </p>
                        <div className="flex justify-center items-center space-x-6 text-sm text-gray-500">
                            <span>Built with ❤️ for productivity</span>
                            <span>•</span>
                            <span>Simple • Modern • Effective</span>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}