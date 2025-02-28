

// import React from 'react';
// //import { GoogleMap, AdvancedMarker, InfoWindow, useLoadScript } from "@react-google-maps/api";
// import { APIProvider, Map, AdvancedMarker } from "@vis.gl/react-google-maps";
// import greenIcon from '../assets/images/marker/greenMarker3232.png'


// const MapWithMarker = ({ locationName = "", latitude, longitude, vendorName, batteryAHCapacity }) => {
//   const [selectedMarker, setSelectedMarker] = React.useState(false);
//   const { isLoaded, loadError } = useLoadScript({
//     googleMapsApiKey: "AIzaSyDRsvO4B8wU4AtMjhgRkjRx0YVdrfwouN4",
//   });

//   const isMounted = React.useRef(true);

//   React.useEffect(() => {
//     return () => {
//       isMounted.current = false;
//     };
//   }, []);

//   const handleMarkerClick = () => {
//     if (isMounted.current) {
//       setSelectedMarker(true);
//     }
//   };

//   const handleCloseInfoWindow = () => {
//     if (isMounted.current) {
//       setSelectedMarker(false);
//     }
//   };

//   const mapStyles = {
//     height: "200px",
//     width: "100%",
//   };

//   const defaultCenter = {
//     lat: 17.4065,
//     lng: 78.4772,
//   };

//   if (loadError) return <div>Error loading maps</div>;
//   if (!isLoaded) return <div>Loading Maps...</div>;


//   // const markerIcon = {
//   //   url: greenIcon ,
//   //   scaledSize: isLoaded ? new window.google.maps.Size(40, 40) : null, // Properly instantiate Size
//   // };

//   const localMarkerIcon = {
//     url: greenIcon, // Local image
//     scaledSize: new window.google.maps.Size(40, 40),
//   };

//   const publicMarkerIcon = {
//     url: "https://maps.google.com/mapfiles/ms/icons/green-dot.png", // Public image
//     scaledSize: new window.google.maps.Size(40, 40),
//   };

//   // Debug logs
//   console.log("Is Google Maps Loaded?", isLoaded);
//   console.log("Local Marker Icon:", localMarkerIcon);
//   console.log("Public Marker Icon:", publicMarkerIcon);
//   console.log("ScaledSize Instance (Local):", localMarkerIcon.scaledSize instanceof window.google.maps.Size);
//   console.log("Marker Position:", { lat: parseFloat(latitude), lng: parseFloat(longitude) });

//   // Test the image URL accessibility
//   fetch(greenIcon)
//     .then((response) => console.log("Image Fetch Test:", response.ok ? "Success" : "Failed", response.status))
//     .catch((error) => console.error("Image Fetch Error:", error));

//     return (
//       <GoogleMap center={defaultCenter} zoom={10} mapContainerStyle={mapStyles}>
//         {isLoaded && (
//           <AdvancedMarker
//             position={{ lat: parseFloat(latitude), lng: parseFloat(longitude) }}
//             onClick={handleMarkerClick}
//           >
//             <img
//               src={localMarkerIcon.url}
//               alt="Custom Marker"
//               style={{ width: "40px", height: "40px" }} // Match scaledSize
//             />
//           </AdvancedMarker>
//         )}
//         {selectedMarker && isLoaded && (
//           <InfoWindow
//             position={{ lat: parseFloat(latitude), lng: parseFloat(longitude) }}
//             onCloseClick={handleCloseInfoWindow}
//           >
//             <div>
//               <strong>{locationName || "Location"}</strong>
//               <br />
//               Vendor: {vendorName || "N/A"}
//               <br />
//               Battery Capacity: {batteryAHCapacity || "N/A"} AH
//             </div>
//           </InfoWindow>
//         )}
//       </GoogleMap>
//     );
// };

// export default MapWithMarker;
import React from "react";
import { APIProvider, Map, AdvancedMarker } from "@vis.gl/react-google-maps";

const MapWithMarker = ({ locationName = "", latitude, longitude, vendorName, batteryAHCapacity }) => {
  const [selectedMarker, setSelectedMarker] = React.useState(false);
  const [mapError, setMapError] = React.useState(null);

  const defaultCenter = {
    lat: 19.2403,
    lng: 73.1305,
  };

  const lat = parseFloat(latitude) || defaultCenter.lat;
  const lng = parseFloat(longitude) || defaultCenter.lng;

  const handleMarkerClick = () => setSelectedMarker(true);
  const handleCloseInfoWindow = () => setSelectedMarker(false);

  const handleApiLoadError = (error) => {
    console.error("Google Maps API Load Error:", error);
    setMapError("Failed to load Google Maps");
  };

  return (
    <APIProvider
      apiKey="AIzaSyDRsvO4B8wU4AtMjhgRkjRx0YVdrfwouN4"
      onError={handleApiLoadError}
    >
      {mapError ? (
        <div>{mapError}</div>
      ) : (
        <Map
          center={defaultCenter}
          zoom={10}
          style={{ height: "200px", width: "100%" }}
          mapId="57f9f0203fe55f5e" // Replace with your Map ID (e.g., "bms-map")
        >
          <AdvancedMarker position={{ lat, lng }} onClick={handleMarkerClick}>
            <img
              src="https://cdn.jsdelivr.net/gh/pointhi/leaflet-color-markers/img/marker-icon-2x-green.png"
              alt="Green Marker"
              style={{ width: "25px", height: "41px" }} // Adjust size to match the new marker
            />
          </AdvancedMarker>
          {selectedMarker && (
            <div style={{ position: "relative" }}>
              <div
                style={{
                  position: "absolute",
                  bottom: "50px", // Position above the marker
                  left: "50%", // Center horizontally
                  transform: "translateX(-50%)", // Adjust for centering
                  background: "white",
                  padding: "5px",
                  borderRadius: "3px",
                  boxShadow: "0 2px 5px rgba(0,0,0,0.3)",
                  fontSize: "12px", // Smaller text
                  whiteSpace: "nowrap", // Keep it compact
                  zIndex: 1000, // Ensure it’s above other elements
                }}
                onClick={(e) => {
                  e.stopPropagation(); // Prevent map click from closing it
                  handleCloseInfoWindow();
                }}
              >
                <strong>{locationName || "Location"}</strong>
                <br />
                Vendor: {vendorName || "N/A"}
                <br />
                Battery Capacity: {batteryAHCapacity || "N/A"} AH
              </div>
            </div>
          )}
        </Map>
      )}
    </APIProvider>
  );
};

export default MapWithMarker;