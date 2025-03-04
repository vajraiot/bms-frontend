import React, { useState } from 'react';

const GradientTeardropMarker = ({
  size = 60,
  primaryColor = "#0055A4",
  secondaryColor = "#0077CC",
  ringColor = "#FFFFFF",
  innerCircleGradient = {start: "#0044A0", end: "#006BE0"},
  label = "",
  animate = true,
  onClick = () => {}
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const gradientId = `marker-gradient-${Math.random().toString(36).substr(2, 9)}`;
  const innerGradientId = `inner-gradient-${Math.random().toString(36).substr(2, 9)}`;
  
  return (
    <div 
      className="relative"
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Pulse animation */}
      {animate && (
        <div 
          className="absolute rounded-full animate-ping opacity-40"
          style={{
            backgroundColor: primaryColor,
            width: size * 1.2,
            height: size * 1.2,
            top: -size * 0.1,
            left: -size * 0.1
          }}
        />
      )}
      
      {/* Main teardrop shape */}
      <div
        className={`relative transition-transform duration-300 ${isHovered ? "scale-110" : ""}`}
        style={{
          width: size,
          height: size * 1.3,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        {/* SVG for teardrop shape with gradient */}
        <svg 
          width={size} 
          height={size * 1.3} 
          viewBox="0 0 100 130" 
          style={{position: 'absolute'}}
        >
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={primaryColor} />
              <stop offset="100%" stopColor={secondaryColor} />
            </linearGradient>
            <linearGradient id={innerGradientId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={innerCircleGradient.start} />
              <stop offset="100%" stopColor={innerCircleGradient.end} />
            </linearGradient>
          </defs>
          <path 
            d="M50,0 C22.4,0 0,22.4 0,50 C0,88.4 50,130 50,130 C50,130 100,88.4 100,50 C100,22.4 77.6,0 50,0 Z" 
            fill={`url(#${gradientId})`}
          />
        </svg>
        
        {/* White ring */}
        <div 
          className="rounded-full absolute"
          style={{
            width: size * 0.6,
            height: size * 0.6,
            backgroundColor: ringColor,
            top: size * 0.2,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            boxShadow: 'inset 0 0 5px rgba(0,0,0,0.1)'
          }}
        >
          {/* Inner circle with gradient */}
          <div 
            className="rounded-full flex justify-center items-center"
            style={{
              width: size * 0.4,
              height: size * 0.4,
              background: `linear-gradient(135deg, ${innerCircleGradient.start}, ${innerCircleGradient.end})`
            }}
          >
            {label && (
              <span className="text-white font-bold" style={{ fontSize: size * 0.18 }}>
                {label}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Example usage showing a map with multiple gradient markers
const MapWithGradientMarkers = () => {
  const markers = [
    { 
      id: 1, 
      lat: 34.052, 
      lng: -118.243, 
      label: "LA",
      colors: {
        primary: "#2E5BFF", 
        secondary: "#4F6EFF",
        innerStart: "#1E3FCC", 
        innerEnd: "#4F6EFF"
      }
    },
    { 
      id: 2, 
      lat: 40.713, 
      lng: -74.006, 
      label: "NY",
      colors: {
        primary: "#FF3366", 
        secondary: "#FF5C8D",
        innerStart: "#E01F50", 
        innerEnd: "#FF5C8D"
      }
    },
    { 
      id: 3, 
      lat: 51.507, 
      lng: -0.127, 
      label: "LN",
      colors: {
        primary: "#33CC66", 
        secondary: "#50E87C",
        innerStart: "#28A452", 
        innerEnd: "#50E87C"
      }
    },
  ];
  
  return (
    <div className="bg-gray-100 p-4 rounded-lg w-full h-64 relative">
      <h2 className="text-lg font-bold mb-2">Map with Gradient Markers</h2>
      <div className="w-full h-48 bg-blue-50 rounded border border-gray-200 relative overflow-hidden">
        {/* Simplified map background */}
        <div className="absolute inset-0 bg-blue-50">
          <div className="absolute w-full h-px bg-gray-200 top-1/2"></div>
          <div className="absolute h-full w-px bg-gray-200 left-1/2"></div>
        </div>
        
        {/* Place markers at positions */}
        {markers.map((marker) => (
          <div 
            key={marker.id}
            className="absolute transform -translate-x-1/2 -translate-y-full"
            style={{ 
              left: `${(marker.lng + 180) / 360 * 100}%`, 
              top: `${(90 - marker.lat) / 180 * 100}%` 
            }}
          >
            <GradientTeardropMarker 
              size={40} 
              label={marker.label}
              primaryColor={marker.colors.primary}
              secondaryColor={marker.colors.secondary}
              innerCircleGradient={{
                start: marker.colors.innerStart,
                end: marker.colors.innerEnd
              }}
              onClick={() => alert(`Clicked ${marker.label}`)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default MapWithGradientMarkers;