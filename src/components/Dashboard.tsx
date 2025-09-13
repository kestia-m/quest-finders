
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import safariQuestData from '../../public/safari-quest-data.json';
import { theme } from '../../styles/theme';
import { type User, type Recommendation, type Place } from '../types'; // Import types

const DashboardContainer = styled.div`
  min-height: 100vh;
  background: ${theme.colors.cream};
  padding: 2rem;
`;

const RecsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
  margin-top: 2rem;
`;

const RecCard = styled(motion.div)`
  background: white;
  border-radius: 20px;
  padding: 1.5rem;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
  border: 2px solid ${theme.colors.peach};
`;

const SearchBar = styled.input`
  width: 100%;
  padding: 1rem;
  border: 2px solid ${theme.colors.peach};
  border-radius: 20px;
  margin-bottom: 1rem;
  font-size: 1rem;
`;

const FilterButtons = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
`;

const FilterBtn = styled.button<{ active: boolean }>` // Add active prop type
  background: ${props => (props.active ? theme.colors.peach : 'white')};
  border: 2px solid ${theme.colors.peach};
  border-radius: 20px;
  padding: 0.5rem 1rem;
  cursor: pointer;
`;

const XPBar = styled.div` // Define XPBar
  width: 100%;
  height: 8px;
  background: ${theme.colors.lightGray};
  border-radius: 4px;
  overflow: hidden;
  margin: 1rem 0;

  & > div {
    height: 100%;
    background: ${theme.gradients.warm};
    transition: width 0.3s ease;
  }
`;

const Dashboard: React.FC<{ user: User | null }> = ({ user }) => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  useEffect(() => {
    if (user?.preferences) {
      // "AI-generate": Filter places from json matching prefs
      const filteredPlaces = (safariQuestData.places as unknown as Place[]).filter((place) =>
        user.preferences.interests.some((interest: string) =>
          place.category.includes(interest.toLowerCase())
        ) ||
        user.preferences.places.some((placePref: string) =>
          place.name.toLowerCase().includes(placePref.toLowerCase())
        )
      ).slice(0, 10); // Top 10 "AI" recs

      // Enhance with reviews/influencers
      const enriched: Recommendation[] = filteredPlaces.map((place) => ({
        ...place,
        avgRating: (safariQuestData.reviews as any[])
          .filter((r) => r.placeId === place.id)
          .reduce((sum: number, r: any) => sum + r.rating, 0) /
          ((safariQuestData.reviews as any[]).filter((r) => r.placeId === place.id).length || 1) || 0,
        influencerEndorsed: (safariQuestData.influencers as any[]).some((inf) =>
          inf.endorsements.includes(place.id)
        ),
      }));

      setRecommendations(enriched);
    }
  }, [user]);

  const filteredRecs = recommendations.filter((rec) =>
    rec.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filter === 'all' || rec.category.includes(filter))
  );

  const swipeNext = () => setCurrentCardIndex((prev) => (prev + 1) % Math.max(filteredRecs.length - 6, 1));

  return (
    <DashboardContainer>
      <h1 style={{ color: theme.colors.coral }}>Your Dashboard, {user?.preferences.lifestyle || 'Explorer'}!</h1>

      {/* Profile Summary with XP/Badges */}
      <RecCard>
        <XPBar>
          <div
            style={{
              width: `${(user?.progression?.currentXP || 0) / (user?.progression?.nextLevelXP || 1500) * 100}%`,
            }}
          />
        </XPBar>
        <h3>{user?.progression?.title}</h3>
        <div>
          {user?.progression?.badges?.map((badge: any) => (
            <span key={badge.id}>{badge.icon} {badge.name}</span>
          ))}
        </div>
        <p>Stats: {user?.progression?.stats?.placesVisited} places visited</p>
      </RecCard>

      {/* Search & Filters */}
      <SearchBar
        placeholder="Search recommendations..."
        value={searchTerm}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
      />
      <FilterButtons>
        {['all', 'wildlife', 'culture', 'food'].map((cat) => (
          <FilterBtn key={cat} active={filter === cat} onClick={() => setFilter(cat)}>
            {cat}
          </FilterBtn>
        ))}
      </FilterButtons>

      {/* AI Recs Grid */}
      <RecsGrid>
        {filteredRecs.slice(0, 6).map((rec) => (
          <RecCard key={rec.id} whileHover={{ scale: 1.02 }}>
            <h3>{rec.name}</h3>
            <p>{rec.description.slice(0, 100)}...</p>
            <p>⭐ {rec.avgRating.toFixed(1)} | {rec.influencerEndorsed ? 'Influencer Pick' : ''}</p>
            <button>Book Now</button>
          </RecCard>
        ))}
      </RecsGrid>

      {/* Discovery Deck: Swipe for more */}
      {filteredRecs.length > 6 && (
        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <h3>Discovery Deck</h3>
          <motion.div
            style={{ width: '300px', height: '400px', margin: '0 auto', position: 'relative' }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={(_e, info) => info.offset.x > 50 && swipeNext()}
          >
            <RecCard
              style={{ position: 'absolute', top: 0, left: 0 }}
              animate={{ x: currentCardIndex * -320 }} // Simple swipe sim
            >
              {filteredRecs[currentCardIndex + 6]?.name || 'No more recommendations'}
            </RecCard>
          </motion.div>
          <button onClick={swipeNext}>Swipe for More</button>
        </div>
      )}
    </DashboardContainer>
  );
};

export default Dashboard;