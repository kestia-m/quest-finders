import { motion } from "framer-motion";
import { MapPin, Star, Heart, Users } from "lucide-react";
import { type Spot } from "@/types";

interface RecommendationCardProps {
  spot: Spot;
  onSelect?: () => void;
}

export default function RecommendationCard({ spot, onSelect }: RecommendationCardProps) {
  const avgRating =
    spot.reviews && spot.reviews.length > 0
      ? spot.reviews.reduce((sum, r) => sum + r.rating, 0) / spot.reviews.length
      : 0;
  const totalCost = spot.cost ? spot.cost.entry + spot.cost.transport + spot.cost.accommodation : 0;

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="bg-white rounded-2xl overflow-hidden shadow-lg border border-thistle cursor-pointer"
      onClick={onSelect}
    >
      <div className="aspect-video bg-gray-200 relative">
        {spot.image ? (
          <img 
            src={spot.image} 
            alt={spot.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            Image coming soon
          </div>
        )}
        
        {spot.influencerEndorsed && (
          <div className="absolute top-3 left-3 bg-persianPink text-white text-xs font-medium py-1 px-2 rounded-full flex items-center gap-1">
            <Users className="h-3 w-3" />
            Influencer Pick
          </div>
        )}
      </div>
      
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-gray-800">{spot.name}</h3>
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <MapPin className="h-4 w-4 text-persianPink" />
            <span>{spot.location?.lat.toFixed(1)}, {spot.location?.lng.toFixed(1)}</span>
          </div>
        </div>
        
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{spot.description}</p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 text-yellow-400 fill-current" />
              <span className="text-sm font-medium">{avgRating.toFixed(1)}</span>
            </div>
            <span className="text-xs text-gray-500">({spot.reviews?.length} reviews)</span>
          </div>
          
          <div className="text-sm font-medium text-persianPink">
            R{totalCost}
          </div>
        </div>
        
        {spot.influencerEndorsed && (
          <div className="mt-2 text-xs text-persianPink">
            💖 {spot.endorsedBy}
          </div>
        )}
      </div>
    </motion.div>
  );
}