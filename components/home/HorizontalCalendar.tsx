"use client";

import { useState, useRef, useEffect } from "react";
import { format, addDays, startOfWeek, isSameDay, isToday, startOfMonth, endOfMonth, eachDayOfInterval, getDay, addMonths, subMonths } from "date-fns";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, ChevronLeft, ChevronRight } from "lucide-react";

interface HorizontalCalendarProps {
    selectedDate: Date;
    onSelectDate: (date: Date) => void;
    tasks: { date: string; completed: boolean }[]; // Minimal task info for indicators
}

export function HorizontalCalendar({ selectedDate, onSelectDate, tasks }: HorizontalCalendarProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    // For Month View
    const [currentMonth, setCurrentMonth] = useState(new Date(selectedDate));

    // For Week View (Horizontal Strip)
    // We want the strip to be scrollable or at least show a relevant window.
    // Let's center it around the selected date or today.
    const [weekStart, setWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));

    // Update month when selected date changes? 
    useEffect(() => {
        setCurrentMonth(selectedDate);
    }, [selectedDate]);

    // Calculate indicators
    const getIndicators = (date: Date) => {
        const dateStr = format(date, 'yyyy-MM-dd');
        const daysTasks = tasks.filter(t => t.date === dateStr);
        if (daysTasks.length === 0) return null;

        const hasPending = daysTasks.some(t => !t.completed);
        const allCompleted = daysTasks.every(t => t.completed);

        return { hasPending, allCompleted };
    };

    // --- Week View Logic ---
    const weekDays = Array.from({ length: 14 }).map((_, i) => addDays(weekStart, i));

    // --- Month View Logic ---
    const daysInMonth = eachDayOfInterval({
        start: startOfMonth(currentMonth),
        end: endOfMonth(currentMonth),
    });
    const startDayIndex = getDay(startOfMonth(currentMonth)); // 0 = Sun, 1 = Mon...
    // Adjust for Monday start if desired, but standard calendar often starts Sun. Let's stick to standard.

    const toggleExpand = () => setIsExpanded(!isExpanded);

    const handleMonthNav = (dir: 'prev' | 'next') => {
        setCurrentMonth(prev => dir === 'prev' ? subMonths(prev, 1) : addMonths(prev, 1));
    };

    return (
        <div className="w-full relative">
            {/* Header Control for Expansion (Optional overlay on date?) Or just a handle bar */}
            {/* Header / Expansion Control */}
            <div
                className="flex flex-col items-center justify-center pb-2 cursor-pointer group"
                onClick={toggleExpand}
            >
                {/* Collapsed Month Label (Only show if NOT expanded to avoid duplicate) */}
                {!isExpanded && (
                    <div className="text-sm font-semibold text-sage-600 dark:text-sage-300 mb-1 opacity-80 group-hover:opacity-100 transition-opacity">
                        {format(currentMonth, 'MMMM yyyy')} <ChevronDown className="inline h-3 w-3 ml-1" />
                    </div>
                )}

                {/* Handle Bar */}
                <div className="w-12 h-1.5 rounded-full bg-sage-200 dark:bg-zinc-700 group-hover:bg-sage-300 transition-colors" />
            </div>

            <AnimatePresence mode="wait">
                {!isExpanded ? (
                    <motion.div
                        key="week"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="w-full overflow-x-auto scrollbar-hide py-2"
                    >
                        <div className="flex gap-3 min-w-max px-2">
                            {weekDays.map((day) => {
                                const isSelected = isSameDay(day, selectedDate);
                                const indicators = getIndicators(day);
                                return (
                                    <DayButton
                                        key={day.toISOString()}
                                        day={day}
                                        isSelected={isSelected}
                                        indicators={indicators}
                                        onClick={() => onSelectDate(day)}
                                    />
                                );
                            })}
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="month"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="px-2 pb-4"
                    >
                        <div className="flex items-center justify-between mb-4 px-2">
                            <h3 className="font-bold text-lg text-sage-900 dark:text-sage-100">
                                {format(currentMonth, 'MMMM yyyy')}
                            </h3>
                            <div className="flex gap-2">
                                <button onClick={() => handleMonthNav('prev')} className="p-1 hover:bg-black/5 rounded-full"><ChevronLeft className="h-5 w-5 text-sage-600" /></button>
                                <button onClick={() => handleMonthNav('next')} className="p-1 hover:bg-black/5 rounded-full"><ChevronRight className="h-5 w-5 text-sage-600" /></button>
                            </div>
                        </div>

                        <div className="grid grid-cols-7 gap-y-4 gap-x-1 text-center">
                            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
                                <div key={d} className="text-xs font-semibold text-sage-400 uppercase tracking-wider">{d}</div>
                            ))}

                            {/* Empty slots */}
                            {Array.from({ length: startDayIndex }).map((_, i) => <div key={`empty-${i}`} />)}

                            {daysInMonth.map((day) => {
                                const isSelected = isSameDay(day, selectedDate);
                                const indicators = getIndicators(day);
                                return (
                                    <div key={day.toISOString()} className="flex justify-center">
                                        <DayButton
                                            day={day}
                                            isSelected={isSelected}
                                            indicators={indicators}
                                            onClick={() => {
                                                onSelectDate(day);
                                                // Optional: close on select?
                                                // setIsExpanded(false);
                                            }}
                                            mini // Smaller version for month view
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Handle at bottom to verify */}
            {isExpanded && (
                <div
                    className="flex justify-center pt-2 cursor-pointer"
                    onClick={() => setIsExpanded(false)}
                >
                    <ChevronUp className="h-5 w-5 text-sage-400" />
                </div>
            )}
        </div>
    );
}

function DayButton({ day, isSelected, indicators, onClick, mini = false }: any) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "flex flex-col items-center justify-center transition-all duration-300 relative",
                mini ? "w-8 h-8 rounded-full" : "w-12 h-16 rounded-3xl",
                isSelected
                    ? "bg-sage-600 text-white shadow-md scale-105"
                    : "bg-white dark:bg-zinc-800 text-sage-600 dark:text-sage-400 hover:bg-sage-50",
                isToday(day) && !isSelected && "border border-sage-500",
            )}
        >
            {!mini && (
                <span className="text-[10px] font-medium opacity-80 uppercase mb-0.5">
                    {format(day, "EEE")}
                </span>
            )}
            <span className={cn(
                "font-bold",
                mini ? "text-sm" : "text-lg",
                isSelected ? "text-white" : "text-sage-900 dark:text-sage-200"
            )}>
                {format(day, "d")}
            </span>

            {/* Indicators */}
            <div className={cn("absolute flex gap-0.5", mini ? "-bottom-1" : "bottom-2")}>
                {indicators && (
                    <div className={cn(
                        "rounded-full",
                        mini ? "w-1 h-1" : "w-1.5 h-1.5",
                        indicators.allCompleted ? "bg-emerald-300" :
                            isSelected ? "bg-white/50" : "bg-sage-400"
                    )} />
                )}
            </div>
        </button>
    )
}
