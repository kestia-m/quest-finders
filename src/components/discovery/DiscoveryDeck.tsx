
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin } from "lucide-react";
import { useState } from "react";
import RecommendationCard from "./RecommendationCard";
import { type Spot } from "@/types";
interface DiscoveryDeckProps {
  spots: Spot[];
}

export default function DiscoveryDeck({ spots }: DiscoveryDeckProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextCard = () => setCurrentIndex((prev) => (prev + 1) % spots.length);
  const prevCard = () => setCurrentIndex((prev) => (prev - 1 + spots.length) % spots.length);

  if (spots.length === 0) return <div>No spots available</div>;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Discovery Deck
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RecommendationCard spot={spots[currentIndex]} />
          <div className="flex justify-between mt-4">
            <Button variant="outline" onClick={prevCard}>Previous</Button>
            <Badge variant="secondary">{currentIndex + 1} / {spots.length}</Badge>
            <Button onClick={nextCard}>Next</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}