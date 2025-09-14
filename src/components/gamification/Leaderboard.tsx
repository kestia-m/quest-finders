// src/components/gamification/Leaderboard.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Crown, Trophy, Medal, Users, Star, Sparkles, Award } from "lucide-react";
import { dataService, type LeaderboardEntry } from '@/services/dataService';
import { useState, useEffect } from 'react';

interface Props {
  type: 'global' | 'friends';
}

interface UserProgression {
  level: number;
  currentXP: number;
  nextLevelXP: number;
  badges: string[];
}

export function Leaderboard({ type = 'global' }: Props) {
  const entries: LeaderboardEntry[] = dataService.getLeaderboards(type);
  const [timeframe, setTimeframe] = useState<'weekly' | 'monthly' | 'alltime'>('weekly');
  const [userProgression, setUserProgression] = useState<UserProgression>({
    level: 1,
    currentXP: 250,
    nextLevelXP: 1000,
    badges: ["Vibe Voyager"]
  });

  useEffect(() => {
    // Load user progression from localStorage or API
    const savedProgression = localStorage.getItem('userProgression');
    if (savedProgression) {
      setUserProgression(JSON.parse(savedProgression));
    }
  }, []);

  // Add level information to entries
  const enhancedEntries = entries.map(entry => ({
    ...entry,
    level: Math.floor(entry.xp / 1000) + 1,
    nextLevelXP: (Math.floor(entry.xp / 1000) + 1) * 1000,
    currentLevelXP: entry.xp % 1000
  }));

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="h-6 w-6 text-yellow-500 fill-yellow-100" />;
    if (rank === 2) return <Medal className="h-5 w-5 text-gray-400 fill-gray-100" />;
    if (rank === 3) return <Medal className="h-5 w-5 text-amber-700 fill-amber-100" />;
    return <span className="text-sm font-bold w-6 h-6 flex items-center justify-center bg-muted rounded-full">{rank}</span>;
  };

  const getRankBorder = (rank: number) => {
    if (rank === 1) return "border-2 border-yellow-400 shadow-lg";
    if (rank === 2) return "border-2 border-gray-300 shadow-md";
    if (rank === 3) return "border-2 border-amber-600 shadow";
    return "";
  };

  const currentUser = {
    id: "user1",
    username: "ExplorerJane",
    rank: 4,
    xp: userProgression.currentXP,
    level: userProgression.level,
    badges: userProgression.badges,
    nextLevelXP: userProgression.nextLevelXP
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="pb-3 bg-gradient-to-r from-purple-50 to-blue-50 rounded-t-lg">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-2xl">
            {type === 'global' ? <Trophy className="h-6 w-6 text-amber-500" /> : <Users className="h-6 w-6 text-blue-500" />}
            {type.charAt(0).toUpperCase() + type.slice(1)} Leaderboard
          </CardTitle>
          <div className="flex gap-1 bg-background p-1 rounded-md">
            {(['weekly', 'monthly', 'alltime'] as const).map((time) => (
              <button
                key={time}
                className={`px-3 py-1 text-sm rounded-md transition-all ${
                  timeframe === time 
                    ? 'bg-primary text-primary-foreground shadow' 
                    : 'bg-transparent text-muted-foreground hover:text-foreground'
                }`}
                onClick={() => setTimeframe(time)}
              >
                {time.charAt(0).toUpperCase() + time.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-6">
        {/* Current User Stats */}
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-4 rounded-lg mb-6 border border-primary/20">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="font-bold text-lg">{currentUser.rank}.</div>
              <div className="font-semibold text-lg">{currentUser.username}</div>
              <Badge variant="default" className="flex items-center gap-1">
                <Sparkles className="h-3 w-3" />
                Level {currentUser.level}
              </Badge>
            </div>
            <div className="font-bold text-primary text-lg">{currentUser.xp} XP</div>
          </div>
          
          <div className="space-y-2">
            <Progress 
              value={(currentUser.xp / currentUser.nextLevelXP) * 100} 
              className="h-2" 
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{currentUser.nextLevelXP - currentUser.xp} XP to level {currentUser.level + 1}</span>
              <span>{currentUser.xp}/{currentUser.nextLevelXP} XP</span>
            </div>
          </div>
          
          {currentUser.badges.length > 0 && (
            <div className="mt-3 flex gap-2 flex-wrap">
              {currentUser.badges.map(badge => (
                <Badge key={badge} variant="secondary" className="flex items-center gap-1">
                  <Award className="h-3 w-3" />
                  {badge}
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Leaderboard List */}
        <div className="space-y-4">
          {enhancedEntries.map(entry => (
            <div 
              key={entry.userId} 
              className={`flex items-center justify-between p-4 rounded-xl transition-all hover:scale-[1.02] ${
                entry.userId === currentUser.id 
                  ? 'bg-primary/10 border-2 border-primary/30 shadow-md' 
                  : 'bg-card shadow-sm'
              } ${getRankBorder(entry.rank)}`}
            >
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <div className="flex-shrink-0">
                  {getRankIcon(entry.rank)}
                </div>
                
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="min-w-0">
                    <div className="font-semibold truncate">{entry.username}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        Lvl {entry.level}
                      </Badge>
                      <Progress 
                        value={(entry.currentLevelXP! / 1000) * 100} 
                        className="h-1 w-16" 
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-4 flex-shrink-0">
                {entry.badges && entry.badges.length > 0 && (
                  <div className="hidden md:flex gap-1">
                    {entry.badges.slice(0, 2).map(badge => (
                      <Badge key={badge} variant="outline" className="text-xs">
                        {badge}
                      </Badge>
                    ))}
                    {entry.badges.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{entry.badges.length - 2}
                      </Badge>
                    )}
                  </div>
                )}
                
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-amber-500" />
                  <span className="font-bold text-primary">{entry.xp} XP</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {enhancedEntries.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <Trophy className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
            <p className="text-lg">No entries yet</p>
            <p className="text-sm">Complete quests to appear on the leaderboard!</p>
          </div>
        )}

        {/* Leaderboard Tips */}
        <div className="mt-6 p-4 bg-muted/30 rounded-lg">
          <h4 className="font-semibold mb-2 flex items-center gap-2">
            <Star className="h-4 w-4 text-amber-500" />
            How to climb the leaderboard:
          </h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Complete quests for XP rewards</li>
            <li>• Join group quests for bonus XP</li>
            <li>• Share your travel tales for upvote bonuses</li>
            <li>• Visit new spots and leave reviews</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}