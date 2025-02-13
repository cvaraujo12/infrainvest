"use client";

import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { infrastructureTypes } from "@/lib/infrastructure-types";
import { useEffect, useState } from "react";
import { CACHE_KEY } from "@/lib/search-automation";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const investmentByType = [
  { name: "Energy", value: 450 },
  { name: "Transport", value: 300 },
  { name: "Maritime", value: 200 },
  { name: "Aviation", value: 150 },
];

const projectsByStatus = [
  { name: "Planned", value: 15 },
  { name: "In Progress", value: 24 },
  { name: "Completed", value: 18 },
];

export default function Dashboard() {
  const [lastUpdate, setLastUpdate] = useState(null);
  const [updateStats, setUpdateStats] = useState({
    totalUpdates: 0,
    countriesUpdated: 0,
    averageInvestment: 0,
  });

  useEffect(() => {
    const handleRefresh = () => {
      const cache = JSON.parse(localStorage.getItem(CACHE_KEY) || '{}');
      setLastUpdate(cache.lastUpdate);

      // Calculate statistics from cache
      if (cache.updates) {
        const stats = {
          totalUpdates: cache.updates.length,
          countriesUpdated: new Set(cache.updates.map(u => u.country)).size,
          averageInvestment: cache.updates.reduce((acc, curr) => {
            return acc + (curr.results.reduce((sum, val) => sum + val, 0) / curr.results.length);
          }, 0) / cache.updates.length,
        };
        setUpdateStats(stats);
      }
    };

    // Initial load
    handleRefresh();

    // Listen for updates
    window.addEventListener('refreshInvestments', handleRefresh);
    return () => window.removeEventListener('refreshInvestments', handleRefresh);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Investment Dashboard</h1>
        {lastUpdate && (
          <p className="text-sm text-muted-foreground">
            Last updated: {new Date(lastUpdate).toLocaleString()}
          </p>
        )}
      </div>

      {/* Update Summary Card */}
      <Card className="mb-8 p-6">
        <h2 className="text-lg font-semibold mb-4">Update Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Total Updates</p>
            <p className="text-2xl font-bold">{updateStats.totalUpdates}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Countries Updated</p>
            <p className="text-2xl font-bold">{updateStats.countriesUpdated}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Average Investment</p>
            <p className="text-2xl font-bold">
              {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                notation: 'compact',
                maximumFractionDigits: 1,
              }).format(updateStats.averageInvestment)}
            </p>
          </div>
        </div>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="p-6">
          <h3 className="text-sm font-medium text-muted-foreground">Total Investment</h3>
          <p className="text-2xl font-bold">$1.15B USD</p>
        </Card>
        <Card className="p-6">
          <h3 className="text-sm font-medium text-muted-foreground">Active Projects</h3>
          <p className="text-2xl font-bold">24</p>
        </Card>
        <Card className="p-6">
          <h3 className="text-sm font-medium text-muted-foreground">Countries</h3>
          <p className="text-2xl font-bold">5</p>
        </Card>
        <Card className="p-6">
          <h3 className="text-sm font-medium text-muted-foreground">Completion Rate</h3>
          <p className="text-2xl font-bold">68%</p>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Investment by Type</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={investmentByType}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {investmentByType.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Projects by Status</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={projectsByStatus}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Infrastructure Type Tabs */}
      <Card className="mt-6">
        <Tabs defaultValue="energy" className="p-6">
          <TabsList>
            {Object.values(infrastructureTypes).map((type) => (
              <TabsTrigger key={type.id} value={type.id}>
                {type.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {Object.values(infrastructureTypes).map((type) => (
            <TabsContent key={type.id} value={type.id}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.values(type.subtypes).map((subtype) => (
                  <Card key={subtype.id} className="p-4">
                    <h4 className="font-semibold mb-2">{subtype.name}</h4>
                    <div className="space-y-2">
                      {subtype.fields.map((field) => (
                        <div key={field.name} className="text-sm">
                          <span className="text-muted-foreground">{field.label}: </span>
                          <span className="font-medium">N/A</span>
                        </div>
                      ))}
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </Card>
    </div>
  );
}