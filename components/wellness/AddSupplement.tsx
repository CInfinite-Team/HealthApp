import { Drawer } from "vaul";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState, useEffect } from "react";
import { useAppStore } from "@/store/useAppStore";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Supplement } from "@/types";

interface AddSupplementProps {
    children?: React.ReactNode;
    supplementToEdit?: Supplement | null;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}

export function AddSupplement({ children, supplementToEdit, open: controlledOpen, onOpenChange }: AddSupplementProps) {
    const { addSupplement, updateSupplement } = useAppStore();
    const [internalOpen, setInternalOpen] = useState(false);

    // Controlled vs Uncontrolled
    const isControlled = controlledOpen !== undefined;
    const isOpen = isControlled ? controlledOpen : internalOpen;
    const setIsOpen = isControlled ? onOpenChange : setInternalOpen;

    const [name, setName] = useState("");
    const [dosage, setDosage] = useState("");
    const [stock, setStock] = useState("30");
    const [cost, setCost] = useState("");
    const [pillsPerBottle, setPillsPerBottle] = useState("");
    const [frequency, setFrequency] = useState("1");
    const [category, setCategory] = useState<'vital' | 'non-vital'>("vital");

    // Initialize with data if editing
    useEffect(() => {
        if (isOpen && supplementToEdit) {
            setName(supplementToEdit.name);
            setDosage(supplementToEdit.dosage);
            setStock(supplementToEdit.stock.toString());
            setCost(supplementToEdit.costPerBottle.toString());
            setPillsPerBottle(supplementToEdit.pillsPerBottle.toString());
            setFrequency((supplementToEdit.frequency || 1).toString());
            setCategory(supplementToEdit.category || "vital");
        } else if (isOpen && !supplementToEdit) {
            // Reset if opening in add mode and not edit mode (though typically cleared on submit/close)
            setName("");
            setDosage("");
            setStock("30");
            setCost("");
            setPillsPerBottle("");
            setFrequency("1");
            setCategory("vital");
        }
    }, [isOpen, supplementToEdit]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name) return;

        const supplementData = {
            id: supplementToEdit ? supplementToEdit.id : crypto.randomUUID(),
            name,
            dosage: dosage || "1 pill",
            stock: parseInt(stock) || 0,
            costPerBottle: parseFloat(cost) || 0,
            pillsPerBottle: parseInt(pillsPerBottle) || parseInt(stock) || 30,
            frequency: parseInt(frequency) || 1,
            category
        };

        if (supplementToEdit) {
            updateSupplement(supplementData);
            toast.success("Supplement updated!");
        } else {
            addSupplement(supplementData);
            toast.success("Supplement added!");
        }

        if (setIsOpen) setIsOpen(false);

        // Reset form if unlikely to reopen same instance immediately or for next "Add" usage
        if (!supplementToEdit) {
            setName("");
            setDosage("");
            setStock("30");
            setCost("");
            setPillsPerBottle("");
            setFrequency("1");
            setCategory("vital");
        }
    };

    return (
        <Drawer.Root open={isOpen} onOpenChange={setIsOpen}>
            {children && <Drawer.Trigger asChild>{children}</Drawer.Trigger>}
            <Drawer.Portal>
                <Drawer.Overlay className="fixed inset-0 bg-black/40 z-50 backdrop-blur-sm" />
                <Drawer.Content className="bg-background flex flex-col rounded-t-[20px] max-h-[90vh] h-auto fixed bottom-0 left-0 right-0 z-50 border-t border-sage-200 dark:border-zinc-800 outline-none">
                    <div className="p-4 bg-muted/10 rounded-t-[20px] overflow-y-auto pb-safe">
                        <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-sage-200 mb-6" />

                        <div className="max-w-md mx-auto">
                            <h2 className="text-xl font-bold mb-4 font-serif">
                                {supplementToEdit ? "Edit Supplement" : "Add Supplement"}
                            </h2>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Name</label>
                                    <Input
                                        placeholder="e.g. Magnesium Glycinate"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="h-11 bg-muted/20"
                                        autoFocus={!supplementToEdit}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Dosage</label>
                                        <Input
                                            placeholder="e.g. 200mg"
                                            value={dosage}
                                            onChange={(e) => setDosage(e.target.value)}
                                            className="h-11 bg-muted/20"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Daily Frequency</label>
                                        <Input
                                            type="number"
                                            placeholder="Times/day"
                                            value={frequency}
                                            onChange={(e) => setFrequency(e.target.value)}
                                            className="h-11 bg-muted/20"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Current Stock</label>
                                        <Input
                                            type="number"
                                            value={stock}
                                            onChange={(e) => setStock(e.target.value)}
                                            className="h-11 bg-muted/20"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Total Pills/Bottle</label>
                                        <Input
                                            type="number"
                                            placeholder="e.g. 90"
                                            value={pillsPerBottle}
                                            onChange={(e) => setPillsPerBottle(e.target.value)}
                                            className="h-11 bg-muted/20"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Cost ($)</label>
                                        <Input
                                            type="number"
                                            placeholder="0.00"
                                            value={cost}
                                            onChange={(e) => setCost(e.target.value)}
                                            className="h-11 bg-muted/20"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Priority</label>
                                        <div className="flex bg-muted/20 p-1 rounded-lg">
                                            <button
                                                type="button"
                                                onClick={() => setCategory("vital")}
                                                className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${category === "vital" ? "bg-white shadow-sm text-sage-900" : "text-muted-foreground hover:text-foreground"}`}
                                            >
                                                Vital
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setCategory("non-vital")}
                                                className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${category === "non-vital" ? "bg-white shadow-sm text-sage-900" : "text-muted-foreground hover:text-foreground"}`}
                                            >
                                                Non-Vital
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <Button type="submit" className="w-full h-12 rounded-xl text-lg bg-sage-600 hover:bg-sage-700 text-white mt-4">
                                    {supplementToEdit ? "Save Changes" : "Add to Shelf"}
                                </Button>
                            </form>
                        </div>
                    </div>
                </Drawer.Content>
            </Drawer.Portal>
        </Drawer.Root>
    );
}
