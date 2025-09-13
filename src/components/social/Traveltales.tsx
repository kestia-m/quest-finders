import { Button } from '@/components/ui/button';
import { dataService } from '@/services/dataService';
import { useState } from 'react';

export function TravelTales({ groupId }: { groupId: number }) {
  const [content, setContent] = useState('');
  const groups = dataService.getMultiplayerGroups('user1'); // Mock user
  const group = groups.find(g => g.id === groupId);

  const shareTale = () => {
    dataService.createTale(groupId, content);
    setContent('');
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold">Share Travel Tale</h2>
      <textarea
        value={content}
        onChange={e => setContent(e.target.value)}
        placeholder="#SATravel story"
        className="w-full p-2 border rounded"
      />
      <Button onClick={shareTale}>Share</Button>
      <ul className="mt-4 space-y-2">
        {group?.tales.map(tale => (
          <li key={tale.id} className="bg-accent p-2 rounded">
            {tale.content} - Upvotes: {tale.upvotes} (XP Bonus: {tale.xpBonus})
          </li>
        ))}
      </ul>
    </div>
  );
}
