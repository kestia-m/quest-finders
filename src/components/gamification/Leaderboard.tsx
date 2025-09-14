import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { 
  Crown, Trophy, Medal, Users, Star, Sparkles, Award, 
  MapPin, Calendar, Target, TrendingUp, Filter, Globe,
  ChevronRight, Zap, Heart, Camera, Compass
} from "lucide-react";

interface LeaderboardEntry {
  id: string;
  username: string;
  rank: number;
  xp: number;
  level: number;
  badges: string[];
  avatar: string;
  location: string;
  questsCompleted: number;
  streak: number;
  favoriteCategory: string;
  lastActive: string;
}

interface UserStats {
  level: number;
  currentXP: number;
  nextLevelXP: number;
  rank: number;
  badges: string[];
  questsCompleted: number;
  streak: number;
  weeklyXP: number;
  monthlyXP: number;
}

const mockLeaderboard: LeaderboardEntry[] = [
  {
    id: "1",
    username: "SafariQueen_CT",
    rank: 1,
    xp: 3450,
    level: 4,
    badges: ["Safari Legend", "Budget Boss", "Culture Keeper", "Squad Goals"],
    avatar: "👑",
    location: "Cape Town",
    questsCompleted: 15,
    streak: 12,
    favoriteCategory: "Wildlife",
    lastActive: "2h ago"
  },
  {
    id: "2", 
    username: "DrakensbergHiker",
    rank: 2,
    xp: 3200,
    level: 3,
    badges: ["Mountain Master", "Family Hero", "Weekend Hero"],
    avatar: "⛰️",
    location: "KwaZulu-Natal",
    questsCompleted: 12,
    streak: 8,
    favoriteCategory: "Adventure",
    lastActive: "5h ago"
  },
  {
    id: "3",
    username: "JoBurg_Foodie",
    rank: 3,
    xp: 2950,
    level: 3,
    badges: ["Food Explorer", "Vibe Voyager", "Budget Boss"],
    avatar: "🍽️",
    location: "Johannesburg",
    questsCompleted: 11,
    streak: 15,
    favoriteCategory: "Food",
    lastActive: "1h ago"
  },
  {
    id: "4",
    username: "GardenRouteGang",
    rank: 4,
    xp: 2750,
    level: 3,
    badges: ["Squad Goals", "Culture Keeper"],
    avatar: "🚗",
    location: "Garden Route",
    questsCompleted: 9,
    streak: 5,
    favoriteCategory: "Friends",
    lastActive: "30m ago"
  },
  {
    id: "5",
    username: "KrugerKing",
    rank: 5,
    xp: 2500,
    level: 3,
    badges: ["Safari Legend", "Weekend Hero"],
    avatar: "🦁",
    location: "Mpumalanga",
    questsCompleted: 8,
    streak: 7,
    favoriteCategory: "Wildlife",
    lastActive: "4h ago"
  }
];

export default function Leaderboard() {
  const [activeTimeframe, setActiveTimeframe] = useState<'weekly' | 'monthly' | 'alltime'>('weekly');
  const [activeRegion, setActiveRegion] = useState<'all' | 'western-cape' | 'gauteng' | 'kzn' | 'mpumalanga'>('all');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  const [currentUser] = useState<UserStats>({
    level: 3,
    currentXP: 1250,
    nextLevelXP: 3000,
    rank: 7,
    badges: ["Vibe Voyager", "Budget Boss", "Family Hero"],
    questsCompleted: 6,
    streak: 4,
    weeklyXP: 320,
    monthlyXP: 1250
  });

  const regions = [
    { id: 'all', name: 'All SA', emoji: '🇿🇦' },
    { id: 'western-cape', name: 'Western Cape', emoji: '🏔️' },
    { id: 'gauteng', name: 'Gauteng', emoji: '🏙️' },
    { id: 'kzn', name: 'KwaZulu-Natal', emoji: '🌊' },
    { id: 'mpumalanga', name: 'Mpumalanga', emoji: '🦁' }
  ];

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="h-6 w-6 text-yellow-500 fill-yellow-100" />;
    if (rank === 2) return <Medal className="h-5 w-5 text-gray-400 fill-gray-100" />;
    if (rank === 3) return <Medal className="h-5 w-5 text-amber-700 fill-amber-100" />;
    return <span className="text-sm font-bold w-6 h-6 flex items-center justify-center bg-gray-100 rounded-full">{rank}</span>;
  };

  const getRankBorder = (rank: number) => {
    if (rank === 1) return "border-2 border-yellow-400 shadow-lg bg-gradient-to-r from-yellow-50 to-yellow-100";
    if (rank === 2) return "border-2 border-gray-300 shadow-md bg-gradient-to-r from-gray-50 to-gray-100";
    if (rank === 3) return "border-2 border-amber-600 shadow bg-gradient-to-r from-amber-50 to-amber-100";
    return "bg-white";
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Wildlife': return Target;
      case 'Adventure': return Compass;
      case 'Food': return Heart;
      case 'Friends': return Users;
      case 'Family': return Heart;
      case 'Cultural': return Camera;
      default: return Star;
    }
  };

  const filteredLeaderboard = mockLeaderboard.filter(entry => {
    if (activeRegion === 'all') return true;
    return entry.location.toLowerCase().includes(activeRegion.replace('-', ' '));
  });

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-80' : 'w-16'} transition-all duration-300 bg-white border-r border-gray-200 flex flex-col`}>
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {sidebarOpen && (
              <div>
                <h2 className="text-lg font-bold text-gray-900">🇿🇦 SA Explorers</h2>
                <p className="text-sm text-gray-600">Leaderboard</p>
              </div>
            )}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRight className={`h-5 w-5 transition-transform ${sidebarOpen ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>

        {sidebarOpen && (
          <>
            {/* User Profile */}
            <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 border-b border-gray-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  You
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900">ExplorerJane_CPT</div>
                  <div className="text-sm text-gray-600">Rank #{currentUser.rank}</div>
                </div>
                <Badge variant="default" className="flex items-center gap-1">
                  <Sparkles className="h-3 w-3" />
                  Lvl {currentUser.level}
                </Badge>
              </div>

              <div className="space-y-2">
                <Progress value={(currentUser.currentXP / currentUser.nextLevelXP) * 100} className="h-2" />
                <div className="flex justify-between text-xs text-gray-600">
                  <span>{currentUser.currentXP} XP</span>
                  <span>{currentUser.nextLevelXP - currentUser.currentXP} to next level</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 mt-3 text-center">
                <div>
                  <div className="font-bold text-purple-600">{currentUser.questsCompleted}</div>
                  <div className="text-xs text-gray-600">Quests</div>
                </div>
                <div>
                  <div className="font-bold text-pink-600">{currentUser.streak}</div>
                  <div className="text-xs text-gray-600">Streak</div>
                </div>
                <div>
                  <div className="font-bold text-green-600">{currentUser.badges.length}</div>
                  <div className="text-xs text-gray-600">Badges</div>
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="p-4 border-b border-gray-200 space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Timeframe
                </h3>
                <div className="space-y-1">
                  {['weekly', 'monthly', 'alltime'].map(time => (
                    <button
                      key={time}
                      onClick={() => setActiveTimeframe(time as any)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        activeTimeframe === time 
                          ? 'bg-purple-100 text-purple-800 font-medium' 
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {time.charAt(0).toUpperCase() + time.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Region
                </h3>
                <div className="space-y-1">
                  {regions.map(region => (
                    <button
                      key={region.id}
                      onClick={() => setActiveRegion(region.id as any)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 ${
                        activeRegion === region.id 
                          ? 'bg-blue-100 text-blue-800 font-medium' 
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <span>{region.emoji}</span>
                      {region.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="p-4 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Your Progress
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Weekly XP</span>
                  <span className="font-semibold text-purple-600">{currentUser.weeklyXP}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Monthly XP</span>
                  <span className="font-semibold text-pink-600">{currentUser.monthlyXP}</span>
                </div>
                <div className="pt-2">
                  <div className="flex flex-wrap gap-1">
                    {currentUser.badges.map(badge => (
                      <Badge key={badge} variant="outline" className="text-xs">
                        {badge}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Tips */}
            <div className="p-4 flex-1">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Zap className="h-4 w-4" />
                Level Up Tips
              </h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div>• Complete daily quests for bonus XP</div>
                <div>• Join group adventures for multipliers</div>
                <div>• Share travel photos for social XP</div>
                <div>• Visit new provinces for exploration bonuses</div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-6 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">🏆 SA Explorer Leaderboard</h1>
                <p className="text-gray-600">Top adventurers conquering South Africa</p>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-600 mb-1">{activeTimeframe.toUpperCase()}</div>
                <div className="text-2xl font-bold text-purple-600">{filteredLeaderboard.length} Explorers</div>
              </div>
            </div>
          </div>

          {/* Timeframe Tabs */}
          <div className="flex gap-1 bg-white p-1 rounded-lg mb-6 w-fit shadow-sm border">
            {['weekly', 'monthly', 'alltime'].map(time => (
              <button
                key={time}
                onClick={() => setActiveTimeframe(time as any)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  activeTimeframe === time 
                    ? 'bg-purple-500 text-white shadow-md' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {time.charAt(0).toUpperCase() + time.slice(1)}
              </button>
            ))}
          </div>

          {/* Leaderboard */}
          <div className="space-y-3">
            {filteredLeaderboard.map(entry => {
              const CategoryIcon = getCategoryIcon(entry.favoriteCategory);
              
              return (
                <Card key={entry.id} className={`transition-all hover:shadow-md ${getRankBorder(entry.rank)}`}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      {/* Rank */}
                      <div className="flex-shrink-0">
                        {getRankIcon(entry.rank)}
                      </div>

                      {/* Avatar & Info */}
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="text-2xl">{entry.avatar}</div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <div className="font-bold text-gray-900 truncate">{entry.username}</div>
                            <Badge variant="outline" className="flex items-center gap-1 text-xs">
                              <Sparkles className="h-3 w-3" />
                              Lvl {entry.level}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {entry.location}
                            </div>
                            <div className="flex items-center gap-1">
                              <CategoryIcon className="h-3 w-3" />
                              {entry.favoriteCategory}
                            </div>
                            <div className="flex items-center gap-1">
                              <Target className="h-3 w-3" />
                              {entry.questsCompleted} quests
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="flex items-center gap-6">
                        {/* Streak */}
                        <div className="text-center hidden md:block">
                          <div className="font-bold text-orange-600">{entry.streak}</div>
                          <div className="text-xs text-gray-600">day streak</div>
                        </div>

                        {/* Badges */}
                        <div className="hidden lg:flex gap-1">
                          {entry.badges.slice(0, 2).map(badge => (
                            <Badge key={badge} variant="secondary" className="text-xs">
                              {badge}
                            </Badge>
                          ))}
                          {entry.badges.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{entry.badges.length - 2}
                            </Badge>
                          )}
                        </div>

                        {/* XP */}
                        <div className="text-right">
                          <div className="flex items-center gap-1 text-purple-600 font-bold text-lg">
                            <Sparkles className="h-4 w-4" />
                            {entry.xp}
                          </div>
                          <div className="text-xs text-gray-500">{entry.lastActive}</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Achievement Showcase */}
          <div className="mt-8 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Award className="h-6 w-6 text-yellow-500" />
              Recent Achievements
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg p-4 text-center">
                <div className="text-2xl mb-2">🦁</div>
                <div className="font-semibold">SafariQueen_CT</div>
                <div className="text-sm text-gray-600">Unlocked "Safari Legend"</div>
              </div>
              <div className="bg-white rounded-lg p-4 text-center">
                <div className="text-2xl mb-2">⛰️</div>
                <div className="font-semibold">DrakensbergHiker</div>
                <div className="text-sm text-gray-600">Reached Level 3</div>
              </div>
              <div className="bg-white rounded-lg p-4 text-center">
                <div className="text-2xl mb-2">🍽️</div>
                <div className="font-semibold">JoBurg_Foodie</div>
                <div className="text-sm text-gray-600">15-day streak!</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}