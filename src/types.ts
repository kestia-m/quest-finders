// src/types.ts
export interface User {
  id?: string;
  preferences: {
    interests: string[];
    places: string[];
    budget: string;
    lifestyle: string;
    perfectTrip: string;
  };
  progression?: {
    title?: string;
    stats?: {
      placesVisited?: number;
    };
    currentXP?: number;
    nextLevelXP?: number;
    badges?: { id: string; name: string; icon: string }[];
  };
}

export interface Place {
  id: string;
  name: string;
  category: string[];
  description: string;
  // Add other fields from safari-quest-data.json as needed
}

export interface Recommendation extends Place {
  avgRating: number;
  influencerEndorsed: boolean;
}
