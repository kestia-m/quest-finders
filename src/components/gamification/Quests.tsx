// src/components/gamification/Quests.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Users, MapPin, Target, Calendar, Trophy, Sparkles, Crown, Star, Award } from "lucide-react";
import { dataService, type Quest } from "@/services/dataService";
import { useState } from "react";
import { Sidebar, MobileSidebar } from "@/components/ui/Sidebar"; // Adjust import path as needed
import { useLocation } from "react-router-dom";

interface QuestProgress {
  [key: string]: number;
}

interface GroupMember {
  id: string;
  name: string;
  avatar: string;
  progress: number;
}

interface QuestGroup {
  questId: string;
  members: GroupMember[];
}

interface UserProgression {
  level: number;
  currentXP: number;
  nextLevelXP: number;
  badges: string[];
  questsCompleted: number;
}

export function Quests() {
  const quests: Quest[] = dataService.getQuests();
  const [questProgress, setQuestProgress] = useState<QuestProgress>({});
  const [activeGroups, setActiveGroups] = useState<QuestGroup[]>([]);
  const [selectedQuest, setSelectedQuest] = useState<string | null>(null);
  const [userProgression, setUserProgression] = useState<UserProgression>({
    level: 1,
    currentXP: 250,
    nextLevelXP: 1000,
    badges: ["Vibe Voyager"],
    questsCompleted: 1
  });
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [newLevel, setNewLevel] = useState(0);

  useEffect(() => {
    // Load user progression from localStorage or API
    const savedProgression = localStorage.getItem('userProgression');
    if (savedProgression) {
      setUserProgression(JSON.parse(savedProgression));
    }
  }, []);

  const updateQuestProgress = (questId: string, progress: number) => {
    const newProgress = Math.min(progress, 100);
    setQuestProgress(prev => ({ ...prev, [questId]: newProgress }));
    
    // Check for completion
    if (newProgress >= 100 && questProgress[questId] < 100) {
      const quest = quests.find(q => String(q.id) === questId);
      if (quest) {
        // Award XP
        const xpGained = quest.xpReward;
        const newXP = userProgression.currentXP + xpGained;
        let newLevel = userProgression.level;
        let nextLevelXP = userProgression.nextLevelXP;
        
        // Check for level up
        if (newXP >= nextLevelXP) {
          newLevel++;
          nextLevelXP = calculateNextLevelXP(newLevel);
          setNewLevel(newLevel);
          setShowLevelUp(true);
        }
        
        // Update progression
        const updatedProgression: UserProgression = {
          ...userProgression,
          currentXP: newXP,
          nextLevelXP,
          level: newLevel,
          questsCompleted: userProgression.questsCompleted + 1,
          badges: quest.badge ? [...userProgression.badges, quest.badge] : userProgression.badges
        };
        
        setUserProgression(updatedProgression);
        localStorage.setItem('userProgression', JSON.stringify(updatedProgression));
        
        // Update global leaderboard
        dataService.updateLeaderboard('user1', xpGained);
        
        console.log(`Quest ${questId} completed! Gained ${xpGained} XP`);
      }
    }
  };

  const calculateNextLevelXP = (level: number): number => {
    return level * 1000; // Example: 1000 XP per level
  };

  const joinGroup = (questId: string) => {
    // Simulate joining a group
    const newGroup: QuestGroup = {
      questId,
      members: [
        { id: "1", name: "You", avatar: "👤", progress: 0 },
        { id: "2", name: "AdventureAmy", avatar: "🧗‍♀️", progress: 45 },
        { id: "3", name: "TravelTom", avatar: "✈️", progress: 75 },
      ]
    };
    
    setActiveGroups(prev => [...prev.filter(g => g.questId !== questId), newGroup]);
    setSelectedQuest(questId);
  };

  const getQuestIcon = (category: string) => {
    switch (category) {
      case "Events": return Target;
      case "Wildlife": return MapPin;
      case "Budget": return Users;
      case "Fitness": return Trophy;
      case "Cultural": return Calendar;
      default: return CheckCircle;
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Active Quests</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {quests.map((quest) => {
          const Icon = getQuestIcon(quest.category);
          const progress = questProgress[quest.id] || 0;
          const isCompleted = progress >= 100;

          return (
            <Card key={quest.id}>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Icon className="h-5 w-5" />
                  <CardTitle className="text-lg">{quest.name}</CardTitle>
                </div>
                <p className="text-sm text-muted-foreground">{quest.description}</p>
                {quest.badge && <Badge>{quest.badge}</Badge>}
              </CardHeader>
              <CardContent>
                <Progress value={progress} className="mb-2" />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{progress}% Complete</span>
                  <span>{quest.xpReward} XP Reward</span>
                </div>
                {!isCompleted ? (
                  <Button
                    className="w-full mt-2"
                    onClick={() => updateQuestProgress(String(quest.id), Math.min(progress + 20, 100))}
                    variant={quest.multiplayer ? "outline" : "default"}
                  >
                    {quest.multiplayer ? "Join Group" : "Mark Progress"}
                  </Button>
                ) : (
                  <Button className="w-full mt-2" variant="secondary" disabled>
                    <CheckCircle className="h-4 w-4 mr-2" /> Completed
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
