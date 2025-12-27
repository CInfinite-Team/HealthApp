"use client";

import { useAppStore } from "@/store/useAppStore";
import { Button } from "@/components/ui/button";
import { Pill, Plus, DollarSign, TrendingDown, MoreVertical, Trash2, Edit2, Share2, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { AddSupplement } from "./AddSupplement";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { OptionsDrawer } from "@/components/ui/OptionsDrawer";

export function SupplementList() {
    const { supplements, takeSupplement, deleteSupplement } = useAppStore();
    const [costFilter, setCostFilter] = useState<'daily' | 'weekly' | 'monthly'>('monthly');
    const [categoryFilter, setCategoryFilter] = useState<'all' | 'vital' | 'non-vital'>('all');
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [optionsOpenId, setOptionsOpenId] = useState<string | null>(null);
    const [editSupp, setEditSupp] = useState<any>(null);

    const handleTake = (id: string, name: string) => {
        takeSupplement(id);
        toast.success(`Took ${name}`, { description: "Inventory updated." });
    };

    // --- Calculations ---
    const filteredSupplements = supplements.filter(s => {
        if (categoryFilter === 'all') return true;
        if (categoryFilter === 'vital') return s.category === 'vital';
        return s.category !== 'vital';
    });

    const totalMonthlyCost = filteredSupplements.reduce((acc, supp) => {
        const costPerPill = supp.pillsPerBottle > 0 ? (supp.costPerBottle / supp.pillsPerBottle) : 0;
        const dailyCost = costPerPill * (supp.frequency || 1);
        return acc + (dailyCost * 30);
    }, 0);

    const displayCost = costFilter === 'daily' ? totalMonthlyCost / 30
        : costFilter === 'weekly' ? (totalMonthlyCost / 30) * 7
            : totalMonthlyCost;

    const lowStockCount = filteredSupplements.filter(s => {
        const daysLeft = Math.floor(s.stock / (s.frequency || 1));
        return daysLeft <= 7;
    }).length;

    // --- Categorization ---
    const vitalSupps = filteredSupplements.filter(s => s.category === 'vital');
    const nonVitalSupps = filteredSupplements.filter(s => s.category !== 'vital'); // Default or explicitly non-vital

    const renderSupplementCard = (supp: any) => {
        const daysLeft = Math.floor(supp.stock / (supp.frequency || 1));
        const progress = Math.min(100, (supp.stock / (supp.pillsPerBottle || 30)) * 100);

        const isLowStock = daysLeft <= 7;

        return (
            <div key={supp.id} className="relative group p-4 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-sm">
                {/* Options Trigger */}
                <div className="absolute top-3 right-3 z-10">
                    <button
                        onClick={() => setOptionsOpenId(supp.id)}
                        className="p-1 text-muted-foreground hover:text-foreground rounded-full hover:bg-muted/50"
                    >
                        <MoreVertical className="h-4 w-4" />
                    </button>
                </div>

                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3 pr-8">
                        <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center",
                            supp.category === 'vital' ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/20" : "bg-sage-100 text-sage-600 dark:bg-emerald-900/10")}>
                            <Pill className="h-5 w-5" />
                        </div>
                        <div>
                            <h4 className="font-bold text-base">{supp.name}</h4>
                            <p className="text-xs text-muted-foreground font-medium">
                                {supp.dosage} • {supp.frequency}x daily
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between mb-3">
                    <Button
                        size="sm"
                        className="rounded-full h-8 px-6 bg-emerald-500 hover:bg-emerald-600 text-white font-medium shadow-emerald-200 dark:shadow-none w-full"
                        onClick={() => handleTake(supp.id, supp.name)}
                        disabled={supp.stock === 0}
                    >
                        Take
                    </Button>
                </div>


                <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold text-muted-foreground">
                        <span className={cn(isLowStock && "text-red-500")}>{supp.stock} pills left</span>
                        <span className={cn(isLowStock && "text-red-500")}>{daysLeft} days</span>
                    </div>
                    {/* Progress Bar Custom */}
                    <div className="h-2 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                        <div
                            className={cn("h-full rounded-full transition-all duration-500",
                                isLowStock ? "bg-red-500" : supp.category === 'vital' ? "bg-emerald-500" : "bg-blue-500"
                            )}
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>

                <OptionsDrawer
                    open={optionsOpenId === supp.id}
                    onOpenChange={(open) => !open && setOptionsOpenId(null)}
                    title={supp.name}
                    options={[
                        {
                            label: 'Share',
                            icon: Share2,
                            onClick: () => toast.success("Shared!")
                        },
                        {
                            label: 'Edit',
                            icon: Edit2,
                            onClick: () => setEditSupp(supp)
                        },
                        {
                            label: 'Delete',
                            icon: Trash2,
                            variant: 'destructive',
                            onClick: () => {
                                deleteSupplement(supp.id);
                                toast.success("Supplement deleted");
                            }
                        }
                    ]}
                />
            </div>
        );
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between px-1 gap-4">
                <h3 className="font-bold text-lg text-sage-800 dark:text-sage-200 hidden">Dashboard</h3>
                {/* Filters */}
                <div className="flex items-center bg-gray-100 dark:bg-zinc-800 rounded-full p-1">
                    {(['all', 'vital', 'non-vital'] as const).map(filter => (
                        <button
                            key={filter}
                            onClick={() => setCategoryFilter(filter)}
                            className={cn(
                                "px-3 py-1.5 text-xs font-semibold rounded-full capitalize transition-all",
                                categoryFilter === filter
                                    ? "bg-white dark:bg-zinc-700 text-foreground shadow-sm"
                                    : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            {filter === 'non-vital' ? 'Non-Vital' : filter}
                        </button>
                    ))}
                </div>

                <div className="ml-auto">
                    {/* Add Trigger */}
                    <AddSupplement>
                        <Button className="h-9 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white gap-1.5 px-4 shadow-lg shadow-emerald-100 dark:shadow-none">
                            <Plus className="h-4 w-4" /> Add
                        </Button>
                    </AddSupplement>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-sage-50 dark:bg-zinc-900/50 p-4 rounded-[20px] border border-sage-100 dark:border-white/5">
                    <div className="flex flex-col h-full justify-between gap-4">
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-1.5 text-sage-500 text-xs font-semibold uppercase tracking-wide">
                                <DollarSign className="h-3.5 w-3.5" />
                                <div className="relative">
                                    <button
                                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                                        className="flex items-center gap-1 hover:text-sage-700 transition-colors"
                                    >
                                        {costFilter === 'daily' ? 'Daily Cost' :
                                            costFilter === 'weekly' ? 'Weekly Cost' : 'Monthly Cost'}
                                        <ChevronDown className={cn("h-3 w-3 transition-transform", isFilterOpen && "rotate-180")} />
                                    </button>

                                    <AnimatePresence>
                                        {isFilterOpen && (
                                            <>
                                                <div
                                                    className="fixed inset-0 z-10"
                                                    onClick={() => setIsFilterOpen(false)}
                                                />
                                                <motion.div
                                                    initial={{ opacity: 0, y: -10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -10 }}
                                                    className="absolute top-full left-0 mt-2 w-36 bg-white dark:bg-zinc-800 rounded-xl shadow-xl border border-sage-100 dark:border-zinc-700 z-20 py-1 overflow-hidden"
                                                >
                                                    {(['daily', 'weekly', 'monthly'] as const).map((option) => (
                                                        <button
                                                            key={option}
                                                            onClick={() => {
                                                                setCostFilter(option);
                                                                setIsFilterOpen(false);
                                                            }}
                                                            className={cn(
                                                                "w-full text-left px-3 py-2 text-xs font-semibold hover:bg-sage-50 dark:hover:bg-zinc-700/50 transition-colors",
                                                                costFilter === option ? "text-emerald-600 bg-sage-50/50" : "text-muted-foreground"
                                                            )}
                                                        >
                                                            {option.charAt(0).toUpperCase() + option.slice(1)} Cost
                                                        </button>
                                                    ))}
                                                </motion.div>
                                            </>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        </div>
                        <div className="text-3xl font-bold font-mono text-sage-900 dark:text-sage-100 tracking-tight">
                            ${displayCost.toFixed(2)}
                        </div>
                    </div>
                </div>

                <div className="bg-sage-50 dark:bg-emerald-900/10 p-4 rounded-[20px] border border-sage-100 dark:border-emerald-900/20">
                    <div className="flex flex-col h-full justify-between gap-4">
                        <div className="flex items-center gap-1.5 text-sage-600/80 text-xs font-semibold uppercase tracking-wide">
                            <TrendingDown className="h-3.5 w-3.5 text-emerald-600" /> Next Restock
                        </div>
                        {filteredSupplements.length > 0 ? (() => {
                            // Find the supplement running out soonest, prioritizing Vital
                            const soonest = [...filteredSupplements].sort((a, b) => {
                                const daysA = Math.floor(a.stock / (a.frequency || 1));
                                const daysB = Math.floor(b.stock / (b.frequency || 1));

                                // If something is critically low (<= 3 days), prioritize it regardless of category
                                const criticalA = daysA <= 3;
                                const criticalB = daysB <= 3;
                                if (criticalA && !criticalB) return -1;
                                if (!criticalA && criticalB) return 1;

                                // Otherwise, prioritize Vital supplements ("Meds")
                                if (a.category === 'vital' && b.category !== 'vital') return -1;
                                if (a.category !== 'vital' && b.category === 'vital') return 1;

                                return daysA - daysB;
                            })[0];

                            const daysLeft = Math.floor(soonest.stock / (soonest.frequency || 1));

                            return (
                                <div>
                                    <div className={cn("text-3xl font-bold font-mono tracking-tight",
                                        daysLeft <= 3 ? "text-red-500" :
                                            daysLeft <= 7 ? "text-orange-500" :
                                                "text-emerald-700 dark:text-emerald-400"
                                    )}>
                                        {daysLeft === 0 ? "Today" : daysLeft === 1 ? "Tomorrow" : `In ${daysLeft} days`}
                                    </div>
                                    <div className="text-xs text-muted-foreground mt-1 font-medium truncate">
                                        for {soonest.name}
                                    </div>
                                </div>
                            );
                        })() : (
                            <div className="text-3xl font-bold font-mono text-emerald-700 dark:text-emerald-400 tracking-tight">
                                -
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* VITAL Section */}
            {vitalSupps.length > 0 && (
                <div className="space-y-3">
                    <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest px-1">Vital</h4>
                    <div className="grid grid-cols-1 gap-3">
                        {vitalSupps.map(renderSupplementCard)}
                    </div>
                </div>
            )}

            {/* NON-VITAL Section */}
            {nonVitalSupps.length > 0 && (
                <div className="space-y-3">
                    <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest px-1 mt-2">Non-Vital</h4>
                    <div className="grid grid-cols-1 gap-3">
                        {nonVitalSupps.map(renderSupplementCard)}
                    </div>
                </div>
            )}

            {supplements.length === 0 && (
                <div className="text-center py-12 opacity-50">
                    <Pill className="h-12 w-12 mx-auto mb-3 text-sage-300" />
                    <p>No supplements in your stack.</p>
                </div>
            )}

            {/* Edit Drawer (Controlled) */}
            {editSupp && (
                <AddSupplement
                    supplementToEdit={editSupp}
                    open={true}
                    onOpenChange={(open) => !open && setEditSupp(null)}
                />
            )}
        </div>
    );
}
