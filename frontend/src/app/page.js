"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { MapIcon, BarChart3Icon, FolderIcon } from "lucide-react";
import SearchBar from "@/components/search/SearchBar";
import UpdateNotification from "@/components/search/UpdateNotification";
import { useEffect, useState } from "react";
import { auth } from "@/lib/auth";

export default function Home() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    setUser(auth.getUser());
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <NavigationMenu className="py-4">
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link href="/" legacyBehavior passHref>
                  <NavigationMenuLink className="font-bold text-xl">
                    InfraInvest
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/projects" legacyBehavior passHref>
                  <NavigationMenuLink className="flex items-center gap-2">
                    <FolderIcon className="w-4 h-4" />
                    Projects
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/map" legacyBehavior passHref>
                  <NavigationMenuLink className="flex items-center gap-2">
                    <MapIcon className="w-4 h-4" />
                    Map View
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/dashboard" legacyBehavior passHref>
                  <NavigationMenuLink className="flex items-center gap-2">
                    <BarChart3Icon className="w-4 h-4" />
                    Dashboard
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem className="ml-auto">
                {user ? (
                  <NavigationMenuTrigger>
                    {user.name}
                    <NavigationMenuContent>
                      <Link href="/profile" legacyBehavior passHref>
                        <NavigationMenuLink className="block px-4 py-2">
                          Profile Settings
                        </NavigationMenuLink>
                      </Link>
                      <button
                        onClick={() => {
                          auth.logout();
                          window.location.reload();
                        }}
                        className="block w-full text-left px-4 py-2 hover:bg-accent"
                      >
                        Sign Out
                      </button>
                    </NavigationMenuContent>
                  </NavigationMenuTrigger>
                ) : (
                  <Link href="/auth/login" legacyBehavior passHref>
                    <NavigationMenuLink>Sign In</NavigationMenuLink>
                  </Link>
                )}
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-6xl">
            Infrastructure Investment Tracking
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Track and analyze infrastructure investments across Latin America with our comprehensive platform.
          </p>
          <div className="mt-10 max-w-md mx-auto">
            <SearchBar />
          </div>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6">
            <FolderIcon className="w-12 h-12 text-primary mb-4" />
            <h3 className="text-lg font-semibold mb-2">Project Portfolio</h3>
            <p className="text-muted-foreground">
              Browse and track infrastructure projects across different sectors and regions.
            </p>
          </Card>
          <Card className="p-6">
            <MapIcon className="w-12 h-12 text-primary mb-4" />
            <h3 className="text-lg font-semibold mb-2">Geographic Insights</h3>
            <p className="text-muted-foreground">
              Visualize project locations and regional investment distribution.
            </p>
          </Card>
          <Card className="p-6">
            <BarChart3Icon className="w-12 h-12 text-primary mb-4" />
            <h3 className="text-lg font-semibold mb-2">Investment Analytics</h3>
            <p className="text-muted-foreground">
              Track investment performance and analyze trends over time.
            </p>
          </Card>
        </div>
      </div>

      <UpdateNotification />
    </div>
  );
}