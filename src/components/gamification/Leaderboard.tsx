// src/components/gamification/Leaderboard.tsx
import { dataService, type LeaderboardEntry } from '@/services/dataService';

interface Props {
  type: 'global' | 'friends';
}

export function Leaderboard({ type = 'global' }: Props) {
  const entries: LeaderboardEntry[] = dataService.getLeaderboards(type);

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold">{type.charAt(0).toUpperCase() + type.slice(1)} Leaderboard</h2>
      <ul className="space-y-2">
        {entries.map(entry => (
          <li key={entry.userId} className="flex justify-between bg-card p-2 rounded">
            <span>{entry.rank}. {entry.username} - XP: {entry.xp}</span>
            {entry.badges && (
              <span className="text-sm text-muted-foreground">
                Badges: {entry.badges.join(', ')}
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
