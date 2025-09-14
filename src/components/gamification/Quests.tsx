// src/components/gamification/Quests.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Users, MapPin, Target } from "lucide-react";
import { dataService, type Quest } from "@/services/dataService";
import { useState } from "react";
import { Sidebar, MobileSidebar } from "@/components/ui/Sidebar"; // Adjust import path as needed
import { useLocation } from "react-router-dom";

interface QuestProgress {
  [key: string]: number;
}

export function Quests() {
  const quests: Quest[] = dataService.getQuests();
  const [questProgress, setQuestProgress] = useState<QuestProgress>({});

  const updateQuestProgress = (questId: string, progress: number) => {
    setQuestProgress(prev => ({ ...prev, [questId]: progress }));
    // Simulate completion check
    if (progress >= 100) {
      // Award XP, etc. (integrate with progression logic)
      console.log(`Quest ${questId} completed!`);
    }
  };

  const getQuestIcon = (category: string) => {
    switch (category) {
      case "Events": return Target;
      case "Wildlife": return MapPin;
      case "Budget": return Users;
      default: return CheckCircle;
    }
  };

  const location = useLocation();

  return (
    <div className="flex h-screen bg-white">
      <Sidebar currentPath={location.pathname} />
      <div className="flex flex-1 flex-col">
        <header className="border-b p-4 flex items-center justify-between">
          <MobileSidebar />
          <h1 className="text-xl font-semibold">Quests</h1>
        </header>
        <main className="flex-1 p-6 overflow-auto">
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
        </main>
      </div>
    </div>
  );
}
