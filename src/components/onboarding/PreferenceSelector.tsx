
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { MapPin, Music, Leaf, Wallet } from "lucide-react";
import type { User } from '../../types';

interface PreferenceSelectorProps {
  setUser: (user: User | null) => void;
}

export default function PreferenceSelector({ setUser }: PreferenceSelectorProps) {
  const [preferences, setPreferences] = useState({
    wildlife: false,
    nature: false,
    concerts: false,
    budgetTravel: false,
  });
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const user: User = {
      id: localStorage.getItem('user')?.split('"id": "')[1]?.split('"')[0] || 'user1',
      //email: localStorage.getItem('user')?.split('"email": "')[1]?.split('"')[0] || 'newuser@example.com',
      preferences: {
          ...preferences,
          budget: '',
          lifestyle: '',
          perfectTrip: '',
          interests: [],
          places: []
      },
      progression: { currentXP: 0, nextLevelXP: 1000, title: 'Newbie', badges: [], stats: { placesVisited: 0, questsCompleted: 0 } },
      //budgets: [],
    };
    setUser(user);
    localStorage.setItem('user', JSON.stringify(user));
    navigate('/trip-params');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Select Your Preferences</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="wildlife"
                checked={preferences.wildlife}
                onCheckedChange={(checked) => setPreferences({ ...preferences, wildlife: !!checked })}
              />
              <label htmlFor="wildlife" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Wildlife
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="nature"
                checked={preferences.nature}
                onCheckedChange={(checked) => setPreferences({ ...preferences, nature: !!checked })}
              />
              <label htmlFor="nature" className="flex items-center gap-2">
                <Leaf className="h-4 w-4" />
                Nature
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="concerts"
                checked={preferences.concerts}
                onCheckedChange={(checked) => setPreferences({ ...preferences, concerts: !!checked })}
              />
              <label htmlFor="concerts" className="flex items-center gap-2">
                <Music className="h-4 w-4" />
                Concerts
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="budgetTravel"
                checked={preferences.budgetTravel}
                onCheckedChange={(checked) => setPreferences({ ...preferences, budgetTravel: !!checked })}
              />
              <label htmlFor="budgetTravel" className="flex items-center gap-2">
                <Wallet className="h-4 w-4" />
                Budget Travel
              </label>
            </div>
            <Button type="submit" className="w-full">Next: Plan Your Trip</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}