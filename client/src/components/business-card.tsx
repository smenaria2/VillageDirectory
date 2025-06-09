import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, MapPin, Phone, Navigation, Store, Utensils, Wrench, Heart, Users } from "lucide-react";
import type { Business } from "@shared/schema";

interface BusinessCardProps {
  business: Business;
}

const categoryIcons = {
  shop: Store,
  service: Wrench,
  food: Utensils,
  health: Heart,
  other: Users,
};

const categoryColors = {
  shop: "text-orange-600 bg-orange-100",
  service: "text-blue-600 bg-blue-100",
  food: "text-orange-600 bg-orange-100",
  health: "text-purple-600 bg-purple-100",
  other: "text-green-600 bg-green-100",
};

export default function BusinessCard({ business }: BusinessCardProps) {
  const Icon = categoryIcons[business.category as keyof typeof categoryIcons] || Store;
  const colorClass = categoryColors[business.category as keyof typeof categoryColors] || "text-gray-600 bg-gray-100";

  const handleCall = () => {
    if (business.phone) {
      window.location.href = `tel:${business.phone}`;
    }
  };

  const handleDirections = () => {
    // In a real app, this would open maps with the business location
    console.log("Opening directions for", business.name);
  };

  return (
    <Card className="hover:shadow-md transition-all duration-200">
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          <div className={`w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0 ${colorClass}`}>
            <Icon className="w-6 h-6" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 truncate">{business.name}</h3>
                <p className="text-sm text-gray-500 capitalize">
                  {business.category}
                  {business.description && ` • ${business.description.slice(0, 30)}${business.description.length > 30 ? '...' : ''}`}
                </p>
                <div className="flex items-center space-x-3 mt-2 text-sm text-gray-600">
                  <span className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 mr-1 fill-current" />
                    <span>{business.rating || "4.5"}</span>
                  </span>
                  <span className="flex items-center">
                    <MapPin className="w-4 h-4 text-gray-400 mr-1" />
                    <span>0.5 km</span>
                  </span>
                  <span className={`flex items-center ${business.isOpen ? 'text-green-600' : 'text-red-600'}`}>
                    <span className="w-2 h-2 rounded-full bg-current mr-1"></span>
                    <span>{business.isOpen ? 'Open' : 'Closed'}</span>
                  </span>
                </div>
              </div>
              <div className="flex flex-col space-y-2 ml-2">
                {business.phone && (
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={handleCall}
                    className="w-8 h-8 bg-primary/10 hover:bg-primary/20 text-primary"
                  >
                    <Phone className="w-4 h-4" />
                  </Button>
                )}
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={handleDirections}
                  className="w-8 h-8 bg-gray-50 hover:bg-gray-100 text-gray-600"
                >
                  <Navigation className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
