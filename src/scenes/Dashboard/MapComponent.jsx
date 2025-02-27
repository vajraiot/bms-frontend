import React, { useState } from 'react';
import { GoogleMap, Marker, InfoWindow, useLoadScript } from '@react-google-maps/api';
import RoomOutlinedIcon from '@mui/icons-material/RoomOutlined';

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

  return (
    <GoogleMap
      center={{ lat: 17.4065, lng: 78.4772 }}
      zoom={5}
      mapContainerStyle={{ height: '440px', width: '100%' }}
    >
      {markers.map((marker, index) => {
        // Define color based on statusType
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

        const iconColor = getIconColor(marker.statusType);
        const infoWindowStyle = {
          fontSize: '14px',
          fontFamily: 'Arial, sans-serif',
          color: '#333',
          maxWidth: '150px',
          padding: '0', // Remove padding
          margin: '0', // Remove margin
        };
        
        const closeButtonStyle = {
          position: 'absolute',
          top: '20px',
          right: '20px',
          background: 'red',
          border: '1px solid #ccc',
          borderRadius: '50%',
          cursor: 'pointer',
          fontSize: '10px',
          fontWeight: 'bold',
          color: '#ffff',
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
          color: '#2c3e50',
          backgroundColor: '#FFC107', // Yellow background
          textAlign: 'center', // Center the title
          padding: '5px', // Add some padding
          borderRadius: '4px', // Optional: Add border radius
        };
        
        const contentStyle = {
          display: 'flex',
          fontSize: '10px',
          fontWeight: '200',
          flexDirection: 'column',
          gap: '5px', // Add gap between items
        };
        
        return (
          <Marker
            key={index}
            position={{ lat: parseFloat(marker.lat), lng: parseFloat(marker.lng) }}
            icon={{
              path: RoomOutlinedIcon.path,
              fillColor: iconColor,
              fillOpacity: 1,
              strokeColor: iconColor,
              strokeWeight: 1,
              scale: 2,
              anchor: new window.google.maps.Point(10, 15),
            }}
            onClick={() => handleMarkerClick(marker)}
          >
            {selectedMarker === marker && (
              <InfoWindow onCloseClick={handleCloseInfoWindow} options={{ disableAutoPan: true }}>
                <div style={infoWindowStyle}>
                  <button onClick={handleCloseInfoWindow} style={closeButtonStyle}>✖</button>
                  <div style={titleStyle}>{marker.name}</div>
                  <div style={contentStyle}>
                    <span>🔹 <strong>Sub-Station ID:</strong> {marker.siteId}</span>
                    <span>🔹 <strong>Customer:</strong> {marker.vendor || 'N/A'}</span>
                    <span>🔹 <strong>SerialNum:</strong> {marker.serialNumber || 'N/A'}</span>
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