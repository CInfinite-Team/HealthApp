import { Drawer } from "vaul";
import { Button } from "@/components/ui/button";
import { Plus, CheckCircle, Palette, Save, Clock } from "lucide-react";
import { useState, useEffect } from "react";
import { useAppStore } from "@/store/useAppStore";
import { cn } from "@/lib/utils";
import { Habit } from "@/types";

interface AddHabitProps {
    children?: React.ReactNode;
    habitToEdit?: Habit;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    noTrigger?: boolean;
}

export function AddHabit({ children, habitToEdit, open, onOpenChange, noTrigger }: AddHabitProps) {
    const { addHabit, updateHabit } = useAppStore();
    const [internalOpen, setInternalOpen] = useState(false);

    const isControlled = open !== undefined;
    const isOpen = isControlled ? open : internalOpen;
    const setIsOpen = isControlled ? onOpenChange! : setInternalOpen;

    const [title, setTitle] = useState("");
    const [color, setColor] = useState("bg-sage-200");
    const [frequency, setFrequency] = useState<Habit['frequency']>('daily');

    useEffect(() => {
        if (isOpen) {
            if (habitToEdit) {
                setTitle(habitToEdit.title);
                setColor(habitToEdit.color);
                setFrequency(habitToEdit.frequency || 'daily');
            } else {
                setTitle("");
                setColor("bg-sage-200");
                setFrequency('daily');
            }
        }
    }, [isOpen, habitToEdit]);

    const colors = [
        "bg-sage-200", "bg-blue-100", "bg-orange-100", "bg-purple-100", "bg-pink-100", "bg-yellow-100"
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title) return;

        if (habitToEdit) {
            updateHabit({
                ...habitToEdit,
                title,
                color,
                frequency
            });
        } else {
            addHabit({
                id: crypto.randomUUID(),
                title,
                color,
                icon: 'Circle',
                completedDates: [],
                streak: 0,
                frequency
            });
        }

        setIsOpen(false);
        if (!habitToEdit) setTitle("");
    };

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
                <Drawer.Content className="bg-background flex flex-col rounded-t-[10px] max-h-[85vh] h-auto fixed bottom-0 left-0 right-0 z-50 border-t border-sage-100 dark:border-sage-800 outline-none">
                    <div className="p-4 bg-muted/20 rounded-t-[10px] overflow-y-auto pb-safe">
                        <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-muted mb-8" />
                        <div className="max-w-md mx-auto">
                            <h2 className="text-2xl font-serif font-bold text-sage-900 dark:text-sage-100 mb-6">
                                {habitToEdit ? 'Edit Habit' : 'New Habit'}
                            </h2>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-muted-foreground ml-1">Habit Name</label>
                                    <input
                                        autoFocus
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        placeholder="e.g., Read for 15 mins"
                                        className="w-full text-lg p-4 rounded-xl bg-card border border-border focus:ring-2 focus:ring-sage-400 outline-none transition-all placeholder:text-muted-foreground/50"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-muted-foreground ml-1 flex items-center gap-2"><Palette className="h-4 w-4" /> Color Tag</label>
                                    <div className="flex gap-3">
                                        {colors.map(c => (
                                            <button
                                                key={c}
                                                type="button"
                                                onClick={() => setColor(c)}
                                                className={cn(
                                                    "w-8 h-8 rounded-full border border-border shadow-sm transition-transform hover:scale-110",
                                                    c,
                                                    color === c && "ring-2 ring-offset-2 ring-sage-500"
                                                )}
                                            />
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-muted-foreground ml-1 flex items-center gap-2"><Clock className="h-4 w-4" /> Frequency</label>
                                    <div className="flex flex-wrap gap-2">
                                        {(['daily', 'weekdays', 'weekends'] as const).map((f) => (
                                            <button
                                                key={f}
                                                type="button"
                                                onClick={() => setFrequency(f)}
                                                className={cn(
                                                    "px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors capitalize",
                                                    frequency === f
                                                        ? "bg-sage-600 text-white border-sage-600"
                                                        : "bg-transparent text-sage-600 border-sage-200 hover:bg-sage-50"
                                                )}
                                            >
                                                {f}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <Button type="submit" size="lg" className="w-full text-lg font-semibold bg-sage-600 hover:bg-sage-700 h-14 rounded-xl mt-4">
                                    {habitToEdit ? (
                                        <span className="flex items-center gap-2"><Save className="h-5 w-5" /> Save Changes</span>
                                    ) : (
                                        "Create Habit"
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
