"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { infrastructureTypes } from "@/lib/infrastructure-types";
import { Loader2, Filter, Info } from "lucide-react";

// Dynamically import map components to avoid SSR issues
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const ZoomControl = dynamic(
  () => import("react-leaflet").then((mod) => mod.ZoomControl),
  { ssr: false }
);
const PulsingMarker = dynamic(
  () => import("@/components/ui/map-marker"),
  { ssr: false }
);

// Sample investment data
const sampleInvestments = [
  {
    id: 1,
    name: "São Paulo Metro Line 6",
    type: "TRANSPORT",
    subtype: "SUBWAY",
    position: [-23.5505, -46.6333],
    amount: 5200000000,
    status: "in_progress",
    country: "Brazil",
    description: "Extension of São Paulo's metro system with new line construction.",
  },
  {
    id: 2,
    name: "Porto do Açu Expansion",
    type: "MARITIME",
    subtype: "PORT",
    position: [-21.8229, -41.0019],
    amount: 3100000000,
    status: "planned",
    country: "Brazil",
    description: "Major port expansion project in Rio de Janeiro state.",
  },
  // Add more sample investments...
];

export default function MapView() {
  const [investments, setInvestments] = useState(sampleInvestments);
  const [filters, setFilters] = useState({
    type: "all",
    minAmount: "",
    maxAmount: "",
    status: "all",
  });
  const [selectedInvestment, setSelectedInvestment] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const filteredInvestments = investments.filter((investment) => {
    if (filters.type !== "all" && investment.type !== filters.type) return false;
    if (filters.status !== "all" && investment.status !== filters.status) return false;
    if (filters.minAmount && investment.amount < parseFloat(filters.minAmount)) return false;
    if (filters.maxAmount && investment.amount > parseFloat(filters.maxAmount)) return false;
    return true;
  });

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="h-[calc(100vh-4rem)] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-4rem)] relative">
      {/* Filters Sheet */}
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            className="absolute top-4 right-4 z-[1000]"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Filter Investments</SheetTitle>
          </SheetHeader>
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label>Infrastructure Type</Label>
              <Select
                value={filters.type}
                onValueChange={(value) =>
                  setFilters({ ...filters, type: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {Object.entries(infrastructureTypes).map(([key, type]) => (
                    <SelectItem key={key} value={key}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Investment Amount Range</Label>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  type="number"
                  placeholder="Min"
                  value={filters.minAmount}
                  onChange={(e) =>
                    setFilters({ ...filters, minAmount: e.target.value })
                  }
                />
                <Input
                  type="number"
                  placeholder="Max"
                  value={filters.maxAmount}
                  onChange={(e) =>
                    setFilters({ ...filters, maxAmount: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={filters.status}
                onValueChange={(value) =>
                  setFilters({ ...filters, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="planned">Planned</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Investment Details Sheet */}
      <Sheet open={!!selectedInvestment} onOpenChange={() => setSelectedInvestment(null)}>
        <SheetContent>
          {selectedInvestment && (
            <>
              <SheetHeader>
                <SheetTitle>{selectedInvestment.name}</SheetTitle>
              </SheetHeader>
              <div className="space-y-4 mt-4">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">
                    {infrastructureTypes[selectedInvestment.type]?.name}
                  </Badge>
                  <Badge variant="outline">
                    {selectedInvestment.status.replace('_', ' ')}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <Label>Investment Amount</Label>
                  <p className="text-2xl font-bold">
                    {formatAmount(selectedInvestment.amount)}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Location</Label>
                  <p>{selectedInvestment.country}</p>
                </div>

                <div className="space-y-2">
                  <Label>Description</Label>
                  <p className="text-sm text-muted-foreground">
                    {selectedInvestment.description}
                  </p>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Map */}
      <MapContainer
        center={[-15.7801, -47.9292]} // Centered on Brazil
        zoom={4}
        className="h-full w-full"
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <ZoomControl position="bottomright" />

        {filteredInvestments.map((investment) => (
          <PulsingMarker
            key={investment.id}
            position={investment.position}
            investment={investment}
            onClick={() => setSelectedInvestment(investment)}
          />
        ))}
      </MapContainer>

      {/* Legend */}
      <Card className="absolute bottom-4 left-4 p-4 z-[1000] bg-background/80 backdrop-blur-sm">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500" />
            <span className="text-sm">&lt; $100M</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <span className="text-sm">&gt; $100M</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-orange-500" />
            <span className="text-sm">&gt; $500M</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <span className="text-sm">&gt; $1B</span>
          </div>
        </div>
      </Card>
    </div>
  );
}