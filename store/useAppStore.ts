import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Habit, TimelineTask, PetState, HealthLog, Friend, Supplement, Protocol } from '@/types';

interface AppState {
    habits: Habit[];
    timeline: TimelineTask[];
    pet: PetState;
    healthLogs: HealthLog[];
    friends: Friend[];
    supplements: Supplement[];

    // Actions
    addHabit: (habit: Habit) => void;
    updateHabit: (habit: Habit) => void;
    toggleHabit: (id: string, date: string) => void;
    addTimelineTask: (task: TimelineTask) => void;
    updateTimelineTask: (task: TimelineTask) => void;
    deleteTimelineTask: (id: string) => void;
    updatePet: (updates: Partial<PetState>) => void;
    addHealthLog: (log: HealthLog) => void;
    updateHealthLog: (log: HealthLog) => void;
    deleteHealthLog: (id: string) => void;
    deleteHabit: (id: string) => void;
    addFriend: (friend: Friend) => void;
    removeFriend: (id: string) => void;
    addSupplement: (supp: Supplement) => void;
    updateSupplement: (supp: Supplement) => void;
    deleteSupplement: (id: string) => void;
    takeSupplement: (id: string) => void;

    // Social
    friendActivity: import('@/types').FriendActivity[];
    triggerFriendActivity: () => void;
    pingFriends: (message: string) => void;


    // Marketplace / Protocols
    protocols: import('@/types').Protocol[];
    joinedProtocols: string[]; // IDs of joined protocols
    joinProtocol: (protocolId: string) => void;
    createProtocol: (protocol: import('@/types').Protocol) => void;
}

export const useAppStore = create<AppState>()(
    persist(
        (set, get) => ({
            habits: [],
            timeline: [],
            pet: {
                name: 'Luna',
                type: 'hummingbird',
                level: 1,
                xp: 0,
                mood: 'happy',
                lastInteraction: new Date().toISOString(),
            },
            healthLogs: [],
            friends: [],
            supplements: [],

            addHabit: (habit) => set((state) => ({ habits: [...state.habits, habit] })),

            updateHabit: (updatedHabit) => set((state) => ({
                habits: state.habits.map(h => h.id === updatedHabit.id ? updatedHabit : h)
            })),

            toggleHabit: (id, date) => set((state) => {
                const habit = state.habits.find(h => h.id === id);
                if (!habit) return state;

                const newCompleted = !habit.completedDates.includes(date);
                const newDates = newCompleted
                    ? [...habit.completedDates, date]
                    : habit.completedDates.filter(d => d !== date);

                // XP Logic
                let newPet = { ...state.pet };
                if (newCompleted) {
                    newPet.xp += 10;
                    // Simple Level Up: Every 100 XP
                    const newLevel = Math.floor(newPet.xp / 100) + 1;
                    if (newLevel > newPet.level) {
                        newPet.level = newLevel;
                        // Maybe trigger a mood upgrade?
                        newPet.mood = 'excited';
                    }
                } else {
                    // Optional: Remove XP if unchecked? 
                    // Let's keep XP to be nice, or remove it. Strict mode: remove.
                    newPet.xp = Math.max(0, newPet.xp - 10);
                    newPet.level = Math.floor(newPet.xp / 100) + 1;
                }

                return {
                    habits: state.habits.map(h => h.id === id ? { ...h, completedDates: newDates } : h),
                    pet: newPet
                };
            }),

            addTimelineTask: (task) => set((state) => ({ timeline: [...state.timeline, task] })),

            updateTimelineTask: (updatedTask) => set((state) => {
                const oldTask = state.timeline.find(t => t.id === updatedTask.id);
                let newPet = { ...state.pet };

                if (oldTask) {
                    // Check if completion status changed
                    if (updatedTask.completed && !oldTask.completed) {
                        newPet.xp += 10;
                        const newLevel = Math.floor(newPet.xp / 100) + 1;
                        if (newLevel > newPet.level) {
                            newPet.level = newLevel;
                            newPet.mood = 'excited';
                        }
                    } else if (!updatedTask.completed && oldTask.completed) {
                        newPet.xp = Math.max(0, newPet.xp - 10);
                        newPet.level = Math.floor(newPet.xp / 100) + 1;
                    }
                }

                return {
                    timeline: state.timeline.map(t => t.id === updatedTask.id ? updatedTask : t),
                    pet: newPet
                };
            }),

            deleteTimelineTask: (id) => set((state) => ({
                timeline: state.timeline.filter(t => t.id !== id)
            })),

            updatePet: (updates) => set((state) => ({ pet: { ...state.pet, ...updates } })),

            addHealthLog: (log) => set((state) => {
                let newPet = { ...state.pet };
                // Award XP for logging food (meal) as requested
                // User said "everything", but let's stick to meals for now as explicitly requested alongside supplements
                if (log.type === 'food') {
                    newPet.xp += 10;
                    const newLevel = Math.floor(newPet.xp / 100) + 1;
                    if (newLevel > newPet.level) {
                        newPet.level = newLevel;
                        newPet.mood = 'excited';
                    }
                }
                return {
                    healthLogs: [...state.healthLogs, log],
                    pet: newPet
                };
            }),

            updateHealthLog: (updatedLog) => set((state) => ({
                healthLogs: state.healthLogs.map(l => l.id === updatedLog.id ? updatedLog : l)
            })),

            deleteHealthLog: (id) => set((state) => ({
                healthLogs: state.healthLogs.filter(l => l.id !== id)
            })),

            deleteHabit: (id) => set((state) => ({ habits: state.habits.filter(h => h.id !== id) })),

            addFriend: (friend) => set((state) => ({ friends: [...state.friends, friend] })),

            removeFriend: (id) => set((state) => ({ friends: state.friends.filter(f => f.id !== id) })),

            addSupplement: (supp) => set((state) => ({ supplements: [...state.supplements, supp] })),

            updateSupplement: (updatedSupp) => set((state) => ({
                supplements: state.supplements.map(s => s.id === updatedSupp.id ? updatedSupp : s)
            })),

            deleteSupplement: (id) => set((state) => ({ supplements: state.supplements.filter(s => s.id !== id) })),

            takeSupplement: (id) => set((state) => {
                let newPet = { ...state.pet };
                newPet.xp += 10;
                const newLevel = Math.floor(newPet.xp / 100) + 1;
                if (newLevel > newPet.level) {
                    newPet.level = newLevel;
                    newPet.mood = 'excited';
                }

                // Add Health Log for history
                const supplement = state.supplements.find(s => s.id === id);
                const newLog: HealthLog = {
                    id: crypto.randomUUID(),
                    date: new Date().toISOString(),
                    type: 'supplement',
                    label: supplement ? `Took ${supplement.name}` : 'Supplement',
                    supplementId: id,
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
                };

                return {
                    supplements: state.supplements.map(s => s.id === id ? { ...s, stock: Math.max(0, s.stock - 1) } : s),
                    pet: newPet,
                    healthLogs: [...state.healthLogs, newLog]
                };
            }),

            friendActivity: [],
            triggerFriendActivity: () => {
                const activities = [
                    "completed Morning Yoga",
                    "drank water",
                    "finished a 5k run",
                    "meditated for 10 mins",
                    "ate a healthy lunch"
                ];
                const randomActivity = activities[Math.floor(Math.random() * activities.length)];
                const names = ["Sarah", "Mike", "Jessica", "David", "Emma"];
                const randomName = names[Math.floor(Math.random() * names.length)];

                const newActivity = {
                    id: Math.random().toString(),
                    friendId: "mock-friend",
                    friendName: randomName,
                    action: randomActivity,
                    timestamp: new Date().toISOString()
                };

                set((state) => ({ friendActivity: [newActivity, ...state.friendActivity].slice(0, 10) }));
            },

            pingFriends: (message) => {
                // Mock network request
                console.log("Pinging friends:", message);
                // We could add this to our own activity feed if we had one
            },

            protocols: [
                {
                    id: 'p1',
                    title: '7-Day Keto Kickstart',
                    description: 'A beginner-friendly low-carb meal plan to reset your metabolism.',
                    creatorId: 'pro-1',
                    creatorName: 'Dr. Sarah Fit',
                    tasks: [], // We'd populate this with template tasks
                    isPublic: true,
                    followers: 1240,
                    price: 0,
                    rating: 4.8,
                    category: 'nutrition'
                },
                {
                    id: 'p2',
                    title: 'Morning Mobility Routine',
                    description: '15-minute daily stretch routine to improve posture and energy.',
                    creatorId: 'pro-2',
                    creatorName: 'Coach Mike',
                    tasks: [],
                    isPublic: true,
                    followers: 850,
                    price: 29,
                    rating: 4.5,
                    category: 'fitness'
                }
            ],
            joinedProtocols: [],

            createProtocol: (protocol) => set((state) => ({ protocols: [...state.protocols, protocol] })),

            joinProtocol: (protocolId) => set((state) => {
                if (state.joinedProtocols.includes(protocolId)) return state;

                const protocol = state.protocols.find(p => p.id === protocolId);
                // In a real app, we'd copy tasks here. For now, just mark joined.
                // We'll simulate adding tasks:
                let newTimeline = [...state.timeline];
                if (protocol) {
                    const sampleTask: TimelineTask = {
                        id: crypto.randomUUID(),
                        title: `Start ${protocol.title}`,
                        time: "08:00",
                        date: new Date().toISOString().split('T')[0],
                        type: 'event', // or 'todo'
                        completed: false
                    };
                    newTimeline.push(sampleTask);
                }

                return {
                    joinedProtocols: [...state.joinedProtocols, protocolId],
                    timeline: newTimeline
                };
            }),
        }),
        {
            name: 'health-app-production',
            storage: createJSONStorage(() => localStorage),
        }
    )
);
