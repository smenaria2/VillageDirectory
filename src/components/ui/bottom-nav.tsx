import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Home, Search, MapPin, Heart, User } from "lucide-react";

export default function BottomNav() {
  const [location, setLocation] = useLocation();

  const navItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Search, label: "Search", path: "/search" },
    { icon: MapPin, label: "Map", path: "/map" },
    { icon: Heart, label: "Saved", path: "/saved" },
    { icon: User, label: "Profile", path: "/profile" },
  ];

  return (
    <nav className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-white border-t border-gray-200 px-4 py-2">
      <div className="flex items-center justify-around">
        {navItems.map(({ icon: Icon, label, path }) => {
          const isActive = location === path;
          return (
            <Button
              key={path}
              variant="ghost"
              size="sm"
              onClick={() => setLocation(path)}
              className={`flex flex-col items-center space-y-1 py-2 px-3 h-auto ${
                isActive
                  ? "text-primary"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs font-medium">{label}</span>
            </Button>
          );
        })}
      </div>
    </nav>
  );
}