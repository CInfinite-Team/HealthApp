"use client";

import { motion, useAnimation, PanInfo } from "framer-motion";
import { Habit } from "@/types";
import { useAppStore } from "@/store/useAppStore";
import { Share } from "@capacitor/share";
import { Check, X, Flame, Trash2, Settings2, RotateCcw, MoreVertical, Share2, UserPlus } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { format } from "date-fns";
import { AddHabit } from "./AddHabit";
import { useState } from "react";
import { OptionsDrawer } from "../ui/OptionsDrawer";
import { ConfirmationDrawer } from "../ui/ConfirmationDrawer";

interface HabitCardProps {
    habit: Habit;
    date?: Date;
}

export function HabitCard({ habit, date }: HabitCardProps) {
    const deleteHabit = useAppStore((state) => state.deleteHabit);
    const toggleHabit = useAppStore((state) => state.toggleHabit);
    const controls = useAnimation();

    // Use provided date or fallback to today
    const targetDate = date ? format(date, "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd");
    const isCompleted = habit.completedDates.includes(targetDate);



    const [optionsOpen, setOptionsOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

    const handleDelete = async () => {
        await controls.start({ x: -500, opacity: 0 });
        deleteHabit(habit.id);
        toast.success("Habit deleted", {
            action: {
                label: "Undo",
                onClick: () => useAppStore.getState().addHabit(habit),
            },
        });
    };

    const handleDragEnd = async (_: any, info: PanInfo) => {
        const threshold = 100;
        const velocity = info.velocity.x;

        if (info.offset.x > threshold) {
            // Swipe Right -> Toggle Completion
            toggleHabit(habit.id, targetDate);
            if (!isCompleted) {
                toast.success(`Great job on ${habit.title}!`, {
                    action: {
                        label: "Notify Friends",
                        onClick: () => {
                            useAppStore.getState().pingFriends(`Completed ${habit.title}`);
                            toast.success("Friends notified! 🚀");
                        }
                    }
                });
            } else {
                toast.info(`Marked ${habit.title} as not done.`);
            }
            controls.start({ x: 0 });
        } else if (info.offset.x < -100 || (info.offset.x < -50 && velocity < -500)) {
            // Swipe Left -> Confirm Delete
            controls.start({ x: 0 }); // Snap back
            setDeleteConfirmOpen(true);
        } else {
            controls.start({ x: 0 });
        }
    };

    return (
        <>
            <div className="relative mb-4 group h-20 select-none">
                {/* Background Indicators (Swipe) */}
                <div className="absolute inset-0 bg-muted/50 rounded-2xl flex items-center justify-between px-6 border border-border">
                    <div className="flex items-center text-green-600/60 font-bold">
                        {isCompleted ? <RotateCcw className="h-6 w-6" /> : <Check className="h-6 w-6" />}
                    </div>
                    <div className="flex items-center text-red-500/60 font-bold">
                        <Trash2 className="h-6 w-6" />
                    </div>
                </div>

                {/* Foreground Card */}
                <motion.div
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    onDragEnd={handleDragEnd}
                    animate={controls}
                    whileTap={{ cursor: "grabbing" }}
                    onDoubleClick={() => toggleHabit(habit.id, targetDate)}
                    className={cn(
                        "absolute inset-0 rounded-2xl p-4 flex items-center justify-between shadow-sm cursor-grab active:cursor-grabbing border border-border/50",
                        isCompleted ? "bg-green-50 dark:bg-green-900" : "bg-card"
                    )}
                    style={{ x: 0 }}
                >
                    <div className="flex items-center gap-4">
                        {/* Toggle Button */}
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                toggleHabit(habit.id, targetDate);
                            }}
                            className={cn(
                                "h-12 w-12 rounded-full flex items-center justify-center text-xl transition-colors",
                                isCompleted
                                    ? "bg-emerald-500 text-white"
                                    : cn(habit.color || "bg-sage-100", "text-zinc-700 dark:text-zinc-800")
                            )}
                        >
                            {isCompleted ? <RotateCcw className="h-6 w-6" /> : habit.title.charAt(0)}
                        </button>

                        <div>
                            <h3 className={cn("font-bold text-lg", isCompleted && "line-through text-muted-foreground")}>
                                {habit.title}
                            </h3>
                            <p className="text-xs text-muted-foreground flex items-center">
                                <Flame className="h-3 w-3 mr-1 text-emerald-400" /> {habit.streak} day streak
                            </p>
                        </div>
                    </div>

                    {/* Options Trigger */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setOptionsOpen(true);
                            }}
                            className="p-2 text-muted-foreground hover:text-sage-600 hover:bg-sage-100 rounded-full transition-colors"
                        >
                            <MoreVertical className="h-5 w-5" />
                        </button>
                    </div>
                </motion.div >
            </div >

            {/* Options Drawer */}
            < OptionsDrawer
                open={optionsOpen}
                onOpenChange={setOptionsOpen}
                title={habit.title}
                options={
                    [
                        {
                            label: 'Share Progress',
                            icon: Share2,
                            onClick: () => {
                                useAppStore.getState().pingFriends(`Im on a ${habit.streak} day streak for ${habit.title}!`);
                                toast.success("Progress shared!");
                            }
                        },
                        {
                            label: 'Share with Friend',
                            icon: UserPlus,
                            onClick: async () => {
                                await Share.share({
                                    title: `Join me in ${habit.title}!`,
                                    text: `I'm building a new habit: ${habit.title}. Join me on HealthApp and let's track it together!`,
                                    dialogTitle: 'Share Habit'
                                });
                            }
                        },
                        {
                            label: 'Edit Habit',
                            icon: Settings2,
                            onClick: () => setEditOpen(true)
                        },
                        {
                            label: 'Delete Habit',
                            icon: Trash2,
                            variant: 'destructive',
                            onClick: () => setDeleteConfirmOpen(true)
                        }
                    ]}
            />

            {/* Edit Drawer (controlled by local state now) */}
            < AddHabit
                habitToEdit={habit}
                open={editOpen}
                onOpenChange={setEditOpen}
                noTrigger
            />

            {/* Delete Confirmation Drawer */}
            < ConfirmationDrawer
                open={deleteConfirmOpen}
                onOpenChange={setDeleteConfirmOpen}
                title={`Delete ${habit.title}?`
                }
                description="This will permanently delete this habit and all its history. This action cannot be undone."
                onConfirm={handleDelete}
                confirmLabel="Delete Habit"
            />
        </>
    );
}
