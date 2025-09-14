import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Heart, Brain, ArrowRight, ArrowLeft } from "lucide-react";

// Define your color palette
const colors = {
  persianPink: '#f991cc',
  pinkLavender: '#e2afde',
  thistle: '#d3c2ce',
  timberwolf: '#d3d2c7',
  lemonChiffon: '#e2e1b9',
};

// Avatar options
const avatarOptions = [
  { id: 1, emoji: '🦁', label: 'Lion' },
  { id: 2, emoji: '🐘', label: 'Elephant' },
  { id: 3, emoji: '🐆', label: 'Leopard' },
  { id: 4, emoji: '🦒', label: 'Giraffe' },
  { id: 5, emoji: '🐊', label: 'Crocodile' },
  { id: 6, emoji: '🦏', label: 'Rhino' },
];

export default function ProfileCreator() {
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState({
    name: '',
    avatar: '',
    likes: '',
    hobbies: '',
    favoriteFood: '',
    wouldRatherBeach: false,
    wouldRatherSolo: false,
    wouldRatherBudget: false,
  });
  const navigate = useNavigate();

  const prompts = [
    { type: 'likes', question: 'What are your top 3 likes? (e.g., adventure, music)' },
    { type: 'hobbies', question: 'Favorite hobbies? (e.g., hiking, reading)' },
    { type: 'favoriteFood', question: 'Favorite SA food? (e.g., bobotie, bunny chow)' },
  ];

  const handleNext = () => {
    if (step < 5) {
      setStep(step + 1);
    } else {
      // Save profile (mock - extend userData.users[0])
      const updatedUser = { ...profile };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      navigate('/preferences');
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      navigate('/login');
    }
  };

  const handleAvatarSelect = (emoji: string) => {
    setProfile({ ...profile, avatar: emoji });
  };

  const currentPrompt = step > 1 && step < 5 ? prompts[step - 2] : null;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Progress indicator */}
        <div className="flex justify-center mb-6">
          <div className="flex space-x-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full ${
                  i <= step ? 'bg-persianPink' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-lg border border-thistle">
          <h2 className="text-xl font-semibold text-center mb-6 text-gray-800" style={{ fontFamily: "'Montserrat', sans-serif" }}>
            {step === 1 && 'Create Your Profile'}
            {step === 2 && 'Your Interests'}
            {step === 3 && 'Your Hobbies'}
            {step === 4 && 'Food Preferences'}
            {step === 5 && 'Travel Style'}
          </h2>
          
          <div className="space-y-6">
            {step === 1 && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-4 flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Basic Info
                </h3>
                
                {/* Avatar Selection */}
                <div className="mb-6">
                  <p className="text-xs text-gray-600 mb-3">Choose your avatar:</p>
                  <div className="grid grid-cols-3 gap-3">
                    {avatarOptions.map((avatar) => (
                      <motion.button
                        key={avatar.id}
                        type="button"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`p-3 rounded-xl border-2 text-2xl flex items-center justify-center ${
                          profile.avatar === avatar.emoji
                            ? 'border-persianPink bg-pinkLavender/20'
                            : 'border-thistle bg-timberwolf/20'
                        }`}
                        onClick={() => handleAvatarSelect(avatar.emoji)}
                      >
                        {avatar.emoji}
                      </motion.button>
                    ))}
                  </div>
                </div>
                
                <input
                  placeholder="Full Name"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-thistle focus:outline-none focus:ring-2 focus:ring-persianPink/50"
                  style={{ backgroundColor: `${colors.timberwolf}20` }}
                />
              </div>
            )}
            
            {currentPrompt && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-4 flex items-center gap-2">
                  {currentPrompt.type === 'likes' && <Heart className="h-4 w-4" />}
                  {currentPrompt.type === 'hobbies' && <Brain className="h-4 w-4" />}
                  {currentPrompt.type === 'favoriteFood' && '🍴'}
                  {currentPrompt.question}
                </h3>
                <input
                  placeholder={currentPrompt.question}
                  value={profile[currentPrompt.type as keyof typeof profile] as string}
                  onChange={(e) => setProfile({ ...profile, [currentPrompt.type]: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-thistle focus:outline-none focus:ring-2 focus:ring-persianPink/50"
                  style={{ backgroundColor: `${colors.timberwolf}20` }}
                />
              </div>
            )}
            
            {step === 5 && (
              <div className="space-y-6">
                <h3 className="text-sm font-medium text-gray-700 text-center">Would You Rather?</h3>
                
                <div className="space-y-4">
                  <div className="p-4 rounded-xl border border-thistle" style={{ backgroundColor: `${colors.timberwolf}10` }}>
                    <p className="text-sm font-medium text-gray-700 mb-2">Beach getaway or Mountain hike?</p>
                    <div className="flex space-x-3">
                      <button
                        type="button"
                        className={`flex-1 py-2 rounded-lg text-sm ${
                          profile.wouldRatherBeach ? 'bg-persianPink text-white' : 'bg-gray-100 text-gray-700'
                        }`}
                        onClick={() => setProfile({ ...profile, wouldRatherBeach: true })}
                      >
                        Beach
                      </button>
                      <button
                        type="button"
                        className={`flex-1 py-2 rounded-lg text-sm ${
                          !profile.wouldRatherBeach ? 'bg-persianPink text-white' : 'bg-gray-100 text-gray-700'
                        }`}
                        onClick={() => setProfile({ ...profile, wouldRatherBeach: false })}
                      >
                        Mountains
                      </button>
                    </div>
                  </div>
                  
                  <div className="p-4 rounded-xl border border-thistle" style={{ backgroundColor: `${colors.timberwolf}10` }}>
                    <p className="text-sm font-medium text-gray-700 mb-2">Solo travel or Group adventure?</p>
                    <div className="flex space-x-3">
                      <button
                        type="button"
                        className={`flex-1 py-2 rounded-lg text-sm ${
                          profile.wouldRatherSolo ? 'bg-persianPink text-white' : 'bg-gray-100 text-gray-700'
                        }`}
                        onClick={() => setProfile({ ...profile, wouldRatherSolo: true })}
                      >
                        Solo
                      </button>
                      <button
                        type="button"
                        className={`flex-1 py-2 rounded-lg text-sm ${
                          !profile.wouldRatherSolo ? 'bg-persianPink text-white' : 'bg-gray-100 text-gray-700'
                        }`}
                        onClick={() => setProfile({ ...profile, wouldRatherSolo: false })}
                      >
                        Group
                      </button>
                    </div>
                  </div>
                  
                  <div className="p-4 rounded-xl border border-thistle" style={{ backgroundColor: `${colors.timberwolf}10` }}>
                    <p className="text-sm font-medium text-gray-700 mb-2">Budget trip or Luxury escape?</p>
                    <div className="flex space-x-3">
                      <button
                        type="button"
                        className={`flex-1 py-2 rounded-lg text-sm ${
                          profile.wouldRatherBudget ? 'bg-persianPink text-white' : 'bg-gray-100 text-gray-700'
                        }`}
                        onClick={() => setProfile({ ...profile, wouldRatherBudget: true })}
                      >
                        Budget
                      </button>
                      <button
                        type="button"
                        className={`flex-1 py-2 rounded-lg text-sm ${
                          !profile.wouldRatherBudget ? 'bg-persianPink text-white' : 'bg-gray-100 text-gray-700'
                        }`}
                        onClick={() => setProfile({ ...profile, wouldRatherBudget: false })}
                      >
                        Luxury
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex justify-between pt-4">
              <motion.button
                type="button"
                onClick={handleBack}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 text-sm text-gray-600"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </motion.button>
              
              <motion.button
                type="button"
                onClick={handleNext}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white"
                style={{ backgroundColor: colors.persianPink }}
              >
                {step < 5 ? 'Next' : 'Finish'}
                <ArrowRight className="h-4 w-4" />
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}