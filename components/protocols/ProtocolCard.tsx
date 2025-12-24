"use client";

import { Protocol } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Users, ArrowRight, Check } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/useAppStore";
import { toast } from "sonner";

interface ProtocolCardProps {
    protocol: Protocol;
}

export function ProtocolCard({ protocol }: ProtocolCardProps) {
    const { joinedProtocols, joinProtocol } = useAppStore();
    const isJoined = joinedProtocols.includes(protocol.id);

    const handleJoin = () => {
        if (!isJoined) {
            joinProtocol(protocol.id);
            toast.success(`Joined ${protocol.title}!`, {
                description: "Tasks have been added to your timeline."
            });
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="group relative bg-card rounded-3xl overflow-hidden border border-border/50 hover:shadow-xl transition-all duration-300"
        >
            {/* Header Image / Gradient */}
            <div className={cn(
                "h-28 p-4 flex flex-col justify-end relative",
                protocol.category === 'nutrition' ? "bg-gradient-to-br from-green-100 to-emerald-50 dark:from-green-900/40 dark:to-emerald-900/20" :
                    protocol.category === 'fitness' ? "bg-gradient-to-br from-blue-100 to-indigo-50 dark:from-blue-900/40 dark:to-indigo-900/20" :
                        "bg-gradient-to-br from-purple-100 to-pink-50 dark:from-purple-900/40 dark:to-pink-900/20"
            )}>
                <div className="absolute top-3 right-3 bg-background/80 backdrop-blur-md px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center shadow-sm">
                    <Star className="h-2.5 w-2.5 text-yellow-500 mr-1 fill-yellow-500" />
                    {protocol.rating}
                </div>

                <Badge variant="secondary" className="self-start mb-1.5 backdrop-blur-sm bg-white/50 dark:bg-black/30 capitalize text-[10px] px-1.5 py-0 h-5">
                    {protocol.category}
                </Badge>
                <h3 className="font-bold text-lg leading-tight text-foreground/90">{protocol.title}</h3>
            </div>

            {/* Content */}
            <div className="p-4 space-y-3">
                <p className="text-xs text-muted-foreground line-clamp-2 min-h-[32px]">
                    {protocol.description}
                </p>

                <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                    <div className="flex items-center">
                        <Users className="h-3 w-3 mr-1" />
                        {new Intl.NumberFormat('en-US', { notation: "compact" }).format(protocol.followers)} joined
                    </div>
                    <div className="truncate max-w-[80px] text-right">
                        by <span className="font-semibold text-foreground">{protocol.creatorName}</span>
                    </div>
                </div>

                <div className="pt-1">
                    <Button
                        onClick={handleJoin}
                        disabled={isJoined}
                        size="sm"
                        className={cn(
                            "w-full rounded-lg h-9 transition-all text-xs font-semibold",
                            isJoined
                                ? "bg-green-100/50 text-green-600 hover:bg-green-100/50 border border-green-200 dark:bg-green-900/20 dark:border-green-800"
                                : "bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm"
                        )}
                    >
                        {isJoined ? (
                            <>
                                <Check className="mr-1.5 h-3.5 w-3.5" /> Active
                            </>
                        ) : (
                            <>
                                Join <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </motion.div>
    );
}
