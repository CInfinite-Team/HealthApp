"use client";

import { SocialView } from "@/components/social/SocialView";

export default function SocialPage() {
    return (
        <div className="space-y-6 animate-in fade-in duration-500 min-h-screen">
            <header className="pt-2 mb-4">
                <h1 className="text-3xl font-bold font-serif text-sage-900 dark:text-sage-100">Community</h1>
                <p className="text-sage-500 dark:text-sage-400">Better together.</p>
            </header>
            <SocialView />
        </div>
    );
}
