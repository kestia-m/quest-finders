import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  CheckCircle, Users, MapPin, Target, Calendar, Trophy, 
  Sparkles, Crown, Star, Award, DollarSign, Heart,
  Camera, Compass, Coffee, Music, Zap, Coins
} from "lucide-react";

interface Quest {
  id: string;
  name: string;
  description: string;
  category: 'Wildlife' | 'Budget' | 'Family' | 'Friends' | 'Cultural' | 'Adventure' | 'Food';
  xpReward: number;
  badge?: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  duration: string;
  multiplayer: boolean;
  requirements: string[];
  location?: string;
  budgetRange?: string;
  groupSize?: string;
}

interface QuestProgress {
  [key: string]: number;
}

interface GroupMember {
  id: string;
  name: string;
  avatar: string;
  progress: number;
}

const saQuests: Quest[] = [
  {
    id: "big5-safari",
    name: "Big Five Safari Master",
    description: "Spot all Big Five animals in Kruger National Park. Document each sighting!",
    category: "Wildlife",
    xpReward: 200,
    badge: "Safari Legend",
    difficulty: "Hard",
    duration: "3-5 days",
    multiplayer: true,
    requirements: ["Visit Kruger", "Spot Lion", "Spot Elephant", "Spot Rhino", "Spot Leopard", "Spot Buffalo"],
    location: "Kruger National Park",
    budgetRange: "R15,000-25,000",
    groupSize: "2-6 people"
  },
  {
    id: "budget-backpacker",
    name: "Shoestring Adventurer",
    description: "Complete a 7-day SA adventure on under R5,000 total budget",
    category: "Budget",
    xpReward: 150,
    badge: "Budget Boss",
    difficulty: "Medium",
    duration: "7 days",
    multiplayer: false,
    requirements: ["Book budget accommodation", "Use public transport", "Cook 5 meals", "Find 3 free activities"],
    budgetRange: "Under R5,000"
  },
  {
    id: "family-cape-town",
    name: "Cape Town Family Explorer",
    description: "Create magical family memories across Cape Town's top kid-friendly spots",
    category: "Family",
    xpReward: 120,
    badge: "Family Hero",
    difficulty: "Easy",
    duration: "4-6 days", 
    multiplayer: true,
    requirements: ["Visit Table Mountain", "Two Oceans Aquarium", "Kirstenbosch Gardens", "Beach day"],
    location: "Cape Town",
    budgetRange: "R8,000-15,000",
    groupSize: "Family (3-8 people)"
  },
  {
    id: "friends-garden-route",
    name: "Garden Route Road Trip Squad",
    description: "Epic friends road trip from Cape Town to Port Elizabeth with squad goals",
    category: "Friends",
    xpReward: 180,
    badge: "Squad Goals",
    difficulty: "Medium",
    duration: "10-14 days",
    multiplayer: true,
    requirements: ["Visit 5 towns", "Bungee jump", "Wine tasting", "Beach activities", "Group photo at each stop"],
    location: "Garden Route",
    budgetRange: "R12,000-20,000",
    groupSize: "3-8 friends"
  },
  {
    id: "zulu-cultural",
    name: "Zulu Heritage Journey",
    description: "Immerse yourself in authentic Zulu culture and traditions in KwaZulu-Natal",
    category: "Cultural",
    xpReward: 140,
    badge: "Culture Keeper",
    difficulty: "Medium",
    duration: "3-4 days",
    multiplayer: false,
    requirements: ["Visit cultural village", "Learn traditional dance", "Taste traditional food", "Meet local artisans"],
    location: "KwaZulu-Natal",
    budgetRange: "R6,000-10,000"
  },
  {
    id: "drakensberg-hike",
    name: "Drakensberg Peak Conqueror",
    description: "Conquer the majestic Drakensberg mountains with challenging hikes",
    category: "Adventure",
    xpReward: 160,
    badge: "Mountain Master",
    difficulty: "Hard",
    duration: "5-7 days",
    multiplayer: true,
    requirements: ["Complete 3 major hikes", "See ancient rock art", "Summit Cathedral Peak", "Camp under stars"],
    location: "Drakensberg",
    budgetRange: "R7,000-12,000",
    groupSize: "2-6 people"
  },
  {
    id: "jo-burg-foodie",
    name: "Joburg Food Safari",
    description: "Taste your way through Johannesburg's incredible food scene",
    category: "Food",
    xpReward: 100,
    badge: "Food Explorer",
    difficulty: "Easy",
    duration: "3-5 days",
    multiplayer: true,
    requirements: ["Try boerewors", "Visit local market", "Fine dining experience", "Street food adventure"],
    location: "Johannesburg",
    budgetRange: "R4,000-8,000",
    groupSize: "2-6 people"
  },
  {
    id: "weekend-warrior",
    name: "R2000 Weekend Warrior",
    description: "Max weekend adventure in your province for under R2000",
    category: "Budget",
    xpReward: 80,
    badge: "Weekend Hero",
    difficulty: "Easy",
    duration: "2 days",
    multiplayer: false,
    requirements: ["Stay under budget", "2 activities", "Local transport", "Social media post"],
    budgetRange: "Under R2,000"
  }
];

export default function Quests() {
  const [questProgress, setQuestProgress] = useState<QuestProgress>({});
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [userLevel, setUserLevel] = useState(3);
  const [userXP, setUserXP] = useState(1250);
  const [userBadges, setUserBadges] = useState(['Vibe Voyager', 'Budget Boss']);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [activeGroups, setActiveGroups] = useState<string[]>([]);

  const categories = ['All', 'Wildlife', 'Budget', 'Family', 'Friends', 'Cultural', 'Adventure', 'Food'];

  const getQuestIcon = (category: string) => {
    switch (category) {
      case "Wildlife": return Target;
      case "Budget": return DollarSign;
      case "Family": return Heart;
      case "Friends": return Users;
      case "Cultural": return Calendar;
      case "Adventure": return Compass;
      case "Food": return Coffee;
      default: return MapPin;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy": return "bg-green-100 text-green-800";
      case "Medium": return "bg-yellow-100 text-yellow-800";
      case "Hard": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const updateQuestProgress = (questId: string) => {
    setQuestProgress(prev => {
      const current = prev[questId] || 0;
      const newProgress = Math.min(current + 20, 100);
      
      // Check for completion
      if (newProgress === 100 && current < 100) {
        const quest = saQuests.find(q => q.id === questId);
        if (quest) {
          setUserXP(prev => prev + quest.xpReward);
          if (quest.badge && !userBadges.includes(quest.badge)) {
            setUserBadges(prev => [...prev, quest.badge!]);
          }
          
          // Check for level up
          const newLevel = Math.floor((userXP + quest.xpReward) / 1000) + 1;
          if (newLevel > userLevel) {
            setUserLevel(newLevel);
            setShowLevelUp(true);
            setTimeout(() => setShowLevelUp(false), 3000);
          }
        }
      }
      
      return { ...prev, [questId]: newProgress };
    });
  };

  const joinGroup = (questId: string) => {
    setActiveGroups(prev => 
      prev.includes(questId) 
        ? prev.filter(id => id !== questId)
        : [...prev, questId]
    );
  };

  const filteredQuests = activeCategory === 'All' 
    ? saQuests 
    : saQuests.filter(quest => quest.category === activeCategory);

  const completedQuests = Object.values(questProgress).filter(p => p === 100).length;

  return (
    <div className="max-w-6xl mx-auto p-4">
      {/* Header with User Stats */}
      <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-6 mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">🇿🇦 SA Adventure Quests</h1>
            <p className="text-gray-600">Level up your South African travel game!</p>
          </div>
          
          <div className="flex items-center gap-6 text-center">
            <div>
              <div className="text-2xl font-bold text-purple-600">{userLevel}</div>
              <div className="text-sm text-gray-600">Level</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-pink-600">{userXP}</div>
              <div className="text-sm text-gray-600">XP</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">{completedQuests}</div>
              <div className="text-sm text-gray-600">Completed</div>
            </div>
          </div>
        </div>

        {showLevelUp && (
          <div className="mt-4 bg-yellow-100 border border-yellow-300 rounded-lg p-4 text-center animate-bounce">
            <div className="flex items-center justify-center gap-2 text-yellow-800">
              <Crown className="h-6 w-6" />
              <span className="font-bold">LEVEL UP! You're now Level {userLevel}!</span>
              <Trophy className="h-6 w-6" />
            </div>
          </div>
        )}
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`px-4 py-2 rounded-full whitespace-nowrap transition-all flex items-center gap-2 ${
              activeCategory === category
                ? 'bg-purple-500 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {category !== 'All' && React.createElement(getQuestIcon(category), { className: "h-4 w-4" })}
            {category}
          </button>
        ))}
      </div>

      {/* Quests Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredQuests.map(quest => {
          const Icon = getQuestIcon(quest.category);
          const progress = questProgress[quest.id] || 0;
          const isCompleted = progress >= 100;
          const isInGroup = activeGroups.includes(quest.id);

          return (
            <Card key={quest.id} className={`relative overflow-hidden transition-all hover:shadow-lg ${
              isCompleted ? 'border-green-300 bg-green-50' : ''
            }`}>
              {/* Difficulty Badge */}
              <div className={`absolute top-4 right-4 px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(quest.difficulty)}`}>
                {quest.difficulty}
              </div>

              <CardHeader className="pb-3">
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${
                    quest.category === 'Wildlife' ? 'bg-green-100' :
                    quest.category === 'Budget' ? 'bg-blue-100' :
                    quest.category === 'Family' ? 'bg-pink-100' :
                    quest.category === 'Friends' ? 'bg-purple-100' :
                    'bg-gray-100'
                  }`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg leading-tight">{quest.name}</CardTitle>
                    <p className="text-sm text-gray-600 mt-1">{quest.description}</p>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Quest Details */}
                <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                  <div>📍 {quest.location || 'Flexible'}</div>
                  <div>⏱️ {quest.duration}</div>
                  <div>💰 {quest.budgetRange || 'Variable'}</div>
                  <div>👥 {quest.groupSize || 'Solo/Group'}</div>
                </div>

                {/* Progress */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Progress</span>
                    <span className="text-sm text-gray-600">{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>

                {/* Requirements */}
                <div className="space-y-2">
                  <div className="text-sm font-medium">Requirements:</div>
                  <div className="space-y-1">
                    {quest.requirements.slice(0, 3).map((req, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-gray-600">
                        <div className={`w-2 h-2 rounded-full ${
                          progress > (idx + 1) * 25 ? 'bg-green-500' : 'bg-gray-300'
                        }`} />
                        {req}
                      </div>
                    ))}
                    {quest.requirements.length > 3 && (
                      <div className="text-xs text-gray-500">
                        +{quest.requirements.length - 3} more
                      </div>
                    )}
                  </div>
                </div>

                {/* Rewards */}
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-yellow-500" />
                    <span className="font-medium text-yellow-700">{quest.xpReward} XP</span>
                  </div>
                  {quest.badge && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Award className="h-3 w-3" />
                      {quest.badge}
                    </Badge>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="space-y-2">
                  {!isCompleted ? (
                    <>
                      <Button
                        onClick={() => updateQuestProgress(quest.id)}
                        className="w-full"
                        size="sm"
                      >
                        <Zap className="h-4 w-4 mr-2" />
                        Update Progress
                      </Button>
                      
                      {quest.multiplayer && (
                        <Button
                          onClick={() => joinGroup(quest.id)}
                          variant={isInGroup ? "default" : "outline"}
                          className="w-full"
                          size="sm"
                        >
                          <Users className="h-4 w-4 mr-2" />
                          {isInGroup ? "In Group" : "Join Group"}
                        </Button>
                      )}
                    </>
                  ) : (
                    <Button variant="secondary" className="w-full" size="sm" disabled>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Completed!
                    </Button>
                  )}
                </div>

                {/* Group Members (if in group) */}
                {isInGroup && quest.multiplayer && (
                  <div className="bg-purple-50 p-3 rounded-lg">
                    <div className="text-sm font-medium mb-2">Group Members:</div>
                    <div className="flex -space-x-2">
                      <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white text-xs">
                        You
                      </div>
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">
                        A
                      </div>
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs">
                        M
                      </div>
                      <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 text-xs">
                        +
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredQuests.length === 0 && (
        <div className="text-center py-12">
          <div className="text-4xl mb-4">🌍</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No quests found</h3>
          <p className="text-gray-600">Try selecting a different category!</p>
        </div>
      )}

      {/* Quick Stats Footer */}
      <div className="mt-8 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-green-600">{saQuests.filter(q => questProgress[q.id] >= 100).length}</div>
            <div className="text-sm text-gray-600">Completed</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-600">{activeGroups.length}</div>
            <div className="text-sm text-gray-600">Active Groups</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-600">{userBadges.length}</div>
            <div className="text-sm text-gray-600">Badges Earned</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-pink-600">
              {saQuests.reduce((sum, q) => questProgress[q.id] >= 100 ? sum + q.xpReward : sum, 0)}
            </div>
            <div className="text-sm text-gray-600">Total XP Earned</div>
          </div>
        </div>
      </div>
    </div>
  );
}