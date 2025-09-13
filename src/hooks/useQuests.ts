import { useState, useEffect } from 'react';
import { dataService, type Quest } from '@/services/dataService';

export function useQuests(userId: string) {
  const [quests, setQuests] = useState<Quest[]>([]);

  useEffect(() => {
    setQuests(dataService.getQuests());
  }, []);

  const completeQuest = (questId: number) => {
    dataService.updateQuest(questId, true);
    // Simulate XP update
    dataService.updateLeaderboard(userId, 100);  // Award XP
    setQuests(quests.map(q => q.id === questId ? { ...q, completed: true } : q));
  };

  return { quests, completeQuest };
}
