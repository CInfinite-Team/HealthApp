"use client";

import { cn } from "@/lib/utils";

export function TextureOverlay() {
    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-none z-0">
            {/* Noise Texture */}
            <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.01] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

            {/* Watercolor blobs (CSS gradients) - Optimized blur */}
            <div className="absolute top-[-10%] right-[-10%] w-[300px] h-[300px] bg-sage-200/20 rounded-full blur-[40px] dark:bg-sage-900/10" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[300px] h-[300px] bg-blue-100/20 rounded-full blur-[40px] dark:bg-blue-900/10" />

            {/* Watermarks */}
            <div className="absolute top-8 right-6 font-mono text-[10px] text-sage-900/10 dark:text-sage-100/10 rotate-90 select-none">
                777
            </div>
            <div className="absolute bottom-24 left-6 font-mono text-[10px] text-sage-900/10 dark:text-sage-100/10 -rotate-90 select-none">
                144
            </div>
        </div>
    );
}
