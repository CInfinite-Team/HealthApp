"use client";

import { WellnessView } from "@/components/wellness/WellnessView";

export default function WellnessPage() {
    return (
        <div className="space-y-6 animate-in fade-in duration-500 min-h-screen">
            <header className="pt-2 mb-4">
                <h1 className="text-3xl font-bold font-serif text-sage-900 dark:text-sage-100">Wellness</h1>
                <p className="text-sage-500 dark:text-sage-400">Nourish your body.</p>
            </header>
            <WellnessView />
        </div>
    );
}
