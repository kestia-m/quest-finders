
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { Calendar, MapPin, DollarSign } from 'lucide-react';
import { theme } from '../../styles/theme'; // Reuse theme

const ParamsContainer = styled.div`
  min-height: 100vh;
  background: ${theme.colors.cream};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
`;

const ParamsCard = styled(motion.div)`
  background: white;
  border-radius: 32px;
  padding: 3rem;
  box-shadow: 0 12px 48px rgba(255, 107, 107, 0.12);
  border: 2px solid ${theme.colors.peach};
  width: 100%;
  max-width: 400px;
`;

const IconInput = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  input {
    flex: 1;
    padding: 1rem;
    border: 2px solid ${theme.colors.peach};
    border-radius: 20px;
    margin-left: 0.5rem;
  }
`;

const NextButton = styled(motion.button)` // Define here
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

const TripParams: React.FC = () => {
  const [params, setParams] = useState({ destination: '', dates: '', budget: '' });
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('tripParams', JSON.stringify(params));
    navigate('/dashboard');
  };

  return (
    <ParamsContainer>
      <ParamsCard
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h2 style={{ color: theme.colors.coral, marginBottom: '2rem' }}>Your Perfect Trip</h2>
        <form onSubmit={handleSubmit}>
          <IconInput>
            <MapPin size={24} color={theme.colors.sage} />
            <input
              placeholder="Destination (e.g., Kruger)"
              value={params.destination}
              onChange={(e) => setParams({ ...params, destination: e.target.value })}
            />
          </IconInput>
          <IconInput>
            <Calendar size={24} color={theme.colors.sage} />
            <input type="date" value={params.dates} onChange={(e) => setParams({ ...params, dates: e.target.value })} />
          </IconInput>
          <IconInput>
            <DollarSign size={24} color={theme.colors.sage} />
            <input
              type="number"
              placeholder="Max Budget (ZAR)"
              value={params.budget}
              onChange={(e) => setParams({ ...params, budget: e.target.value })}
            />
          </IconInput>
          <NextButton
            type="submit"
            whileHover={{ scale: 1.02 }}
          >
            Plan My Getaway
          </NextButton>
        </form>
      </ParamsCard>
    </ParamsContainer>
  );
};

export default TripParams;