"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, CheckCircle, Activity, Pill, Utensils } from "lucide-react";
import { cn } from "@/lib/utils";

export function BottomNav() {
    const pathname = usePathname();

    const navItems = [
        { href: "/", label: "Home", icon: Home },
        { href: "/habits", label: "Habits", icon: CheckCircle },
        { href: "/symptoms", label: "Symptoms", icon: Activity },
        { href: "/supplements", label: "Supplements", icon: Pill },
        { href: "/meals", label: "Meals", icon: Utensils },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-t border-border pb-safe">
            <div className="flex justify-around items-center h-16">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex flex-col items-center justify-center w-full h-full transition-colors duration-200",
                                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            <item.icon className={cn("h-6 w-6 mb-1", isActive && "fill-current/20")} />
                            <span className="text-[10px] font-medium">{item.label}</span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
