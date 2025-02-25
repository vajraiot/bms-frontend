import React, { useState } from 'react';
import { GoogleMap, Marker, InfoWindow, useLoadScript } from '@react-google-maps/api';

const MapComponent = ({ mapMarkers = [], selectedStatus }) => {
  const [selectedMarker, setSelectedMarker] = useState(null);
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyDRsvO4B8wU4AtMjhgRkjRx0YVdrfwouN4"
  });

  const handleMarkerClick = (marker) => {
    setSelectedMarker(marker);
  };

  const handleCloseInfoWindow = () => {
    setSelectedMarker(null);
  };

  if (!isLoaded) return <div>Loading maps...</div>;
  if (loadError) return <div>Error loading maps...</div>;

  // Ensure mapMarkers is an array before mapping
  const markers = Array.isArray(mapMarkers) ? mapMarkers : [];

  // Define marker color based on statusType
  const getIconColor = (statusType) => {
    switch (statusType) {
      case 1:
        return '#4CAF50'; // green
      case 0:
        return '#F44336'; // red
      default:
        return '#FFC107'; // yellow
    }
  };

  return (
    <GoogleMap
      center={{ lat: 17.4065, lng: 78.4772 }}
      zoom={5}
      mapContainerStyle={{ height: '440px', width: '100%' }}
    >
      {markers.map((marker, index) => {
        const iconColor = getIconColor(marker.statusType);

        const infoWindowStyle = {
          fontSize: '14px',
          fontFamily: 'Arial, sans-serif',
          color: '#333',
          maxWidth: '150px',
          position: 'relative'
        };

        const closeButtonStyle = {
          position: 'absolute',
          top: '5px',
          right: '5px',
          background: 'white',
          border: '1px solid #ccc',
          borderRadius: '50%',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: 'bold',
          color: '#555',
          width: '20px',
          height: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        };

        const titleStyle = {
          fontSize: '15px',
          fontWeight: 'bold',
          marginBottom: '8px',
          color: '#2c3e50'
        };

        const contentStyle = {
          display: 'flex',
          fontSize: '10px',
          fontWeight: '200',
          flexDirection: 'column',
        };

        return (
          <Marker
            key={index}
            position={{ lat: parseFloat(marker.lat), lng: parseFloat(marker.lng) }}
            icon={{
              path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z', // Default Google Maps pin path
              fillColor: iconColor,
              fillOpacity: 1,
              strokeColor: '#000',
              strokeWeight: 1,
              scale: 2,
              anchor: new window.google.maps.Point(12, 24), // Adjust anchor point for the pin
            }}
            onClick={() => handleMarkerClick(marker)}
          >
            {selectedMarker === marker && (
              <InfoWindow onCloseClick={handleCloseInfoWindow}>
                <div style={infoWindowStyle}>
                  <button onClick={handleCloseInfoWindow} style={closeButtonStyle}>✖</button>
                  <div style={titleStyle}>{marker.name}</div>
                  <div style={contentStyle}>
                    <span>🔹 <strong>Sub-Station ID:</strong> {marker.siteId}</span>
                    <span>🔹 <strong>Customer:</strong> {marker.vendor || 'N/A'}</span>
                    <span>🔹 <strong>Serial Number:</strong> {marker.serialNumber || 'N/A'}</span>
                  </div>
                </div>
              </InfoWindow>
            )}
          </Marker>
        );
      })}
    </GoogleMap>
  );
};

export default MapComponent;