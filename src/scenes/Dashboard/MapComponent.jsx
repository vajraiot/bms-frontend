import React, { useState, useEffect } from 'react';
import { APIProvider, Map, AdvancedMarker, InfoWindow, useMap } from '@vis.gl/react-google-maps';
import CloseIcon from '@mui/icons-material/Close';

const MapComponent = ({ mapMarkers = [], selectedStatus }) => {
  const [selectedMarker, setSelectedMarker] = useState(null);

  // Ensure mapMarkers is an array before mapping
  const markers = Array.isArray(mapMarkers) ? mapMarkers : [];

  // Define marker icon URLs based on statusType
  const getMarkerIcon = (statusType) => {
    switch (statusType) {
      case 1:
        return 'https://cdn.jsdelivr.net/gh/pointhi/leaflet-color-markers/img/marker-icon-2x-green.png'; // green
      case 0:
        return 'https://cdn.jsdelivr.net/gh/pointhi/leaflet-color-markers/img/marker-icon-2x-red.png'; // red
      default:
        return 'https://cdn.jsdelivr.net/gh/pointhi/leaflet-color-markers/img/marker-icon-2x-gold.png'; // yellow
    }
  };

  // Component to handle map bounds
  const MapBounds = ({ markers }) => {
    const map = useMap();

    useEffect(() => {
      if (!map || !markers.length) return;

      // Create a new bounds object
      const bounds = new window.google.maps.LatLngBounds();
      markers.forEach((marker) => {
        bounds.extend({ lat: parseFloat(marker.lat), lng: parseFloat(marker.lng) });
      });

      // Fit the map to the bounds
      map.fitBounds(bounds);
    }, [map, markers]);

    return null; // This component doesn't render anything
  };

  const handleMarkerClick = (marker) => {
    setSelectedMarker(marker);
  };

  const handleCloseInfoWindow = () => {
    setSelectedMarker(null);
  };

  const hideDefaultCloseButton = `
    .gm-style-iw button.gm-ui-hover-effect {
      display: none !important;
    }
  `;

  return (
    <>
      <style>{hideDefaultCloseButton}</style>
      <APIProvider apiKey="AIzaSyDRsvO4B8wU4AtMjhgRkjRx0YVdrfwouN4">
        <div style={{ boxShadow: '0px 0px 15px rgba(0, 0, 0, 0.7)', borderRadius: '8px', overflow: 'hidden' }}>
          <Map
            mapId="6ff7b6f4b0371642" // Satellite view with labels
            mapTypeId="hybrid" // Explicitly set the map type to Satellite
            style={{ height: '470px', width: '100%' }}
          >
            <MapBounds markers={markers} /> {/* Handle dynamic bounds */}
            {markers.map((marker, index) => {
              const markerIconUrl = getMarkerIcon(marker.statusType);

              const infoWindowStyle = {
                fontSize: '14px',
                fontFamily: 'Arial, sans-serif',
                color: '#333',
                minWidth: '150px',
                padding: '1px',
                margin: '0',
              };

              const closeButtonStyle = {
                position: 'fixed',
                top: '1px',
                right: '5px',
                cursor: 'pointer',
                fontSize: '8px',
                fontWeight: 'bold',
                width: '20px',
                height: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
              };

              const titleStyle = {
                fontSize: '15px',
                fontWeight: 'bold',
                marginBottom: '8px',
                color: '#2c3e50',
                backgroundColor: '#FFC107',
                textAlign: 'center',
                padding: '5px',
                borderRadius: '4px',
              };

              const contentStyle = {
                display: 'flex',
                fontSize: '10px',
                fontWeight: '200',
                flexDirection: 'column',
                gap: '5px',
              };

              const rowStyle = {
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              };

              return (
                <React.Fragment key={index}>
                  <AdvancedMarker
                    position={{ lat: parseFloat(marker.lat), lng: parseFloat(marker.lng) }}
                    onClick={() => handleMarkerClick(marker)}
                  >
                    <img
                      src={markerIconUrl}
                      alt="Marker"
                      style={{ width: '18px', height: '30px' }}
                    />
                  </AdvancedMarker>

                  {selectedMarker === marker && (
                    <InfoWindow
                      position={{ lat: parseFloat(marker.lat), lng: parseFloat(marker.lng) }}
                      pixelOffset={[0, -10]}
                      onCloseClick={handleCloseInfoWindow}
                    >
                      <div style={infoWindowStyle}>
                <CloseIcon style={closeButtonStyle} onClick={handleCloseInfoWindow} />
                <div style={titleStyle}>{marker.name}</div>
                <div style={contentStyle}>
                  <span>

                    <div style={{display:"flex"}}>
                    <div> <strong style={{width: "85px", display: "inline-block"}}>🔹Sub-Station ID </strong></div>
                       <div ><strong>:</strong></div>
                       <div style={{ color: "#000f89",fontWeight:"bold"}}>{marker.siteId}</div>
                      </div>
                  </span>
                  <span>
                  <div style={{display:"flex"}}>
                  <div> <strong style={{width: "85px", display: "inline-block"}}>🔹Customer </strong></div>
                  <div ><strong>:</strong></div>
                  <div style={{ color: "#000f89",fontWeight:"bold"}}>{marker.vendor || "N/A"}</div>
                    </div>
                  </span>
                  <span>
                  <div style={{display:"flex"}}>
                  <div> <strong style={{width: "85px", display: "inline-block"}}>🔹SerialNum</strong></div>
                  <div ><strong>:</strong></div>
                  <div style={{ color: "#000f89",fontWeight:"bold"}}> {marker.serialNumber || "N/A"}</div>
                    </div>
                  </span>
                </div>
              </div>
                    </InfoWindow>
                  )}
                </React.Fragment>
              );
            })}
          </Map>
        </div>
      </APIProvider>
    </>
  );
};

export default MapComponent;