"use client";

import { useAppStore } from "@/store/useAppStore";
import { FriendCard } from "./FriendCard";
import { Users, Share2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function SocialView() {
    const friends = useAppStore((state) => state.friends);
    const friendActivity = useAppStore((state) => state.friendActivity);
    const triggerFriendActivity = useAppStore((state) => state.triggerFriendActivity);

    return (
        <div className="space-y-6 pb-24">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold flex items-center gap-2">
                    <Users className="h-6 w-6 text-sage-500" />
                    Community
                </h2>
                <div className="flex gap-2">
                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={triggerFriendActivity}
                        className="text-xs bg-sage-100 dark:bg-sage-800 text-sage-600 dark:text-sage-300"
                    >
                        Simulate Activity
                    </Button>
                    <Button variant="ghost" size="icon" className="rounded-full">
                        <Share2 className="h-5 w-5 text-muted-foreground" />
                    </Button>
                </div>
            </div>

            {/* Live Activity Feed */}
            {friendActivity.length > 0 && (
                <div className="space-y-2">
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Live Updates</h3>
                    <div className="space-y-2">
                        {friendActivity.map(activity => (
                            <div key={activity.id} className="bg-card p-3 rounded-xl border border-border/50 flex items-center gap-3 animate-in slide-in-from-top-2">
                                <div className="h-8 w-8 rounded-full bg-sage-200 dark:bg-sage-800 flex items-center justify-center font-bold text-xs text-sage-700 dark:text-sage-300">
                                    {activity.friendName.charAt(0)}
                                </div>
                                <div className="text-sm">
                                    <span className="font-semibold text-sage-900 dark:text-sage-100">{activity.friendName}</span>
                                    <span className="text-muted-foreground"> {activity.action}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Find friends..."
                    className="pl-9 rounded-xl bg-muted/30 border-none focus-visible:ring-1 focus-visible:ring-sage-400"
                />
            </div>

            {/* Friends List */}
            <div>
                <h3 className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wider">Your Circle</h3>
                {friends.length > 0 ? (
                    friends.map(friend => (
                        <FriendCard key={friend.id} friend={friend} />
                    ))
                ) : (
                    <div className="text-center py-10 bg-muted/20 rounded-2xl border border-dashed border-border">
                        <p className="text-muted-foreground">No friends yet.</p>
                        <Button variant="link" className="text-sage-500">Invite someone!</Button>
                    </div>
                )}
            </div>

            {/* Invite Banner */}
            <div className="bg-gradient-to-r from-sage-100 to-indigo-100 dark:from-sage-900/40 dark:to-indigo-900/20 p-6 rounded-2xl flex flex-col items-center text-center space-y-3">
                <h4 className="font-bold text-lg text-sage-900 dark:text-sage-100">Stay Consistent Together</h4>
                <p className="text-sm text-sage-700 dark:text-sage-300 max-w-[200px]">
                    Habits are 42% more likely to stick when you have an accountability partner.
                </p>
                <Button className="rounded-full bg-sage-600 hover:bg-sage-700 text-white w-full max-w-[200px]">
                    Invite Friend
                </Button>
            </div>
        </div>
    );
}
