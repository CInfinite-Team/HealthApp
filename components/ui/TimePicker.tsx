"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface TimePickerProps {
    value: string; // "HH:mm" (24h format)
    onChange: (value: string) => void;
    className?: string;
}

export function TimePicker({ value, onChange, className }: TimePickerProps) {
    const [hour, setHour] = useState("09");
    const [minute, setMinute] = useState("00");
    const [period, setPeriod] = useState("AM");

    // Parse initial value
    useEffect(() => {
        if (!value) return;
        const [h, m] = value.split(':');
        let hNum = parseInt(h);
        const p = hNum >= 12 ? 'PM' : 'AM';

        if (hNum > 12) hNum -= 12;
        if (hNum === 0) hNum = 12;

        setHour(hNum.toString().padStart(2, '0'));
        setMinute(m);
        setPeriod(p);
    }, [value]);

    const handleChange = (newHour: string, newMinute: string, newPeriod: string) => {
        let h = parseInt(newHour);
        if (newPeriod === 'PM' && h !== 12) h += 12;
        if (newPeriod === 'AM' && h === 12) h = 0;

        onChange(`${h.toString().padStart(2, '0')}:${newMinute}`);
    };

    const hourOptions = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'));
    const minuteOptions = Array.from({ length: 12 }, (_, i) => (i * 5).toString().padStart(2, '0'));

    return (
        <div className={cn("flex items-center gap-2", className)}>
            {/* Hour Select */}
            <div className="relative">
                <select
                    value={hour}
                    onChange={(e) => {
                        setHour(e.target.value);
                        handleChange(e.target.value, minute, period);
                    }}
                    className="w-20 p-3 rounded-xl bg-card border border-border appearance-none text-center text-lg font-medium outline-none focus:ring-2 focus:ring-sage-400"
                >
                    {hourOptions.map(h => <option key={h} value={h}>{h}</option>)}
                </select>
            </div>

            <span className="text-xl font-bold text-sage-300">:</span>

            {/* Minute Select */}
            <div className="relative">
                <select
                    value={minute}
                    onChange={(e) => {
                        setMinute(e.target.value);
                        handleChange(hour, e.target.value, period);
                    }}
                    className="w-20 p-3 rounded-xl bg-card border border-border appearance-none text-center text-lg font-medium outline-none focus:ring-2 focus:ring-sage-400"
                >
                    {minuteOptions.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
            </div>

            {/* AM/PM Select */}
            <div className="relative ml-2">
                <select
                    value={period}
                    onChange={(e) => {
                        setPeriod(e.target.value);
                        handleChange(hour, minute, e.target.value);
                    }}
                    className="w-20 p-3 rounded-xl bg-card border border-border appearance-none text-center text-lg font-medium outline-none focus:ring-2 focus:ring-sage-400"
                >
                    <option value="AM">AM</option>
                    <option value="PM">PM</option>
                </select>
            </div>
        </div>
    );
}
