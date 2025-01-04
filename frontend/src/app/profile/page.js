"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast"; // Adjusted import
import { auth } from "@/lib/auth";
import { Loader2 } from "lucide-react";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const userData = auth.getUser();
    if (!userData) {
      router.push("/auth/login");
    } else {
      setUser(userData);
    }
  }, [router]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const updatedUser = await auth.updateProfile(user);
      setUser(updatedUser);
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    auth.logout();
    router.push("/auth/login");
  };

  if (!user) return null;

  return (
    <div className="max-w-2xl mx-auto p-4 py-12">
      <Card className="p-6">
        <h1 className="text-2xl font-bold mb-6">Profile Settings</h1>

        <form onSubmit={handleUpdate} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={user.name}
              onChange={(e) => setUser({ ...user, name: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="notifications">Email Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive updates about new investments
              </p>
            </div>
            <Switch
              id="notifications"
              checked={user.preferences?.notifications}
              onCheckedChange={(checked) =>
                setUser({
                  ...user,
                  preferences: { ...user.preferences, notifications: checked },
                })
              }
            />
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
            <Button type="button" variant="outline" onClick={handleLogout}>
              Sign Out
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}