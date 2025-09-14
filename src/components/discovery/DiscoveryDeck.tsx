import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, ChevronLeft, ChevronRight, Heart, X } from "lucide-react";
import { type Spot } from "@/types";
import RecommendationCard from "./RecommendationCard";

interface DiscoveryDeckProps {
  spots: Spot[];
  onSwipe: (spotId: string, action: 'like' | 'dislike') => void;
}

export default function DiscoveryDeck({ spots, onSwipe }: DiscoveryDeckProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [activeSpot, setActiveSpot] = useState<Spot | null>(null);

  const nextCard = () => {
    setDirection(1);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % spots.length);
      setDirection(0);
    }, 100);
  };

  const prevCard = () => {
    setDirection(-1);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + spots.length) % spots.length);
      setDirection(0);
    }, 100);
  };

  const handleSwipe = (action: 'like' | 'dislike') => {
    //onSwipe(spots[currentIndex].id, action);
    nextCard();
  };

  if (spots.length === 0) return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="text-6xl mb-4">🌵</div>
      <h3 className="text-xl font-semibold text-gray-800 mb-2">No spots available</h3>
      <p className="text-gray-600">Check back later for new recommendations!</p>
    </div>
  );

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
          <MapPin className="h-5 w-5 text-persianPink" />
          Discovery Deck
        </h2>
        <div className="text-sm text-gray-500">
          {currentIndex + 1} / {spots.length}
        </div>
      </div>

      <div className="relative h-96">
        <AnimatePresence custom={direction} mode="wait">
          <motion.div
            key={currentIndex}
            custom={direction}
            initial={{ opacity: 0, x: direction > 0 ? 300 : -300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction > 0 ? -300 : 300 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0"
          >
            <RecommendationCard 
              spot={spots[currentIndex]} 
              onSelect={() => setActiveSpot(spots[currentIndex])}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex justify-center gap-4 mt-6">
        <button
          onClick={() => handleSwipe('dislike')}
          className="p-3 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
        >
          <X className="h-6 w-6" />
        </button>
        <button
          onClick={() => handleSwipe('like')}
          className="p-3 rounded-full bg-persianPink text-white hover:bg-pinkLavender transition-colors"
        >
          <Heart className="h-6 w-6" />
        </button>
      </div>

      <div className="flex justify-between mt-4">
        <button
          onClick={prevCard}
          className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-800"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </button>
        <button
          onClick={nextCard}
          className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-800"
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Spot Detail Modal */}
      {activeSpot && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-semibold">{activeSpot.name}</h3>
              <button 
                onClick={() => setActiveSpot(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="aspect-video bg-gray-200 rounded-lg mb-4 flex items-center justify-center text-gray-400">
              {activeSpot.image ? (
                <img 
                  src={activeSpot.image} 
                  alt={activeSpot.name}
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                "Image coming soon"
              )}
            </div>
            
            <p className="text-gray-700 mb-4">{activeSpot.description}</p>
            
            {activeSpot.influencerEndorsed && (
              <div className="bg-pinkLavender/20 border border-persianPink/30 rounded-lg p-3 mb-4">
                <div className="flex items-center gap-2 text-persianPink font-medium">
                  <Heart className="h-4 w-4" />
                  Influencer Pick
                </div>
                <p className="text-sm mt-1">Endorsed by: {activeSpot.endorsedBy}</p>
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <h4 className="text-sm font-medium text-gray-700">Cost Estimate</h4>
                <p className="text-lg font-semibold">
                  R{
                    (activeSpot.cost?.entry ?? 0) +
                    (activeSpot.cost?.transport ?? 0) +
                    (activeSpot.cost?.accommodation ?? 0)
                  }
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-700">Category</h4>
                <p className="text-sm">{activeSpot.category}</p>
              </div>
            </div>
            
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Reviews</h4>
              <div className="space-y-2">
                {activeSpot.reviews?.slice(0, 2).map((review, index) => (
                  <div key={index} className="text-sm border-l-2 border-persianPink pl-2">
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span 
                          key={i} 
                          className={i < review.rating ? "text-yellow-400" : "text-gray-300"}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <p className="text-gray-600">"{review.comment}"</p>
                    <p className="text-xs text-gray-500">- {review.user}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <button className="w-full py-3 bg-persianPink text-white rounded-xl font-medium hover:bg-pinkLavender transition-colors">
              Add to Itinerary
            </button>
          </div>
        </div>
      )}
    </div>
  );
}