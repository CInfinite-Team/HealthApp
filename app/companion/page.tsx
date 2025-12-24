"use client";

import { useAppStore } from "@/store/useAppStore";
import { PetWidget } from "@/components/pet/PetWidget";
import { useEffect, useState } from "react";
import { Sparkles, Trophy, History } from "lucide-react";

export default function CompanionPage() {
    const [mounted, setMounted] = useState(false);
    const { pet } = useAppStore();

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <div className="space-y-6 animate-in fade-in duration-500 min-h-screen pb-24">
            <header className="pt-2 mb-8">
                <h1 className="text-3xl font-bold font-serif text-sage-900 dark:text-sage-100">Your Companion</h1>
                <p className="text-sage-500 dark:text-sage-400">Growing with you, every day.</p>
            </header>

            {/* Main Pet Display */}
            <section className="mb-8">
                <PetWidget />
            </section>

            {/* Stats / Attributes (Mock for now, creates "premium" feel) */}
            <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-card p-4 rounded-2xl border border-border shadow-sm flex flex-col items-center justify-center text-center">
                    <Trophy className="h-6 w-6 text-yellow-500 mb-2" />
                    <span className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Evolution</span>
                    <span className="text-lg font-bold text-sage-800">Stage {Math.floor(pet.level / 5) + 1}</span>
                </div>
                <div className="bg-card p-4 rounded-2xl border border-border shadow-sm flex flex-col items-center justify-center text-center">
                    <Sparkles className="h-6 w-6 text-purple-500 mb-2" />
                    <span className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Bond</span>
                    <span className="text-lg font-bold text-sage-800">Strong</span>
                </div>
            </div>

            {/* Recent Growth History */}
            <section>
                <div className="flex items-center gap-2 mb-4">
                    <History className="h-4 w-4 text-sage-500" />
                    <h2 className="text-lg font-bold text-sage-800 dark:text-sage-200">Growth History</h2>
                </div>
                <div className="space-y-3 pl-2 border-l-2 border-sage-100 dark:border-sage-800 ml-1">
                    {/* Creating a sense of history even if empty logic just for MVP visual */}
                    <div className="pl-4 relative opacity-60">
                        <div className="absolute -left-[5px] top-2 h-2.5 w-2.5 rounded-full bg-sage-300" />
                        <p className="text-sm font-medium">Met Pip!</p>
                        <p className="text-xs text-muted-foreground">Start of journey</p>
                    </div>
                </div>
            </section>
        </div>
    );
}
