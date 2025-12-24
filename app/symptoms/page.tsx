"use client";

import { useAppStore } from "@/store/useAppStore";
import { SymptomLogger } from "@/components/wellness/SymptomLogger";
import { Button } from "@/components/ui/button";
import { Plus, Activity, MoreVertical, Trash2, Edit2, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { HorizontalCalendar } from "@/components/home/HorizontalCalendar";
import { useState, useMemo } from "react";
import { OptionsDrawer } from "@/components/ui/OptionsDrawer";
import { toast } from "sonner";

export default function SymptomsPage() {
    const { healthLogs, deleteHealthLog } = useAppStore();
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [editLog, setEditLog] = useState<any>(null);
    const [optionsOpenId, setOptionsOpenId] = useState<string | null>(null);

    // Filter only symptoms
    const symptomLogs = useMemo(() => healthLogs.filter(log => log.type === 'symptom'), [healthLogs]);

    // Calendar indicators (only for days with symptoms)
    const calendarTasks = useMemo(() => symptomLogs.map(l => ({
        date: l.date.split('T')[0],
        completed: true
    })), [symptomLogs]);

    // Filter logs for selected date
    const dateStr = selectedDate.toISOString().split('T')[0];
    const dailyLogs = symptomLogs.filter(log => log.date.startsWith(dateStr));

    return (
        <div className="space-y-6 pb-32 animate-in fade-in duration-500 min-h-screen pt-4 px-4">
            <header className="mb-2">
                <h1 className="text-3xl font-bold font-serif text-sage-900 dark:text-sage-100">Symptoms</h1>
                <p className="text-sage-500 dark:text-sage-400">Track how you are feeling.</p>
            </header>

            {/* Calendar Section */}
            <div className="bg-gradient-to-br from-white to-sage-50 dark:from-zinc-900 dark:to-zinc-900/50 py-4 px-4 -mx-4 rounded-[30px] shadow-sm">
                <HorizontalCalendar
                    selectedDate={selectedDate}
                    onSelectDate={setSelectedDate}
                    tasks={calendarTasks}
                />
            </div>

            {/* Logger */}
            <div className="bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/10 p-6 rounded-3xl border border-red-100 dark:border-red-900/30">
                <SymptomLogger fixedType="symptom">
                    <Button className="w-full h-14 rounded-xl text-lg font-semibold bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-200 dark:shadow-none">
                        <Plus className="mr-2 h-5 w-5" /> Log Symptom
                    </Button>
                </SymptomLogger>
            </div>

            {/* History / Daily Logs */}
            <div>
                <h3 className="font-bold text-lg mb-3 text-sage-800 dark:text-sage-200 flex justify-between items-center">
                    <span>Logs for {selectedDate.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                </h3>

                <div className="space-y-3">
                    {dailyLogs.length > 0 ? (
                        dailyLogs.slice().reverse().map((log) => (
                            <div key={log.id} className="relative group">
                                <div role="button" className="bg-card p-4 rounded-xl border border-border/50 shadow-sm flex items-start gap-4 w-full text-left cursor-pointer hover:border-red-200 hover:shadow-md transition-all">
                                    <div className="h-10 w-10 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 flex items-center justify-center flex-shrink-0 mt-1">
                                        <Activity className="h-5 w-5" />
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="font-bold text-lg text-foreground truncate">{log.label}</span>
                                            <span className="text-xs font-mono text-muted-foreground">
                                                {log.time || new Date(log.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
                                            </span>
                                        </div>

                                        <div className="flex flex-wrap items-center gap-2 mb-2">
                                            {/* Severity Badge */}
                                            {log.severity && (
                                                <span className={cn(
                                                    "text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide whitespace-nowrap",
                                                    log.severity >= 4 ? "bg-red-100 text-red-600" :
                                                        log.severity >= 3 ? "bg-orange-100 text-orange-600" :
                                                            "bg-green-100 text-green-600"
                                                )}>
                                                    Severity: {log.severity}
                                                </span>
                                            )}
                                        </div>

                                        {/* Notes */}
                                        {log.notes && (
                                            <p className="text-sm text-muted-foreground/90 bg-muted/30 p-2 rounded-lg italic">
                                                "{log.notes}"
                                            </p>
                                        )}
                                    </div>

                                    {/* Options Trigger */}
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setOptionsOpenId(log.id);
                                        }}
                                        className="p-1 -mr-2 -mt-2 text-muted-foreground hover:text-foreground rounded-full hover:bg-muted/50"
                                    >
                                        <MoreVertical className="h-4 w-4" />
                                    </button>
                                </div>

                                {/* Options Drawer */}
                                <OptionsDrawer
                                    open={optionsOpenId === log.id}
                                    onOpenChange={(open) => !open && setOptionsOpenId(null)}
                                    title={log.label}
                                    options={[
                                        {
                                            label: 'Share',
                                            icon: Share2,
                                            onClick: () => toast.success("Shared!")
                                        },
                                        {
                                            label: 'Edit',
                                            icon: Edit2,
                                            onClick: () => setEditLog(log)
                                        },
                                        {
                                            label: 'Delete',
                                            icon: Trash2,
                                            variant: 'destructive',
                                            onClick: () => {
                                                deleteHealthLog(log.id);
                                                toast.success("Symptom deleted");
                                            }
                                        }
                                    ]}
                                />
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-12 text-muted-foreground bg-muted/20 rounded-2xl border border-dashed">
                            <Activity className="h-10 w-10 mx-auto mb-2 opacity-20" />
                            <p>No symptoms logged for this day.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Edit Drawer (Controlled) */}
            {editLog && (
                <SymptomLogger
                    logToEdit={editLog}
                    fixedType="symptom"
                    onClose={() => setEditLog(null)}
                >
                    <span />
                </SymptomLogger>
            )}
        </div>
    );
}
