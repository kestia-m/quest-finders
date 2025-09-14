import spotsData from "../data/spots.json";
import budgetsData from "../data/budgets.json";
import questsData from "../data/quests.json";
import leaderboardsData from "../data/leaderboards.json";
import multiplayerData from "../data/multiplayer.json";
import activitiesData from "../data/activities.json";
import tasksData from "../data/tasks.json";

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
  date: string;
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
  cost: number;
  completedAt?: Date;
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
  status: string;
  label: string;
  priority: "low" | "medium" | "high";
}

export interface UserRewards {
  id: number;
  userId: string;
  totalRands: number;
  xpEarned: number;
  lastUpdated: string;
  sponsorContributions: { sponsor: string; amount: number; date: string }[];
}

interface BudgetsData {
  sampleBudgets: Budget[];
  costs: { discounts: number[]; currency: string };
}

interface LeaderboardsData {
  global: LeaderboardEntry[];
  friends: LeaderboardEntry[];
}

interface ActivitiesData {
  [spotId: number]: Activity[];
}

let trips: Trip[] = [];
let quests: Quest[] = questsData as Quest[];
let budgets: Budget[] = (budgetsData as BudgetsData).sampleBudgets;
let rewards: UserRewards[] = [];

export const dataService = {
  getSpots: (): Spot[] => spotsData as Spot[],
  getBudgets: (userId: string, range?: string): Budget[] => {
    const filteredBudgets = budgets.filter((b) => b.userId === userId);
    if (!range) return filteredBudgets;

    const today = new Date("2025-09-13");
    return filteredBudgets.filter((budget) => {
      const budgetDate = new Date(budget.date);
      const diffInMs = today.getTime() - budgetDate.getTime();
      const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
      switch (range) {
        case "30days":
          return diffInDays <= 30;
        case "60days":
          return diffInDays <= 60;
        case "90days":
          return diffInDays <= 90;
        case "1year":
          return diffInDays <= 365;
        default:
          return true;
      }
    });
  },
  getQuests: (): Quest[] => quests,
  updateQuest: (questId: number, completed: boolean): void => {
    const quest = quests.find((q) => q.id === questId);
    if (quest) {
      quest.completed = completed;
      if (completed && !quest.completedAt) quest.completedAt = new Date();
      console.log(`Updated quest ${questId} to completed: ${completed}`);
    }
  },
  addQuest: (newQuest: Quest): void => {
    quests = [...quests, newQuest];
    console.log(`Added quest ${newQuest.id}: ${newQuest.name}`);
  },
  addBudget: (newBudget: Budget): void => {
    budgets = [...budgets, newBudget];
    console.log(`Added budget ${newBudget.id} for user ${newBudget.userId}`);
  },
  getLeaderboards: (type: "global" | "friends"): LeaderboardEntry[] => (leaderboardsData as LeaderboardsData)[type],
  updateLeaderboard: (userId: string, xp: number): void => {
    const leaderboard = (leaderboardsData as LeaderboardsData).global;
    const user = leaderboard.find((u) => u.userId === userId);
    if (user) {
      user.xp += xp;
      console.log(`Updated XP for ${userId}: ${user.xp}`);
    }
  },
  getMultiplayerGroups: (userId: string): MultiplayerGroup[] => (multiplayerData as MultiplayerGroup[]).filter((g) => g.members.includes(userId)),
  createTale: (groupId: number, content: string): void => {
    const group = (multiplayerData as MultiplayerGroup[]).find((g) => g.id === groupId);
    if (group) {
      group.tales.push({ id: group.tales.length + 1, userId: "user1", content, upvotes: 0, xpBonus: 0 });
      console.log(`Shared tale in group ${groupId}: ${content}`);
    }
  },
  playMiniGame: (): number => Math.floor(Math.random() * 30) + 10,
  getActivities: (spotId: number): Activity[] => (activitiesData as ActivitiesData)[spotId] || [],
  saveTrip: (trip: Trip): void => {
    trips = [...trips, trip];
    console.log(`Saved trip: ${trip.name} with ${trip.spots.length} spots`);
  },
  getTasks: (): Task[] => tasksData as Task[],
  getAllBudgets: (): Budget[] => budgets,
  getRewards: (userId: string): UserRewards | undefined => rewards.find((r) => r.userId === userId),
  updateRewards: (userId: string, updatedRewards: UserRewards): void => {
    const index = rewards.findIndex((r) => r.userId === userId);
    if (index !== -1) {
      rewards[index] = updatedRewards;
    } else {
      rewards = [...rewards, updatedRewards];
    }
    console.log(`Updated rewards for ${userId}: ${updatedRewards.totalRands} ZAR`);
  },
};
