"use client";

import { cn } from "@/lib/utils";

export function TextureOverlay() {
    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-none z-0">
            {/* Optimized Background - Lightweight Gradients Only */}
            <div className="absolute inset-0 bg-gradient-to-b from-sage-50/50 to-transparent dark:from-emerald-950/20 pointer-events-none" />

            {/* Very subtle static accent - No blur filter */}
            <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-radial from-sage-200/10 to-transparent dark:from-emerald-500/5 opacity-50" />
            <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-radial from-blue-100/10 to-transparent dark:from-blue-500/5 opacity-50" />
        </div>
    );
}
