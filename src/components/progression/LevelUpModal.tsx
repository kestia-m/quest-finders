import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trophy, Crown } from "lucide-react";
import { useState } from "react";

interface LevelUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  newLevel: number;
  newBadge?: string;
  perks?: string[];
}

export function LevelUpModal({ isOpen, onClose, newLevel, newBadge, perks }: LevelUpModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-center gap-2 mb-4">
            <Trophy className="h-8 w-8 text-yellow-500 animate-bounce" />
            <Crown className="h-8 w-8 text-yellow-500 animate-pulse" />
          </div>
          <DialogTitle className="text-center">Level Up!</DialogTitle>
          <p className="text-center text-muted-foreground mb-4">
            Congratulations! You've reached Level {newLevel}.
          </p>
          {newBadge && (
            <div className="text-center mb-4">
              <Badge variant="default" className="text-lg px-4 py-2">
                New Badge: {newBadge}
              </Badge>
            </div>
          )}
          {perks && (
            <div className="space-y-2 mb-4">
              <h4 className="font-semibold">Unlocked Perks:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                {perks.map((perk, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    {perk}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="flex justify-center">
            <Button onClick={onClose}>Continue Exploring</Button>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}