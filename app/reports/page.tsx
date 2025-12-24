"use client";

import { useState } from "react";
import { useAppStore } from "@/store/useAppStore";
import { isSameDay, isSameWeek, isSameMonth } from "date-fns";
import { Calendar, Filter, Download, ArrowLeft, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Capacitor } from "@capacitor/core";
import { Filesystem, Directory } from "@capacitor/filesystem";
import { Share } from "@capacitor/share";
import { toast } from "sonner";

export default function ReportsPage() {
    const { habits, timeline, healthLogs, supplements } = useAppStore();

    // Filters
    const [range, setRange] = useState<'today' | 'week' | 'month' | 'all'>('week');

    const [sections, setSections] = useState({
        habits: true,
        tasks: true,
        symptoms: true,
        meals: true,
        supplements: true,
    });

    // Theme Colors from globals.css
    const theme = {
        primary: "#3d6a43", // sage-600
        secondary: "#t7a378", // sage-400 (approx)
        accent: "#4f8557", // sage-500
        dark: "#233827", // sage-900
        light: "#f4f9f4", // sage-50
        text: "#2a442e", // sage-800
    };

    // Helper to check date range
    const filterByDate = (dateStr: string) => {
        const date = new Date(dateStr);
        const now = new Date();

        switch (range) {
            case 'today': return isSameDay(date, now);
            case 'week': return isSameWeek(date, now, { weekStartsOn: 1 });
            case 'month': return isSameMonth(date, now);
            case 'all': return true;
            default: return true;
        }
    };

    const generatePDF = async () => {
        const doc = new jsPDF();

        // --- HEADER ---
        // Green Banner
        doc.setFillColor(theme.primary);
        doc.rect(0, 0, 210, 40, 'F');

        // Title
        doc.setTextColor(255, 255, 255);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(22);
        doc.text("Health & Wellness Report", 14, 20);

        // Date/Range
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        const dateText = `Generated: ${new Date().toLocaleDateString()} | Range: ${range.toUpperCase()}`;
        doc.text(dateText, 14, 30);

        let finalY = 45; // Start content below banner

        // --- 1. HABITS ---
        if (sections.habits) {
            doc.setFontSize(14);
            doc.setTextColor(theme.dark);
            doc.text("Habits & Consistency", 14, finalY);
            finalY += 6;

            const habitRows = habits.map(h => {
                const completionsInRange = h.completedDates.filter(d => filterByDate(d)).length;
                return [h.title, completionsInRange, h.streak + " days"];
            });

            if (habitRows.length === 0) {
                doc.setFontSize(10);
                doc.setTextColor(100);
                doc.text("No habits found.", 14, finalY);
                finalY += 10;
            } else {
                autoTable(doc, {
                    startY: finalY,
                    head: [['Habit', 'Completions (In Range)', 'Current Streak']],
                    body: habitRows,
                    theme: 'grid',
                    headStyles: { fillColor: theme.primary },
                    styles: { fontSize: 9 },
                });
                // @ts-ignore
                finalY = doc.lastAutoTable.finalY + 15;
            }
        }

        // --- 2. TASKS ---
        if (sections.tasks) {
            doc.setFontSize(14);
            doc.setTextColor(theme.dark);
            doc.text("Timeline Tasks", 14, finalY);
            finalY += 6;

            const tasks = timeline.filter(t => filterByDate(t.date));
            const taskRows = tasks.map(t => [
                t.date,
                t.time,
                t.title,
                t.type,
                t.completed ? "Done" : "Pending"
            ]);

            if (taskRows.length === 0) {
                doc.setFontSize(10);
                doc.setTextColor(100);
                doc.text("No tasks found in this range.", 14, finalY);
                finalY += 10;
            } else {
                autoTable(doc, {
                    startY: finalY,
                    head: [['Date', 'Time', 'Task', 'Type', 'Status']],
                    body: taskRows,
                    theme: 'grid',
                    headStyles: { fillColor: theme.primary },
                    styles: { fontSize: 9 },
                });
                // @ts-ignore
                finalY = doc.lastAutoTable.finalY + 15;
            }
        }

        // --- 3. MEALS ---
        if (sections.meals) {
            doc.setFontSize(14);
            doc.setTextColor(theme.dark);
            doc.text("Nutrition & Meals", 14, finalY);
            finalY += 6;

            const meals = healthLogs.filter(l => l.type === 'food' && filterByDate(l.date));
            const mealRows = meals.map(m => [
                new Date(m.date).toLocaleDateString(),
                m.time || "-",
                m.mealType || "-",
                m.label,
                m.notes || "-"
            ]);

            if (mealRows.length === 0) {
                doc.setFontSize(10);
                doc.setTextColor(100);
                doc.text("No meals logged.", 14, finalY);
                finalY += 10;
            } else {
                autoTable(doc, {
                    startY: finalY,
                    head: [['Date', 'Time', 'Type', 'Food Item', 'Notes']],
                    body: mealRows,
                    theme: 'grid',
                    headStyles: { fillColor: theme.primary },
                    styles: { fontSize: 9 },
                });
                // @ts-ignore
                finalY = doc.lastAutoTable.finalY + 15;
            }
        }

        // --- 4. SYMPTOMS ---
        if (sections.symptoms) {
            doc.setFontSize(14);
            doc.setTextColor(theme.dark);
            doc.text("Symptoms & Wellness", 14, finalY);
            finalY += 6;

            const syms = healthLogs.filter(l => (l.type === 'symptom' || l.type === 'biomarker') && filterByDate(l.date));
            const symRows = syms.map(s => [
                new Date(s.date).toLocaleDateString(),
                s.time || "-",
                s.type,
                s.label,
                s.severity || "-"
            ]);

            if (symRows.length === 0) {
                doc.setFontSize(10);
                doc.setTextColor(100);
                doc.text("No symptoms recorded.", 14, finalY);
                finalY += 10;
            } else {
                autoTable(doc, {
                    startY: finalY,
                    head: [['Date', 'Time', 'Category', 'Label', 'Severity']],
                    body: symRows,
                    theme: 'grid',
                    headStyles: { fillColor: theme.primary },
                    styles: { fontSize: 9 },
                });
                // @ts-ignore
                finalY = doc.lastAutoTable.finalY + 15;
            }
        }

        // --- 5. SUPPLEMENTS ---
        if (sections.supplements) {
            doc.setFontSize(14);
            doc.setTextColor(theme.dark);
            doc.text("Supplement Intake", 14, finalY);
            finalY += 6;

            const suppLogs = healthLogs.filter(l => l.type === 'supplement' && filterByDate(l.date));
            const suppRows = suppLogs.map(s => [
                new Date(s.date).toLocaleDateString(),
                s.time || "-",
                s.label
            ]);

            if (suppRows.length === 0) {
                doc.setFontSize(10);
                doc.setTextColor(100);
                doc.text("No supplements history.", 14, finalY);
                finalY += 10;
            } else {
                autoTable(doc, {
                    startY: finalY,
                    head: [['Date', 'Time', 'Detail']],
                    body: suppRows,
                    theme: 'grid',
                    headStyles: { fillColor: theme.primary },
                    styles: { fontSize: 9 },
                });
            }
        }

        // Save or Share
        if (Capacitor.isNativePlatform()) {
            try {
                const base64 = doc.output('datauristring').split(',')[1];
                const fileName = `HealthReport_${range}_${new Date().toISOString().split('T')[0]}.pdf`;

                await Filesystem.writeFile({
                    path: fileName,
                    data: base64,
                    directory: Directory.Cache
                });

                const fileUri = await Filesystem.getUri({
                    directory: Directory.Cache,
                    path: fileName
                });

                await Share.share({
                    title: 'Health Report',
                    text: `Here is my health report for ${range}.`,
                    url: fileUri.uri,
                    dialogTitle: 'Share Health Report'
                });

                toast.success("Report ready to share!");
            } catch (e) {
                console.error("Native share failed", e);
                toast.error("Failed to share report on mobile.");
            }
        } else {
            // Web Download
            doc.save(`HealthReport_${range}_${new Date().toISOString().split('T')[0]}.pdf`);
            toast.success("Report downloaded!");
        }
    };

    return (
        <div className="min-h-screen bg-background pb-20 p-6 animate-in fade-in duration-500">
            <header className="flex items-center gap-4 mb-8">
                <Link href="/" className="p-2 -ml-2 rounded-full hover:bg-muted/50 transition-colors">
                    <ArrowLeft className="h-6 w-6 text-foreground" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold font-serif">Reports & Exports</h1>
                    <p className="text-sm text-muted-foreground">Download your health data</p>
                </div>
            </header>

            <div className="space-y-8 max-w-lg mx-auto">
                {/* 1. Date Range */}
                <section className="space-y-3">
                    <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                        <Calendar className="h-4 w-4" /> Date Range
                    </h2>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                        {(['today', 'week', 'month', 'all'] as const).map((r) => (
                            <button
                                key={r}
                                onClick={() => setRange(r)}
                                className={cn(
                                    "px-4 py-3 rounded-xl text-sm font-medium border transition-all",
                                    range === r
                                        ? "bg-sage-600 border-sage-700 text-white shadow-md shadow-sage-200 dark:shadow-none"
                                        : "bg-card border-border hover:bg-muted text-foreground"
                                )}
                            >
                                {r === 'all' ? 'All Time' : r.charAt(0).toUpperCase() + r.slice(1)}
                            </button>
                        ))}
                    </div>
                </section>

                {/* 2. Sections to Include */}
                <section className="space-y-3">
                    <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                        <Filter className="h-4 w-4" /> Include Sections
                    </h2>
                    <div className="grid grid-cols-1 gap-3">
                        {[
                            { id: 'habits', label: 'Habits & Streaks' },
                            { id: 'tasks', label: 'Tasks & To-Dos' },
                            { id: 'symptoms', label: 'Symptoms & Biomarkers' },
                            { id: 'meals', label: 'Meal Logs' },
                            { id: 'supplements', label: 'Supplement Intake' },
                        ].map((s) => (
                            <div
                                key={s.id}
                                onClick={() => setSections(prev => ({ ...prev, [s.id as keyof typeof sections]: !prev[s.id as keyof typeof sections] }))}
                                className={cn(
                                    "flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all",
                                    sections[s.id as keyof typeof sections]
                                        ? "bg-sage-50/50 border-sage-200 dark:bg-zinc-900 dark:border-zinc-800"
                                        : "bg-card border-transparent opacity-60 hover:opacity-100"
                                )}
                            >
                                <span className="font-medium">{s.label}</span>
                                <div className={cn(
                                    "h-6 w-6 rounded-full border flex items-center justify-center transition-colors",
                                    sections[s.id as keyof typeof sections]
                                        ? "bg-sage-500 border-sage-600 text-white"
                                        : "border-muted-foreground/30"
                                )}>
                                    {sections[s.id as keyof typeof sections] && <CheckCircle2 className="h-4 w-4" />}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <div className="pt-4">
                    <Button
                        onClick={generatePDF}
                        className="w-full h-14 text-lg rounded-2xl bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 shadow-xl"
                    >
                        <Download className="mr-2 h-5 w-5" />
                        Download PDF Report
                    </Button>
                    <p className="text-center text-xs text-muted-foreground mt-4">
                        Generates a formatted PDF with your selected data.
                    </p>
                </div>
            </div>
        </div>
    );
}
