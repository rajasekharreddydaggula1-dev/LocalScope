import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default Leaflet icon paths in Vite bundles
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Component to dynamically pan and zoom to the active selected coordinates
function ChangeView({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, zoom || 13);
    }
  }, [center, zoom, map]);
  return null;
}

export default function BusinessMap({ 
  businesses = [], 
  selectedBusiness = null, 
  onMarkerClick = null,
  center = [12.9716, 77.5946], // Bangalore, India default
  zoom = 13
}) {
  
  // Calculate map center dynamically if a business is selected
  const activeCenter = selectedBusiness?.coordinates
    ? [selectedBusiness.coordinates.lat, selectedBusiness.coordinates.lng]
    : center;

  const activeZoom = selectedBusiness ? 15 : zoom;

  return (
    <div style={{ height: '100%', width: '100%', borderRadius: '16px', overflow: 'hidden' }}>
      <MapContainer 
        center={activeCenter} 
        zoom={activeZoom} 
        scrollWheelZoom={true}
        className="leaflet-container"
      >
        <ChangeView center={activeCenter} zoom={activeZoom} />
        
        {/* Modern dark-themed map layer from Stadia Maps or CartoDB */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        {businesses.map((biz) => {
          if (!biz.coordinates?.lat || !biz.coordinates?.lng) return null;
          
          return (
            <Marker 
              key={biz.id} 
              position={[biz.coordinates.lat, biz.coordinates.lng]}
              eventHandlers={{
                click: () => {
                  if (onMarkerClick) onMarkerClick(biz.id);
                },
              }}
            >
              <Popup>
                <div style={{ padding: '0.2rem' }}>
                  <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '0.95rem', fontWeight: 700 }}>
                    {biz.name}
                  </h4>
                  <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    {biz.category} &bull; {biz.city}
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--warning)', fontWeight: 'bold' }}>
                      ★ {biz.rating > 0 ? biz.rating : 'New'}
                    </span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--accent-primary)', fontWeight: 'bold' }}>
                      {biz.reviewCount} Reviews
                    </span>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
