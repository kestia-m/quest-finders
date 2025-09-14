import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Music, Leaf, Wallet, Calendar, DollarSign } from "lucide-react";
import type { User } from '../../types';

interface PreferenceSelectorProps {
  setUser: (user: User | null) => void;
}

const colors = {
  persianPink: '#f991cc',
  pinkLavender: '#e2afde',
  thistle: '#d3c2ce',
  timberwolf: '#d3d2c7',
  lemonChiffon: '#e2e1b9',
};

export default function PreferenceSelector({ setUser }: PreferenceSelectorProps) {
  const [preferences, setPreferences] = useState({
    wildlife: false,
    nature: false,
    concerts: false,
    budgetTravel: false,
  });
  const [tripParams, setTripParams] = useState({
    destination: '',
    dates: '',
    budget: ''
  });
  const [step, setStep] = useState(1); // 1: Preferences, 2: Trip Params
  const navigate = useNavigate();

  const togglePreference = (key: keyof typeof preferences) => {
    setPreferences({ ...preferences, [key]: !preferences[key] });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const user: User = {
      id: localStorage.getItem('user')?.split('"id": "')[1]?.split('"')[0] || 'user1',
      username: localStorage.getItem('user')?.split('"username": "')[1]?.split('"')[0] || 'NewUser',
      email: localStorage.getItem('user')?.split('"email": "')[1]?.split('"')[0] || 'newuser@example.com',
      preferences: {
        ...preferences,
        interests: Object.entries(preferences)
          .filter(([key, value]) => value === true)
          .map(([key]) => key),
        relaxStyle: '',
        favoriteActivity: '',
        budget: tripParams.budget,
        lifestyle: '',
        perfectTrip: '',
      },
      progression: { level: 1, currentXP: 0, nextLevelXP: 1000, title: 'Newbie', badges: [], stats: { placesVisited: 0, questsCompleted: 0 } },
      budgets: [],
    };
    setUser(user);
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('tripParams', JSON.stringify(tripParams));
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-thistle">
          <h2 className="text-xl font-semibold text-center mb-6 text-gray-800">
            {step === 1 ? 'Select Your Preferences' : 'Plan Your Trip'}
          </h2>
          
          {/* Progress indicator */}
          <div className="flex justify-center mb-6">
            <div className="flex space-x-2">
              <div className={`w-8 h-1 rounded-full ${step >= 1 ? 'bg-persianPink' : 'bg-gray-300'}`}></div>
              <div className={`w-8 h-1 rounded-full ${step >= 2 ? 'bg-persianPink' : 'bg-gray-300'}`}></div>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {step === 1 ? (
              <>
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-colors ${
                    preferences.wildlife 
                      ? 'border-persianPink bg-pinkLavender/20' 
                      : 'border-thistle bg-timberwolf/20'
                  }`}
                  onClick={() => togglePreference('wildlife')}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${preferences.wildlife ? 'bg-persianPink text-white' : 'bg-gray-100'}`}>
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-800">Wildlife</h3>
                      <p className="text-xs text-gray-600">Safaris, animal encounters</p>
                    </div>
                  </div>
                </motion.div>
                
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-colors ${
                    preferences.nature 
                      ? 'border-persianPink bg-pinkLavender/20' 
                      : 'border-thistle bg-timberwolf/20'
                  }`}
                  onClick={() => togglePreference('nature')}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${preferences.nature ? 'bg-persianPink text-white' : 'bg-gray-100'}`}>
                      <Leaf className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-800">Nature</h3>
                      <p className="text-xs text-gray-600">Hiking, landscapes, parks</p>
                    </div>
                  </div>
                </motion.div>
                
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-colors ${
                    preferences.concerts 
                      ? 'border-persianPink bg-pinkLavender/20' 
                      : 'border-thistle bg-timberwolf/20'
                  }`}
                  onClick={() => togglePreference('concerts')}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${preferences.concerts ? 'bg-persianPink text-white' : 'bg-gray-100'}`}>
                      <Music className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-800">Concerts</h3>
                      <p className="text-xs text-gray-600">Music events, festivals</p>
                    </div>
                  </div>
                </motion.div>
                
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-colors ${
                    preferences.budgetTravel 
                      ? 'border-persianPink bg-pinkLavender/20' 
                      : 'border-thistle bg-timberwolf/20'
                  }`}
                  onClick={() => togglePreference('budgetTravel')}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${preferences.budgetTravel ? 'bg-persianPink text-white' : 'bg-gray-100'}`}>
                      <Wallet className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-800">Budget Travel</h3>
                      <p className="text-xs text-gray-600">Affordable options</p>
                    </div>
                  </div>
                </motion.div>
                
                <motion.button
                  type="button"
                  onClick={() => setStep(2)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full py-3 rounded-xl font-medium text-white mt-6"
                  style={{ backgroundColor: colors.persianPink }}
                >
                  Next: Plan Your Trip
                </motion.button>
              </>
            ) : (
              <>
                <div className="space-y-4">
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Destination (e.g., Kruger)"
                      value={tripParams.destination}
                      onChange={(e) => setTripParams({ ...tripParams, destination: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-thistle focus:outline-none focus:ring-2 focus:ring-persianPink/50"
                      style={{ backgroundColor: `${colors.timberwolf}20` }}
                    />
                  </div>
                  
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="date"
                      value={tripParams.dates}
                      onChange={(e) => setTripParams({ ...tripParams, dates: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-thistle focus:outline-none focus:ring-2 focus:ring-persianPink/50"
                      style={{ backgroundColor: `${colors.timberwolf}20` }}
                    />
                  </div>
                  
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="number"
                      placeholder="Max Budget (ZAR)"
                      value={tripParams.budget}
                      onChange={(e) => setTripParams({ ...tripParams, budget: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-thistle focus:outline-none focus:ring-2 focus:ring-persianPink/50"
                      style={{ backgroundColor: `${colors.timberwolf}20` }}
                    />
                  </div>
                </div>
                
                <div className="flex gap-3 mt-6">
                  <motion.button
                    type="button"
                    onClick={() => setStep(1)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex-1 py-3 rounded-xl font-medium border border-thistle text-gray-700"
                  >
                    Back
                  </motion.button>
                  
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex-1 py-3 rounded-xl font-medium text-white"
                    style={{ backgroundColor: colors.persianPink }}
                  >
                    Plan My Getaway
                  </motion.button>
                </div>
              </>
            )}
          </form>
        </div>
      </motion.div>
    </div>
  );
}