// src/components/gamification/Quests.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Users, MapPin, Target, Calendar, Trophy, Sparkles, Crown, Star, Award } from "lucide-react";
import { dataService, type Quest } from "@/services/dataService";
import { useState, useEffect } from "react";
import { LevelUpModal } from "../progression/LevelUpModal";
import { XPBar } from "../progression/XPBar";

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

  const getQuestColor = (category: string) => {
    switch (category) {
      case "Events": return "bg-blue-100 text-blue-800";
      case "Wildlife": return "bg-green-100 text-green-800";
      case "Budget": return "bg-yellow-100 text-yellow-800";
      case "Fitness": return "bg-red-100 text-red-800";
      case "Cultural": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getGroupProgress = (questId: string) => {
    const group = activeGroups.find(g => g.questId === questId);
    if (!group) return 0;
    
    return group.members.reduce((sum, member) => sum + member.progress, 0) / group.members.length;
  };

  return (
    <div className="space-y-6">
      <LevelUpModal 
        isOpen={showLevelUp} 
        onClose={() => setShowLevelUp(false)} 
        newLevel={newLevel}
        newBadge={newLevel === 3 ? "Rainbow Voyager" : undefined}
        perks={["Premium influencer recommendations", "Exclusive AR filters", "Early access to new spots"]}
      />
      
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-lg border">
        <XPBar 
          currentXP={userProgression.currentXP} 
          nextLevelXP={userProgression.nextLevelXP} 
          level={userProgression.level} 
        />
        
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-amber-500" />
              <span className="font-semibold">Level {userProgression.level}</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-purple-500" />
              <span className="font-semibold">{userProgression.questsCompleted} Quests Completed</span>
            </div>
          </div>
          
          <div className="flex gap-2">
            {userProgression.badges.slice(0, 3).map(badge => (
              <Badge key={badge} variant="secondary" className="flex items-center gap-1">
                <Star className="h-3 w-3" />
                {badge}
              </Badge>
            ))}
            {userProgression.badges.length > 3 && (
              <Badge variant="outline">+{userProgression.badges.length - 3} more</Badge>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Active Quests</h2>
        <Badge variant="outline" className="flex items-center gap-1">
          <Sparkles className="h-4 w-4" />
          {quests.filter(q => (questProgress[String(q.id)] || 0) >= 100).length}/{quests.length} Completed
        </Badge>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quests.map((quest) => {
          const Icon = getQuestIcon(quest.category);
          const progress = questProgress[String(quest.id)] || 0;
          const groupProgress = getGroupProgress(String(quest.id));
          const isCompleted = progress >= 100;
          const hasGroup = activeGroups.some(g => g.questId === String(quest.id));

          return (
            <Card key={quest.id} className="relative overflow-hidden transition-all hover:shadow-lg">
              {isCompleted && (
                <div className="absolute top-2 right-2">
                  <CheckCircle className="h-6 w-6 text-green-500 fill-green-100" />
                </div>
              )}
              
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`p-2 rounded-full ${getQuestColor(quest.category)}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <CardTitle className="text-lg">{quest.name}</CardTitle>
                  </div>
                  {quest.badge && (
                    <Badge variant="outline" className="bg-primary/10">
                      {quest.badge}
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-2">{quest.description}</p>
                
                {hasGroup && (
                  <div className="mt-3 p-2 bg-secondary/30 rounded-lg">
                    <div className="flex justify-between text-xs mb-1">
                      <span>Group Progress</span>
                      <span>{Math.round(groupProgress)}%</span>
                    </div>
                    <Progress value={groupProgress} className="h-1" />
                    <div className="flex justify-between text-xs mt-2 text-muted-foreground">
                      <span>{activeGroups.find(g => g.questId === String(quest.id))?.members.length || 0} members</span>
                      <span>+{quest.xpReward * 1.5} XP (Group Bonus)</span>
                    </div>
                  </div>
                )}
              </CardHeader>
              
              <CardContent>
                <div className="mb-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Your Progress</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
                
                <div className="flex justify-between text-sm text-muted-foreground mb-4">
                  <span className="flex items-center gap-1">
                    <Sparkles className="h-4 w-4 text-amber-500" />
                    {quest.xpReward} XP
                  </span>
                  {quest.partnerReward && (
                    <span className="text-amber-600 flex items-center gap-1">
                      <Star className="h-4 w-4" />
                      {quest.partnerReward}
                    </span>
                  )}
                </div>
                
                {!isCompleted ? (
                  <div className="space-y-2">
                    <Button
                      className="w-full"
                      onClick={() => updateQuestProgress(String(quest.id), Math.min(progress + 25, 100))}
                      variant={hasGroup ? "default" : "default"}
                    >
                      {hasGroup ? "Mark Progress" : "Start Quest"}
                    </Button>
                    
                    {quest.multiplayer && !hasGroup && (
                      <Button
                        className="w-full"
                        variant="outline"
                        onClick={() => joinGroup(String(quest.id))}
                      >
                        <Users className="h-4 w-4 mr-2" />
                        Join Group (+50% XP)
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Button className="w-full" variant="secondary" disabled>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Completed
                    </Button>
                    <Button className="w-full" variant="outline">
                      Share Your Story
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}