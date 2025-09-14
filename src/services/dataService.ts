// src/services/dataService.ts
import spotsData from '../data/spots.json';
import budgetsData from '../data/budgets.json';
import questsData from '../data/quests.json';
import leaderboardsData from '../data/leaderboards.json';
import multiplayerData from '../data/multiplayer.json';
import activitiesData from '../data/activities.json';
import tasksData from '../data/tasks.json';
import type { ReactNode } from 'react';

export interface Spot {
  id: number;
  name: string;
  category: string[];
  description: string;
  location?: { lat: number; lng: number };
  cost?: { entry: number; transport: number; accommodation: number };
  reviews?: Array<{ user: string; rating: number; comment: string }>;
  image?: string;
  influencerEndorsed?: boolean;
  endorsedBy?: string;
}

export interface Budget {
  id: number;
  userId: string;
  date: string;
  totalBudget: number;
  currentSpent: number;
  categories: { transport: number; accommodation: number; activities: number; food: number };
  resourceMeter: number;
  alerts: string[];
}

export interface Quest {
  partnerReward: ReactNode;
  id: number;
  name: string;
  description: string;
  category: string;
  xpReward: number;
  badge: string;
  requirements: string[];
  completed: boolean;
  multiplayer: boolean;
}

export interface LeaderboardEntry {
  userId: string;
  username: string;
  xp: number;
  rank: number;
  badges?: string[];
}

export interface MultiplayerGroup {
  id: number;
  groupName: string;
  members: string[];
  sharedItinerary: number[];
  questId: number;
  xpShared: number;
  tales: Array<{ id: number; userId: string; content: string; upvotes: number; xpBonus: number }>;
}

export interface Activity {
  name: string;
  estimatedCost: number;
}

export interface TripSpot extends Spot {
  selectedActivities: Activity[];
}

export interface Trip {
  id: number;
  name: string;
  spots: TripSpot[];
}

export interface Task {
  id: string;
  title: string;
  status: 'todo' | 'in progress' | 'done' | 'backlog' | 'canceled';
  label: 'bug' | 'feature' | 'documentation';
  priority: 'low' | 'medium' | 'high';
}

interface LeaderboardsData {
  global: LeaderboardEntry[];
  friends: LeaderboardEntry[];
}

interface BudgetsData {
  sampleBudgets: Budget[];
  costs: {
    discounts: number[];
    currency: string;
  };
}

interface ActivitiesData {
  [key: number]: Activity[];
}

let trips: Trip[] = [];

export const dataService = {
  getSpots: (): Spot[] => spotsData as unknown as Spot[],
  getSpotById: (id: number): Spot | undefined => (spotsData as unknown as Spot[]).find(s => s.id === id),
  getBudgets: (userId: string): Budget[] => {
    const allBudgets = (budgetsData as BudgetsData).sampleBudgets;
    return allBudgets.filter(budget => budget.userId === userId);
  },
  getBudgetById: (id: number): Budget | undefined => {
    const allBudgets = (budgetsData as BudgetsData).sampleBudgets;
    return allBudgets.find(budget => budget.id === id);
  },
  updateBudget: (budgetId: number, spent: number): void => {
    const budget = (budgetsData as BudgetsData).sampleBudgets.find(b => b.id === budgetId);
    if (budget) {
      budget.currentSpent = spent;
      const percentage = (spent / budget.totalBudget) * 100;
      budget.resourceMeter = Math.round(percentage);
      if (percentage > 80) {
        budget.alerts.push("High spending alert!");
      }
      console.log(`Updated budget ${budgetId}: R${spent} spent`);
    }
  },
  getBudgetsByDateRange: (userId: string, range: '1month' | '3months' | '6months' | '1year'): Budget[] => {
    const allBudgets = (budgetsData as BudgetsData).sampleBudgets.filter(b => b.userId === userId);
    const now = new Date();
    return allBudgets.filter(budget => {
      const diffInDays = (now.getTime() - new Date(budget.date).getTime()) / (1000 * 60 * 60 * 24);
      switch (range) {
        case '1month':
          return diffInDays <= 30;
        case '3months':
          return diffInDays <= 90;
        case '6months':
          return diffInDays <= 180;
        case '1year':
          return diffInDays <= 365;
        default:
          return true;
      }
    });
  },
  getQuests: (): Quest[] => questsData as Quest[],
  updateQuest: (questId: number, completed: boolean): void => {
    const quest = (questsData as Quest[]).find(q => q.id === questId);
    if (quest) {
      quest.completed = completed;
      console.log(`Updated quest ${questId} to completed: ${completed}`);
    }
  },
  getLeaderboards: (type: 'global' | 'friends'): LeaderboardEntry[] => (leaderboardsData as LeaderboardsData)[type],
  updateLeaderboard: (userId: string, xp: number): void => {
    const leaderboard = (leaderboardsData as LeaderboardsData).global;
    const user = leaderboard.find(u => u.userId === userId);
    if (user) {
      user.xp += xp;
      console.log(`Updated XP for ${userId}: ${user.xp}`);
    }
  },
  getMultiplayerGroups: (userId: string): MultiplayerGroup[] => (multiplayerData as MultiplayerGroup[]).filter(g => g.members.includes(userId)),
  createTale: (groupId: number, content: string): void => {
    const group = (multiplayerData as MultiplayerGroup[]).find(g => g.id === groupId);
    if (group) {
      group.tales.push({ id: group.tales.length + 1, userId: 'user1', content, upvotes: 0, xpBonus: 0 });
      console.log(`Shared tale in group ${groupId}: ${content}`);
    }
  },
  playMiniGame: (): number => Math.floor(Math.random() * 30) + 10,
  getActivities: (spotId: number): Activity[] => (activitiesData as ActivitiesData)[spotId] || [],
  saveTrip: (trip: Trip): void => {
    trips = [...trips, trip];
    console.log(`Saved trip: ${trip.name} with ${trip.spots.length} spots`);
  },
  getTrips: (): Trip[] => trips,
  getTasks: (): Task[] => tasksData as Task[],
  getAllBudgets: (): Budget[] => (budgetsData as BudgetsData).sampleBudgets,
};