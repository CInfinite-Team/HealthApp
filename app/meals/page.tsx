"use client";

import { useAppStore } from "@/store/useAppStore";
import { SymptomLogger } from "@/components/wellness/SymptomLogger";
import { Coffee, Sun, Moon, Sparkles, Utensils, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { HorizontalCalendar } from "@/components/home/HorizontalCalendar";
import { AddMealPlan } from "@/components/meals/AddMealPlan";
import { TimelineView } from "@/components/timeline/TimelineView";
import { DailyScheduleDrawer } from "@/components/home/DailyScheduleDrawer";

export default function MealsPage() {
    const { healthLogs, mealPlans, addHealthLog } = useAppStore();
    const [filter, setFilter] = useState<'all' | 'breakfast' | 'lunch' | 'dinner' | 'snack'>('all');
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [isScheduleOpen, setIsScheduleOpen] = useState(false);

    const handleQuickLog = (plan: any, portion: string) => {
        addHealthLog({
            id: crypto.randomUUID(),
            date: new Date().toISOString(),
            type: 'food',
            label: `${plan.name} (${portion})`,
            mealType: plan.mealType,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
        });
        toast.success(`Logged ${plan.name}`, { description: "Added to your food journal." });
    };

    const foodLogs = healthLogs.filter(log => log.type === 'food');
    const filteredLogs = filter === 'all'
        ? foodLogs
        : foodLogs.filter(log => log.mealType === filter);

    // Filter Meal Plans for Selected Date
    const dayOfWeek = selectedDate.getDay(); // 0-6
    const daysPlanned = mealPlans.filter(plan =>
        plan.selectedDays.includes(dayOfWeek) &&
        (filter === 'all' || plan.mealType === filter)
    );

    // Calculate time since last food
    const lastMeal = [...foodLogs].sort((a, b) => b.date.localeCompare(a.date))[0];
    const timeSinceMeal = lastMeal ? formatDistanceToNow(new Date(lastMeal.date)) : "No record";

    const filters = [
        { id: 'all', label: 'All', icon: Utensils },
        { id: 'breakfast', label: 'Breakfast', icon: Coffee },
        { id: 'lunch', label: 'Lunch', icon: Sun },
        { id: 'dinner', label: 'Dinner', icon: Moon },
        { id: 'snack', label: 'Snack', icon: Sparkles },
    ];

    return (
        <div className="space-y-6 pb-24 animate-in fade-in duration-500 min-h-screen pt-4">
            <header className="mb-2 px-4">
                <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                        <Utensils className="h-6 w-6 text-emerald-600" />
                        <h1 className="text-3xl font-bold font-serif text-sage-900 dark:text-sage-100">Meal Planner</h1>
                    </div>

                    {/* Add Plan Button */}
                    <AddMealPlan>
                        <button className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full shadow-lg shadow-emerald-200 dark:shadow-none transition-all">
                            + Plan Meal
                        </button>
                    </AddMealPlan>
                </div>
                <p className="text-sage-500 dark:text-sage-400 pl-8">Nourish your body with intention</p>
            </header>

            {/* Calendar */}
            <HorizontalCalendar
                selectedDate={selectedDate}
                onSelectDate={(date) => {
                    setSelectedDate(date);
                    setIsScheduleOpen(true);
                }}
                className="mb-4"
            />

            {/* Top Filters */}
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide px-4">
                {filters.map((f) => (
                    <button
                        key={f.id}
                        onClick={() => setFilter(f.id as any)}
                        className={cn(
                            "flex flex-col items-center justify-center min-w-[80px] h-20 rounded-2xl border transition-all flex-shrink-0",
                            filter === f.id
                                ? "bg-emerald-500 text-white border-emerald-600 shadow-lg shadow-emerald-200 dark:shadow-none"
                                : "bg-card border-border hover:bg-muted text-muted-foreground"
                        )}
                    >
                        <f.icon className={cn("h-5 w-5 mb-1", filter === f.id ? "text-white" : "text-emerald-600/70")} />
                        <span className="text-[10px] font-bold uppercase tracking-wider">{f.label}</span>
                    </button>
                ))}
            </div>

            {/* Timeline View */}
            <div className="px-4">
                <h3 className="text-xs font-bold uppercase text-muted-foreground mb-3 flex items-center gap-2">
                    <Clock className="h-3 w-3" /> Schedule
                </h3>

                {daysPlanned.length > 0 ? (
                    <TimelineView tasks={daysPlanned.map(plan => {
                        const portion = plan.portions[dayOfWeek] || "Standard";
                        // Determine if completed based on logs? 
                        // For now, let's just show them as open tasks unless we find a matching log.
                        // Simple matching: check if any log today has same label?
                        // Ideally we'd store completion status in a separate tracker, but for now let's just visualize.
                        // Actually, timeline view manages its own completion state via logs or we can just pass them as is.
                        // Wait, TimelineView expects tasks. Let's map.

                        const isCompleted = foodLogs.some(log =>
                            new Date(log.date).toDateString() === selectedDate.toDateString() &&
                            (log.label === plan.name || log.label.startsWith(plan.name))
                        );

                        return {
                            id: plan.id,
                            title: `${plan.name} (${portion})`,
                            time: plan.time || "08:00", // Default if missing
                            date: selectedDate.toISOString().split('T')[0], // YYYY-MM-DD
                            completed: isCompleted,
                            type: 'habit', // Use habit styling for now
                            category: 'wellness'
                        };
                    })} />
                ) : (
                    <div className="text-center py-6 text-muted-foreground bg-muted/20 rounded-2xl border border-dashed text-sm">
                        No schedule for today.
                    </div>
                )}
            </div>

            {/* Daily Schedule Drawer */}
            <DailyScheduleDrawer
                open={isScheduleOpen}
                onOpenChange={setIsScheduleOpen}
                date={selectedDate}
                tasks={daysPlanned.map(plan => ({
                    id: plan.id,
                    title: `${plan.name}`,
                    time: plan.time || "08:00",
                    date: selectedDate.toISOString().split('T')[0], // YYYY-MM-DD
                    completed: false,
                    type: 'meal',
                    category: 'wellness'
                }))}
            />

            {/* List View (Existing) */}
            <div className="px-4">
                <h3 className="text-xs font-bold uppercase text-muted-foreground mb-3 flex items-center gap-2">
                    <Utensils className="h-3 w-3" /> Meal List
                </h3>

                {daysPlanned.length > 0 ? (
                    <div className="space-y-3">
                        {daysPlanned.map(plan => {
                            // Determine portion
                            // Check if specific day portion exists, else try finding a default or '0' key?
                            // Based on AddMealPlan logic, portions are stored by day ID.
                            // If simple mode used, all selected days have keys.
                            const portion = plan.portions[dayOfWeek] || "Standard";

                            return (
                                <AddMealPlan key={plan.id} planToEdit={plan}>
                                    <div className="bg-card dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 p-4 rounded-2xl shadow-sm flex items-center justify-between group hover:border-emerald-500/30 transition-all cursor-pointer">
                                        <div className="flex items-center gap-3">
                                            <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center",
                                                plan.mealType === 'breakfast' ? "bg-orange-100 text-orange-600 dark:bg-orange-900/20" :
                                                    plan.mealType === 'lunch' ? "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20" :
                                                        plan.mealType === 'dinner' ? "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/20" :
                                                            "bg-pink-100 text-pink-600 dark:bg-pink-900/20"
                                            )}>
                                                {plan.mealType === 'breakfast' ? <Coffee className="h-5 w-5" /> :
                                                    plan.mealType === 'lunch' ? <Sun className="h-5 w-5" /> :
                                                        plan.mealType === 'dinner' ? <Moon className="h-5 w-5" /> :
                                                            <Sparkles className="h-5 w-5" />}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-base">{plan.name}</h4>
                                                <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                                                    <span className="bg-muted px-1.5 py-0.5 rounded capitalize">{plan.mealType}</span>
                                                    {portion && <span className="text-emerald-600 dark:text-emerald-400">• {portion}</span>}
                                                </div>
                                            </div>
                                        </div>

                                        <div onClick={(e) => e.stopPropagation()}>
                                            <Button
                                                size="sm"
                                                onClick={() => handleQuickLog(plan, portion)}
                                                className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:hover:bg-emerald-900/50 rounded-full h-8 px-4 text-xs font-bold shadow-none"
                                            >
                                                Eat
                                            </Button>
                                        </div>
                                    </div>
                                </AddMealPlan>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-8 bg-muted/20 rounded-2xl border border-dashed border-sage-200 dark:border-white/10">
                        <p className="text-sm text-muted-foreground">No meals planned for this day.</p>
                        <AddMealPlan>
                            <button className="text-xs font-bold text-emerald-600 hover:underline mt-1">Start Planning</button>
                        </AddMealPlan>
                    </div>
                )}
            </div>

            {/* Inline Logger */}
            <div className="pt-2 px-4">
                <h3 className="text-xs font-bold uppercase text-muted-foreground mb-3">Quick Log</h3>
                <SymptomLogger fixedType="food" inline />
            </div>

            {/* History Section */}
            <div className="px-4">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="font-bold text-xl text-sage-800 dark:text-sage-200">
                        {filter === 'all' ? "Recent Logged Meals" : `${filter.charAt(0).toUpperCase() + filter.slice(1)} History`}
                    </h2>
                    <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                        {timeSinceMeal} ago
                    </span>
                </div>

                <div className="space-y-3">
                    <AnimatePresence mode="popLayout">
                        {filteredLogs.length > 0 ? (
                            filteredLogs.slice().reverse().map((log) => (
                                <motion.div
                                    key={log.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    layout
                                >
                                    <SymptomLogger logToEdit={log} fixedType="food">
                                        <div role="button" className="bg-card dark:bg-emerald-950/10 p-4 rounded-xl border border-border/50 shadow-sm flex items-center justify-between w-full text-left cursor-pointer hover:border-emerald-200 hover:shadow-md transition-all group dark:hover:border-emerald-900/30">
                                            <div className="flex items-center gap-3">
                                                <div className={cn(
                                                    "h-10 w-10 rounded-full flex items-center justify-center transition-colors",
                                                    "bg-sage-100 text-sage-600 dark:bg-emerald-900/20 dark:text-emerald-400"
                                                )}>
                                                    {log.mealType === 'breakfast' ? <Coffee className="h-5 w-5" /> :
                                                        log.mealType === 'lunch' ? <Sun className="h-5 w-5" /> :
                                                            log.mealType === 'dinner' ? <Moon className="h-5 w-5" /> :
                                                                <Sparkles className="h-5 w-5" />}
                                                </div>
                                                <div>
                                                    <span className="font-medium block text-lg">{log.label}</span>
                                                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                        {new Date(log.date).toLocaleDateString()}
                                                        {log.mealType && <span className="capitalize">• {log.mealType}</span>}
                                                    </span>
                                                </div>
                                            </div>
                                            <span className="text-sm font-mono text-muted-foreground group-hover:text-emerald-500 transition-colors">
                                                {log.time || new Date(log.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    </SymptomLogger>
                                </motion.div>
                            ))
                        ) : (
                            <div className="text-center py-12 text-muted-foreground bg-muted/20 rounded-2xl border border-dashed">
                                <Utensils className="h-10 w-10 mx-auto mb-2 opacity-20" />
                                <p>No meals found.</p>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
