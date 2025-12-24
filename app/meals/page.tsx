"use client";

import { useAppStore } from "@/store/useAppStore";
import { SymptomLogger } from "@/components/wellness/SymptomLogger";
import { Coffee, Sun, Moon, Sparkles, Utensils, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export default function MealsPage() {
    const { healthLogs } = useAppStore();
    const [filter, setFilter] = useState<'all' | 'breakfast' | 'lunch' | 'dinner' | 'snack'>('all');

    const foodLogs = healthLogs.filter(log => log.type === 'food');
    const filteredLogs = filter === 'all'
        ? foodLogs
        : foodLogs.filter(log => log.mealType === filter);

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
            <header className="mb-2">
                <div className="flex items-center gap-2 mb-1">
                    <Utensils className="h-6 w-6 text-emerald-600" />
                    <h1 className="text-3xl font-bold font-serif text-sage-900 dark:text-sage-100">Meal Planner</h1>
                </div>
                <p className="text-sage-500 dark:text-sage-400 pl-8">Nourish your body with intention</p>
            </header>

            {/* Top Filters */}
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
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

            {/* Inline Logger */}
            <div className="pt-2">
                <SymptomLogger fixedType="food" inline />
            </div>

            {/* History Section */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="font-bold text-xl text-sage-800 dark:text-sage-200">
                        {filter === 'all' ? "Recent Meals" : `${filter.charAt(0).toUpperCase() + filter.slice(1)} History`}
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
