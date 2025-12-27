"use client";

import { Drawer } from "vaul";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Sparkles, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'companion';
    timestamp: Date;
}

interface CompanionChatDrawerProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    petName: string;
}

export function CompanionChatDrawer({ open, onOpenChange, petName }: CompanionChatDrawerProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Initial Greeting
    useEffect(() => {
        if (open && messages.length === 0) {
            setIsTyping(true);
            setTimeout(() => {
                setMessages([
                    {
                        id: 'init-1',
                        text: `Hello! I'm ${petName}. How are you feeling today?`,
                        sender: 'companion',
                        timestamp: new Date()
                    }
                ]);
                setIsTyping(false);
            }, 1000);
        }
    }, [open, petName]);

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isTyping]);

    const handleSend = () => {
        if (!inputValue.trim()) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            text: inputValue,
            sender: 'user',
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMsg]);
        setInputValue("");
        setIsTyping(true);

        // Simulated Response (Simple heuristic for demo)
        setTimeout(() => {
            let responseText = "I'm always here to support you! 🌟";
            const lowerInput = userMsg.text.toLowerCase();

            if (lowerInput.includes("good") || lowerInput.includes("great") || lowerInput.includes("happy")) {
                responseText = "That matches my mood! Keep changing the world! 🚀";
            } else if (lowerInput.includes("bad") || lowerInput.includes("sad") || lowerInput.includes("tired")) {
                responseText = "I'm sorry to hear that. Remember, small steps are still progress. Take a deep breath. 🍃";
            } else if (lowerInput.includes("hello") || lowerInput.includes("hi")) {
                responseText = "Hi there! Ready to crush some habits today?";
            }

            const companionMsg: Message = {
                id: (Date.now() + 1).toString(),
                text: responseText,
                sender: 'companion',
                timestamp: new Date()
            };

            setMessages(prev => [...prev, companionMsg]);
            setIsTyping(false);
        }, 1500);
    };

    return (
        <Drawer.Root open={open} onOpenChange={onOpenChange}>
            <Drawer.Portal>
                <Drawer.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50" />
                <Drawer.Content className="bg-white dark:bg-zinc-900 flex flex-col rounded-t-[32px] mt-24 fixed bottom-0 left-0 right-0 z-50 h-[85vh] focus:outline-none shadow-2xl">

                    {/* Header */}
                    <div className="p-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center border border-emerald-200 dark:border-emerald-800/50">
                                <img src="/hummingbird.png" alt="Pet" className="h-6 w-6 object-contain" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg text-zinc-900 dark:text-zinc-100">{petName}</h3>
                                <p className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center">
                                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-1.5 animate-pulse" />
                                    Online
                                </p>
                            </div>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)} className="rounded-full">
                            <X className="h-5 w-5 text-zinc-500" />
                        </Button>
                    </div>

                    {/* Chat Area */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-zinc-50/50 dark:bg-zinc-950/50">
                        {messages.map((msg) => (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                key={msg.id}
                                className={cn(
                                    "flex w-full",
                                    msg.sender === 'user' ? "justify-end" : "justify-start"
                                )}
                            >
                                <div
                                    className={cn(
                                        "max-w-[80%] rounded-2xl px-4 py-3 text-sm shadow-sm",
                                        msg.sender === 'user'
                                            ? "bg-emerald-500 text-white rounded-tr-sm"
                                            : "bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700 rounded-tl-sm"
                                    )}
                                >
                                    {msg.text}
                                </div>
                            </motion.div>
                        ))}

                        {isTyping && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex justify-start">
                                <div className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                                    <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                                    <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" />
                                </div>
                            </motion.div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-4 bg-white dark:bg-zinc-900 border-t border-zinc-100 dark:border-zinc-800 pt-2 pb-8">
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleSend();
                            }}
                            className="flex items-center gap-2"
                        >
                            <Input
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                placeholder="Say something..."
                                className="rounded-full bg-zinc-100 dark:bg-zinc-800 border-transparent focus:border-emerald-500 h-12"
                            />
                            <Button
                                type="submit"
                                size="icon"
                                disabled={!inputValue.trim()}
                                className="h-12 w-12 rounded-full bg-emerald-500 hover:bg-emerald-600 shrink-0 text-white shadow-emerald-200 dark:shadow-none transition-all active:scale-95"
                            >
                                <Send className="h-5 w-5 ml-0.5" />
                            </Button>
                        </form>
                    </div>

                </Drawer.Content>
            </Drawer.Portal>
        </Drawer.Root>
    );
}
