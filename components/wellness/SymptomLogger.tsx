"use client";

import { Drawer } from "vaul";
import { Button } from "@/components/ui/button";
import { Plus, Activity, Utensils, GlassWater, Trash2, Zap, Heart, Moon, Brain, Thermometer, Coffee, Sun, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import { useAppStore } from "@/store/useAppStore";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { HealthLog } from "@/types";

interface SymptomLoggerProps {
    children?: React.ReactNode;
    defaultType?: 'symptom' | 'food' | 'biomarker' | 'supplement';
    fixedType?: 'symptom' | 'food' | 'biomarker' | 'supplement';
    logToEdit?: HealthLog;
    onClose?: () => void;
    date?: Date;
    inline?: boolean;
}

export function SymptomLogger({ children, defaultType = 'symptom', fixedType, logToEdit, onClose, date, inline }: SymptomLoggerProps) {
    const { addHealthLog, updateHealthLog } = useAppStore();
    const [open, setOpen] = useState(false);

    const [label, setLabel] = useState("");
    const initialType = fixedType || defaultType;
    const [type, setType] = useState<'symptom' | 'food' | 'biomarker' | 'supplement'>(initialType);
    const [severity, setSeverity] = useState(3); // 1-5
    const [time, setTime] = useState("");
    const [notes, setNotes] = useState("");
    const [mealType, setMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('breakfast');

    // Initialize/Reset form
    useEffect(() => {
        if (open || inline) {
            if (logToEdit) {
                setLabel(logToEdit.label);
                setType(logToEdit.type);
                if (logToEdit.severity) setSeverity(logToEdit.severity);
                setTime(logToEdit.time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }));
                setNotes(logToEdit.notes || "");
                if (logToEdit.mealType) setMealType(logToEdit.mealType);
            } else {
                // Don't reset if just switching inline/drawer context, only on open
                if (!inline || (inline && !label)) { // Simple check to avoid clearing while typing if effect re-runs
                    // Actually better logic: Reset when 'open' becomes true (Drawer) or on mount (Inline)
                }

                // For inline, we might want to manually reset after submit.
            }
        }

        // Initial setup
        if (!label && (open || inline) && !logToEdit) {
            setLabel("");
            if (!fixedType) setType(defaultType);
            setSeverity(3);
            setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }));
            setNotes("");
            setMealType('breakfast');
        }

    }, [open, logToEdit, fixedType, defaultType, inline]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!label) return;

        if (logToEdit) {
            updateHealthLog({
                ...logToEdit,
                type,
                label,
                severity: type === 'symptom' ? severity : undefined,
                mealType: type === 'food' ? mealType : undefined,
                time,
                notes
            });
            toast.success("Log updated!");
        } else {
            const baseDate = date || new Date();
            let finalDate = new Date();
            if (date) {
                finalDate = new Date(date);
            }

            if (time) {
                const [hours, minutes] = time.split(':').map(Number);
                finalDate.setHours(hours, minutes);
            }

            addHealthLog({
                id: crypto.randomUUID(),
                date: finalDate.toISOString(),
                type,
                label,
                severity: type === 'symptom' ? severity : undefined,
                mealType: type === 'food' ? mealType : undefined,
                time,
                notes
            });
            toast.success("Log added!");
        }

        if (!inline) {
            setOpen(false);
        } else {
            // Reset form for inline usage
            setLabel("");
            setNotes("");
            // Keep mealType same or reset? Maybe keep same for rapid logging.
        }

        if (onClose) onClose();
    };

    const FormContent = (
        <div className={cn("bg-background flex flex-col h-auto outline-none w-full", !inline && "rounded-t-[20px] max-h-[90vh] fixed bottom-0 left-0 right-0 z-50 border-t border-sage-200 dark:border-zinc-800")}>
            <div className={cn("overflow-y-auto pb-safe w-full", !inline ? "p-4 bg-muted/10 rounded-t-[20px]" : "p-0")}>
                {!inline && <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-sage-200 mb-6" />}

                <div className={cn("max-w-md mx-auto w-full", inline && "max-w-full")}>
                    <h2 className="text-xl font-bold mb-4 font-serif">
                        {logToEdit ? "Edit Entry" : (fixedType === 'food' ? "Log a Meal" : fixedType === 'symptom' ? "Log Symptom" : "Log Health Event")}
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Type Selection (Only if not fixed) */}
                        {(!fixedType) && (
                            <div className="flex gap-2">
                                {[
                                    { id: 'symptom', icon: Activity, label: 'Symptom' },
                                    { id: 'food', icon: Utensils, label: 'Food' },
                                    { id: 'biomarker', icon: GlassWater, label: 'Water/Bio' }
                                ].map((t) => (
                                    <button
                                        key={t.id}
                                        type="button"
                                        onClick={() => setType(t.id as any)}
                                        className={cn(
                                            "flex-1 flex flex-col items-center p-3 rounded-xl border border-border transition-all",
                                            type === t.id ? "bg-sage-100 border-sage-500 text-sage-800 dark:bg-sage-900 dark:text-sage-200" : "bg-card hover:bg-muted"
                                        )}
                                    >
                                        <t.icon className="h-5 w-5 mb-1.5" />
                                        <span className="text-xs font-medium">{t.label}</span>
                                    </button>
                                ))}
                            </div>
                        )}

                        {type === 'symptom' && (
                            <div className="space-y-3 mb-4">
                                <label className="text-xs font-medium uppercase text-muted-foreground">How are you feeling?</label>
                                <div className="flex flex-wrap gap-2">
                                    {[
                                        { label: 'Fatigue', icon: Zap },
                                        { label: 'Pain', icon: Heart },
                                        { label: 'Sleep Issues', icon: Moon },
                                        { label: 'Brain Fog', icon: Brain },
                                        { label: 'Inflammation', icon: Thermometer },
                                    ].map((s) => (
                                        <button
                                            key={s.label}
                                            type="button"
                                            onClick={() => setLabel(s.label)}
                                            className={cn(
                                                "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all",
                                                label === s.label
                                                    ? "bg-sage-100 border-sage-500 text-sage-800 dark:bg-sage-900 dark:border-sage-700 dark:text-sage-200"
                                                    : "bg-background border-border hover:bg-muted text-muted-foreground"
                                            )}
                                        >
                                            <s.icon className="h-3.5 w-3.5" />
                                            {s.label}
                                        </button>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={() => setLabel("")}
                                        className={cn(
                                            "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border border-dashed transition-all hover:bg-muted text-muted-foreground",
                                            !["Fatigue", "Pain", "Sleep Issues", "Brain Fog", "Inflammation"].includes(label) && label !== "" ? "border-sage-500 text-sage-800" : ""
                                        )}
                                    >
                                        <Plus className="h-3.5 w-3.5" />
                                        Custom
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* MEAL TYPE SELECTION */}
                        {type === 'food' && (
                            <div className="grid grid-cols-4 gap-2 mb-6">
                                {[
                                    { id: 'breakfast', label: 'Breakfast', icon: Coffee },
                                    { id: 'lunch', label: 'Lunch', icon: Sun },
                                    { id: 'dinner', label: 'Dinner', icon: Moon },
                                    { id: 'snack', label: 'Snack', icon: Sparkles },
                                ].map((m) => (
                                    <button
                                        key={m.id}
                                        type="button"
                                        onClick={() => setMealType(m.id as any)}
                                        className={cn(
                                            "flex flex-col items-center justify-center p-1 rounded-xl border transition-all h-16",
                                            mealType === m.id
                                                ? "bg-emerald-500 border-emerald-600 text-white shadow-lg shadow-emerald-200 dark:shadow-none"
                                                : "bg-card hover:bg-emerald-50/50 dark:hover:bg-zinc-800 border-border"
                                        )}
                                    >
                                        <m.icon className={cn("h-4 w-4 mb-1", mealType === m.id ? "text-white" : "text-muted-foreground", "transition-colors")} />
                                        <span className={cn("text-[8px] font-bold uppercase tracking-wider", mealType === m.id ? "text-white" : "text-muted-foreground", "transition-colors")}>{m.label}</span>
                                    </button>
                                ))}
                            </div>
                        )}

                        <div className="flex gap-3">
                            {/* Time Input */}
                            <div className="w-32 shrink-0 space-y-2">
                                <label className="text-xs font-medium uppercase text-muted-foreground">Time</label>
                                <Input
                                    type="time"
                                    value={time}
                                    onChange={(e) => setTime(e.target.value)}
                                    className="h-12 text-center px-0 bg-muted/20 text-sm"
                                />
                            </div>

                            {/* Main Label Input */}
                            <div className="flex-1 space-y-2">
                                <label className="text-xs font-medium uppercase text-muted-foreground">
                                    {type === 'food' ? "What did you eat?" : type === 'symptom' ? "Symptom" : "Detail"}
                                </label>
                                <Input
                                    placeholder={
                                        type === 'food' ? "e.g. Avocado Toast" :
                                            type === 'symptom' ? "e.g. Headache" :
                                                "e.g. 500ml Water"
                                    }
                                    value={label}
                                    onChange={(e) => setLabel(e.target.value)}
                                    className="h-12 text-base bg-muted/20"
                                    autoFocus={!inline}
                                />
                            </div>
                        </div>

                        {/* Severity (Only for Symptom) */}
                        {type === 'symptom' && (
                            <div className="space-y-2">
                                <label className="text-xs font-medium uppercase text-muted-foreground">Severity (1-5)</label>
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map((s) => (
                                        <button
                                            key={s}
                                            type="button"
                                            onClick={() => setSeverity(s)}
                                            className={cn(
                                                "h-10 w-10 rounded-full flex items-center justify-center border font-bold transition-all",
                                                severity === s ? "bg-emerald-500 text-white border-emerald-600 scale-110 shadow-md" : "bg-card hover:bg-muted"
                                            )}
                                        >
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Notes Input */}
                        <div className="space-y-2">
                            <label className="text-xs font-medium uppercase text-muted-foreground">Notes (Optional)</label>
                            <textarea
                                className="flex w-full rounded-md border border-input bg-muted/20 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-[80px]"
                                placeholder={type === 'food' ? "How did it make you feel?" : "Any details to add..."}
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                            />
                        </div>

                        <Button type="submit" className="w-full h-12 rounded-xl text-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-md">
                            {logToEdit ? "Update Entry" : (type === 'food' ? "Log Meal" : "Save Entry")}
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );

    if (inline) {
        return <div className="w-full">{FormContent}</div>;
    }

    return (
        <Drawer.Root open={open} onOpenChange={setOpen}>
            <Drawer.Trigger asChild>{children}</Drawer.Trigger>
            <Drawer.Portal>
                <Drawer.Overlay className="fixed inset-0 bg-black/40 z-50 backdrop-blur-sm" />
                {FormContent}
            </Drawer.Portal>
        </Drawer.Root>
    );
}
