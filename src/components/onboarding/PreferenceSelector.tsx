import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  MapPin, Music, Leaf, Wallet, Calendar, DollarSign, 
  Target, Heart, Users, Camera, Coffee, Mountain,
  Plane, ChevronRight, Sparkles, Trophy
} from "lucide-react";

interface PreferenceSelectorProps {
  onComplete?: (preferences: any, tripParams: any) => void;
}

const colors = {
  persianPink: '#f991cc',
  pinkLavender: '#e2afde',
  thistle: '#d3c2ce',
  timberwolf: '#d3d2c7',
  lemonChiffon: '#e2e1b9',
};

const saDestinations = [
  'Cape Town', 'Kruger National Park', 'Johannesburg', 'Durban',
  'Garden Route', 'Drakensberg', 'Stellenbosch', 'Hermanus',
  'Knysna', 'Port Elizabeth', 'Blyde River Canyon', 'Pilanesberg'
];

const budgetRanges = [
  { label: 'Budget Explorer', range: 'R2,000 - R8,000', icon: '💰' },
  { label: 'Comfortable Adventurer', range: 'R8,000 - R15,000', icon: '✈️' },
  { label: 'Premium Experience', range: 'R15,000 - R30,000', icon: '🏖️' },
  { label: 'Luxury Escape', range: 'R30,000+', icon: '👑' }
];

export default function EnhancedPreferenceSelector({ onComplete }: PreferenceSelectorProps) {
  const [preferences, setPreferences] = useState({
    wildlife: false,
    nature: false,
    cultural: false,
    adventure: false,
    food: false,
    family: false,
    friends: false,
    budget: false,
  });

  const [tripParams, setTripParams] = useState({
    destination: '',
    startDate: '',
    endDate: '',
    budget: '',
    budgetRange: '',
    groupSize: '1',
    tripType: 'solo'
  });

  const [step, setStep] = useState(1); // 1: Welcome, 2: Preferences, 3: Trip Details, 4: Final
  const [showDestinationSuggestions, setShowDestinationSuggestions] = useState(false);

  const preferenceOptions = [
    {
      key: 'wildlife',
      title: 'Wildlife Safari',
      description: 'Big Five, game reserves, Kruger',
      icon: Target,
      color: 'from-green-400 to-green-600'
    },
    {
      key: 'nature',
      title: 'Natural Wonders',
      description: 'Hiking, mountains, coastlines',
      icon: Mountain,
      color: 'from-blue-400 to-blue-600'
    },
    {
      key: 'cultural',
      title: 'Cultural Heritage',
      description: 'History, townships, local traditions',
      icon: Camera,
      color: 'from-purple-400 to-purple-600'
    },
    {
      key: 'adventure',
      title: 'Thrill Seeking',
      description: 'Bungee, shark diving, extreme sports',
      icon: Sparkles,
      color: 'from-red-400 to-red-600'
    },
    {
      key: 'food',
      title: 'Culinary Journey',
      description: 'Wine routes, local cuisine, markets',
      icon: Coffee,
      color: 'from-orange-400 to-orange-600'
    },
    {
      key: 'family',
      title: 'Family Fun',
      description: 'Kid-friendly activities, beaches',
      icon: Heart,
      color: 'from-pink-400 to-pink-600'
    },
    {
      key: 'friends',
      title: 'Squad Adventures',
      description: 'Group activities, nightlife, road trips',
      icon: Users,
      color: 'from-indigo-400 to-indigo-600'
    },
    {
      key: 'budget',
      title: 'Budget-Conscious',
      description: 'Affordable options, backpacker spots',
      icon: Wallet,
      color: 'from-emerald-400 to-emerald-600'
    }
  ];

  const togglePreference = (key: keyof typeof preferences) => {
    setPreferences({ ...preferences, [key]: !preferences[key] });
  };

  const getSelectedCount = () => Object.values(preferences).filter(Boolean).length;

  const handlePlanGetaway = () => {
    // Create user object with preferences
    const userData = {
      preferences,
      tripParams,
      selectedInterests: Object.entries(preferences)
        .filter(([_, selected]) => selected)
        .map(([key, _]) => key)
    };

    // Save to localStorage
    localStorage.setItem('userPreferences', JSON.stringify(userData));
    
    // Navigate to recommendations
    if (onComplete) {
      onComplete(preferences, tripParams);
    } else {
      // Fallback navigation
      window.location.href = '/recommendations';
    }
  };

  const renderWelcome = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center space-y-6"
    >
      <div className="text-6xl mb-4">🇿🇦</div>
      <h1 className="text-3xl font-bold text-gray-900">Welcome to SA Explorer</h1>
      <p className="text-gray-600 text-lg">
        Discover your perfect South African adventure based on your interests and travel style.
      </p>
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-purple-600">500+</div>
            <div className="text-sm text-gray-600">SA Destinations</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-pink-600">50+</div>
            <div className="text-sm text-gray-600">Adventure Quests</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">24/7</div>
            <div className="text-sm text-gray-600">Trip Planning</div>
          </div>
        </div>
      </div>
      <motion.button
        onClick={() => setStep(2)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-full py-4 rounded-xl font-medium text-white text-lg flex items-center justify-center gap-2"
        style={{ backgroundColor: colors.persianPink }}
      >
        Start Planning <ChevronRight className="h-5 w-5" />
      </motion.button>
    </motion.div>
  );

  const renderPreferences = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">What interests you?</h2>
        <p className="text-gray-600">Select all that apply ({getSelectedCount()}/8 selected)</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {preferenceOptions.map((option) => {
          const Icon = option.icon;
          const isSelected = preferences[option.key as keyof typeof preferences];
          
          return (
            <motion.div
              key={option.key}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                isSelected 
                  ? 'border-pink-400 bg-gradient-to-r from-pink-50 to-purple-50' 
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
              onClick={() => togglePreference(option.key as keyof typeof preferences)}
            >
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-lg bg-gradient-to-r ${option.color} text-white`}>
                  <Icon className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{option.title}</h3>
                  <p className="text-sm text-gray-600">{option.description}</p>
                </div>
                {isSelected && (
                  <div className="text-pink-500">
                    <Trophy className="h-5 w-5" />
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      <motion.button
        onClick={() => setStep(3)}
        disabled={getSelectedCount() === 0}
        whileHover={{ scale: getSelectedCount() > 0 ? 1.05 : 1 }}
        whileTap={{ scale: getSelectedCount() > 0 ? 0.95 : 1 }}
        className={`w-full py-4 rounded-xl font-medium text-white mt-6 flex items-center justify-center gap-2 ${
          getSelectedCount() > 0 
            ? 'opacity-100' 
            : 'opacity-50 cursor-not-allowed'
        }`}
        style={{ backgroundColor: colors.persianPink }}
      >
        Next: Trip Details <ChevronRight className="h-5 w-5" />
      </motion.button>
    </motion.div>
  );

  const renderTripDetails = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Plan Your Trip</h2>
        <p className="text-gray-600">Let's customize your South African adventure</p>
      </div>

      <div className="space-y-4">
        {/* Destination */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Where would you like to go?
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="e.g., Cape Town, Kruger National Park"
              value={tripParams.destination}
              onChange={(e) => {
                setTripParams({ ...tripParams, destination: e.target.value });
                setShowDestinationSuggestions(e.target.value.length > 0);
              }}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500/50 bg-gray-50"
            />
            {showDestinationSuggestions && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-40 overflow-y-auto">
                {saDestinations
                  .filter(dest => dest.toLowerCase().includes(tripParams.destination.toLowerCase()))
                  .map(dest => (
                    <div
                      key={dest}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        setTripParams({ ...tripParams, destination: dest });
                        setShowDestinationSuggestions(false);
                      }}
                    >
                      {dest}
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="date"
                value={tripParams.startDate}
                onChange={(e) => setTripParams({ ...tripParams, startDate: e.target.value })}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500/50 bg-gray-50"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="date"
                value={tripParams.endDate}
                onChange={(e) => setTripParams({ ...tripParams, endDate: e.target.value })}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500/50 bg-gray-50"
              />
            </div>
          </div>
        </div>

        {/* Budget Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Budget Range</label>
          <div className="grid grid-cols-1 gap-2">
            {budgetRanges.map((range) => (
              <motion.div
                key={range.label}
                whileHover={{ scale: 1.02 }}
                className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                  tripParams.budgetRange === range.range
                    ? 'border-pink-400 bg-pink-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
                onClick={() => setTripParams({ ...tripParams, budgetRange: range.range })}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{range.icon}</span>
                    <div>
                      <div className="font-medium text-gray-900">{range.label}</div>
                      <div className="text-sm text-gray-600">{range.range}</div>
                    </div>
                  </div>
                  {tripParams.budgetRange === range.range && (
                    <Trophy className="h-5 w-5 text-pink-500" />
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Trip Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Trip Type</label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { key: 'solo', label: 'Solo', icon: '🧳' },
              { key: 'couple', label: 'Couple', icon: '💕' },
              { key: 'group', label: 'Group', icon: '👥' }
            ].map((type) => (
              <motion.button
                key={type.key}
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setTripParams({ ...tripParams, tripType: type.key })}
                className={`p-3 rounded-xl border-2 transition-all ${
                  tripParams.tripType === type.key
                    ? 'border-pink-400 bg-pink-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="text-2xl mb-1">{type.icon}</div>
                <div className="text-sm font-medium">{type.label}</div>
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <motion.button
          type="button"
          onClick={() => setStep(2)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex-1 py-3 rounded-xl font-medium border border-gray-300 text-gray-700 bg-white"
        >
          Back
        </motion.button>
        
        <motion.button
          type="button"
          onClick={handlePlanGetaway}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex-2 py-3 px-6 rounded-xl font-medium text-white flex items-center justify-center gap-2"
          style={{ backgroundColor: colors.persianPink }}
        >
          <Plane className="h-5 w-5" />
          Plan My SA Getaway
        </motion.button>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl"
      >
        <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
          {/* Progress indicator */}
          <div className="flex justify-center mb-8">
            <div className="flex space-x-2">
              {[1, 2, 3].map((stepNum) => (
                <div
                  key={stepNum}
                  className={`w-10 h-2 rounded-full transition-colors ${
                    step >= stepNum ? 'bg-gradient-to-r from-pink-400 to-purple-400' : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
          </div>
          
          {step === 1 && renderWelcome()}
          {step === 2 && renderPreferences()}
          {step === 3 && renderTripDetails()}
        </div>
      </motion.div>
    </div>
  );
}