import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Search, MapPin, Plus, Star, Phone, Navigation } from "lucide-react";
import BottomNav from "@/components/ui/bottom-nav";
import BusinessCard from "@/components/business-card";
import BusinessRegistrationModal from "@/components/business-registration-modal";
import CategoryTabs from "@/components/category-tabs";
import type { Business } from "@/types/schema";

export default function Home() {
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isBusinessModalOpen, setIsBusinessModalOpen] = useState(false);

  const { data: businesses = [], isLoading } = useQuery<Business[]>({
    queryKey: ["businesses", { category: selectedCategory, search: searchQuery }],
    queryFn: async () => {
      let query = supabase
        .from('businesses')
        .select('*')
        .order('created_at', { ascending: false });

      if (selectedCategory !== "all") {
        query = query.eq('category', selectedCategory);
      }

      if (searchQuery) {
        query = query.or(`name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%,category.ilike.%${searchQuery}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },
  });

  const featuredBusiness = businesses[0];

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen relative">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <MapPin className="w-4 h-4 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">VillageConnect</h1>
              <p className="text-xs text-gray-500">Greenfield Village</p>
            </div>
          </div>
          <button className="w-8 h-8 rounded-full overflow-hidden border-2 border-gray-200">
            <img
              src={user?.profile_image_url || "https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&w=32&h=32&dpr=1"}
              alt="User avatar"
              className="w-full h-full object-cover"
            />
          </button>
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
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        </div>
      </section>

      {/* Category Tabs */}
      <CategoryTabs
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      {/* Main Content */}
      <main className="px-4 pb-20">
        {featuredBusiness && (
          <section className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Featured Business</h2>
            <Card className="bg-gradient-to-r from-primary to-blue-600 text-white relative overflow-hidden">
              <CardContent className="p-4">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white bg-opacity-10 rounded-full -translate-y-16 translate-x-16"></div>
                <div className="relative z-10">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{featuredBusiness.name}</h3>
                      <p className="text-blue-100 text-sm capitalize">{featuredBusiness.category}</p>
                    </div>
                  </div>
                  <p className="text-blue-100 text-sm mb-3">
                    {featuredBusiness.description || "Serving the community with quality services."}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm">
                      <span className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-300 mr-1 fill-current" />
                        <span>{featuredBusiness.rating || "4.8"}</span>
                      </span>
                      <span className="flex items-center">
                        <MapPin className="w-4 h-4 text-blue-200 mr-1" />
                        <span>0.2 km</span>
                      </span>
                    </div>
                    <Button variant="secondary" size="sm" className="bg-white text-primary hover:bg-gray-100">
                      View Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        )}

        {/* Business Listings */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Nearby Businesses</h2>
            <Button variant="ghost" size="sm" className="text-primary">
              View All
            </Button>
          </div>

          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
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
                <h3 className="text-lg font-medium text-gray-900 mb-2">No businesses found</h3>
                <p className="text-gray-600 mb-4">
                  {searchQuery
                    ? "Try adjusting your search terms"
                    : "Be the first to register your business in this category!"}
                </p>
                <Button onClick={() => setIsBusinessModalOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Business
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {businesses.map((business) => (
                <BusinessCard key={business.id} business={business} />
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Floating Action Button */}
      <Button
        onClick={() => setIsBusinessModalOpen(true)}
        className="fixed bottom-20 right-4 w-14 h-14 rounded-full shadow-lg hover:shadow-xl z-40"
        size="icon"
      >
        <Plus className="w-6 h-6" />
      </Button>

      {/* Business Registration Modal */}
      <BusinessRegistrationModal
        isOpen={isBusinessModalOpen}
        onClose={() => setIsBusinessModalOpen(false)}
      />

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}