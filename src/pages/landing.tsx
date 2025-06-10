import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Store, Users, Shield } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function Landing() {
  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      },
    });
    
    if (error) {
      console.error('Error logging in:', error);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary to-blue-600 text-white px-6 py-12">
        <div className="text-center">
          <div className="w-20 h-20 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <MapPin className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-4">VillageConnect</h1>
          <p className="text-blue-100 text-lg leading-relaxed">
            Connect with local businesses in your community. Discover shops, services, and support your neighborhood.
          </p>
        </div>
      </div>

      {/* Features Section */}
      <div className="px-6 py-8">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
          Discover Local Businesses
        </h2>
        
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Store className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Local Directory</h3>
                  <p className="text-gray-600 text-sm">
                    Browse nearby shops, restaurants, and service providers all in one place.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Community Driven</h3>
                  <p className="text-gray-600 text-sm">
                    Connect with your neighbors and support local businesses in your village.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Shield className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Trusted Network</h3>
                  <p className="text-gray-600 text-sm">
                    Verified local businesses with ratings and reviews from community members.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* CTA Section */}
      <div className="px-6 py-8">
        <Card className="bg-gray-50">
          <CardContent className="p-6 text-center">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Ready to Get Started?</h3>
            <p className="text-gray-600 mb-6">
              Join VillageConnect and discover amazing local businesses in your area.
            </p>
            <Button onClick={handleLogin} className="w-full" size="lg">
              Sign in with Google
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <div className="px-6 py-8 text-center">
        <p className="text-gray-500 text-sm">
          Connecting communities, one business at a time.
        </p>
      </div>
    </div>
  );
}