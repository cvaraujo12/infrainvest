"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

export default function MapView() {
  return (
    <div className="h-[calc(100vh-4rem)]">
      <MapContainer
        center={[-15.7801, -47.9292]} // Centered on Brazil
        zoom={4}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {/* Placeholder markers - will be replaced with real data */}
        <Marker position={[-15.7801, -47.9292]}>
          <Popup>
            <div className="p-2">
              <h3 className="font-semibold">Brazil Infrastructure Project</h3>
              <p className="text-sm">Investment: $10M USD</p>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}