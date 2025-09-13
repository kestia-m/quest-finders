import spotsData from '../data/spots.json';
import budgetsData from '../data/budgets.json';
import questsData from '../data/quests.json';
import leaderboardsData from '../data/leaderboards.json';
import multiplayerData from '../data/multiplayer.json';
import activitiesData from '../data/activities.json';
import tasksData from '../data/tasks.json';

// Types for JSON data
export interface Spot {
  id: number;
  name: string;
  category: string;
  description: string;
  location: { lat: number; lng: number };
  cost: { entry: number; transport: number; accommodation: number };
  reviews: Array<{ user: string; rating: number; comment: string }>;
  image: string;
}

export interface Budget {
  id: number;
  userId: string;
  totalBudget: number;
  currentSpent: number;
  categories: { transport: number; accommodation: number; activities: number; food: number };
  resourceMeter: number;
  alerts: string[];
}

export interface Quest {
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

// New interfaces for trip planning
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

// New interface for tasks (assumed structure, adjust based on tasks.json)
export interface Task {
  id: string;
  title: string;
  status: string;
  label:string;
  priority: 'low' | 'medium'|'high';
  // Add more fields based on tasks.json and taskSchema if needed
}

// Type for budgets.json structure
interface BudgetsData {
  sampleBudgets: Budget[];
  costs: { discounts: number[]; currency: string };
}

// Type for leaderboards.json structure
interface LeaderboardsData {
  global: LeaderboardEntry[];
  friends: LeaderboardEntry[];
}

// Type for activities.json structure
interface ActivitiesData {
  [spotId: number]: Activity[];
}

// Simulated in-memory storage for trips
let trips: Trip[] = [];

// Services
export const dataService = {
  getSpots: (): Spot[] => spotsData as Spot[],
  getBudgets: (userId: string): Budget[] => (budgetsData as BudgetsData).sampleBudgets.filter(b => b.userId === userId),
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
  playMiniGame: (): number => Math.floor(Math.random() * 30) + 10, // Returns 10-40% discount
  getActivities: (spotId: number): Activity[] => (activitiesData as ActivitiesData)[spotId] || [],
  saveTrip: (trip: Trip): void => {
    trips = [...trips, trip];
    console.log(`Saved trip: ${trip.name} with ${trip.spots.length} spots`);
  },
  getTasks: (): Task[] => tasksData as Task[], // New method to get tasks
};
