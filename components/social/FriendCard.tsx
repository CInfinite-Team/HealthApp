"use client";

import { Friend } from "@/types";
import { cn } from "@/lib/utils";
import { Bell, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { motion } from "framer-motion";

interface FriendCardProps {
    friend: Friend;
}

export function FriendCard({ friend }: FriendCardProps) {
    const handlePing = () => {
        toast.success(`Ping sent to ${friend.name}!`, {
            icon: "👋",
            description: "They'll get a nudge to check their habits."
        });
    };

    return (
        <div className="flex items-center justify-between p-4 bg-card rounded-2xl border border-border/50 shadow-sm mb-3">
            <div className="flex items-center gap-4">
                <div className="relative">
                    <div className="h-12 w-12 rounded-full bg-sage-200 dark:bg-sage-800 flex items-center justify-center text-sage-700 dark:text-sage-300 font-bold text-lg">
                        {friend.avatar || <User className="h-6 w-6" />}
                    </div>
                    <div className={cn(
                        "absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-[3px] border-card",
                        friend.status === 'online' ? "bg-green-500" :
                            friend.status === 'busy' ? "bg-red-500" : "bg-gray-400"
                    )} />
                </div>
                <div>
                    <h3 className="font-semibold text-foreground">{friend.name}</h3>
                    <p className="text-xs text-muted-foreground">
                        {friend.status === 'online' ? 'Online' :
                            friend.status === 'busy' ? 'Busy' :
                                `Last active ${friend.lastActive}`}
                    </p>
                </div>
            </div>

            <motion.div whileTap={{ scale: 0.9 }}>
                <Button
                    size="sm"
                    variant="outline"
                    className="rounded-full h-9 px-4 text-sage-600 border-sage-200 hover:bg-sage-50 hover:text-sage-700 dark:border-sage-800 dark:text-sage-400 dark:hover:bg-sage-900"
                    onClick={handlePing}
                >
                    <Bell className="h-4 w-4 mr-2" />
                    Ping
                </Button>
            </motion.div>
        </div>
    );
}
