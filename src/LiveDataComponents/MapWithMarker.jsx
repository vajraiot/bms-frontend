import React, { useRef, useEffect } from "react";
import { APIProvider, Map, AdvancedMarker, InfoWindow } from "@vis.gl/react-google-maps";
import { te } from "date-fns/locale";

// Inline styles for InfoWindow
const infoWindowStyle = {
 // width: "260px",
  background: "#ffffff",
  //borderRadius: "10px",
 // padding: "15px",
  //boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
  fontFamily: "'Roboto', sans-serif",
 // border: "1px solid #e0e0e0",
};

const closeButtonStyle = {
  position: "absolute",
  top: "8px",
  right: "8px",
  width: "24px",
  height: "24px",
  background: "#f5f5f5",
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  color: "#757575",
  fontSize: "16px",
  border: "none",
  transition: "background-color 0.2s",
};

const titleStyle = {
  fontSize: "16px",
  fontWeight: "600",
  color: "#1a73e8",
  //marginBottom: "10px",
  textAlign: "center",
  paddingRight: "20px", // Space for close button
};

const contentStyle = {
  //fontSize: "14px",
  color: "#424242",
  lineHeight: "1.5",
};

const MapWithMarker = ({ 
  locationName = "", 
  latitude, 
  longitude, 
  vendorName, 
  batteryAHCapacity 
}) => {
  const [selectedMarker, setSelectedMarker] = React.useState(false);
  const [mapError, setMapError] = React.useState(null);
  const mapRef = useRef(null);
  const [mapCenter, setMapCenter] = React.useState({
    lat: 19.2403,
    lng: 73.1305,
  });

  const lat = parseFloat(latitude) || mapCenter.lat;
  const lng = parseFloat(longitude) || mapCenter.lng;

  useEffect(() => {
    if (latitude && longitude) {
      setMapCenter({ lat, lng });
    }
  }, [latitude, longitude]);

  useEffect(() => {
    if (mapRef.current && selectedMarker) {
      mapRef.current.panTo({ lat: lat - 0.0025, lng });
    } else if (mapRef.current && !selectedMarker) {
      mapRef.current.panTo({ lat, lng });
    }
  }, [selectedMarker, lat, lng]);

  const handleMarkerClick = () => setSelectedMarker(true);
  const handleCloseInfoWindow = () => setSelectedMarker(false);

  const handleApiLoadError = (error) => {
    console.error("Google Maps API Load Error:", error);
    setMapError("Failed to load Google Maps");
  };

  const handleMapLoad = (map) => {
    mapRef.current = map;
  };

  return (
    <APIProvider
      apiKey="AIzaSyDRsvO4B8wU4AtMjhgRkjRx0YVdrfwouN4"
      onError={handleApiLoadError}
    >
      {mapError ? (
        <div>{mapError}</div>
      ) : (
        <div 
          style={{ 
            position: "relative", 
            height: "200px", 
            width: "100%",
            boxShadow: '0px 0px 15px rgba(0, 0, 0, 0.3)', borderRadius: '8px',
          }}
        >
          <Map
            defaultCenter={{ lat, lng }}
            zoom={10}
            style={{ height: "100%", width: "100%" }}
            mapId="57f9f0203fe55f5e"
            mapTypeId="hybrid"
            gestureHandling="greedy"
            disableDefaultUI={true}
            onMapLoad={handleMapLoad}
          >
            <AdvancedMarker 
              position={{ lat, lng }} 
              onClick={handleMarkerClick}
            >
              <img
                src="https://cdn.jsdelivr.net/gh/pointhi/leaflet-color-markers/img/marker-icon-2x-blue.png"
                alt="Green Marker"
                style={{ 
                  width: "25px", 
                  height: "41px",
                  transform: "translateY(-50%)"
                }}
              />
            </AdvancedMarker>

            {selectedMarker && (
              <InfoWindow
                position={{ lat, lng }}
                onCloseClick={handleCloseInfoWindow}
                pixelOffset={[0, -41]}
                disableAutoClose={false} // Use custom close button only
              >
                <div style={infoWindowStyle}>
                  <button
                    style={closeButtonStyle}
                    onClick={handleCloseInfoWindow}
                    onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#e0e0e0")}
                    onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#f5f5f5")}
                  >
                    ×
                  </button>
                  <div style={titleStyle}>{locationName || "Location"}</div>
                  <div style={contentStyle}>
                    <div style={{ display: "flex", alignItems: "center", marginBottom: "6px" }}>
                      <strong style={{ width: "100px", display: "inline-block" }}>🔹 Customer</strong>
                      <strong style={{ margin: "0 5px" }}>:</strong>
                      <span style={{ color: "#000f89", fontWeight: "bold" }}>{vendorName || "N/A"}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <strong style={{ width: "100px", display: "inline-block" }}>🔹 AH Capacity</strong>
                      <strong style={{ margin: "0 5px" }}>:</strong>
                      <span style={{ color: "#000f89", fontWeight: "bold" }}>{batteryAHCapacity.ahCapacity|| "N/A"} AH</span>
                    </div>
                  </div>
                </div>
              </InfoWindow>
            )}
          </Map>
        </div>
      )}
    </APIProvider>
  );
};

export default MapWithMarker;