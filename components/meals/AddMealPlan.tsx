"use client";

import { useState, useEffect } from "react";
import { Drawer } from "vaul";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label"; // Not found
// import { Textarea } from "@/components/ui/textarea"; // Not found
import { cn } from "@/lib/utils";
import { ArrowLeft, Check, ChevronRight, X, Calendar, Clock, Utensils, Repeat } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { toast } from "sonner";
import { MealPlan } from "@/types";

const DAYS = [
    { id: 0, label: 'S', name: 'Sunday' },
    { id: 1, label: 'M', name: 'Monday' },
    { id: 2, label: 'T', name: 'Tuesday' },
    { id: 3, label: 'W', name: 'Wednesday' },
    { id: 4, label: 'T', name: 'Thursday' },
    { id: 5, label: 'F', name: 'Friday' },
    { id: 6, label: 'S', name: 'Saturday' },
];

interface AddMealPlanProps {
    children?: React.ReactNode;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    planToEdit?: MealPlan;
}

export function AddMealPlan({ children, open: controlledOpen, onOpenChange: setControlledOpen, planToEdit }: AddMealPlanProps) {
    const { addMealPlan, updateMealPlan } = useAppStore();
    const [internalOpen, setInternalOpen] = useState(false);

    const isControlled = controlledOpen !== undefined;
    const open = isControlled ? controlledOpen : internalOpen;
    const setOpen = isControlled ? setControlledOpen! : setInternalOpen;

    const [step, setStep] = useState(1);
    const [name, setName] = useState("");
    const [mealType, setMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('breakfast');
    const [time, setTime] = useState("");
    const [frequency, setFrequency] = useState<'daily' | 'alternate' | 'custom'>('daily');
    const [selectedDays, setSelectedDays] = useState<number[]>([0, 1, 2, 3, 4, 5, 6]);

    // Portion Logic
    const [portionMode, setPortionMode] = useState<'simple' | 'advanced'>('simple');
    const [simplePortion, setSimplePortion] = useState("");
    const [dailyPortions, setDailyPortions] = useState<Record<number, string>>({});

    useEffect(() => {
        if (open) {
            if (planToEdit) {
                setName(planToEdit.name);
                setMealType(planToEdit.mealType);
                setTime(planToEdit.time || "");
                setFrequency(planToEdit.frequency);
                setSelectedDays(planToEdit.selectedDays);
                setDailyPortions(planToEdit.portions || {});

                // Determine mode based on if all portions are same
                const uniquePortions = new Set(Object.values(planToEdit.portions || {}));
                if (uniquePortions.size <= 1) {
                    setPortionMode('simple');
                    setSimplePortion(Object.values(planToEdit.portions || {})[0] || "");
                } else {
                    setPortionMode('advanced');
                }
            } else {
                resetForm();
            }
        }
    }, [open, planToEdit]);

    const resetForm = () => {
        setStep(1);
        setName("");
        setMealType('breakfast');
        setTime("");
        setFrequency('daily');
        setSelectedDays([0, 1, 2, 3, 4, 5, 6]);
        setPortionMode('simple');
        setSimplePortion("");
        setDailyPortions({});
    };

    const handleFrequencyChange = (freq: 'daily' | 'alternate' | 'custom') => {
        setFrequency(freq);
        if (freq === 'daily') setSelectedDays([0, 1, 2, 3, 4, 5, 6]);
        if (freq === 'alternate') setSelectedDays([1, 3, 5]); // Mon, Wed, Fri default
        if (freq === 'custom') setSelectedDays([]);
    };

    const toggleDay = (dayId: number) => {
        if (selectedDays.includes(dayId)) {
            setSelectedDays(selectedDays.filter(d => d !== dayId));
        } else {
            setSelectedDays([...selectedDays, dayId].sort());
        }
    };

    const handleSave = () => {
        if (!name.trim()) return toast.error("Please enter a meal name");
        if (selectedDays.length === 0) return toast.error("Please select at least one day");

        // Construct portions map
        let finalPortions: Record<number, string> = {};
        if (portionMode === 'simple') {
            selectedDays.forEach(d => {
                finalPortions[d] = simplePortion;
            });
        } else {
            finalPortions = { ...dailyPortions };
            // Ensure only selected days are kept? Or keep all just in case.
            // Let's filter to be clean.
            const cleaned: Record<number, string> = {};
            selectedDays.forEach(d => {
                cleaned[d] = dailyPortions[d] || "";
            });
            finalPortions = cleaned;
        }

        const plan: MealPlan = {
            id: planToEdit ? planToEdit.id : crypto.randomUUID(),
            name,
            mealType,
            time,
            frequency,
            selectedDays,
            portions: finalPortions
        };

        if (planToEdit) {
            updateMealPlan(plan);
            toast.success("Meal plan updated");
        } else {
            addMealPlan(plan);
            toast.success("Meal plan created");
        }
        setOpen(false);
    };

    return (
        <Drawer.Root open={open} onOpenChange={setOpen}>
            <Drawer.Trigger asChild>
                {children}
            </Drawer.Trigger>
            <Drawer.Portal>
                <Drawer.Overlay className="fixed inset-0 bg-black/40 z-50 backdrop-blur-sm" />
                <Drawer.Content className="fixed bottom-0 left-0 right-0 max-h-[96vh] flex flex-col rounded-t-[32px] z-50 focus:outline-none">
                    {/* Glassmorphism Background */}
                    <div className="absolute inset-0 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl rounded-t-[32px] border-t border-white/20 shadow-2xl" />

                    <div className="relative flex-1 flex flex-col p-6 overflow-y-auto">
                        <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-zinc-300 dark:bg-zinc-700 mb-6" />

                        {step === 1 ? (
                            <div className="space-y-6 animate-in slide-in-from-right-8 duration-300">
                                <div>
                                    <label className="text-xs uppercase tracking-widest text-muted-foreground font-bold pl-1">What are you planning?</label>
                                    <Input
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="e.g. Oatmeal & Berries"
                                        className="mt-2 text-2xl font-bold bg-transparent border-none px-0 shadow-none placeholder:text-muted-foreground/30 focus-visible:ring-0 h-auto"
                                        autoFocus
                                    />
                                    <div className="flex items-center gap-2 mt-2">
                                        <Clock className="h-4 w-4 text-emerald-600" />
                                        <Input
                                            type="time"
                                            value={time}
                                            onChange={(e) => setTime(e.target.value)}
                                            className="w-auto h-8 bg-transparent border-none p-0 text-sm font-medium focus-visible:ring-0 text-muted-foreground"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs uppercase tracking-widest text-muted-foreground font-bold pl-1 mb-3 block">Category</label>
                                    <div className="grid grid-cols-4 gap-2">
                                        {(['breakfast', 'lunch', 'dinner', 'snack'] as const).map(type => (
                                            <button
                                                key={type}
                                                onClick={() => setMealType(type)}
                                                className={cn(
                                                    "flex flex-col items-center justify-center p-3 rounded-2xl transition-all border",
                                                    mealType === type
                                                        ? "bg-emerald-500 text-white border-emerald-500 shadow-lg shadow-emerald-200 dark:shadow-none"
                                                        : "bg-muted/30 border-transparent hover:bg-muted"
                                                )}
                                            >
                                                <span className="capitalize text-xs font-bold">{type}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs uppercase tracking-widest text-muted-foreground font-bold pl-1 mb-3 block">When?</label>
                                    <div className="flex bg-muted/30 p-1 rounded-xl mb-4">
                                        {(['daily', 'alternate', 'custom'] as const).map(freq => (
                                            <button
                                                key={freq}
                                                onClick={() => handleFrequencyChange(freq)}
                                                className={cn(
                                                    "flex-1 py-2 text-xs font-bold uppercase rounded-lg transition-all",
                                                    frequency === freq ? "bg-white dark:bg-zinc-800 shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
                                                )}
                                            >
                                                {freq}
                                            </button>
                                        ))}
                                    </div>

                                    {(frequency === 'custom' || frequency === 'alternate') && (
                                        <div className="flex justify-between gap-1">
                                            {DAYS.map(day => (
                                                <button
                                                    key={day.id}
                                                    onClick={() => toggleDay(day.id)}
                                                    className={cn(
                                                        "h-10 w-10 text-xs font-bold rounded-full transition-all flex items-center justify-center",
                                                        selectedDays.includes(day.id)
                                                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200"
                                                            : "bg-transparent text-muted-foreground border border-transparent hover:bg-muted"
                                                    )}
                                                >
                                                    {day.label}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>

                            </div>
                        ) : (
                            <div className="space-y-6 animate-in slide-in-from-right-8 duration-300">
                                <div>
                                    <h3 className="text-xl font-bold mb-1">Portions</h3>
                                    <p className="text-muted-foreground text-sm">How much should you eat?</p>
                                </div>

                                <div className="flex bg-muted/30 p-1 rounded-xl">
                                    <button
                                        onClick={() => setPortionMode('simple')}
                                        className={cn(
                                            "flex-1 py-2 text-xs font-bold uppercase rounded-lg transition-all",
                                            portionMode === 'simple' ? "bg-white dark:bg-zinc-800 shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
                                        )}
                                    >
                                        Same Every Day
                                    </button>
                                    <button
                                        onClick={() => setPortionMode('advanced')}
                                        className={cn(
                                            "flex-1 py-2 text-xs font-bold uppercase rounded-lg transition-all",
                                            portionMode === 'advanced' ? "bg-white dark:bg-zinc-800 shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
                                        )}
                                    >
                                        Variable
                                    </button>
                                </div>

                                {portionMode === 'simple' ? (
                                    <div className="bg-sage-50 dark:bg-white/5 p-6 rounded-3xl border border-sage-100 dark:border-white/5 text-center">
                                        <div className="text-4xl font-mono font-bold text-emerald-800 dark:text-emerald-400 mb-2">
                                            <Input
                                                value={simplePortion}
                                                onChange={(e) => setSimplePortion(e.target.value)}
                                                placeholder="200g"
                                                className="text-center text-4xl h-16 bg-transparent border-none focus-visible:ring-0 placeholder:text-emerald-800/20 dark:placeholder:text-emerald-400/20"
                                            />
                                        </div>
                                        <p className="text-sm text-muted-foreground font-medium">Portion size for all days</p>
                                    </div>
                                ) : (
                                    <div className="space-y-3 max-h-[40vh] overflow-y-auto pr-2">
                                        {selectedDays.sort().map(d => (
                                            <div key={d} className="flex items-center gap-4 bg-card p-3 rounded-xl border">
                                                <div className="w-10 h-10 rounded-full bg-sage-100 dark:bg-white/10 flex items-center justify-center font-bold text-sage-700 dark:text-white">
                                                    {DAYS[d].label}
                                                </div>
                                                <div className="flex-1">
                                                    <span className="text-xs font-medium uppercase text-muted-foreground block mb-1">{DAYS[d].name}</span>
                                                    <Input
                                                        value={dailyPortions[d] || ""}
                                                        onChange={(e) => setDailyPortions(prev => ({ ...prev, [d]: e.target.value }))}
                                                        placeholder="e.g. 200g"
                                                        className="h-8 bg-muted/30"
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="mt-auto pt-6 flex gap-3">
                            {step === 2 && (
                                <Button
                                    variant="outline"
                                    onClick={() => setStep(1)}
                                    className="rounded-full h-12 w-12 p-0 shrink-0"
                                >
                                    <ArrowLeft className="h-5 w-5" />
                                </Button>
                            )}
                            <Button
                                onClick={() => step === 1 ? setStep(2) : handleSave()}
                                className="flex-1 rounded-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base shadow-lg shadow-emerald-200 dark:shadow-none"
                            >
                                {step === 1 ? "Next: Portions" : "Save Plan"}
                                {step === 1 && <ChevronRight className="ml-2 h-4 w-4" />}
                            </Button>
                        </div>
                    </div>
                </Drawer.Content>
            </Drawer.Portal>
        </Drawer.Root>
    );
}
