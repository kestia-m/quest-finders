import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Crown, Star, MapPin } from "lucide-react";

interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
}

interface BadgeShowcaseProps {
  badges: Badge[];
}

export function BadgeShowcase({ badges }: BadgeShowcaseProps) {
  const badgeIcons = {
    "Vibe Voyager": Crown,
    "Safari Master": Star,
    "Thrifty Traveler": MapPin,
    "Bushveld Explorer": Star,
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Badges</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {badges.map((badge) => {
          const Icon = badgeIcons[badge.name as keyof typeof badgeIcons] || Star;
          return (
            <Badge
              key={badge.id}
              variant="secondary"
              className="flex items-center gap-2 p-3 h-auto"
            >
              <Icon className="h-4 w-4" />
              {badge.name}
              <span className="text-xs ml-auto">{badge.description}</span>
            </Badge>
          );
        })}
        {badges.length === 0 && (
          <p className="text-muted-foreground text-center col-span-full">No badges yet. Complete quests to earn them!</p>
        )}
      </CardContent>
    </Card>
  );
}