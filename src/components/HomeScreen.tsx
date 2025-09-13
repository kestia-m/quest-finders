import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { theme } from '../../styles/theme';

const Container = styled.div`
  min-height: 100vh;
  background: ${theme.colors.cream};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  text-align: center;
`;

const Mascot = styled(motion.div)`
  width: 200px;
  height: 200px;
  background: ${theme.gradients.warm};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 8rem;
  margin-bottom: 2rem;
`;

const Title = styled(motion.h1)`
  font-size: 3rem;
  background: ${theme.gradients.warm};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 1rem;
`;

const Subtitle = styled(motion.p)`
  font-size: 1.2rem;
  color: #666;
  margin-bottom: 2rem;
  max-width: 500px;
`;

const StartButton = styled(motion.button)`
  background: ${theme.gradients.warm};
  border: none;
  border-radius: 50px;
  padding: 1rem 2rem;
  color: white;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 8px 32px rgba(255, 107, 107, 0.3);
  }
`;

const HomeScreen: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      navigate('/dashboard');
    } else {
      //navigate('/tasks');
      navigate('/preferences');
    }
  }, [navigate]);

  return (
    <Container>
      <Mascot
        animate={{ rotate: [0, 10, -10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        🦁
      </Mascot>
      <Title
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Welcome to SafariQuest
      </Title>
      <Subtitle
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        Discover epic adventures, earn rewards, and plan your perfect getaway.
      </Subtitle>
      <StartButton
        onClick={() => navigate('/preferences')}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Start Your Journey
      </StartButton>
    </Container>
  );
};

export default HomeScreen;
