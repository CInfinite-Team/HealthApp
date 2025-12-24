"use client";

import { Drawer } from "vaul";
import { Button } from "@/components/ui/button";
import { Plus, Clock, Type, Trash2, Save } from "lucide-react";
import { useState, useEffect } from "react";
import { useAppStore } from "@/store/useAppStore";
import { cn } from "@/lib/utils";
import { TimelineTask } from "@/types";
import { TimePicker } from "@/components/ui/TimePicker";

interface TimelineTaskDrawerProps {
    children?: React.ReactNode;
    task?: TimelineTask; // If present, we are editing
    defaultDate?: Date; // Optional default date for new tasks
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    defaultTime?: string; // Optional default time 
    noTrigger?: boolean;
}

export function TimelineTaskDrawer({ children, task, defaultDate, open, onOpenChange, defaultTime, noTrigger }: TimelineTaskDrawerProps) {
    const { addTimelineTask, updateTimelineTask, deleteTimelineTask } = useAppStore();
    const [internalOpen, setInternalOpen] = useState(false);

    // Controlled vs Uncontrolled logic
    const isControlled = open !== undefined;
    const isOpen = isControlled ? open : internalOpen;
    const setIsOpen = isControlled ? onOpenChange! : setInternalOpen;

    // Form State
    const [title, setTitle] = useState("");
    const [time, setTime] = useState("09:00");
    const [type, setType] = useState<TimelineTask['type']>('todo');

    // Initialize/Reset form based on task prop
    useEffect(() => {
        if (isOpen) {
            if (task) {
                setTitle(task.title);
                setTime(task.time);
                setType(task.type);
            } else {
                // Default for new task
                setTitle("");
                setTime(defaultTime || "09:00");
                setType('todo');
            }
        }
    }, [isOpen, task, defaultTime]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title) return;

        if (task) {
            // Update
            updateTimelineTask({
                ...task,
                title,
                time,
                type
            });
        } else {
            // Create
            addTimelineTask({
                id: crypto.randomUUID(),
                title,
                time,
                date: defaultDate ? defaultDate.toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
                type,
                completed: false
            });
        }

        setIsOpen(false);
    };

    const handleDelete = () => {
        if (task) {
            deleteTimelineTask(task.id);
            setIsOpen(false);
        }
    };

    const types: TimelineTask['type'][] = ['todo', 'meal', 'medication', 'event', 'habit'];

    const triggerButton = children ? children : (
        <Button size="icon" className="h-12 w-12 rounded-full shadow-lg bg-sage-600 hover:bg-sage-700 text-white fixed bottom-24 right-6 z-[60]">
            <Plus className="h-6 w-6" />
        </Button>
    );

    return (
        <Drawer.Root open={isOpen} onOpenChange={setIsOpen}>
            {!noTrigger && (
                <Drawer.Trigger asChild>
                    {triggerButton}
                </Drawer.Trigger>
            )}
            <Drawer.Portal>
                <Drawer.Overlay className="fixed inset-0 bg-black/40 z-50" />
                <Drawer.Content className="bg-background flex flex-col rounded-t-[10px] max-h-[90vh] h-[90vh] fixed bottom-0 left-0 right-0 z-50 border-t border-sage-100 dark:border-sage-800 outline-none">
                    <div className="p-4 bg-muted/20 rounded-t-[10px] flex-1 overflow-y-auto pb-safe">
                        <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-muted mb-8" />

                        <div className="max-w-md mx-auto">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-serif font-bold text-sage-900 dark:text-sage-100">
                                    {task ? 'Edit Task' : 'Add to Flow'}
                                </h2>
                                {task && (
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={handleDelete}
                                        className="text-red-400 hover:text-red-600 hover:bg-red-50"
                                    >
                                        <Trash2 className="h-5 w-5" />
                                    </Button>
                                )}
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Title Input */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-muted-foreground ml-1">What needs doing?</label>
                                    <input
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        placeholder="e.g., Morning Jog"
                                        className="w-full text-lg p-4 rounded-xl bg-card border border-border focus:ring-2 focus:ring-sage-400 outline-none transition-all placeholder:text-muted-foreground/50"
                                    />
                                </div>

                                {/* Time Input - Custom Picker */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-muted-foreground ml-1 flex items-center gap-2"><Clock className="h-4 w-4" /> Time</label>
                                    <TimePicker value={time} onChange={setTime} />
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
                                    {task ? (
                                        <span className="flex items-center gap-2"><Save className="h-5 w-5" /> Save Changes</span>
                                    ) : (
                                        "Add Task"
                                    )}
                                </Button>
                            </form>
                        </div>
                    </div>
                </Drawer.Content>
            </Drawer.Portal>
        </Drawer.Root>
    )
}
