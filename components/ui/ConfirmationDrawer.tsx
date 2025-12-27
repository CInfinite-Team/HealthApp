"use client";

import { Drawer } from "vaul";
import { Button } from "./button";
import { AlertTriangle } from "lucide-react";

interface ConfirmationDrawerProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title?: string;
    description?: string;
    onConfirm: () => void;
    confirmLabel?: string;
    cancelLabel?: string;
    trigger?: React.ReactNode;
}

export function ConfirmationDrawer({
    open,
    onOpenChange,
    title = "Are you sure?",
    description = "This action cannot be undone.",
    onConfirm,
    confirmLabel = "Delete",
    cancelLabel = "Cancel",
    trigger
}: ConfirmationDrawerProps) {
    return (
        <Drawer.Root open={open} onOpenChange={onOpenChange}>
            {trigger && <Drawer.Trigger asChild>{trigger}</Drawer.Trigger>}
            <Drawer.Portal>
                <Drawer.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50" />
                <Drawer.Content className="bg-white dark:bg-zinc-900 flex flex-col rounded-t-[32px] mt-24 fixed bottom-0 left-0 right-0 z-50 max-h-[96%] focus:outline-none">
                    <div className="p-4 bg-white dark:bg-zinc-900 rounded-t-[32px] flex-1">
                        <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-zinc-300 dark:bg-zinc-700 mb-8" />

                        <div className="flex flex-col items-center text-center space-y-4 px-4 pb-8">
                            <div className="h-14 w-14 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-500 dark:text-red-400 mb-2">
                                <AlertTriangle className="h-7 w-7" />
                            </div>

                            <Drawer.Title className="text-2xl font-bold font-serif text-zinc-900 dark:text-zinc-100">
                                {title}
                            </Drawer.Title>

                            <p className="text-zinc-500 dark:text-zinc-400 text-base leading-relaxed max-w-xs">
                                {description}
                            </p>
                        </div>

                        <div className="flex flex-col gap-3 mt-4">
                            <Button
                                onClick={() => {
                                    onConfirm();
                                    onOpenChange(false);
                                }}
                                className="w-full bg-red-500 hover:bg-red-600 text-white rounded-2xl h-14 text-lg font-semibold shadow-red-200 dark:shadow-none"
                            >
                                {confirmLabel}
                            </Button>

                            <Button
                                onClick={() => onOpenChange(false)}
                                variant="outline"
                                className="w-full border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-2xl h-14 text-lg font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800"
                            >
                                {cancelLabel}
                            </Button>
                        </div>
                    </div>
                </Drawer.Content>
            </Drawer.Portal>
        </Drawer.Root>
    );
}
