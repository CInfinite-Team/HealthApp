"use client";

import { Drawer } from "vaul";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

export interface OptionItem {
    label: string;
    icon?: React.ElementType;
    onClick: () => void;
    variant?: 'default' | 'destructive' | 'outline';
    disabled?: boolean;
}

interface OptionsDrawerProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title?: string;
    options: OptionItem[];
    children?: ReactNode; // Trigger
}

export function OptionsDrawer({ open, onOpenChange, title, options, children }: OptionsDrawerProps) {
    return (
        <Drawer.Root open={open} onOpenChange={onOpenChange}>
            {children && <Drawer.Trigger asChild>{children}</Drawer.Trigger>}
            <Drawer.Portal>
                <Drawer.Overlay className="fixed inset-0 bg-black/40 z-[60]" />
                <Drawer.Content className="bg-background flex flex-col rounded-t-[10px] fixed bottom-0 left-0 right-0 z-[70] outline-none max-h-[85vh]">
                    <div className="p-4 bg-background rounded-t-[10px] pb-safe">
                        <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-muted mb-6" />

                        {title && <h3 className="text-lg font-semibold text-center mb-6">{title}</h3>}

                        <div className="flex flex-col gap-3">
                            {options.map((option, idx) => {
                                const Icon = option.icon;
                                return (
                                    <Button
                                        key={idx}
                                        variant={option.variant === 'destructive' ? 'ghost' : 'outline'}
                                        disabled={option.disabled}
                                        onClick={() => {
                                            option.onClick();
                                            onOpenChange(false);
                                        }}
                                        className={cn(
                                            "w-full h-14 justify-start text-lg font-medium",
                                            option.variant === 'destructive' && "text-red-500 hover:text-red-600 hover:bg-red-50 border-transparent",
                                            option.variant === 'default' && "border-transparent bg-sage-50 hover:bg-sage-100 text-sage-900",
                                        )}
                                    >
                                        {Icon && <Icon className="mr-3 h-5 w-5" />}
                                        {option.label}
                                    </Button>
                                );
                            })}
                        </div>

                        <div className="mt-4 pt-4 border-t border-border">
                            <Button
                                variant="ghost"
                                className="w-full h-12 text-muted-foreground"
                                onClick={() => onOpenChange(false)}
                            >
                                Cancel
                            </Button>
                        </div>
                    </div>
                </Drawer.Content>
            </Drawer.Portal>
        </Drawer.Root>
    );
}
