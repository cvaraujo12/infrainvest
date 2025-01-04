"use client";

import { useEffect, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { RefreshCw, AlertCircle } from "lucide-react";
import { updateService } from "@/lib/update-service";
import { useToast } from "@/hooks/use-toast";

export default function UpdateNotification() {
  const [updates, setUpdates] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Start the update service
    updateService.start();

    // Listen for updates
    const handleUpdate = (event) => {
      const newUpdates = event.detail;
      setUpdates(newUpdates);
      setIsVisible(true);

      toast({
        title: "New Investment Data Available",
        description: `${newUpdates.length} new updates found`,
        duration: 5000,
      });
    };

    window.addEventListener('infrastructureUpdate', handleUpdate);

    // Cleanup
    return () => {
      updateService.stop();
      window.removeEventListener('infrastructureUpdate', handleUpdate);
    };
  }, []);

  if (!isVisible || updates.length === 0) return null;

  return (
    <Alert className="fixed bottom-4 right-4 w-96 shadow-lg">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Investment Updates Available</AlertTitle>
      <AlertDescription>
        <p className="mb-2">
          {updates.length} new investment updates found across {
            new Set(updates.map(u => u.country)).size
          } countries.
        </p>
        <div className="flex gap-2">
          <Button
            size="sm"
            onClick={() => {
              // Trigger data refresh in the UI
              window.dispatchEvent(new CustomEvent('refreshInvestments'));
              setIsVisible(false);
            }}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Update Now
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsVisible(false)}
          >
            Dismiss
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
}