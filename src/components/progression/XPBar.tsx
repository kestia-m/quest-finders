import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Trophy } from "lucide-react";

interface XPBarProps {
  currentXP: number;
  nextLevelXP: number;
  level: number;
}

export function XPBar({ currentXP, nextLevelXP, level }: XPBarProps) {
  const progress = (currentXP / nextLevelXP) * 100;
  const xpToNext = nextLevelXP - currentXP;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Trophy className="h-4 w-4" />
          <span className="font-semibold">Level {level}</span>
        </div>
        <Badge variant="secondary">{xpToNext} XP to next level</Badge>
      </div>
      <Progress value={progress} className="h-3" />
      <div className="text-sm text-muted-foreground">
        {currentXP} / {nextLevelXP} XP
      </div>
    </div>
  );
}