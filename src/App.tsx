import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import HomeScreen from './components/HomeScreen';
import CreatePreferences from './components/CreatePreferences';
import TripParams from './components/TripParams';
import Dashboard from './components/Dashboard';
import './App.css';
import type { User } from './types';
//import ResourceMeter from '@/components/budget/ResourceMeter';
import { ItineraryPlanner } from '@/components/itinerary/ItineraryPlanner';
import { Leaderboard } from '@/components/gamification/Leaderboard';
import { TravelTales } from '@/components/social/Traveltales';
import {TaskPage} from '@/components/tasks/tasklist';
import Dashboardk from '@/components/dashboard/dashboard';
import Budget from '@/components/budget/Budget';
import Rewards from './components/rewards/Rewards';
function App() {
  const [user, setUser] = useState<User | null>(null);

  return (
    <div>
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/preferences" element={<CreatePreferences setUser={setUser} />} />
        <Route path="/trip-params" element={<TripParams />} />
        <Route path="/dashboard" element={<Dashboard user={user} />} />
        <Route path="/itinerary" element={<ItineraryPlanner /> }/>
        <Route path="/tasks" element={<TaskPage />}/>
         <Route path="/dashboard-k" element={<Dashboardk user={user}/>}/>
        <Route path="/leaderboard" element={<Leaderboard type="global" />} />
        <Route path="/tales" element={<TravelTales groupId={1} />}/>
        <Route path="/budget" element={<Budget user={user} />} />
        <Route path="/rewards" element={<Rewards userId="user1"/>}/>
      </Routes>
    </div>
  );
}

export default App;
