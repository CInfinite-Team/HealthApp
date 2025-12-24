"use client";

import { useAppStore } from "@/store/useAppStore";
import { ProtocolCard } from "./ProtocolCard";
import { Search, Filter } from "lucide-react";
import { motion } from "framer-motion";

export function MarketplaceView() {
    const { protocols } = useAppStore();

    return (
        <div className="space-y-8 pb-24 animate-in fade-in duration-500 min-h-screen pt-4 px-4">
            <header className="mb-8">
                <h1 className="text-3xl font-bold font-serif text-sage-900 dark:text-sage-100">Discover</h1>
                <p className="text-sage-500 dark:text-sage-400">Explore protocols from health experts.</p>
            </header>

            {/* Search & Filter */}
            <div className="flex gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search for meal plans, routines..."
                        className="w-full h-12 rounded-xl bg-muted/40 border-none pl-10 pr-4 focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                    />
                </div>
                <button className="h-12 w-12 rounded-xl bg-muted/40 flex items-center justify-center hover:bg-muted/60 transition-colors">
                    <Filter className="h-5 w-5 text-muted-foreground" />
                </button>
            </div>

            {/* Featured Section (Horizontal validation if we had more items, grid for now) */}
            <div className="space-y-4">
                <h2 className="font-bold text-xl text-sage-800 dark:text-sage-200">Featured Protocols</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {protocols.map((protocol, index) => (
                        <motion.div
                            key={protocol.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <ProtocolCard protocol={protocol} />
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Categories (Mock Visuals) */}
            <div className="space-y-4 pt-4">
                <h2 className="font-bold text-xl text-sage-800 dark:text-sage-200">Browse by Category</h2>
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                    {['Nutrition', 'Fitness', 'Mindfulness', 'Sleep', 'Medical'].map((cat, i) => (
                        <div key={cat} className="min-w-[120px] h-24 rounded-2xl bg-gradient-to-br from-sage-50 to-white dark:from-sage-900/40 dark:to-sage-900/10 border border-sage-100 dark:border-sage-800 flex flex-col items-center justify-center gap-2 hover:scale-105 transition-transform cursor-pointer shadow-sm">
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                {cat[0]}
                            </div>
                            <span className="text-xs font-medium">{cat}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
