import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Search, MapPin } from "lucide-react";
import BottomNav from "@/components/ui/bottom-nav";
import BusinessCard from "@/components/business-card";
import CategoryTabs from "@/components/category-tabs";
import type { Business } from "@shared/schema";

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { data: businesses = [], isLoading } = useQuery<Business[]>({
    queryKey: ["/api/businesses", { category: selectedCategory, search: debouncedQuery }],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (selectedCategory !== "all") params.append("category", selectedCategory);
      if (debouncedQuery) params.append("search", debouncedQuery);
      
      const response = await fetch(`/api/businesses?${params}`);
      if (!response.ok) throw new Error("Failed to fetch businesses");
      return response.json();
    },
  });

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen relative">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Search className="w-4 h-4 text-primary-foreground" />
          </div>
          <h1 className="text-lg font-semibold text-gray-900">Search Businesses</h1>
        </div>
      </header>

      {/* Search Section */}
      <section className="px-4 py-4 bg-white border-b border-gray-100">
        <div className="relative">
          <Input
            type="text"
            placeholder="Search businesses, services..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-3 bg-gray-50 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
            autoFocus
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        </div>
      </section>

      {/* Category Tabs */}
      <CategoryTabs
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      {/* Search Results */}
      <main className="px-4 pb-20">
        <div className="py-4">
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-16 h-16 bg-gray-200 rounded-xl"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : businesses.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {searchQuery || selectedCategory !== "all" 
                    ? "No businesses found" 
                    : "Start searching"}
                </h3>
                <p className="text-gray-600">
                  {searchQuery 
                    ? "Try different keywords or check your spelling"
                    : "Enter a business name, category, or service to find local businesses"}
                </p>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="mb-4">
                <p className="text-sm text-gray-600">
                  Found {businesses.length} business{businesses.length !== 1 ? "es" : ""}
                  {searchQuery && ` for "${searchQuery}"`}
                  {selectedCategory !== "all" && ` in ${selectedCategory}`}
                </p>
              </div>
              <div className="space-y-4">
                {businesses.map((business) => (
                  <BusinessCard key={business.id} business={business} />
                ))}
              </div>
            </>
          )}
        </div>
      </main>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
