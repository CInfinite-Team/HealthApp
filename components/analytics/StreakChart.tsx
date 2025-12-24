"use client";

import { motion } from "framer-motion";
import { useAppStore } from "@/store/useAppStore";

export function StreakChart() {
    const { habits } = useAppStore();

    // Calculate last 7 days data
    const data = Array.from({ length: 7 }).map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (6 - i)); // Order from 6 days ago to Today
        const dateStr = d.toISOString().split('T')[0];
        const dayLabel = d.toLocaleDateString('en-US', { weekday: 'narrow' }); // M, T, W...

        if (habits.length === 0) return { day: dayLabel, value: 0 };

        const completedCount = habits.filter(h => h.completedDates.includes(dateStr)).length;
        const value = Math.round((completedCount / habits.length) * 100);

        return { day: dayLabel, value };
    });

    return (
        <div className="bg-card rounded-2xl p-5 border border-border/50 shadow-sm">
            <h3 className="font-semibold mb-6 flex items-center justify-between">
                <span>Weekly Activity</span>
                <span className="text-xs font-normal text-muted-foreground bg-muted px-2 py-1 rounded-full">Last 7 Days</span>
            </h3>

            <div className="flex items-end justify-between h-32 gap-2">
                {data.map((item, index) => (
                    <div key={index} className="flex flex-col items-center gap-2 flex-1 group">
                        <div className="relative w-full h-full flex items-end justify-center">
                            {/* Bar Background */}
                            <div className="absolute bottom-0 w-2 h-full bg-muted/30 rounded-full" />

                            {/* Active Bar */}
                            <motion.div
                                initial={{ height: 0 }}
                                animate={{ height: `${item.value}%` }}
                                transition={{ duration: 1, delay: index * 0.1, type: "spring" }}
                                className="w-2 rounded-full bg-sage-500 group-hover:bg-sage-600 transition-colors z-10"
                            />
                        </div>
                        <span className="text-[10px] text-muted-foreground font-medium">{item.day}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
