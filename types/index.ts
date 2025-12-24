export type Habit = {
    id: string;
    title: string;
    color: string; // Hex code or Tailwind class
    icon: string; // Lucide icon name
    completedDates: string[]; // ISO date strings (YYYY-MM-DD)
    streak: number;
};

export type TaskType = 'habit' | 'todo' | 'medication' | 'meal' | 'event';

export type TimelineTask = {
    id: string;
    title: string;
    time: string; // "08:00"
    date: string; // YYYY-MM-DD
    type: TaskType;
    completed: boolean;
    linkedHabitId?: string; // If this task corresponds to a habit
};

export type PetState = {
    name: string;
    type: 'hummingbird' | 'dragon';
    level: number;
    xp: number;
    mood: 'happy' | 'neutral' | 'sleepy' | 'excited';
    lastInteraction: string; // ISO string
};

export type HealthLog = {
    id: string;
    date: string;
    type: 'symptom' | 'food' | 'biomarker' | 'supplement';
    label: string; // e.g. "Headache", "Gluten", "Vitamin C"
    severity?: number; // 1-5
    time?: string; // "14:30"
    notes?: string;
    mealType?: 'breakfast' | 'lunch' | 'dinner' | 'snack';
    supplementId?: string; // For linking back to inventory
};

export type Friend = {
    id: string;
    name: string;
    avatar?: string;
    status: 'online' | 'offline' | 'busy';
    lastActive?: string;
};

export type Supplement = {
    id: string;
    name: string;
    dosage: string;
    stock: number;
    costPerBottle: number;
    pillsPerBottle: number;
    frequency: number; // pills per day
    category: 'vital' | 'non-vital';
};

export type FriendActivity = {
    id: string;
    friendId: string;
    friendName: string;
    action: string; // "completed Morning Yoga"
    timestamp: string; // ISO
};

export interface Protocol {
    id: string;
    title: string;
    description: string;
    creatorId: string;
    creatorName: string;
    tasks: TimelineTask[];
    isPublic: boolean;
    followers: number;
    price: number;
    rating: number;
    category: 'fitness' | 'nutrition' | 'wellness' | 'medical';
    coverImage?: string;
}

export interface MarketplaceItem extends Protocol {
    // Extending Protocol
}
