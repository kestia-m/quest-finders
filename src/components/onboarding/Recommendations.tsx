// src/components/discovery/Recommendations.tsx (New component to display generated recommendations with reviews, link to itinerary)
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, MapPin, Users } from "lucide-react";
import { useState } from "react";
import spotsData from '../../data/spots.json';
import { type Spot } from "@/types";

export default function Recommendations() {
  const [recommendations, setRecommendations] = useState<Spot[]>(spotsData as Spot[]);

  const avgRating = (reviews: any[]) => reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length || 0;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Recommended Spots</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recommendations.map((spot) => (
          <Card key={spot.id}>
            <CardHeader>
              <CardTitle>{spot.name}</CardTitle>
              {spot.influencerEndorsed && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  Influencer Pick: {spot.endorsedBy}
                </Badge>
              )}
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-muted-foreground">{spot.description}</p>
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 fill-current text-yellow-500" />
                <span>{avgRating(spot.reviews).toFixed(1)}</span>
              </div>
              <div className="space-y-1">
                {spot.reviews.map((review, idx) => (
                  <div key={idx} className="text-xs">
                    <span className="font-medium">{review.user}:</span> {review.comment} (⭐{review.rating})
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full">Add to Itinerary</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}