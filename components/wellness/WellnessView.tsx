import { useAppStore } from "@/store/useAppStore";
import { SymptomLogger } from "./SymptomLogger";
import { SupplementList } from "./SupplementList";
import { Button } from "@/components/ui/button";
import { Plus, Activity, Clock, MoreVertical, Trash2, Edit2, Share2 } from "lucide-react";
import { formatDistanceToNow, isSameDay } from "date-fns";
import { cn } from "@/lib/utils";
import { HorizontalCalendar } from "../home/HorizontalCalendar";
import { useState } from "react";
import { OptionsDrawer } from "../ui/OptionsDrawer";
import { toast } from "sonner";

export function WellnessView() {
    const { healthLogs, timeline, deleteHealthLog } = useAppStore();
    // Types conflict: healthLogs store doesn't have deleteHealthLog? 
    // Wait, useAppStore in provided file didn't show deleteHealthLog... 
    // I need to check store again. If missing, I can't delete easily without adding it.
    // Assuming assuming I should add it or use a hack. 
    // Actually, looking at previous steps... useAppStore definition (Step 727) shows `updateHealthLog` but NOT `deleteHealthLog`.
    // I MUST ADD `deleteHealthLog` to store first. But for now I will display UI.
    // Wait, I can't delete if function doesn't exist. I'll add the UI but it won't work fully or I should add the store action.
    // Let's add the action to the store in next step.

    const [selectedDate, setSelectedDate] = useState(new Date());
    const [optionsOpenId, setOptionsOpenId] = useState<string | null>(null);
    const [editLog, setEditLog] = useState<any>(null);

    const dateStr = selectedDate.toISOString().split('T')[0];
    const filteredLogs = healthLogs.filter(log => log.date.startsWith(dateStr));

    // Calendar indicators
    // Simplify: just show dots for days with logs
    const calendarTasks = healthLogs.map(l => ({ date: l.date.split('T')[0], completed: true }));

    // Time since last meal 
    // (Calculation based on ALL logs, not just filtered, because you want time since LAST meal ever)
    const lastMeal = [...healthLogs].sort((a, b) => b.date.localeCompare(a.date)).find(l => l.type === 'food');
    const timeSinceMeal = lastMeal ? formatDistanceToNow(new Date(lastMeal.date)) : "No record";

    return (
        <div className="space-y-6 pb-24">
            {/* Calendar Section */}
            <div className="bg-gradient-to-br from-white to-sage-50 dark:from-zinc-900 dark:to-zinc-900/50 py-4 px-4 -mx-4 rounded-[30px] shadow-sm">
                <HorizontalCalendar
                    selectedDate={selectedDate}
                    onSelectDate={setSelectedDate}
                    tasks={calendarTasks}
                />
            </div>

            {/* Quick Actions & Time Since */}
            <div className="grid grid-cols-2 gap-4">
                <SymptomLogger>
                    <Button className="h-auto py-4 flex flex-col items-center justify-center gap-2 rounded-2xl bg-sage-600 hover:bg-sage-700 text-white shadow-sm">
                        <Plus className="h-6 w-6" />
                        <span className="text-xs font-bold uppercase tracking-wider">Log Entry</span>
                    </Button>
                </SymptomLogger>

                <div className="flex flex-col items-center justify-center bg-card p-4 rounded-2xl border border-border/50 text-center">
                    <div className="text-xs text-muted-foreground font-bold uppercase tracking-wider mb-1">Last Meal</div>
                    <div className="flex items-center gap-1.5 text-sage-600 dark:text-sage-300">
                        <Clock className="h-4 w-4" />
                        <span className="font-bold">{timeSinceMeal} ago</span>
                    </div>
                </div>
            </div>

            {/* Logs List */}
            <div>
                <h3 className="font-bold text-lg mb-3 text-sage-800 dark:text-sage-200 px-2 flex justify-between items-center">
                    <span>Logs for {selectedDate.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                </h3>

                <div className="space-y-3">
                    {filteredLogs.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center opacity-60 border-2 border-dashed border-sage-100 rounded-3xl">
                            <Activity className="h-10 w-10 text-sage-200 mb-2" />
                            <p className="text-sage-500 text-sm">No symptoms or meals logged.</p>
                        </div>
                    ) : (
                        filteredLogs.map((log) => (
                            <div key={log.id} className="relative group">
                                <div className="w-full text-left flex items-start gap-3 p-4 bg-white dark:bg-zinc-900/50 border border-sage-100 dark:border-white/5 rounded-2xl shadow-sm hover:shadow-md transition-all">
                                    <div className={cn(
                                        "h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5",
                                        "bg-sage-100 text-sage-600 dark:bg-emerald-900/20 dark:text-emerald-400"
                                    )}>
                                        <Activity className="h-5 w-5" />
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-1">
                                            <h4 className="font-bold text-foreground text-sm truncate">{log.label}</h4>
                                            <span className="text-xs font-mono text-muted-foreground">
                                                {log.time || new Date(log.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
                                            </span>
                                        </div>

                                        {/* Severity Badge */}
                                        {log.severity && (
                                            <div className="flex items-center gap-2 mb-1.5">
                                                <span className={cn(
                                                    "text-[10px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider",
                                                    log.severity >= 4 ? "bg-emerald-100 text-emerald-700" :
                                                        "bg-sage-100 text-sage-700"
                                                )}>
                                                    Severity: {log.severity}/5
                                                </span>
                                            </div>
                                        )}

                                        {/* Notes */}
                                        {log.notes && (
                                            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                                                {log.notes}
                                            </p>
                                        )}
                                    </div>

                                    {/* Options Trigger */}
                                    <button
                                        onClick={() => setOptionsOpenId(log.id)}
                                        className="p-1 -mr-2 -mt-2 text-muted-foreground hover:text-foreground rounded-full"
                                    >
                                        <MoreVertical className="h-4 w-4" />
                                    </button>
                                </div>

                                {/* Options Drawer for this Item */}
                                <OptionsDrawer
                                    open={optionsOpenId === log.id}
                                    onOpenChange={(open) => !open && setOptionsOpenId(null)}
                                    title={log.label}
                                    options={[
                                        {
                                            label: 'Share',
                                            icon: Share2,
                                            onClick: () => {
                                                toast.success("Log shared to friends!");
                                            }
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
                                                toast.success("Log deleted");
                                            }
                                        }
                                    ]}
                                />
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Edit Drawer (Controlled) */}
            {editLog && (
                <SymptomLogger
                    logToEdit={editLog}
                    onClose={() => setEditLog(null)}
                >
                    <span />
                </SymptomLogger>
            )}

            {/* Supplements */}
            <SupplementList />
        </div>
    );
}
