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
    <div className="bg-white flex h-screen">
      {/* Sidebar fixed on the left */}
      <div className="fixed left-0 top-0 h-full">
        <Sidebar currentPath={window.location.pathname} />
      </div>
      {/* Main content centered with max-width */}
      <div className="flex flex-1 flex-col overflow-hidden pl-64"> {/* Adjust padding-left to match sidebar width */}
        <header className="border-b p-4 md:p-6 bg-white w-full">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div className="flex items-center gap-4">
              <MobileSidebar />
              <h1 className="text-xl font-semibold md:text-2xl">
                {getPageTitle(window.location.pathname)}
              </h1>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-4 md:p-6 flex justify-center">
          <div className="w-full max-w-7xl">
            <Routes>
              <Route path="/" element={<LoginScreen />} />
              <Route path="/dashboard-k" element={<Dashboard user={user} />} />
              <Route path="/itinerary" element={<ItineraryPlanner />} />
              <Route path="/quests" element={<Quests />} />
              <Route path="/leaderboard" element={<Leaderboard type="global" />} />
              <Route path="/tales" element={<TravelTales groupId={1} />} />
              <Route path="/budget" element={<Budget user={user} />} />
              <Route path="/rewards" element={<Rewards userId={userId} />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
