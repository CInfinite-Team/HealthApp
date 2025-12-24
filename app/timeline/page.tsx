"use client";

import { useAppStore } from "@/store/useAppStore";
import { TimelineView } from "@/components/timeline/TimelineView";
import { TimelineTaskDrawer } from "@/components/timeline/TimelineTaskDrawer";
import { useEffect, useState } from "react";

export default function TimelinePage() {
    const { timeline } = useAppStore();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <div className="space-y-6 animate-in fade-in duration-500 min-h-screen pb-24">
            <header className="pt-2 mb-8">
                <h1 className="text-3xl font-bold font-serif text-sage-900 dark:text-sage-100">Your Flow</h1>
                <p className="text-sage-500 dark:text-sage-400">Structure brings peace.</p>
            </header>

            <section>
                <TimelineView tasks={timeline} />
            </section>

            <TimelineTaskDrawer />
        </div>
    );
}
