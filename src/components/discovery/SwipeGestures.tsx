// src/components/discovery/SwipeGestures.tsx
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, Heart, ThumbsUp, ThumbsDown } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { type Spot } from "@/types";

interface SwipeGesturesProps {
  spots: Spot[];
  onSwipe: (spotId: string, action: 'like' | 'dislike') => void;
}

export default function SwipeGestures({ spots, onSwipe }: SwipeGesturesProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dragged, setDragged] = useState(0);

  if (spots.length === 0) return <div>No spots to swipe</div>;

  const handleSwipe = (action: 'like' | 'dislike') => {
    onSwipe(spots[currentIndex].id, action);
    setCurrentIndex((prev) => (prev + 1) % spots.length);
    setDragged(0);
  };

  const handleDrag = (deltaX: number) => {
    setDragged(deltaX);
  };

  return (
    <div className="relative h-96 w-80 mx-auto">
      <motion.div
        className="absolute inset-0"
        drag="x"
        dragConstraints={{ left: -100, right: 100 }}
        dragElastic={0.5}
        onDrag={(e, info) => handleDrag(info.point.x)}
        onDragEnd={(_, info) => {
          if (info.point.x > 50) handleSwipe('like');
          else if (info.point.x < -50) handleSwipe('dislike');
        }}
        animate={{ x: dragged }}
        style={{ rotate: dragged / 10 }}
      >
        <Card className="h-full w-full">
          <CardContent className="p-0 h-full flex flex-col">
            <div className="flex-1 p-4">
              <h3 className="text-lg font-semibold">{spots[currentIndex].name}</h3>
              <p className="text-sm text-muted-foreground">{spots[currentIndex].description}</p>
            </div>
            <div className="p-4 border-t">
              <div className="flex justify-between">
                <Button variant="ghost" size="sm" onClick={() => handleSwipe('dislike')}>
                  <ThumbsDown className="h-4 w-4 mr-2" />
                  Skip
                </Button>
                <Button size="sm" onClick={() => handleSwipe('like')}>
                  <Heart className="h-4 w-4 mr-2" />
                  Like
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-4">
        <Button variant="outline" size="sm" onClick={() => handleSwipe('dislike')}>
          <ArrowLeft className="h-4 w-4 mr-1" />
          No
        </Button>
        <Button size="sm" onClick={() => handleSwipe('like')}>
          Yes
          <ArrowRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}