"use client";

import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isSameDay, isToday } from "date-fns";
import { useAppStore } from "@/store/useAppStore";

export function StatsCalendar() {
    const [currentDate, setCurrentDate] = useState(new Date());

    const days = eachDayOfInterval({
        start: startOfMonth(currentDate),
        end: endOfMonth(currentDate),
    });

    const { habits } = useAppStore();

    // Calculate completed days based on habit history for the current month
    const isCompleted = (day: Date) => {
        const dateStr = format(day, 'yyyy-MM-dd');
        // A day is "completed" if at least one habit was done
        return habits.some(h => h.completedDates.includes(dateStr));
    };

    const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    const startDayIndex = getDay(startOfMonth(currentDate));

    return (
        <div className="bg-card rounded-2xl p-5 border border-border/50 shadow-sm">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">{format(currentDate, 'MMMM yyyy')}</h3>
                <div className="flex gap-1">
                    <button className="p-1 hover:bg-muted rounded-full">
                        <ChevronLeft className="h-4 w-4 text-muted-foreground" />
                    </button>
                    <button className="p-1 hover:bg-muted rounded-full">
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-7 text-center mb-2">
                {weekDays.map(d => (
                    <div key={d} className="text-[10px] text-muted-foreground font-medium">{d}</div>
                ))}
            </div>

            <div className="grid grid-cols-7 gap-y-2 gap-x-1">
                {/* Empty placeholders for days before start of month */}
                {Array.from({ length: startDayIndex }).map((_, i) => (
                    <div key={`empty-${i}`} />
                ))}

                {days.map((day, i) => (
                    <div key={i} className="flex justify-center">
                        <div className={cn(
                            "h-8 w-8 rounded-full flex items-center justify-center text-xs transition-all",
                            isToday(day) ? "border-2 border-sage-500 font-bold text-sage-600 dark:text-sage-400" : "text-foreground",
                            isCompleted(day) ? "bg-sage-500 text-white font-medium shadow-sm" :
                                "hover:bg-muted"
                        )}>
                            {format(day, 'd')}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
