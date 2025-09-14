
export interface User {
  id?: string;
  username?: string;
  email?: string;
  preferences: {
    interests: string[]; // e.g., wildlife, nature, concerts, budgetTravel
    places?: string[];
    budget: string; // e.g., "1000-3000"
    lifestyle: string; // e.g., "Adventurous soul"
    perfectTrip: string; // e.g., "5-day wildlife getaway"
    relaxStyle?: string;
    favoriteActivity?: string;
  };
  progression?: {
    level?: number;
    title?: string;
    stats?: {
      placesVisited?: number;
      questsCompleted?: number;
    };
    currentXP?: number;
    nextLevelXP?: number;
    badges?: { id: string; name: string; icon: string; description?: string }[];
  };
  budgets?: {
    id: number;
    date: string;
    totalBudget: number;
    currentSpent: number;
  }[];
}

export interface Place {
  id: string;
  name: string;
  category: string[];
  description: string;
  location?: {
    lat: number;
    lng: number;
  };
  cost?: {
    [key: string]: number;
  };
  image?: string;
  influencerEndorsed?: boolean;
  endorsedBy?: string;
  reviews?: Review[];
}

export interface Review {
  user: string;
  rating: number;
  comment: string;
}


export interface Spot {
  id: number;
  name: string;
  category: string[]; // Changed to string[] to match spots.json
  description: string;
  location?: { lat: number; lng: number };
  cost?: { entry: number; transport: number; accommodation: number };
  reviews?: Review[];
  image?: string;
  influencerEndorsed?: boolean;
  endorsedBy?: string;
}

export interface Recommendation extends Spot {
  avgRating: number;
  influencerEndorsed: boolean;
}

export interface TripSpot extends Spot {
  selectedActivities: {
    name: string;
    estimatedCost: number;
  }[];
}

export interface Trip {
  id: number;
  name: string;
  spots: TripSpot[];
}