// src/components/Recommendations.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Star, MapPin, Users, Calendar, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { dataService } from '@/services/dataService';
import type { Spot } from '../../types';
//import SpotMapPopup from '../maps/SpotMapPopup';
//import CheckInPopup from '../gamification/CheckInPopup';

const colors = {
  persianPink: '#f991cc',
  pinkLavender: '#e2afde',
  thistle: '#d3c2ce',
  timberwolf: '#d3d2c7',
  lemonChiffon: '#e2e1b9',
};

const mockUserPreferences = {
  interests: ['wildlife', 'nature'],
  budget: '1000-5000',
  location: 'JNB/PTA',
};

export default function Recommendations() {
  const [filteredSpots, setFilteredSpots] = useState<Spot[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedSpot, setSelectedSpot] = useState<Spot | null>(null);
  const [itinerary, setItinerary] = useState<Spot[]>([]);

  useEffect(() => {
    const spots = dataService.getSpots();
    let recommendations = spots.filter((spot: Spot) => {
      const matchesInterest = mockUserPreferences.interests.some(interest =>
        spot.category.some(cat => cat.toLowerCase().includes(interest))
      );
      const totalCost = Object.values(spot.cost || {}).reduce((sum: number, cost: number) => sum + cost, 0);
      const matchesBudget = parseInt(mockUserPreferences.budget.split('-')[1]) >= totalCost;
      const matchesLocation = spot.name.toLowerCase().includes('kruger') ||
        spot.name.toLowerCase().includes('lion') ||
        spot.name.toLowerCase().includes('pretoria') ||
        spot.name.toLowerCase().includes('pietermaritzburg');
      return matchesInterest || matchesBudget || matchesLocation;
    });

    recommendations.sort((a: Spot, b: Spot) => {
      const aEndorsed = a.influencerEndorsed ? 1 : 0;
      const bEndorsed = b.influencerEndorsed ? 1 : 0;
      const aRating = a.reviews ? a.reviews.reduce((sum, r) => sum + r.rating, 0) / a.reviews.length : 0;
      const bRating = b.reviews ? b.reviews.reduce((sum, r) => sum + r.rating, 0) / b.reviews.length : 0;
      return bEndorsed - aEndorsed || bRating - aRating;
    });

    setFilteredSpots(recommendations);
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredRecommendations = filteredSpots.filter((spot: Spot) =>
    spot.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (categoryFilter === 'all' || spot.category.some(cat => cat.toLowerCase() === categoryFilter))
  );

  const addToItinerary = (spot: Spot) => {
    if (!itinerary.some(s => s.id === spot.id)) {
      setItinerary([...itinerary, spot]);
      alert(`${spot.name} added to itinerary! +10 XP`);
    }
  };

  const avgRating = (reviews?: any[]) => (reviews || []).reduce((sum, r) => sum + r.rating, 0) / (reviews?.length || 1) || 0;

  return (
    <div className="min-h-screen bg-timberwolf p-6">
      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold mb-6 flex items-center gap-2"
        style={{ color: colors.persianPink }}
      >
        <MapPin className="h-8 w-8" />
        Recommended Spots
      </motion.h1>

      <div className="flex flex-col md:flex-row gap-4 mb-6 bg-lemon-chiffon p-4 rounded-xl">
        <Input
          placeholder="Search spots (e.g., Kruger)..."
          value={searchTerm}
          onChange={handleSearch}
          className="flex-1"
          style={{ borderColor: colors.thistle }}
        />
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="wildlife">Wildlife</SelectItem>
            <SelectItem value="nature">Nature</SelectItem>
            <SelectItem value="concerts">Concerts</SelectItem>
            <SelectItem value="budget">Budget Travel</SelectItem>
          </SelectContent>
        </Select>
        {/*<div className="flex gap-2">
          <SpotMapPopup />
          {selectedSpot && <CheckInPopup spot={selectedSpot} />}
        </div>*/}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <AnimatePresence>
          {filteredRecommendations.map((spot: Spot, index) => (
            <motion.div
              key={spot.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              onClick={() => setSelectedSpot(spot)}
            >
              <Card className="custom-card hover:shadow-lg transition-shadow cursor-pointer overflow-hidden">
                <CardHeader className="p-0">
                  <img
                    src={spot.image ? `/images/${spot.image}` : '/placeholder.jpg'}
                    alt={spot.name}
                    className="w-full h-48 object-cover"
                  />
                  {spot.influencerEndorsed && (
                    <Badge className="absolute top-2 left-2 flex items-center gap-1 bg-persian-pink text-white">
                      <Users className="h-3 w-3" />
                      Influencer Pick
                    </Badge>
                  )}
                </CardHeader>
                <CardContent className="p-4">
                  <CardTitle className="text-lg font-semibold mb-1">{spot.name}</CardTitle>
                  <CardDescription className="text-sm mb-2">{spot.description}</CardDescription>
                  
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-current text-yellow-400" />
                      <span className="font-medium">{avgRating(spot.reviews).toFixed(1)}</span>
                      <span className="text-xs text-muted-foreground">({spot.reviews?.length || 0} reviews)</span>
                    </div>
                    <div className="text-sm font-medium" style={{ color: colors.persianPink }}>
                      R{Object.values(spot.cost || {}).reduce((sum: number, cost: number) => sum + cost, 0)}
                    </div>
                  </div>

                  <div className="space-y-1 mb-3">
                    {spot.reviews?.slice(0, 2).map((review: any, idx: number) => (
                      <div key={idx} className="text-xs flex items-start gap-1">
                        <span className="font-medium">{review.user}:</span>
                        <span className="text-muted-foreground">"{review.comment}"</span>
                      </div>
                    ))}
                  </div>

                  {spot.influencerEndorsed && (
                    <div className="text-xs mb-3 text-persian-pink">
                      💖 Endorsed by {spot.endorsedBy}
                    </div>
                  )}

                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={(_e: { stopPropagation: () => void; }) => {
                      _e.stopPropagation();
                      addToItinerary(spot);
                    }}
                  >
                    <Heart className="h-4 w-4 mr-2" />
                    Add to Itinerary
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {itinerary.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-lemon-chiffon p-4 rounded-xl"
        >
          <h3 className="text-lg font-semibold mb-2 flex items-center gap-2" style={{ color: colors.persianPink }}>
            <Calendar className="h-5 w-5" />
            Your Itinerary ({itinerary.length} spots)
          </h3>
          <div className="flex flex-wrap gap-2">
            {itinerary.map((spot: Spot) => (
              <Badge key={spot.id} variant="secondary">
                {spot.name}
              </Badge>
            ))}
          </div>
          <Button className="mt-3 w-full" variant="default">
            <DollarSign className="h-4 w-4 mr-2" />
            View Full Plan
          </Button>
        </motion.div>
      )}

      <AnimatePresence>
        {selectedSpot && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedSpot(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl max-w-md w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-4">{selectedSpot.name}</h2>
                <img
                  src={selectedSpot.image ? `/images/${selectedSpot.image}` : '/placeholder.jpg'}
                  alt={selectedSpot.name}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <p className="text-gray-600 mb-4">{selectedSpot.description}</p>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Rating</span>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-current text-yellow-400" />
                      <span>{avgRating(selectedSpot.reviews).toFixed(1)}</span>
                    </div>
                  </div>
                  
                  {selectedSpot.influencerEndorsed && (
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-persian-pink" />
                      <span className="text-sm text-persian-pink">Endorsed by {selectedSpot.endorsedBy}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Estimated Cost</span>
                    <span className="text-sm font-semibold" style={{ color: colors.persianPink }}>
                      R{Object.values(selectedSpot.cost || {}).reduce((sum: number, cost: number) => sum + cost, 0)}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 mb-6">
                  <h4 className="text-sm font-medium">Reviews</h4>
                  {selectedSpot.reviews?.map((review: any, idx: number) => (
                    <div key={idx} className="text-xs p-2 bg-timberwolf rounded">
                      <div className="flex items-center gap-1 mb-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span key={i} className={i < review.rating ? "text-yellow-400" : "text-gray-300"}>
                            ★
                          </span>
                        ))}
                      </div>
                      <p>"{review.comment}"</p>
                      <p className="text-thistle">- {review.user}</p>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      addToItinerary(selectedSpot);
                      setSelectedSpot(null);
                    }}
                  >
                    <Heart className="h-4 w-4 mr-2" />
                    Add to Itinerary
                  </Button>
                  <Button
                    variant="secondary"
                    className="flex-1"
                    onClick={() => setSelectedSpot(null)}
                  >
                    Close
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}