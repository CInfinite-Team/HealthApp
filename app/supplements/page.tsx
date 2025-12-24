"use client";

import { SupplementList } from "@/components/wellness/SupplementList";

export default function SupplementsPage() {
    return (
        <div className="space-y-6 pb-32 animate-in fade-in duration-500 min-h-screen pt-4 px-4">
            <header className="mb-6">
                <h1 className="text-3xl font-bold font-serif text-sage-900 dark:text-sage-100">Supplements</h1>
                <p className="text-sage-500 dark:text-sage-400">Manage your stack and inventory.</p>
            </header>

            <SupplementList />
        </div>
    );
}
