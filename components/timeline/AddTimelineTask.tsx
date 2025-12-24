"use client";

import { Drawer } from "vaul";
import { Button } from "@/components/ui/button";
import { Plus, Clock, Calendar as CalendarIcon, Type } from "lucide-react";
import { useState } from "react";
import { useAppStore } from "@/store/useAppStore";
import { cn } from "@/lib/utils";
import { TimelineTask } from "@/types";

interface AddTimelineTaskProps {
    children?: React.ReactNode;
}

export function AddTimelineTask({ children }: AddTimelineTaskProps) {
    const { addTimelineTask } = useAppStore();
    const [open, setOpen] = useState(false);

    // Form State
    const [title, setTitle] = useState("");
    const [time, setTime] = useState("09:00");
    const [type, setType] = useState<TimelineTask['type']>('todo');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title) return;

        addTimelineTask({
            id: crypto.randomUUID(),
            title,
            time,
            date: new Date().toISOString().split('T')[0], // Default to today
            type,
            completed: false
        });

        // Reset and close
        setTitle("");
        setTime("09:00");
        setOpen(false);
    };

    const types: TimelineTask['type'][] = ['todo', 'meal', 'medication', 'event', 'habit'];

    return (
        <Drawer.Root open={open} onOpenChange={setOpen}>
            <Drawer.Trigger asChild>
                {children ? children : (
                    <Button size="icon" className="h-12 w-12 rounded-full shadow-lg bg-sage-600 hover:bg-sage-700 text-white fixed bottom-24 right-6 z-40">
                        <Plus className="h-6 w-6" />
                    </Button>
                )}
            </Drawer.Trigger>
            <Drawer.Portal>
                <Drawer.Overlay className="fixed inset-0 bg-black/40 z-50" />
                <Drawer.Content className="bg-background flex flex-col rounded-t-[10px] h-[85vh] mt-24 fixed bottom-0 left-0 right-0 z-50 border-t border-sage-100 dark:border-sage-800">
                    <div className="p-4 bg-muted/20 rounded-t-[10px] flex-1">
                        <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-muted mb-8" />

                        <div className="max-w-md mx-auto">
                            <h2 className="text-2xl font-serif font-bold text-sage-900 dark:text-sage-100 mb-6">Add to Flow</h2>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Title Input */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-muted-foreground ml-1">What needs doing?</label>
                                    <input
                                        autoFocus
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        placeholder="e.g., Morning Jog"
                                        className="w-full text-lg p-4 rounded-xl bg-card border border-border focus:ring-2 focus:ring-sage-400 outline-none transition-all placeholder:text-muted-foreground/50"
                                    />
                                </div>

                                {/* Time Input */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-muted-foreground ml-1 flex items-center gap-2"><Clock className="h-4 w-4" /> Time</label>
                                    <input
                                        type="time"
                                        value={time}
                                        onChange={(e) => setTime(e.target.value)}
                                        className="w-full p-4 rounded-xl bg-card border border-border outline-none"
                                    />
                                </div>

                                {/* Type Selection */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-muted-foreground ml-1 flex items-center gap-2"><Type className="h-4 w-4" /> Category</label>
                                    <div className="flex flex-wrap gap-2">
                                        {types.map(t => (
                                            <button
                                                key={t}
                                                type="button"
                                                onClick={() => setType(t)}
                                                className={cn(
                                                    "px-4 py-2 rounded-full text-sm font-medium transition-colors border",
                                                    type === t
                                                        ? "bg-sage-600 text-white border-sage-600"
                                                        : "bg-transparent text-sage-600 border-sage-200 hover:bg-sage-50 dark:border-sage-800"
                                                )}
                                            >
                                                {t.charAt(0).toUpperCase() + t.slice(1)}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <Button type="submit" size="lg" className="w-full text-lg font-semibold bg-sage-600 hover:bg-sage-700 h-14 rounded-xl mt-8">
                                    Add Task
                                </Button>
                            </form>
                        </div>
                    </div>
                </Drawer.Content>
            </Drawer.Portal>
        </Drawer.Root>
    )
}
