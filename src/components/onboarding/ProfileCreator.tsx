// src/components/onboarding/ProfileCreator.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Heart,  Brain, ArrowRight } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import userData from '../../data/user.json';

export default function ProfileCreator() {
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState({
    name: '',
    likes: '',
    hobbies: '',
    favoriteFood: '',
    wouldRatherBeach: false,
    wouldRatherSolo: false,
    wouldRatherBudget: false,
  });
  const navigate = useNavigate();

  const prompts = [
    { type: 'likes', question: 'What are your top 3 likes? (e.g., adventure, music)' },
    { type: 'hobbies', question: 'Favorite hobbies? (e.g., hiking, reading)' },
    { type: 'food', question: 'Favorite SA food? (e.g., bobotie, bunny chow)' },
  ];

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      // Save profile (mock - extend userData.users[0])
      const updatedUser = { ...userData.users[0], profile };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      navigate('/preferences');
    }
  };

  const currentPrompt = prompts[step - 2];

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Create Your Profile</CardTitle>
          <div className="text-center text-sm text-muted-foreground">Step {step}/4</div>
        </CardHeader>
        <CardContent className="space-y-4">
          {step === 1 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <User className="h-5 w-5" />
                <h3>Basic Info</h3>
              </div>
              <Input
                placeholder="Full Name"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              />
            </div>
          )}
          {step > 1 && step < 4 && currentPrompt && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                {currentPrompt.type === 'likes' && <Heart className="h-5 w-5" />}
                {currentPrompt.type === 'hobbies' && <Brain className="h-5 w-5" />}
                {currentPrompt.type === 'food' && <Heart className="h-5 w-5" />}
                <h3>{currentPrompt.question}</h3>
              </div>
              <Input
                placeholder={currentPrompt.question}
                value={profile[currentPrompt.type as keyof typeof profile] as string}
                onChange={(e) => setProfile({ ...profile, [currentPrompt.type]: e.target.value })}
              />
            </div>
          )}
          {step === 4 && (
            <div className="space-y-4">
              <h3 className="text-center">Would You Rather?</h3>
              <RadioGroup
                value={profile.wouldRatherBeach ? 'beach' : 'mountains'}
                onValueChange={(v: string) => setProfile({ ...profile, wouldRatherBeach: v === 'beach' })}
                className="space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="beach" id="beach" />
                  <label htmlFor="beach">Beach getaway</label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="mountains" id="mountains" />
                  <label htmlFor="mountains">Mountain hike</label>
                </div>
              </RadioGroup>
              <RadioGroup
                value={profile.wouldRatherSolo ? 'solo' : 'group'}
                onValueChange={(v: string) => setProfile({ ...profile, wouldRatherSolo: v === 'solo' })}
                className="space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="solo" id="solo" />
                  <label htmlFor="solo">Solo travel</label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="group" id="group" />
                  <label htmlFor="group">Group adventure</label>
                </div>
              </RadioGroup>
              <RadioGroup
                value={profile.wouldRatherBudget ? 'budget' : 'luxury'}
                onValueChange={(v: string) => setProfile({ ...profile, wouldRatherBudget: v === 'budget' })}
                className="space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="budget" id="budget" />
                  <label htmlFor="budget">Budget trip</label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="luxury" id="luxury" />
                  <label htmlFor="luxury">Luxury escape</label>
                </div>
              </RadioGroup>
            </div>
          )}
          <Button onClick={handleNext} className="w-full flex items-center gap-2">
            {step < 4 ? 'Next' : 'Finish Profile'}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}