import * as React from "react";
import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

export interface AutocompleteProps extends React.InputHTMLAttributes<HTMLInputElement> {
    suggestions: string[];
    onValueChange: (value: string) => void;
    value: string;
}

export function Autocomplete({ suggestions, onValueChange, value, className, ...props }: AutocompleteProps) {
    const [open, setOpen] = useState(false);
    const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
    const [position, setPosition] = useState<{ top: number; left: number; width: number } | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const updatePosition = () => {
        if (inputRef.current) {
            const rect = inputRef.current.getBoundingClientRect();
            setPosition({
                top: rect.bottom + 4, // 4px gap
                left: rect.left,
                width: rect.width
            });
        }
    };

    // Filter on value change
    useEffect(() => {
        if (value.length > 0) {
            const filtered = suggestions.filter((item) =>
                item.toLowerCase().includes(value.toLowerCase())
            );
            setFilteredSuggestions(filtered);
            // Only open if we have input and matches, but checking if focused might be needed 
            // to avoid popping up when value is set programmaticly. 
            // For now, let's assume if value changes and we have filtered results, we might want to show?
            // Actually, better to only setFilteredSuggestions here.
            // Open state should probably be controlled by focus + input?
        } else {
            setFilteredSuggestions([]);
            setOpen(false);
        }
    }, [value, suggestions]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        onValueChange(newValue);

        if (props.onChange) {
            props.onChange(e);
        }

        // Open on input
        if (newValue.length > 0) {
            setOpen(true);
            updatePosition();
        }
    };

    const handleSelect = (suggestion: string) => {
        onValueChange(suggestion);
        setOpen(false);
        inputRef.current?.focus();
    };

    const handleBlur = () => {
        // Delay close to allow click event on dropdown
        setTimeout(() => setOpen(false), 200);
    };

    const handleFocus = () => {
        if (value.length > 0) {
            setOpen(true);
            updatePosition();
        }
    };

    // Update position on scroll/resize
    useEffect(() => {
        if (open) {
            window.addEventListener('scroll', updatePosition, true);
            window.addEventListener('resize', updatePosition);
            return () => {
                window.removeEventListener('scroll', updatePosition, true);
                window.removeEventListener('resize', updatePosition);
            };
        }
    }, [open]);

    return (
        <div className="relative w-full">
            <Input
                ref={inputRef}
                value={value}
                onChange={handleInputChange}
                onBlur={handleBlur}
                onFocus={handleFocus}
                autoComplete="off"
                className={cn("w-full", className)}
                {...props}
            />
            {open && filteredSuggestions.length > 0 && position && createPortal(
                <div
                    className="fixed z-[9999] bg-popover text-popover-foreground rounded-md border shadow-md outline-none animate-in fade-in-0 zoom-in-95 overflow-hidden"
                    style={{
                        top: position.top,
                        left: position.left,
                        width: position.width,
                        maxHeight: '200px'
                    }}
                >
                    <div className="overflow-y-auto max-h-[200px] p-1">
                        {filteredSuggestions.map((suggestion) => (
                            <div
                                key={suggestion}
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation(); // Stop propagation to prevent immediate blur?
                                    handleSelect(suggestion);
                                }}
                                className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground"
                            >
                                {suggestion}
                            </div>
                        ))}
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
}
