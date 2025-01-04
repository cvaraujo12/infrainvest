import {
  Factory,
  Train,
  Road,
  Anchor,
  Plane,
  Zap,
  Building2,
  Radio,
  Droplets,
  Wifi,
} from "lucide-react";

export const infrastructureTypes = {
  ENERGY: {
    id: "energy",
    name: "Energy",
    icon: Zap,
    subtypes: {
      HYDROELECTRIC: {
        id: "hydroelectric",
        name: "Hydroelectric Plant",
        fields: [
          { name: "capacity", label: "Power Capacity (MW)", type: "number" },
          { name: "reservoirArea", label: "Reservoir Area (km²)", type: "number" },
          { name: "annualGeneration", label: "Annual Generation (GWh)", type: "number" },
        ]
      },
      SOLAR: {
        id: "solar",
        name: "Solar Farm",
        fields: [
          { name: "capacity", label: "Power Capacity (MW)", type: "number" },
          { name: "panelArea", label: "Panel Area (km²)", type: "number" },
        ]
      },
    }
  },
  TRANSPORT: {
    id: "transport",
    name: "Transport",
    icon: Train,
    subtypes: {
      SUBWAY: {
        id: "subway",
        name: "Subway System",
        fields: [
          { name: "lineLength", label: "Line Length (km)", type: "number" },
          { name: "stations", label: "Number of Stations", type: "number" },
          { name: "dailyRidership", label: "Daily Ridership", type: "number" },
        ]
      },
      HIGHWAY: {
        id: "highway",
        name: "Highway",
        icon: Road,
        fields: [
          { name: "length", label: "Length (km)", type: "number" },
          { name: "lanes", label: "Number of Lanes", type: "number" },
          { name: "tollBooths", label: "Toll Booths", type: "number" },
        ]
      },
    }
  },
  MARITIME: {
    id: "maritime",
    name: "Maritime",
    icon: Anchor,
    subtypes: {
      PORT: {
        id: "port",
        name: "Port",
        fields: [
          { name: "capacity", label: "Annual Capacity (TEU)", type: "number" },
          { name: "berths", label: "Number of Berths", type: "number" },
          { name: "draftDepth", label: "Draft Depth (m)", type: "number" },
        ]
      }
    }
  },
  AVIATION: {
    id: "aviation",
    name: "Aviation",
    icon: Plane,
    subtypes: {
      AIRPORT: {
        id: "airport",
        name: "Airport",
        fields: [
          { name: "runways", label: "Number of Runways", type: "number" },
          { name: "terminals", label: "Number of Terminals", type: "number" },
          { name: "annualPassengers", label: "Annual Passengers", type: "number" },
        ]
      }
    }
  },
};

export const getInfrastructureIcon = (typeId, subtypeId) => {
  const type = infrastructureTypes[typeId.toUpperCase()];
  return type?.icon || Building2;
};

export const getAllSubtypes = () => {
  const subtypes = [];
  Object.values(infrastructureTypes).forEach(type => {
    Object.values(type.subtypes).forEach(subtype => {
      subtypes.push({
        ...subtype,
        typeId: type.id,
        typeName: type.name,
        icon: type.icon,
      });
    });
  });
  return subtypes;
};