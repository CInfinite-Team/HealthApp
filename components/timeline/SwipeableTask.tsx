"use client";

import { motion, useAnimation, PanInfo } from "framer-motion";
import { Trash2, Check, RotateCcw } from "lucide-react";
import { TimelineTask } from "@/types";
import { useAppStore } from "@/store/useAppStore";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface SwipeableTaskProps {
    children: React.ReactNode;
    task: TimelineTask;
    className?: string;
}

export function SwipeableTask({ children, task, className }: SwipeableTaskProps) {
    const { deleteTimelineTask, updateTimelineTask } = useAppStore();
    const controls = useAnimation();

    const handleDragEnd = async (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
        const offset = info.offset.x;
        const velocity = info.velocity.x;

        // Swipe Left to Delete (Skip)
        if (offset < -100 || (offset < -50 && velocity < -500)) {
            await controls.start({ x: -200, opacity: 0 }); // Don't fly off too far, just fade
            deleteTimelineTask(task.id);
            toast("Task skipped", {
                description: task.title,
                action: {
                    label: "Undo",
                    onClick: () => {
                        // We need to re-add the task. 
                        // Note: We need addTimelineTask from store.
                        useAppStore.getState().addTimelineTask(task);
                    }
                }
            });
        }
        // Swipe Right to Complete
        else if (offset > 100 || (offset > 50 && velocity > 500)) {
            // Toggle completion (Undoing if already completed)
            const newCompleted = !task.completed;
            updateTimelineTask({ ...task, completed: newCompleted });

            if (newCompleted) {
                toast.success("Task completed!", {
                    description: "Great work keeping the flow.",
                    action: {
                        label: "Notify Friends",
                        onClick: () => {
                            useAppStore.getState().pingFriends(`Completed a task`);
                            toast.success("Friends notified! 🚀");
                        }
                    }
                });
            } else {
                toast.info("Task reset.", { description: "Marked as pending again." });
            }

            // Bounce back
            controls.start({ x: 0 });
        } else {
            controls.start({ x: 0 });
        }
    };

    return (
        <div className={cn("relative", className)}>
            {/* Background Layer: Left=Delete (Red), Right=Complete (Green) */}
            <div className="absolute inset-0 flex items-center justify-between px-6 rounded-2xl bg-muted/20">
                {/* Complete/Undo Indicator (Visible when swiping right) */}
                <div className="flex items-center text-green-600 bg-green-100/80 dark:bg-green-900/40 p-2 rounded-full opacity-60">
                    {task.completed ? <RotateCcw className="h-6 w-6" /> : <Check className="h-6 w-6" />}
                </div>
                {/* Delete Indicator (Visible when swiping left) */}
                <div className="flex items-center text-red-500 bg-red-100/80 dark:bg-red-900/40 p-2 rounded-full opacity-60">
                    <Trash2 className="h-6 w-6" />
                </div>
            </div>

            {/* Foreground Layer (Task Card) */}
            <motion.div
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.7} // Allow dragging both ways
                onDragEnd={handleDragEnd}
                animate={controls}
                whileTap={{ cursor: "grabbing" }}
                onDoubleClick={(e) => {
                    e.stopPropagation();
                    const newCompleted = !task.completed;
                    updateTimelineTask({ ...task, completed: newCompleted });
                    toast.info(newCompleted ? "Task completed" : "Task reset");
                }}
                className="relative bg-background rounded-2xl z-10 overflow-hidden"
            >
                <div className="absolute inset-0 z-0 pointer-events-none">
                    {/* Optional: Add a subtle overlay if completed */}
                    <div className={cn("absolute inset-0 bg-sage-50/50 dark:bg-sage-900/10 transition-opacity", task.completed ? "opacity-100" : "opacity-0")} />
                </div>

                <div className="relative z-10">
                    {children}
                </div>


            </motion.div>
        </div>
    );
}
