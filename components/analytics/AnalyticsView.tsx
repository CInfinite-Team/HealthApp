"use client";

import { BarChart3, TrendingUp, Calendar as CalIcon } from "lucide-react";
import { StreakChart } from "./StreakChart";
import { StatsCalendar } from "./StatsCalendar";
import { useAppStore } from "@/store/useAppStore";

export function AnalyticsView() {
    const { habits } = useAppStore();

    // Calculate Consistency (Last 7 Days)
    const calculateConsistency = () => {
        if (habits.length === 0) return 0;

        const today = new Date();
        let totalPossible = 0;
        let totalCompleted = 0;

        for (let i = 0; i < 7; i++) {
            const d = new Date();
            d.setDate(today.getDate() - i);
            const dateStr = d.toISOString().split('T')[0];

            totalPossible += habits.length; // Assuming all habits are daily for now
            totalCompleted += habits.filter(h => h.completedDates.includes(dateStr)).length;
        }

        return Math.round((totalCompleted / (totalPossible || 1)) * 100);
    };

    // Calculate Total Active Days (Unique days with at least one completion)
    const calculateTotalDays = () => {
        const allDates = new Set<string>();
        habits.forEach(h => {
            h.completedDates.forEach(date => allDates.add(date));
        });
        return allDates.size;
    };

    const consistency = calculateConsistency();
    const totalDays = calculateTotalDays();

    return (
        <div className="space-y-6 pb-24">
            <div className="flex items-center gap-2">
                <BarChart3 className="h-6 w-6 text-sage-500" />
                <h2 className="text-xl font-bold">Your Progress</h2>
            </div>

            {/* Overview Cards */}
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-sage-50 dark:bg-sage-900/20 p-4 rounded-2xl border border-sage-100 dark:border-sage-800">
                    <div className="flex items-center gap-2 text-sage-600 dark:text-sage-400 mb-1">
                        <TrendingUp className="h-4 w-4" />
                        <span className="text-xs font-bold uppercase tracking-wider">Consistency</span>
                    </div>
                    <p className="text-2xl font-bold text-sage-900 dark:text-sage-100">{consistency}%</p>
                    <p className="text-[10px] text-muted-foreground">Last 7 Days</p>
                </div>
                <div className="bg-orange-50 dark:bg-orange-900/10 p-4 rounded-2xl border border-orange-100 dark:border-orange-900/30">
                    <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400 mb-1">
                        <CalIcon className="h-4 w-4" />
                        <span className="text-xs font-bold uppercase tracking-wider">Active Days</span>
                    </div>
                    <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">{totalDays}</p>
                    <p className="text-[10px] text-muted-foreground">Keep showing up!</p>
                </div>
            </div>

            <StreakChart />
            <StatsCalendar />
        </div>
    );
}
