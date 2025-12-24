"use client";

import { Drawer } from "vaul";
import { format, addHours, startOfDay, isSameDay } from "date-fns";
import { TimelineTask } from "@/types";
import { cn } from "@/lib/utils";
import { X, Clock } from "lucide-react";
import { useEffect, useState } from "react";

interface DailyScheduleDrawerProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    date: Date;
    tasks: TimelineTask[];
    habits?: { title: string; completed: boolean }[]; // Simplified habit type for display
    onAddTask?: (time: string) => void;
    onEditTask?: (task: TimelineTask) => void;
}

export function DailyScheduleDrawer({ open, onOpenChange, date, tasks, habits, onAddTask, onEditTask }: DailyScheduleDrawerProps) {
    const hours = Array.from({ length: 24 }).map((_, i) => i); // 0 to 23

    // Filter tasks for this day
    const dateStr = date.toISOString().split('T')[0];
    const daysTasks = tasks.filter(t => t.date === dateStr);

    // Calculate position for a task
    const getTaskStyle = (time: string) => {
        const [h, m] = time.split(':').map(Number);
        const top = (h * 60) + m; // 1 min = 1px for simplicity? Or 60px per hour?
        // Let's do 80px per hour height.
        const hourHeight = 80;
        const minutesPixels = (m / 60) * hourHeight;
        const topPixels = (h * hourHeight) + minutesPixels;

        return {
            top: `${topPixels}px`,
            height: '70px' // Fixed height for now, or derived from duration if we had it
        };
    };

    // Scroll to current time or 8am on open
    const scrollRef = (node: HTMLDivElement | null) => {
        if (node) {
            const currentHour = new Date().getHours();
            // Scroll to current hour (hour * 80) slightly centered or top
            const scrollTo = Math.max(0, (currentHour * 80) - 100);
            node.scrollTop = scrollTo;
        }
    };

    return (
        <Drawer.Root open={open} onOpenChange={onOpenChange}>
            <Drawer.Portal>
                <Drawer.Overlay className="fixed inset-0 bg-black/40 z-50 backdrop-blur-sm" />
                <Drawer.Content className="bg-background flex flex-col rounded-t-[20px] max-h-[90vh] h-[85vh] fixed bottom-0 left-0 right-0 z-50 border-t border-sage-200 dark:border-zinc-800 outline-none">

                    {/* Header */}
                    <div className="p-4 border-b border-border flex items-center justify-between bg-muted/10 rounded-t-[20px]">
                        <div>
                            <h2 className="text-2xl font-bold font-serif text-foreground">
                                {format(date, 'EEEE, d MMMM')}
                            </h2>
                            <p className="text-muted-foreground text-sm">Daily Schedule</p>
                        </div>
                        <button
                            onClick={() => onOpenChange(false)}
                            className="p-2 hover:bg-muted rounded-full transition-colors"
                        >
                            <X className="h-6 w-6 text-muted-foreground" />
                        </button>
                    </div>

                    {/* Habits / All Day Section */}
                    {habits && habits.length > 0 && (
                        <div className="px-4 py-3 bg-sage-50/50 dark:bg-zinc-900/20 border-b border-border">
                            <h3 className="text-xs font-semibold text-sage-500 uppercase tracking-wider mb-2">My Rituals</h3>
                            <div className="flex flex-wrap gap-2">
                                {habits.map((habit, idx) => (
                                    <div key={idx} className={cn(
                                        "px-2 py-1 rounded-md text-xs font-medium border flex items-center gap-1.5",
                                        habit.completed
                                            ? "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800"
                                            : "bg-white text-sage-700 border-sage-200 dark:bg-zinc-800 dark:text-sage-400 dark:border-zinc-700"
                                    )}>
                                        <div className={cn("w-1.5 h-1.5 rounded-full", habit.completed ? "bg-emerald-500" : "bg-sage-300")} />
                                        {habit.title}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Scrollable Grid */}
                    <div className="flex-1 overflow-y-auto relative" ref={scrollRef}>
                        {/* Current Time Indicator (if open on today) */}
                        {/* {isSameDay(date, new Date()) && ... } */}

                        <div className="relative min-h-[1920px] w-full bg-background" style={{ height: 24 * 80 }}>
                            {/* Grid Lines */}
                            {hours.map(hour => (
                                <div
                                    key={hour}
                                    className="absolute w-full border-b border-border/30 flex items-start group"
                                    style={{ top: hour * 80, height: 80 }}
                                    onClick={() => onAddTask && onAddTask(`${hour.toString().padStart(2, '0')}:00`)}
                                >
                                    <span className="w-16 text-right pr-4 text-xs font-mono text-muted-foreground/60 -mt-2 group-hover:text-primary transition-colors">
                                        {format(new Date().setHours(hour, 0), 'h a')}
                                    </span>
                                    <div className="flex-1 h-full hover:bg-sage-50/50 dark:hover:bg-zinc-900/30 transition-colors cursor-pointer" />
                                </div>
                            ))}

                            {/* Tasks */}
                            {daysTasks.map(task => {
                                const style = getTaskStyle(task.time);
                                return (
                                    <div
                                        key={task.id}
                                        className={cn(
                                            "absolute left-16 right-4 p-3 rounded-xl border border-l-4 shadow-sm text-sm transition-all hover:scale-[1.01] cursor-pointer overflow-hidden",
                                            task.completed
                                                ? "bg-sage-100/50 border-sage-300 border-l-sage-500 text-sage-700 dark:bg-zinc-800 dark:border-zinc-700"
                                                : "bg-blue-50/50 border-blue-200 border-l-blue-500 text-blue-900 dark:bg-blue-950/20 dark:border-blue-900",
                                            task.type === 'habit' && !task.completed && "bg-amber-50/50 border-amber-200 border-l-amber-500 text-amber-900",
                                            task.type === 'meal' && "bg-rose-50/50 border-rose-200 border-l-rose-500 text-rose-900"
                                        )}
                                        style={style}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onEditTask && onEditTask(task);
                                        }}
                                    >
                                        <div className="font-semibold truncate">{task.title}</div>
                                        <div className="text-xs opacity-80 flex items-center gap-1">
                                            <Clock className="h-3 w-3" />
                                            {task.time}
                                            {task.type !== 'todo' && <span className="uppercase text-[9px] border border-current px-1 rounded ml-2">{task.type}</span>}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="p-4 border-t border-border bg-background pb-safe">
                        <p className="text-center text-xs text-muted-foreground">
                            Tip: Tap a time slot to add a task quickly.
                        </p>
                    </div>

                </Drawer.Content>
            </Drawer.Portal>
        </Drawer.Root>
    );
}
