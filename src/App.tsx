import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import type { User } from './types';
import LoginScreen from './components/onboarding/Login';
import { ResourceMeter } from '@/components/budget/ResourceMeter';
import { ItineraryPlanner } from '@/components/itinerary/ItineraryPlanner';
import { Leaderboard } from '@/components/gamification/Leaderboard';
import { TravelTales } from '@/components/social/Traveltales';
import { TaskPage } from '@/components/tasks/tasklist';
import Dashboardk from '@/components/dashboard/Dashboard';
import { Quests } from '@/components/gamification/Quests';
import CreatePreferences from '@/components/onboarding/PreferenceSelector';
import ProfileCreator from './components/onboarding/ProfileCreator';
import Recommendations from './components/onboarding/Recommendations';

function App() {
  const [user, setUser] = useState<User | null>(null);

  return (
    <div>
      <Routes>
        <Route path="/" element={<LoginScreen />} />
         {/*<Route path="/preferences" element={<CreatePreferences setUser={setUser} />} />
        <Route path="/trip-params" element={<TripParams />} />
        <Route path="/dashboard" element={<Dashboard user={user} />} />*/}
        <Route path="/dashboard-k" element={<Dashboardk />} />
        <Route path="/profile" element={<ProfileCreator  />} />
        <Route path="/preferences" element={<CreatePreferences setUser={setUser} />} />
        <Route path="/recommendations" element={<Recommendations />} />
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
