"use client";

import { Card } from "@/components/ui/card";

export default function Projects() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-8">Infrastructure Projects</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Placeholder projects - will be replaced with real data */}
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i} className="p-6">
            <h3 className="text-lg font-semibold mb-2">Project {i}</h3>
            <p className="text-muted-foreground mb-4">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </p>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Location: Brazil</span>
              <span className="text-sm font-medium">$10M USD</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}