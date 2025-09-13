import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import HomeScreen from './components/HomeScreen';
import CreatePreferences from './components/CreatePreferences';
import TripParams from './components/TripParams';
import Dashboard from './components/Dashboard';
import './App.css';
import type { User } from './types';

function App() {
  const [user, setUser] = useState<User | null>(null);

  return (
    <div>
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/preferences" element={<CreatePreferences setUser={setUser} />} />
        <Route path="/trip-params" element={<TripParams />} />
        <Route path="/dashboard" element={<Dashboard user={user} />} />
      </Routes>
    </div>
  );
}

export default App;