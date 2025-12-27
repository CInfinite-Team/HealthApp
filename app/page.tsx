"use client";

import { useAppStore } from "@/store/useAppStore";
import { HabitCard } from "@/components/habit/HabitCard";
import { TimelineTask } from "@/types";
import { PetWidget } from "@/components/pet/PetWidget";
import { TimelineView } from "@/components/timeline/TimelineView";
import { Button } from "@/components/ui/button";
import { Plus, Users, Compass, FileText } from "lucide-react";
import { useEffect, useState } from "react";
import { TimelineTaskDrawer } from "@/components/timeline/TimelineTaskDrawer";
import { AddHabit } from "@/components/habit/AddHabit";
import Link from "next/link";
import { HorizontalCalendar } from "@/components/home/HorizontalCalendar";
import { StatsOverview } from "@/components/home/StatsOverview";
import { DailyScheduleDrawer } from "@/components/home/DailyScheduleDrawer";

export default function Home() {
  const { habits, timeline } = useAppStore();
  const [mounted, setMounted] = useState(false);
  const [greeting, setGreeting] = useState("Good Morning");
  const [selectedDate, setSelectedDate] = useState(new Date());

  const [isScheduleOpen, setIsScheduleOpen] = useState(false);

  // Interaction State
  const [taskDrawerOpen, setTaskDrawerOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<TimelineTask | undefined>(undefined);
  const [newTaskTime, setNewTaskTime] = useState<string | undefined>(undefined);

  const [currentTime, setCurrentTime] = useState(new Date());

  // Hydration fix for Persist middleware & Time check
  useEffect(() => {
    setMounted(true);

    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now);
      const hour = now.getHours();
      if (hour < 12) setGreeting("Good Morning");
      else if (hour < 18) setGreeting("Good Afternoon");
      else setGreeting("Good Evening");
    };

    updateTime(); // Initial run
    const timer = setInterval(updateTime, 1000 * 60); // Update every minute

    return () => clearInterval(timer);
  }, []);

  if (!mounted) return <div className="p-8 flex items-center justify-center min-h-screen text-sage-400">Loading your space...</div>;

  const dateStr = selectedDate.toISOString().split('T')[0];
  const filteredTimeline = timeline.filter(t => t.date === dateStr);

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setIsScheduleOpen(true);
  };

  const handleAddTask = (time?: string) => {
    setEditingTask(undefined);
    setNewTaskTime(time || "09:00");
    setTaskDrawerOpen(true);
  };

  const handleEditTask = (task: TimelineTask) => {
    setEditingTask(task);
    setTaskDrawerOpen(true);
  };

  // Habits are daily for now, so show all. 
  // Calculate stats based on selected date.

  const completedHabitsCount = habits.filter(h => h.completedDates.includes(dateStr)).length;
  const totalHabits = habits.length;

  // Streak calculation (simplified: checking if today has at least one completion? Or just raw streak from store not implemented properly yet, so let's count consecutive days from yesterday backward? 
  // For now let's just use a placeholder logic or simple current streak if we had it. 
  // Let's count how many days in a row at least one habit was completed.
  const calculateStreak = () => {
    let streak = 0;
    const today = new Date();
    // check up to 365 days back
    for (let i = 0; i < 365; i++) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const dStr = d.toISOString().split('T')[0];
      const anyCompleted = habits.some(h => h.completedDates.includes(dStr));
      if (anyCompleted) streak++;
      else if (i > 0) break; // Break if missed a day (excluding today if 0)
    }
    return streak;
  };

  // Generate task indicators for calendar (map date -> completed status)
  // We need a list of dates that have tasks or habits
  // For the calendar prop, we can pass a flat list of status objects for the visible range, but the component handles its own date generation.
  // We'll pass a simplified "tasks" prop that just contains date strings and completion status to color the dots.
  // Let's gather all unique dates from timeline + habit completions

  // Actually, the calendar component I wrote takes `tasks: { date: string; completed: boolean }[]`.
  // Let's generate this from timeline + habits.

  // Flatten habit completions into { date, completed: true }
  const habitCompletions = habits.flatMap(h =>
    h.completedDates.map(date => ({ date, completed: true }))
  );

  const calendarTasks = [
    ...timeline.map(t => ({ date: t.date, completed: t.completed })),
    ...habitCompletions
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-24">

      {/* Pet Widget (Top) */}
      <PetWidget />

      {/* Header & Calendar */}
      <div className="bg-gradient-to-br from-white to-sage-50 dark:from-zinc-900 dark:to-zinc-950 pt-6 pb-6 px-5 rounded-[32px] shadow-sm mb-6 border border-transparent dark:border-white/5 mx-2">
        <header className="flex justify-between items-start mb-6 pl-1 pr-1">
          <div className="pt-1">
            <h1 className="text-2xl font-bold font-serif text-sage-900 dark:text-sage-100">{greeting}</h1>
            <p className="text-sm text-sage-500 dark:text-sage-400 mt-1">Let's have a gentle day.</p>
          </div>
          <div className="flex flex-col items-end gap-3">
            <div className="px-3 py-1.5 text-xs font-mono text-sage-600 bg-white/60 dark:bg-black/40 rounded-full border border-sage-100 dark:border-white/10 backdrop-blur-sm whitespace-nowrap shadow-sm">
              {/* Dynamic Month/Time */}
              {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
            <div className="flex gap-2">
              <Link href="/reports">
                <Button variant="ghost" size="icon" className="h-10 w-10 text-sage-400 hover:text-sage-600 hover:bg-sage-100 rounded-full border border-transparent hover:border-sage-200">
                  <FileText className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="/social">
                <Button variant="ghost" size="icon" className="h-10 w-10 text-sage-400 hover:text-sage-600 hover:bg-sage-100 rounded-full border border-transparent hover:border-sage-200">
                  <Users className="h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </header>

        <HorizontalCalendar
          selectedDate={selectedDate}
          onSelectDate={handleDateSelect}
          tasks={calendarTasks}
        />
      </div>

      <div className="px-1">

        <StatsOverview
          completedToday={completedHabitsCount}
          totalToday={totalHabits}
          streak={calculateStreak()}
        />

        {/* Sections Grid */}
        {/* Sections Grid */}
        <div className="grid grid-cols-1 gap-8">
          {/* Timeline Section */}
          <section>
            <div className="flex items-center justify-between mb-4 px-2">
              <h2 className="text-lg font-bold text-sage-800 dark:text-sage-200">Timeline</h2>
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0 rounded-full border-sage-300 text-sage-600 hover:bg-sage-100"
                onClick={() => handleAddTask()}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <TimelineView tasks={filteredTimeline} />
          </section>

          {/* Habits Section */}
          <section>
            <div className="flex items-center justify-between mb-4 px-2">
              <h2 className="text-lg font-bold text-sage-800 dark:text-sage-200">Daily Habits</h2>
              <AddHabit>
                <Button variant="outline" size="sm" className="h-8 w-8 p-0 rounded-full border-sage-300 text-sage-600 hover:bg-sage-100">
                  <Plus className="h-4 w-4" />
                </Button>
              </AddHabit>
            </div>
            <div>
              {habits.filter(habit => {
                const day = selectedDate.getDay(); // 0 = Sunday
                if (!habit.frequency || habit.frequency === 'daily') return true;
                if (habit.frequency === 'weekdays' && day >= 1 && day <= 5) return true;
                if (habit.frequency === 'weekends' && (day === 0 || day === 6)) return true;
                return false;
              }).map(habit => (
                <HabitCard key={habit.id} habit={habit} date={selectedDate} />
              ))}
            </div>
          </section>
        </div>

        {/* Schedule Drawer */}
        <DailyScheduleDrawer
          open={isScheduleOpen}
          onOpenChange={setIsScheduleOpen}
          date={selectedDate}
          tasks={timeline}
          habits={habits.map(h => ({
            title: h.title,
            completed: h.completedDates.includes(selectedDate.toISOString().split('T')[0])
          }))}
          onAddTask={handleAddTask}
          onEditTask={handleEditTask}
        />

        {/* Global Task Drawer (Controlled) */}
        <TimelineTaskDrawer
          open={taskDrawerOpen}
          onOpenChange={setTaskDrawerOpen}
          task={editingTask}
          defaultDate={selectedDate}
          defaultTime={newTaskTime}
          noTrigger
        />

      </div>
    </div>
  );
}
