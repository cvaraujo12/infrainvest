"use client";

import { useEffect, useRef } from "react";
import { Marker } from "react-leaflet";
import L from "leaflet";

const createPulsingIcon = (color = "#3b82f6", size = 20) => {
  return L.divIcon({
    className: "custom-marker",
    html: `
      <div class="relative">
        <div class="absolute -top-${size/2} -left-${size/2}">
          <div class="w-${size} h-${size} bg-${color} rounded-full opacity-75 animate-ping"></div>
          <div class="absolute top-0 left-0 w-${size} h-${size} bg-${color} rounded-full"></div>
        </div>
      </div>
    `,
    iconSize: [size, size],
    iconAnchor: [size/2, size/2],
  });
};

const getMarkerColor = (investmentAmount) => {
  if (investmentAmount >= 1000000000) return "red-500"; // > $1B
  if (investmentAmount >= 500000000) return "orange-500"; // > $500M
  if (investmentAmount >= 100000000) return "yellow-500"; // > $100M
  return "blue-500"; // < $100M
};

export default function PulsingMarker({ position, investment, onClick }) {
  const markerRef = useRef(null);
  const color = getMarkerColor(investment.amount);

  useEffect(() => {
    if (markerRef.current) {
      const marker = markerRef.current;
      marker.setIcon(createPulsingIcon(color));
    }
  }, [color]);

  return (
    <Marker
      ref={markerRef}
      position={position}
      eventHandlers={{
        click: onClick,
      }}
    />
  );
}