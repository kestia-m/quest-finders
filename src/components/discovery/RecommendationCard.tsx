
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, MapPin, DollarSign } from "lucide-react";
//import Image from "next/image";
import { type Spot } from "@/types";

interface RecommendationCardProps {
  spot: Spot;
}

export default function RecommendationCard({ spot }: RecommendationCardProps) {
  //const avgRating = spot.reviews.reduce((sum, r) => sum + r.rating, 0) / spot.reviews.length || 0;

  return (
    //Placeholder 
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          {spot.name} 
          </CardTitle>
          </CardHeader>
      </Card>
  );
}