"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { infrastructureTypes, getInfrastructureIcon } from "@/lib/infrastructure-types";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Sample data - in real app this would come from an API
const sampleProjects = [
  {
    id: 1,
    name: "São Paulo Metro Line 6",
    type: "transport",
    subtype: "subway",
    country: "Brazil",
    investment: 5200000000,
    status: "in_progress",
    details: {
      lineLength: 15.3,
      stations: 15,
      dailyRidership: 600000,
    }
  },
  {
    id: 2,
    name: "Porto do Açu Expansion",
    type: "maritime",
    subtype: "port",
    country: "Brazil",
    investment: 3100000000,
    status: "planned",
    details: {
      capacity: 2000000,
      berths: 8,
      draftDepth: 25,
    }
  },
  // Add more sample projects...
];

export default function Projects() {
  const [selectedType, setSelectedType] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedProject, setSelectedProject] = useState(null);

  const filteredProjects = sampleProjects.filter(project => {
    if (selectedType !== "all" && project.type !== selectedType) return false;
    if (selectedStatus !== "all" && project.status !== selectedStatus) return false;
    return true;
  });

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      planned: { label: "Planned", className: "bg-blue-100 text-blue-800" },
      in_progress: { label: "In Progress", className: "bg-yellow-100 text-yellow-800" },
      completed: { label: "Completed", className: "bg-green-100 text-green-800" },
    };
    return statusConfig[status] || { label: status, className: "" };
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Infrastructure Projects</h1>
        <Button>Add New Project</Button>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-8">
        <Select value={selectedType} onValueChange={setSelectedType}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {Object.entries(infrastructureTypes).map(([key, type]) => (
              <SelectItem key={key} value={type.id}>
                {type.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="planned">Planned</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => {
          const Icon = getInfrastructureIcon(project.type, project.subtype);
          const status = getStatusBadge(project.status);

          return (
            <Card key={project.id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <Icon className="h-6 w-6 mr-2 text-primary" />
                  <h3 className="text-lg font-semibold">{project.name}</h3>
                </div>
                <Badge className={status.className}>{status.label}</Badge>
              </div>
              
              <div className="space-y-2 mb-4">
                <p className="text-sm text-muted-foreground">
                  Location: {project.country}
                </p>
                <p className="text-sm font-medium">
                  Investment: {formatCurrency(project.investment)}
                </p>
              </div>

              <Dialog>
                <DialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => setSelectedProject(project)}
                  >
                    View Details
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <Icon className="h-6 w-6" />
                      {project.name}
                    </DialogTitle>
                  </DialogHeader>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Type</Label>
                      <p className="text-sm">
                        {infrastructureTypes[project.type.toUpperCase()]?.name} - 
                        {infrastructureTypes[project.type.toUpperCase()]?.subtypes[project.subtype.toUpperCase()]?.name}
                      </p>
                    </div>
                    <div>
                      <Label>Status</Label>
                      <Badge className={status.className}>{status.label}</Badge>
                    </div>
                    <div>
                      <Label>Country</Label>
                      <p className="text-sm">{project.country}</p>
                    </div>
                    <div>
                      <Label>Investment</Label>
                      <p className="text-sm font-medium">{formatCurrency(project.investment)}</p>
                    </div>

                    {/* Dynamic Fields based on infrastructure type */}
                    {Object.entries(project.details).map(([key, value]) => (
                      <div key={key}>
                        <Label>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</Label>
                        <p className="text-sm">{value}</p>
                      </div>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>
            </Card>
          );
        })}
      </div>
    </div>
  );
}