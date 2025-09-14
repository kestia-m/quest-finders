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
import { Sidebar, MobileSidebar } from "@/components/ui/Sidebar";

function App() {
  const [user, /* setUser */] = useState<User | null>(null); // Commented out setUser to avoid unused variable warning

  // Derive userId from user state, fallback to "user1" if null
  const userId = user?.id || "user1";

  // Map routes to page titles for dynamic header
  const getPageTitle = (pathname: string) => {
    const titleMap: { [key: string]: string } = {
      "/": "Login",
      "/dashboard-k": "Dashboard",
      "/itinerary": "Itinerary Planner",
      "/quests": "Quests",
      "/budget": "Budget",
      "/rewards": "Rewards",
      "/leaderboard": "Leaderboard",
      "/tales": "Travel Tales",

    };
    return titleMap[pathname] || "App";
  };

  return (
    <div>
      <Routes>
        <Route path="/" element={<LoginScreen />} />
         {/*<Route path="/preferences" element={<CreatePreferences setUser={setUser} />} />
        <Route path="/trip-params" element={<TripParams />} />
        <Route path="/dashboard" element={<Dashboard user={user} />} />*/}
        <Route path="/dashboard-k" element={<Dashboardk />} />
        <Route path="/budget" element={<ResourceMeter userId="user1"/>}/>
        <Route path="/itinerary" element={<ItineraryPlanner /> }/>
        <Route path="/tasks" element={<TaskPage />}/>
        <Route path="/quests" element={<Quests />} />
        <Route path="/leaderboard" element={<Leaderboard type="global" />} />
        <Route path="/tales" element={<TravelTales groupId={1} />}
          />

      </Routes>
    </div>
  );
}

export default App;
