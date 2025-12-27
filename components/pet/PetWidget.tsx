"use client";

import { useAppStore } from "@/store/useAppStore";
import { cn } from "@/lib/utils";
import { Sparkles, Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { CompanionChatDrawer } from "./CompanionChatDrawer";

export function PetWidget() {
    const pet = useAppStore((state) => state.pet);
    const [isFlying, setIsFlying] = useState(false);
    const [prevXp, setPrevXp] = useState(pet.xp);

    const [quote, setQuote] = useState("");
    const [flyId, setFlyId] = useState(0);
    const [chatOpen, setChatOpen] = useState(false);

    const quotes = [
        "Your potential is endless.",
        "Discipline is choosing between what you want now and what you want most.",
        "The pain you feel today will be the strength you feel tomorrow.",
        "Don't count the days, make the days count.",
        "Your future is created by what you do today, not tomorrow.",
        "Success is not final, failure is not fatal: it is the courage to continue that counts.",
        "Believe you can and you're halfway there.",
        "Your only limit is you.",
        "Small steps every day lead to big changes.",
        "Don't stop until you're proud.",
        "You are stronger than you think.",
        "Progress, not perfection.",
        "Every day is a fresh start.",
        "Focus on the step in front of you.",
        "You got this!",
        "Make today count.",
        "Sweat is just fat crying.",
        "A one-hour workout is only 4% of your day. No excuses.",
        "Motivation is what gets you started. Habit is what keeps you going.",
        "The body achieves what the mind believes.",
        "Hard work beats talent when talent doesn't work hard.",
        "It always seems impossible until it's done.",
        "Start where you are. Use what you have. Do what you can.",
        "Dream big and dare to fail.",
        "Don't watch the clock; do what it does. Keep going.",
        "You don't have to be great to start, but you have to start to be great.",
        "Success usually comes to those who are too busy to be looking for it.",
        "The only way to do great work is to love what you do.",
        "What you get by achieving your goals is not as important as what you become by achieving your goals.",
        "Action is the foundational key to all success."
    ];

    useEffect(() => {
        setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
    }, []);

    // Watch for XP increase (Habit Completion)
    useEffect(() => {
        if (pet.xp > prevXp) {
            triggerFlyover();
        }
        setPrevXp(pet.xp);
    }, [pet.xp]);

    // Simulate flyover on level up or high interaction
    const triggerFlyover = () => {
        // Change quote to a new one (random)
        let newQuote = quotes[Math.floor(Math.random() * quotes.length)];
        // Ensure it's different if possible (simple check)
        while (newQuote === quote && quotes.length > 1) {
            newQuote = quotes[Math.floor(Math.random() * quotes.length)];
        }
        setQuote(newQuote);

        setIsFlying(true);
        setTimeout(() => setIsFlying(false), 5000); // Extended duration for the loop
    };

    return (
        <>
            <div className="bg-gradient-to-br from-sage-100 to-sage-50 dark:from-sage-900 dark:to-sage-950 rounded-3xl p-4 sm:p-6 mb-6 shadow-sm border border-sage-200/50 relative overflow-hidden group">
                <div className="relative z-10 flex flex-col-reverse sm:flex-row items-center justify-between gap-4 sm:gap-0">
                    <div className="text-center sm:text-left w-full sm:w-auto flex flex-col items-center sm:items-start">
                        <div className="inline-flex items-center px-3 py-1 bg-white/50 backdrop-blur-md rounded-full text-xs font-semibold text-sage-700 dark:text-sage-300 mb-2 border border-white/20">
                            Lv. {pet.level} {pet.type.toUpperCase()}
                        </div>
                        <h2 className="text-2xl font-bold text-sage-900 dark:text-sage-50 mb-1">
                            Hi, {pet.name} is {pet.mood}!
                        </h2>
                        <p className="text-sm text-sage-600 dark:text-sage-400 max-w-[200px]">
                            "{quote || "Remember to drink water today!"}"
                        </p>

                        <div className="mt-4 w-full max-w-[150px] bg-white/30 h-2 rounded-full overflow-hidden">
                            <div
                                className="bg-sage-500 h-full rounded-full transition-all duration-1000"
                                style={{ width: `${Math.min(pet.xp, 100)}%` }}
                            />
                        </div>
                        <p className="text-[10px] text-sage-500 mt-1">{pet.xp} / 100 XP to Level Up</p>
                    </div>

                    {/* Interactive Pet Area */}
                    <div
                        className="relative h-24 w-24 sm:h-28 sm:w-28 cursor-pointer shrink-0"
                        onClick={() => setChatOpen(true)}
                    >
                        <motion.div
                            animate={{
                                y: [0, -10, 0],
                                rotate: [0, 2, -2, 0]
                            }}
                            transition={{
                                duration: 4,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                            className="h-full w-full bg-white/40 rounded-full flex items-center justify-center shadow-inner backdrop-blur-sm border border-white/30"
                        >
                            <img
                                src="/hummingbird.png"
                                alt="Hummingbird"
                                className="w-16 h-16 object-contain drop-shadow-lg"
                            />
                        </motion.div>

                        {/* Interactive Hearts on Hover */}
                        <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <Heart className="h-6 w-6 text-pink-400 fill-pink-400 animate-bounce" />
                        </div>
                    </div>
                </div>

                {/* Decorative Background Elements */}
                <Sparkles className="absolute top-2 right-2 text-sage-300/40 h-10 w-10 rotate-12" />
                <div className="absolute -bottom-10 -right-10 h-32 w-32 bg-sage-300/20 rounded-full blur-3xl" />
            </div >

            {/* Flyover Overlay */}
            <AnimatePresence mode="wait">
                {
                    isFlying && (
                        <motion.div
                            key={flyId}
                            initial={{ x: 0, y: 300, scale: 0.2, opacity: 0 }}
                            animate={{
                                x: [0, 150, 0, -150, 0], // Figure-8 / Circle path
                                y: [300, 0, -200, 0, 300], // Go up and come back down
                                scale: [0.5, 1.2, 1.5, 1.2, 0.5], // Ensure it gets big enough
                                opacity: [0, 1, 1, 1, 0],
                                rotate: [0, -10, 0, 10, 0] // Bank into turns
                            }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 5, ease: "easeInOut", times: [0, 0.25, 0.5, 0.75, 1] }}
                            className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center"
                        >
                            <div className="relative">
                                {/* Flapping Bird */}
                                <motion.img
                                    src="/hummingbird.png"
                                    alt="Hummingbird"
                                    className="w-64 h-64 object-contain filter drop-shadow-2xl"
                                    animate={{
                                        rotateY: [0, 45, 0], // Wing flap simulation via rotation
                                        scaleY: [1, 0.9, 1] // Slight squash for energetic flap
                                    }}
                                    transition={{
                                        duration: 0.15,
                                        repeat: Infinity,
                                        repeatType: "reverse",
                                        ease: "linear"
                                    }}
                                />

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 1, duration: 0.5 }}
                                    className="absolute top-full left-1/2 -translate-x-1/2 mt-4 bg-white/90 dark:bg-zinc-800/90 backdrop-blur px-8 py-4 rounded-3xl shadow-xl border border-sage-100 dark:border-white/10 text-center min-w-[280px]"
                                >
                                    <p className="font-bold text-lg text-transparent bg-clip-text bg-gradient-to-r from-sage-600 to-emerald-600 dark:from-sage-300 dark:to-emerald-400">
                                        {quote}
                                    </p>
                                </motion.div>
                                {/* Glitter Particles */}
                                {/* Golden Trail Particles */}
                                {[...Array(30)].map((_, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                                        animate={{
                                            opacity: [0, 1, 0],
                                            scale: [0, Math.random() * 1 + 0.5, 0], // Random sizes
                                            x: -200 - Math.random() * 100, // Move backwards (trail)
                                            y: (Math.random() - 0.5) * 100, // Slight vertical spread
                                            rotate: Math.random() * 360
                                        }}
                                        transition={{
                                            duration: 1.5,
                                            delay: i * 0.05, // Staggered release
                                            ease: "easeOut"
                                        }}
                                        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full ${i % 3 === 0 ? 'bg-yellow-300' :
                                            i % 3 === 1 ? 'bg-amber-400' : 'bg-white'
                                            }`}
                                        style={{
                                            width: Math.random() * 6 + 2 + "px",
                                            height: Math.random() * 6 + 2 + "px",
                                            boxShadow: "0 0 10px rgba(255, 215, 0, 0.8)"
                                        }}
                                    />
                                ))}
                            </div>
                        </motion.div>
                    )
                }
            </AnimatePresence >
            {/* Chat Drawer */}
            <CompanionChatDrawer
                open={chatOpen}
                onOpenChange={setChatOpen}
                petName={pet.name}
            />
        </>
    );
}
