import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { User, LogOut, Store, Edit, Trash2, Plus } from "lucide-react";
import BottomNav from "@/components/ui/bottom-nav";
import type { Business } from "@shared/schema";

export default function Profile() {
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, authLoading, toast]);

  const { data: myBusinesses = [], isLoading: businessesLoading } = useQuery<Business[]>({
    queryKey: ["/api/my-businesses"],
    enabled: isAuthenticated,
    retry: false,
  });

  const deleteMutation = useMutation({
    mutationFn: async (businessId: number) => {
      const response = await fetch(`/api/businesses/${businessId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to delete business");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/my-businesses"] });
      queryClient.invalidateQueries({ queryKey: ["/api/businesses"] });
      toast({
        title: "Success",
        description: "Business deleted successfully",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to delete business",
        variant: "destructive",
      });
    },
  });

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  const handleDeleteBusiness = (businessId: number, businessName: string) => {
    if (window.confirm(`Are you sure you want to delete "${businessName}"? This action cannot be undone.`)) {
      deleteMutation.mutate(businessId);
    }
  };

  if (authLoading) {
    return (
      <div className="max-w-md mx-auto bg-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen relative">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <User className="w-4 h-4 text-primary-foreground" />
          </div>
          <h1 className="text-lg font-semibold text-gray-900">Profile</h1>
        </div>
      </header>

      <main className="px-4 pb-20">
        {/* User Info */}
        <section className="py-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-200">
                  <img
                    src={user?.profileImageUrl || "/api/placeholder/64/64"}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {user?.firstName || user?.lastName 
                      ? `${user.firstName || ""} ${user.lastName || ""}`.trim()
                      : "User"}
                  </h2>
                  <p className="text-gray-600">{user?.email}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* My Businesses */}
        <section className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">My Businesses</h2>
            <Button size="sm" variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Add Business
            </Button>
          </div>

          {businessesLoading ? (
            <div className="space-y-4">
              {[...Array(2)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : myBusinesses.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Store className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No businesses yet</h3>
                <p className="text-gray-600 mb-4">
                  Register your first business to get started.
                </p>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Business
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {myBusinesses.map((business) => (
                <Card key={business.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{business.name}</h3>
                        <p className="text-sm text-gray-500 capitalize mb-2">{business.category}</p>
                        {business.description && (
                          <p className="text-sm text-gray-600 mb-2">{business.description}</p>
                        )}
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          {business.phone && (
                            <span>📞 {business.phone}</span>
                          )}
                          <span className={`flex items-center ${business.isOpen ? 'text-green-600' : 'text-red-600'}`}>
                            <span className="w-2 h-2 rounded-full bg-current mr-1"></span>
                            {business.isOpen ? 'Open' : 'Closed'}
                          </span>
                        </div>
                      </div>
                      <div className="flex space-x-2 ml-4">
                        <Button size="sm" variant="outline">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteBusiness(business.id, business.name)}
                          disabled={deleteMutation.isPending}
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* Account Actions */}
        <section>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Account</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="px-6 py-4">
                <Button
                  variant="ghost"
                  onClick={handleLogout}
                  className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
