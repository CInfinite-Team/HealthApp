"use client";

import { cn } from "@/lib/utils";
import { CheckCircle2, Flame, Activity } from "lucide-react";
import { motion } from "framer-motion";

interface StatsOverviewProps {
    completedToday: number;
    totalToday: number;
    streak: number;
}

export function StatsOverview({ completedToday, totalToday, streak }: StatsOverviewProps) {
    const progress = totalToday > 0 ? (completedToday / totalToday) * 100 : 0;

    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {/* Today Progress */}
            <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-emerald-50 dark:bg-emerald-950/30 p-4 rounded-3xl flex flex-col items-center justify-center text-center gap-2 border border-emerald-100 dark:border-emerald-900/50"
            >
                <div className="relative">
                    <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                    {/* Tiny circle progress could go here */}
                </div>
                <div>
                    <h3 className="text-xl font-bold text-emerald-700 dark:text-emerald-300">
                        {completedToday}/{totalToday}
                    </h3>
                    <p className="text-xs text-emerald-600/70 font-medium">Today</p>
                </div>
            </motion.div>

            {/* Streak */}
            <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-emerald-50 dark:bg-emerald-950/20 p-4 rounded-3xl flex flex-col items-center justify-center text-center gap-2 border border-emerald-100 dark:border-emerald-900/30"
            >
                <Flame className="w-6 h-6 text-emerald-500 fill-emerald-500/20 animate-pulse" />
                <div>
                    <h3 className="text-xl font-bold text-emerald-700 dark:text-emerald-300">
                        {streak}
                    </h3>
                    <p className="text-xs text-emerald-600/70 font-medium">Streak</p>
                </div>
            </motion.div>

            {/* Other / Active Burn */}
            <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-sage-50 dark:bg-emerald-900/10 p-4 rounded-3xl flex flex-col items-center justify-center text-center gap-2 border border-sage-100 dark:border-emerald-900/20"
            >
                <Activity className="w-6 h-6 text-emerald-600" />
                <div>
                    <h3 className="text-xl font-bold text-sage-700 dark:text-sage-300">
                        85%
                    </h3>
                    <p className="text-xs text-sage-600/70 font-medium">Wellness</p>
                </div>
            </motion.div>
        </div>
    );
}
