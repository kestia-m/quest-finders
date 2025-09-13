import { Progress } from '@/components/ui/progress';
import { dataService, type Budget } from '@/services/dataService';
import { useState, useEffect } from 'react';

interface Props { userId: string; }

export function ResourceMeter({ userId }: Props) {
  const [budget, setBudget] = useState<Budget | null>(null);

  useEffect(() => {
    const budgets = dataService.getBudgets(userId);
    setBudget(budgets[0] || null);
  }, [userId]);

  if (!budget) return <div>No budget data</div>;

  const discount = dataService.playMiniGame();  // Mini-game trigger
  const updatedMeter = budget.resourceMeter + (discount / 100) * 10;  // Simulate adjustment

  return (
    <div className="p-4 bg-card rounded-lg">
      <h2 className="text-lg font-bold">Resource Meter</h2>
      <Progress value={updatedMeter} className="w-full" />
      <p>Remaining: {budget.resourceMeter}% (Played mini-game: {discount}% discount!)</p>
      <p className="text-destructive">{budget.alerts[0]}</p>
    </div>
  );
}
