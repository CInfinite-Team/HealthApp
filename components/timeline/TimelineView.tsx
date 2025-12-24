"use client";

import { TimelineTask } from "@/types";
import { cn } from "@/lib/utils";
import { Clock, MoreVertical, Share2, Check, RotateCcw } from "lucide-react";
import { TimelineTaskDrawer } from "./TimelineTaskDrawer";
import { SwipeableTask } from "./SwipeableTask";
import { useState } from "react";
import { Button } from "../ui/button";
import { OptionsDrawer } from "../ui/OptionsDrawer";
import { useAppStore } from "@/store/useAppStore";
import { toast } from "sonner";

export function TimelineView({ tasks }: { tasks: TimelineTask[] }) {
    const [activeTask, setActiveTask] = useState<TimelineTask | null>(null);
    if (tasks.length === 0) {
        return (
            <div className="text-center text-sage-500/60 py-10 flex flex-col items-center">
                <Clock className="h-10 w-10 mb-2 opacity-50" />
                <p>No plans for today. Relax!</p>
            </div>
        );
    }

    // Sort tasks by time
    const sortedTasks = [...tasks].sort((a, b) => a.time.localeCompare(b.time));

    return (
        <div className="relative pl-4 ml-2 space-y-6">
            {/* Vertical Line */}
            <div className="absolute left-[19px] top-2 bottom-2 w-0.5 bg-sage-200 dark:bg-sage-800" />

            {sortedTasks.map(task => (
                <div key={task.id} className="relative pl-10 group">
                    {/* Dot Indicator */}
                    <div className={cn(
                        "absolute left-[13px] top-3 h-3.5 w-3.5 rounded-full border-[3px] border-background z-10 transition-colors",
                        task.completed ? "bg-sage-500" : "bg-sage-300 dark:bg-sage-700"
                    )} />

                    <TimelineTaskDrawer task={task}>
                        <div className="flex flex-col cursor-pointer text-left w-full pr-4">
                            <span className="text-xs font-mono text-sage-500 font-semibold pl-1 mb-1">{task.time}</span>

                            <SwipeableTask task={task} className="w-full">
                                <div className={cn(
                                    "bg-card p-4 rounded-2xl shadow-sm border border-border/50 transition-all hover:shadow-md hover:border-sage-300 active:scale-[0.98] w-full pr-12 relative", // Added relative
                                    task.completed && "opacity-60 grayscale"
                                )}>
                                    <h4 className={cn(
                                        "font-semibold text-foreground",
                                        task.completed && "line-through text-muted-foreground/80"
                                    )}>{task.title}</h4>
                                    {task.type !== 'todo' && (
                                        <span className="text-[10px] uppercase tracking-wider text-sage-500 mt-1 block">
                                            {task.type}
                                        </span>
                                    )}

                                    {/* Options Menu Trigger */}
                                    <div className="absolute right-2 top-1/2 -translate-y-1/2">
                                        <div onClick={(e) => {
                                            e.stopPropagation();
                                            e.preventDefault();
                                            setActiveTask(task);
                                        }}>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-sage-600">
                                                <MoreVertical className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </SwipeableTask>

                        </div>
                    </TimelineTaskDrawer>
                </div>
            ))}

            {/* Options Drawer */}
            <OptionsDrawer
                open={!!activeTask}
                onOpenChange={(open) => !open && setActiveTask(null)}
                title={activeTask?.title}
                options={[
                    {
                        label: activeTask?.completed ? 'Mark as Incomplete' : 'Complete Task',
                        icon: activeTask?.completed ? RotateCcw : Check,
                        onClick: () => {
                            if (activeTask) {
                                const newCompleted = !activeTask.completed;
                                useAppStore.getState().updateTimelineTask({ ...activeTask, completed: newCompleted });
                                toast.info(newCompleted ? "Task completed" : "Task reset");
                            }
                        }
                    },
                    {
                        label: 'Share with Friends',
                        icon: Share2,
                        onClick: () => {
                            useAppStore.getState().pingFriends(`Shared task: ${activeTask?.title}`);
                            toast.success("Shared with friends!");
                        }
                    },
                ]}
            />
        </div>
    )
}
