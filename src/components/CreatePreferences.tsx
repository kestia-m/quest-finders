import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import type { User } from '../types'; // Assume User type includes preferences

// Theme reuse
const theme = {
  colors: {
    coral: '#FF6B6B',
    peach: '#FFB347',
    sage: '#87A96B',
    cream: '#FFF8E7',
  },
  gradients: {
    warm: 'linear-gradient(135deg, #FF6B6B 0%, #FFB347 100%)',
  },
};

const QuestionnaireContainer = styled.div`
  min-height: 100vh;
  background: ${theme.colors.cream};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
`;

const StepCard = styled(motion.div)`
  background: white;
  border-radius: 32px;
  padding: 3rem 2rem;
  box-shadow: 0 12px 48px rgba(255, 107, 107, 0.12);
  border: 2px solid ${theme.colors.peach};
  width: 100%;
  max-width: 500px;
  text-align: center;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 4px;
  background: ${theme.colors.sage || '#ddd'};
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: 2rem;
`;

const ProgressFill = styled(motion.div)`
  height: 100%;
  background: ${theme.gradients.warm};
  transition: width 0.3s ease;
`;

const Question = styled(motion.h2)`
  font-size: 1.8rem;
  color: ${theme.colors.coral};
  margin-bottom: 1.5rem;
`;

const OptionButton = styled(motion.button)`
  background: white;
  border: 2px solid ${theme.colors.peach};
  border-radius: 20px;
  padding: 1rem 2rem;
  margin: 0.5rem;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${theme.colors.peach};
    color: white;
  }
`;

const InputField = styled.input`
  width: 100%;
  padding: 1rem;
  border: 2px solid ${theme.colors.peach};
  border-radius: 20px;
  font-size: 1rem;
  margin-bottom: 1rem;
  text-align: center;
`;

const NextButton = styled(motion.button)`
  background: ${theme.gradients.warm};
  border: none;
  border-radius: 50px;
  padding: 1rem 2rem;
  color: white;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  margin-top: 1rem;
  transition: all 0.3s ease;
  
  &:hover {
    transform: scale(1.02);
  }
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

// Steps data (Typeform-inspired: single focus per step)
const steps = [
  {
    id: 1,
    question: "What are your top interests?",
    type: 'multi-select',
    options: ['Wildlife Safaris', 'Music Concerts', 'Cultural Tours', 'Food Adventures', 'Adventure Sports'],
  },
  {
    id: 2,
    question: "Favorite places or regions?",
    type: 'multi-select',
    options: ['Kruger National Park', 'Cape Town', 'Durban Beaches', 'Drakensberg Mountains', 'Johannesburg'],
  },
  {
    id: 3,
    question: "What's your budget range per trip (ZAR)?",
    type: 'input',
    placeholder: 'e.g., 1000-5000',
  },
  {
    id: 4,
    question: "How would you describe your lifestyle?",
    type: 'textarea',
    placeholder: 'Adventurous explorer, budget backpacker, luxury seeker...',
  },
  {
    id: 5,
    question: "Tell us about your perfect getaway!",
    type: 'textarea',
    placeholder: 'Duration, group size, must-haves (e.g., wildlife spotting with friends for 5 days)',
  },
];

interface Preferences {
  interests: string[];
  places: string[];
  budget: string;
  lifestyle: string;
  perfectTrip: string;
}

const CreatePreferences: React.FC<{ setUser: (user: User | null) => void }> = ({ setUser }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [preferences, setPreferences] = useState<Preferences>({
    interests: [],
    places: [],
    budget: '',
    lifestyle: '',
    perfectTrip: '',
  });
  const navigate = useNavigate();

  const totalSteps = steps.length;
  const step = steps[currentStep];

  const handleSelect = (option: string, key: keyof Preferences) => {
    const arr = (preferences[key] as string[]) || [];
    const newArr = arr.includes(option) ? arr.filter(p => p !== option) : [...arr, option];
    setPreferences({ ...preferences, [key]: newArr });
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, key: keyof Preferences) => {
    setPreferences({ ...preferences, [key]: e.target.value });
  };

  const nextStep = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Save user
      const user: User = {
        id: 'new_user',
        preferences: { ...preferences }, // Map to User type
        // Add other fields from json mock if needed
      };
      setUser(user);
      localStorage.setItem('user', JSON.stringify(user)); // Persist
      navigate('/trip-params');
    }
  };

  const isNextDisabled = step.type === 'multi-select' && (preferences.interests.length === 0 || preferences.places.length === 0) ||
    (step.type === 'input' && !preferences.budget) ||
    (step.type === 'textarea' && (!preferences.lifestyle || !preferences.perfectTrip));

  return (
    <QuestionnaireContainer>
      <AnimatePresence mode="wait">
        <StepCard
          key={currentStep}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.5 }}
        >
          <ProgressBar>
            <ProgressFill
              animate={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
            />
          </ProgressBar>
          <Question
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {step.question}
          </Question>

          {step.type === 'multi-select' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {step.options?.map(option => (
                <OptionButton
                  key={option}
                  onClick={() => handleSelect(option, currentStep === 0 ? 'interests' : 'places')}
                  whileHover={{ scale: 1.05 }}
                  style={{
                    background: (preferences.interests.includes(option) || preferences.places.includes(option)) ? theme.colors.peach : 'white',
                    color: (preferences.interests.includes(option) || preferences.places.includes(option)) ? 'white' : 'black',
                  }}
                >
                  {option}
                </OptionButton>
              ))}
            </motion.div>
          )}

          {(step.type === 'input' || step.type === 'textarea') && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <InputField
                as={step.type === 'textarea' ? 'textarea' : 'input'}
                placeholder={step.placeholder}
                value={(preferences as any)[step.id === 3 ? 'lifestyle' : 'perfectTrip'] || (step.id === 3 ? preferences.lifestyle : preferences.perfectTrip)}
                onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => handleInput(e, step.id === 3 ? 'lifestyle' : 'perfectTrip')}
              />
            </motion.div>
          )}

          <NextButton
            onClick={nextStep}
            disabled={isNextDisabled}
            whileHover={!isNextDisabled ? { scale: 1.02 } : {}}
          >
            {currentStep === totalSteps - 1 ? 'Finish & Discover' : 'Next'}
          </NextButton>
        </StepCard>
      </AnimatePresence>
    </QuestionnaireContainer>
  );
};

export default CreatePreferences;