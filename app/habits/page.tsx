"use client";

import { useAppStore } from "@/store/useAppStore";
import { HabitCard } from "@/components/habit/HabitCard";
import { AddHabit } from "@/components/habit/AddHabit";
import { useEffect, useState } from "react";
import { CheckCircle2, Plus } from "lucide-react";
import { DailyScheduleDrawer } from "@/components/home/DailyScheduleDrawer";
import { HorizontalCalendar } from "@/components/home/HorizontalCalendar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export default function HabitsPage() {
    const { habits, timeline } = useAppStore();
    const [mounted, setMounted] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [isScheduleOpen, setScheduleOpen] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const dateStr = selectedDate.toISOString().split('T')[0];

    // Stats Logic
    const completedToday = habits.filter(h => h.completedDates.includes(dateStr)).length;
    const totalHabits = habits.length;
    const progressPercentage = totalHabits > 0 ? (completedToday / totalHabits) * 100 : 0;

    // Calendar Data
    const calendarTasks = [
        ...timeline.map(t => ({ date: t.date, completed: t.completed })),
        ...habits.flatMap(h => h.completedDates.map(d => ({ date: d, completed: true })))
    ];

    return (
        <div className="space-y-6 animate-in fade-in duration-500 min-h-screen pb-32">

            {/* Header Section */}
            <header className="pt-2 flex items-end justify-between px-2">
                <div>
                    <h1 className="text-3xl font-bold font-serif text-sage-900 dark:text-sage-100 mb-1">Habits</h1>
                    <p className="text-sage-500 dark:text-sage-400 font-medium ml-0.5">
                        {completedToday}/{totalHabits} completed
                    </p>
                </div>
                <AddHabit>
                    <Button className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-full px-4 shadow-sm active:scale-95 transition-all">
                        <Plus className="h-4 w-4 mr-1.5" />
                        Add Habit
                    </Button>
                </AddHabit>
            </header>

            {/* Calendar Section */}
            <div className="bg-gradient-to-br from-white to-sage-50 dark:from-zinc-900 dark:to-zinc-950 py-4 px-4 rounded-[30px] shadow-sm cursor-pointer border border-transparent dark:border-white/5">
                <HorizontalCalendar
                    selectedDate={selectedDate}
                    onSelectDate={(date) => {
                        setSelectedDate(date);
                        setScheduleOpen(true);
                    }}
                    tasks={calendarTasks}
                />
            </div>

            {/* Daily Progress Section */}
            <div className="bg-white/50 dark:bg-zinc-900/40 p-5 rounded-[24px] border border-sage-100 dark:border-white/5 shadow-sm">
                <div className="flex justify-between items-end mb-2">
                    <h3 className="text-lg font-medium text-sage-700 dark:text-sage-300">Daily Progress</h3>
                    <span className="text-2xl font-bold text-sage-900 dark:text-sage-100">{Math.round(progressPercentage)}%</span>
                </div>

                {/* Progress Bar Container */}
                <div className="h-4 w-full bg-sage-200/50 dark:bg-zinc-800 rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progressPercentage}%` }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="h-full bg-emerald-500 rounded-full"
                    />
                </div>
            </div>

            {/* Habits List */}
            <section className="space-y-4 pt-2">
                {habits.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center opacity-60">
                        <CheckCircle2 className="h-16 w-16 text-sage-200 mb-4" />
                        <p className="text-sage-500">No habits yet. Start a new ritual above.</p>
                    </div>
                ) : (
                    habits.map(habit => (
                        <HabitCard key={habit.id} habit={habit} date={selectedDate} />
                    ))
                )}
            </section>

            <DailyScheduleDrawer
                open={isScheduleOpen}
                onOpenChange={setScheduleOpen}
                date={selectedDate}
                tasks={timeline}
                habits={habits.map(h => ({
                    title: h.title,
                    completed: h.completedDates.includes(selectedDate.toISOString().split('T')[0])
                }))}
            />
        </div>
    );
}
