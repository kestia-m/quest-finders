import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import type { User } from "./types";
import LoginScreen from "./components/onboarding/Login";
import { ItineraryPlanner } from "@/components/itinerary/ItineraryPlanner";
import { Leaderboard } from "@/components/gamification/Leaderboard";
import { TravelTales } from "@/components/social/Traveltales";
import Dashboard from "./components/dashboard/dashboard";
import Budget from "@/components/budget/Budget";
import Rewards from "./components/rewards/Rewards";
import { Quests } from "@/components/gamification/Quests";

function App() {
  const [user, /* setUser */] = useState<User | null>(null); // Commented out setUser to avoid unused variable warning

  // Derive userId from user state, fallback to "user1" if null
  const userId = user?.id || "user1";

  return (
    <div>
      <Routes>
        <Route path="/" element={<LoginScreen />} />
        <Route path="/dashboard-k" element={<Dashboard user={user} />} />
        <Route path="/itinerary" element={<ItineraryPlanner />} />
        <Route path="/quests" element={<Quests/>} />
        <Route path="/leaderboard" element={<Leaderboard type="global" />} />
        <Route path="/tales" element={<TravelTales groupId={1} />} />
        <Route path="/budget" element={<Budget user={user} />} />
        <Route path="/rewards" element={<Rewards userId={userId} />} />
      </Routes>
    </div>
  );
}

export default App;
