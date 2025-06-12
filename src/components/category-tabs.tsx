import { Button } from "@/components/ui/button";
import { Store, Wrench, Utensils, Heart } from "lucide-react";

interface CategoryTabsProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const categories = [
  { id: "all", label: "All", icon: null },
  { id: "shop", label: "Shops", icon: Store },
  { id: "service", label: "Services", icon: Wrench },
  { id: "food", label: "Food", icon: Utensils },
  { id: "health", label: "Health", icon: Heart },
];

export default function CategoryTabs({
  selectedCategory,
  onCategoryChange,
}: CategoryTabsProps) {
  return (
    <section className="px-4 py-4 bg-white">
      <div className="flex space-x-2 overflow-x-auto scrollbar-hide">
        {categories.map((category) => {
          const isActive = selectedCategory === category.id;
          const Icon = category.icon;
          
          return (
            <Button
              key={category.id}
              variant={isActive ? "default" : "secondary"}
              size="sm"
              onClick={() => onCategoryChange(category.id)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {Icon && <Icon className="w-4 h-4 mr-1" />}
              {category.label}
            </Button>
          );
        })}
      </div>
    </section>
  );
}