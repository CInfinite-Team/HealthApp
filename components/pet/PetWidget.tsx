"use client";

import { useAppStore } from "@/store/useAppStore";
import { cn } from "@/lib/utils";
import { Sparkles, Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

export function PetWidget() {
    const pet = useAppStore((state) => state.pet);
    const [isFlying, setIsFlying] = useState(false);
    const [prevXp, setPrevXp] = useState(pet.xp);

    const [quote, setQuote] = useState("");

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
        setIsFlying(true);
        setTimeout(() => setIsFlying(false), 4000);
    };

    return (
        <>
            <div className="bg-gradient-to-br from-sage-100 to-sage-50 dark:from-sage-900 dark:to-sage-950 rounded-3xl p-6 mb-6 shadow-sm border border-sage-200/50 relative overflow-hidden group">
                <div className="relative z-10 flex items-center justify-between">
                    <div>
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
                        className="relative h-28 w-28 cursor-pointer"
                        onClick={triggerFlyover}
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
            <AnimatePresence>
                {
                    isFlying && (
                        <motion.div
                            initial={{ x: "-60vw", y: 0, scale: 0.5, opacity: 0 }}
                            animate={{
                                x: ["-60vw", "0vw", "60vw"],
                                y: [0, -20, 0], // Slight bobbing
                                scale: [0.5, 1.5, 1],
                                opacity: [0, 1, 0]
                            }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 3, ease: "easeInOut" }}
                            className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center"
                        >
                            <div className="relative">
                                <img
                                    src="/hummingbird.png"
                                    alt="Hummingbird"
                                    className="w-64 h-64 object-contain filter drop-shadow-2xl"
                                />
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="absolute top-full left-1/2 -translate-x-1/2 mt-4 bg-white/90 dark:bg-zinc-800/90 backdrop-blur px-6 py-2 rounded-full shadow-xl"
                                >
                                    <p className="font-bold text-lg text-sage-600 bg-clip-text text-transparent bg-gradient-to-r from-sage-600 to-indigo-600">Great Job!</p>
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
        </>
    );
}
