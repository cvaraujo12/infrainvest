"use client";

import { useEffect, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

const SEARCH_ENGINES_VERSION = "1.0.0";
const UPDATE_CHECK_INTERVAL = 1000 * 60 * 60; // Check every hour

export default function UpdateNotification() {
  const [updateAvailable, setUpdateAvailable] = useState(false);

  useEffect(() => {
    const checkForUpdates = async () => {
      try {
        // This would typically be an API call to check for updates
        // For demo purposes, we'll simulate an update check
        const lastCheck = localStorage.getItem("lastUpdateCheck");
        const currentVersion = localStorage.getItem("searchEnginesVersion");

        if (!lastCheck || Date.now() - parseInt(lastCheck) > UPDATE_CHECK_INTERVAL) {
          // Simulate API check for new version
          const hasUpdate = currentVersion !== SEARCH_ENGINES_VERSION;
          setUpdateAvailable(hasUpdate);
          
          localStorage.setItem("lastUpdateCheck", Date.now().toString());
          localStorage.setItem("searchEnginesVersion", SEARCH_ENGINES_VERSION);
        }
      } catch (error) {
        console.error("Failed to check for updates:", error);
      }
    };

    checkForUpdates();
    const interval = setInterval(checkForUpdates, UPDATE_CHECK_INTERVAL);

    return () => clearInterval(interval);
  }, []);

  if (!updateAvailable) return null;

  return (
    <Alert className="fixed bottom-4 right-4 w-96">
      <RefreshCw className="h-4 w-4" />
      <AlertTitle>Update Available</AlertTitle>
      <AlertDescription>
        <p className="mb-2">New search engines are available for your region.</p>
        <Button
          size="sm"
          onClick={() => {
            // This would typically trigger the update process
            setUpdateAvailable(false);
            localStorage.setItem("searchEnginesVersion", SEARCH_ENGINES_VERSION);
          }}
        >
          Update Now
        </Button>
      </AlertDescription>
    </Alert>
  );
}