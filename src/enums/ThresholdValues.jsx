//import  CommnFail  from '../assets/images/legends/horizontal/CommonFail.jpg';
//import  BatteryLowVoltage  from '../assets/images/legends/horizontal/LowVoltage.gif';
//import  BatteryAboutToDie  from '../assets/images/legends/horizontal/BatteryAboutToDie3.gif';
//import  OpenBattery  from '../assets/images/legends/horizontal/OpenBatteryCrop.gif';
//import  BatteryHighVoltage  from '../assets/images/legends/horizontal/HighVolt.jpg';
//import  BatteryHighTemperature  from '../assets/images/legends/horizontal/highTemeprature.jpg';
//import  LegendCharging  from '../assets/images/legends/horizontal/Charging.gif';
//import  LegendDisCharging  from '../assets/images/legends/horizontal/Discharging.gif';
import { SvgIcon, Box } from '@mui/material';
import { useContext } from "react";
import { AppContext } from '../services/AppContext';
export const BatteryLowVoltage = () => {
  return (
    <svg viewBox="0 0 100 60" style={{ width: "3rem",  }}>
      <g transform="translate(10,10) scale(0.8)">
        <rect x="0" y="0" width="100" height="60" rx="8" fill="none" stroke="#FF0000" strokeWidth="3">
          <animate attributeName="stroke-opacity" values="1;0.3;1" dur="2s" repeatCount="indefinite" />
        </rect>
        <rect x="100" y="20" width="8" height="20" fill="none" stroke="#FF0000" strokeWidth="3">
          <animate attributeName="stroke-opacity" values="1;0.3;1" dur="2s" repeatCount="indefinite" />
        </rect>
        <rect x="5" y="5" width="20" height="50" rx="6" fill="#FF0000">
          <animate attributeName="fill-opacity" values="1;0.3;1" dur="2s" repeatCount="indefinite" />
        </rect>
      </g>
    </svg>
  );
};

export const Charging = () => {
  return (
    <svg viewBox="0 0 100 60" style={{ width: "3rem",  }}>
      <g transform="translate(10,10) scale(0.8)">
        <rect x="0" y="0" width="100" height="60" rx="8" fill="none" stroke="#2E7D32" strokeWidth="3">
          <animate attributeName="stroke-opacity" values="1;0.3;1" dur="2s" repeatCount="indefinite" />
        </rect>
        <rect x="100" y="20" width="8" height="20" fill="none" stroke="#2E7D32" strokeWidth="3">
          <animate attributeName="stroke-opacity" values="1;0.3;1" dur="2s" repeatCount="indefinite" />
        </rect>
        <rect x="5" y="5" width="20" height="50" rx="6" fill="#4CAF50">
          <animate attributeName="width" values="20;70;20" dur="3s" repeatCount="indefinite" />
        </rect>
      </g>
    </svg>
  );
};
export const AnimatedFuseIcon = ({
  size = 40,
  color ,
  strokeWidth = 1.5,
  isBroken = false,
}) => {
  return (
    <svg
    width={size}
    height={size}
    viewBox="0 0 20 20" // Adjusted viewBox to remove extra space
    fill="none"
    stroke={color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {/* Outer casing */}
    <rect x="2" y="6" width="16" height="8" rx="2" /> {/* Adjusted coordinates */}

    {/* End terminals */}
    <line x1="0" y1="10" x2="2" y2="10" /> {/* Adjusted coordinates */}
    <line x1="18" y1="10" x2="20" y2="10" /> {/* Adjusted coordinates */}

    {/* Static parts */}
    <path d="M5 10h2" /> {/* Adjusted coordinates */}
    <path d="M13 10h2" /> {/* Adjusted coordinates */}

    {/* Broken fuse animation */}
    {isBroken ? (
      <g>
        {/* Left part of broken wire */}
        <path d="M7 10L9 9"> {/* Adjusted coordinates */}
          <animate
            attributeName="d"
            values="M7 10L9 9;M7 10L9 9.5;M7 10L9 9"
            dur="0.5s"
            repeatCount="indefinite"
          />
        </path>

        {/* Right part of broken wire */}
        <path d="M11 11L13 10"> {/* Adjusted coordinates */}
          <animate
            attributeName="d"
            values="M11 11L13 10;M11 10.5L13 10;M11 11L13 10"
            dur="0.5s"
            repeatCount="indefinite"
          />
        </path>

        {/* Spark effect */}
        <circle cx="10" cy="10" r="0.5"> {/* Adjusted coordinates */}
          <animate
            attributeName="r"
            values="0.5;1;0.5"
            dur="0.3s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            values="1;0;1"
            dur="0.3s"
            repeatCount="indefinite"
          />
        </circle>

        {/* Additional spark lines */}
        <g>
          <path d="M9.5 9.5L10.5 10.5"> {/* Adjusted coordinates */}
            <animate
              attributeName="opacity"
              values="1;0;1"
              dur="0.3s"
              repeatCount="indefinite"
            />
          </path>
          <path d="M10.5 9.5L9.5 10.5"> {/* Adjusted coordinates */}
            <animate
              attributeName="opacity"
              values="1;0;1"
              dur="0.3s"
              repeatCount="indefinite"
            />
          </path>
        </g>
      </g>
    ) : (
      // Normal unbroken wire
      <path d="M7 10C7 10 8 8 10 8S13 10 13 10" /> )}
    <path d="M6 6v-1" /> {/* Adjusted coordinates */}
    <path d="M14 6v-1" /> {/* Adjusted coordinates */}
  </svg>
  );
};
export const Discharging = () => {
  return (
    <svg viewBox="0 0 100 60" style={{ width: "3rem"  }}>
      <g transform="translate(10,10) scale(0.8)">
        <rect x="0" y="0" width="100" height="60" rx="8" fill="none" stroke="#C62828" strokeWidth="3">
          <animate attributeName="stroke-opacity" values="1;0.3;1" dur="2s" repeatCount="indefinite" />
        </rect>
        <rect x="100" y="20" width="8" height="20" fill="none" stroke="#C62828" strokeWidth="3">
          <animate attributeName="stroke-opacity" values="1;0.3;1" dur="2s" repeatCount="indefinite" />
        </rect>
        <rect x="5" y="5" width="70" height="50" rx="6" fill="#FF5252">
          <animate attributeName="width" values="70;30;70" dur="3s" repeatCount="indefinite" />
        </rect>
      </g>
    </svg>
  );
};


export const CommunicationFailed = () => {
  return (
    <svg viewBox="0 0 100 60" style={{ width: "3rem"}}>
      <g transform="translate(10,10) scale(0.8)">
        <rect x="0" y="0" width="100" height="60" rx="8" fill="none" stroke="#455A64" strokeWidth="3" />
        <rect x="100" y="20" width="8" height="20" fill="none" stroke="#455A64" strokeWidth="3" />

        <g transform="translate(20,15)">
          <rect x="0" y="20" width="10" height="20" fill="#455A64" opacity="0.3">
            <animate attributeName="opacity" values="0.3;1;0.3" dur="1.5s" repeatCount="indefinite" />
          </rect>
          <rect x="15" y="15" width="10" height="25" fill="#455A64" opacity="0.3">
            <animate attributeName="opacity" values="0.3;1;0.3" dur="1.5s" begin="0.2s" repeatCount="indefinite" />
          </rect>
          <rect x="30" y="10" width="10" height="30" fill="#455A64" opacity="0.3">
            <animate attributeName="opacity" values="0.3;1;0.3" dur="1.5s" begin="0.4s" repeatCount="indefinite" />
          </rect>
        </g>

        <path d="M40,15 L60,35 M60,15 L40,35" stroke="#FF5252" strokeWidth="3">
          <animate attributeName="stroke-opacity" values="1;0.5;1" dur="1s" repeatCount="indefinite" />
        </path>
      </g>
    </svg>
  );
};

export const HighVoltage = () => {
  return (
    <svg viewBox="0 0 100 60" style={{ width: "3rem", }}>
      <g transform="translate(10,10) scale(0.8)">
        {/* Background Gradient */}
        <rect x="0" y="0" width="100" height="60" rx="8" fill="url(#highVoltageGradient)" />
        <defs>
          <radialGradient id="highVoltageGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
            <stop offset="0%" stopColor="#F57F17" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#F57F17" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Battery Outline */}
        <rect x="0" y="0" width="100" height="60" rx="8" fill="none" stroke="#F57F17" strokeWidth="3" />
        <rect x="100" y="20" width="8" height="20" fill="none" stroke="#F57F17" strokeWidth="3" />

        {/* Lightning Bolt */}
        <path d="M45,10 L55,10 L50,25 L60,25 L40,50 L45,35 L35,35 Z" fill="#F57F17">
          <animate attributeName="transform" values="translate(0,0);translate(0,2);translate(0,0)" dur="0.2s" repeatCount="indefinite" />
        </path>
      </g>
    </svg>
  );
};

export const HighTemperature = () => {
  return (
    <svg viewBox="0 0 100 60" style={{ width: "3rem", }}>
      <g transform="translate(10,10) scale(0.8)">
        <rect x="0" y="0" width="100" height="60" rx="8" fill="none" stroke="#D84315" strokeWidth="3">
          <animate attributeName="stroke-opacity" values="1;0.3;1" dur="1s" repeatCount="indefinite" />
        </rect>
        <rect x="100" y="20" width="8" height="20" fill="none" stroke="#D84315" strokeWidth="3" />

        <path d="M20,30 Q35,20 50,30 Q65,40 80,30" stroke="#D84315" strokeWidth="2" fill="none">
          <animate attributeName="d" values="M20,30 Q35,20 50,30 Q65,40 80,30;M20,30 Q35,40 50,30 Q65,20 80,30;M20,30 Q35,20 50,30 Q65,40 80,30" dur="1s" repeatCount="indefinite" />
        </path>
      </g>
    </svg>
  );
};

export const AboutToDie = () => {
  return (
    <svg viewBox="0 0 100 60" style={{ width: "3rem", }}>
      <g transform="translate(10,10) scale(0.8)">
        <rect x="0" y="0" width="100" height="60" rx="8" fill="none" stroke="#C62828" strokeWidth="3">
          <animate attributeName="stroke-opacity" values="1;0.3;1" dur="0.5s" repeatCount="indefinite" />
        </rect>
        <rect x="100" y="20" width="8" height="20" fill="none" stroke="#C62828" strokeWidth="3" />

        <rect x="5" y="5" width="15" height="50" rx="6" fill="#FF0000">
          <animate attributeName="fill-opacity" values="1;0.3;1" dur="0.5s" repeatCount="indefinite" />
        </rect>

        <path d="M40,15 L50,35 L30,35 Z" fill="#C62828">
          <animate attributeName="fill-opacity" values="1;0.3;1" dur="0.5s" repeatCount="indefinite" />
        </path>
        <circle cx="40" cy="31" r="2" fill="#FFEBEE" />
      </g>
    </svg>
  );
};

export const OpenBattery = () => {
  return (
    <svg viewBox="0 0 100 60" style={{ width: "3rem",  }}>
      <g transform="translate(10,10) scale(0.8)">
        <path d="M0,0 L40,0 M60,0 L100,0 L100,60 L0,60 Z" fill="none" stroke="#FF6D00" strokeWidth="3">
          <animate attributeName="stroke-dasharray" values="1,0;1,4;1,0" dur="1s" repeatCount="indefinite" />
        </path>
        <rect x="100" y="20" width="8" height="20" fill="none" stroke="#FF6D00" strokeWidth="3" />

        <path d="M40,0 L60,10 M40,10 L60,0" stroke="#FF6D00" strokeWidth="3">
          <animate attributeName="stroke-width" values="3;5;3" dur="1s" repeatCount="indefinite" />
        </path>
      </g>
    </svg>
  );
};



export const ChargerTrip = () => {
  return (
    <svg viewBox="0 0 100 60" style={{ width: "3rem" }}>
      <rect x="10" y="10" width="80" height="40" rx="5" fill="#ECEFF1" stroke="#455A64" strokeWidth="3" />
      <path d="M30,30 L70,30" stroke="#455A64" strokeWidth="3" strokeLinecap="round">
        <animate
          attributeName="d"
          values="M30,30 L70,30;M30,30 L50,30 M60,30 L70,30;M30,30 L70,30"
          dur="2s"
          repeatCount="indefinite"
        />
      </path>
    </svg>
  );
};

export const StringCurrent=()=>{
  return(
    <>
    <svg viewBox="0 0 100 60" style={{ width: "3rem" }}>
    <g transform="translate(650,50)">
    <rect x="0" y="15" width="100" height="30" rx="15" fill="#FAFAFA" stroke="#424242" stroke-width="3"/>
    <circle cx="20" cy="30" r="8" fill="#424242">
      <animate attributeName="cx" values="20;80;20" dur="2s" repeatCount="indefinite"/>
    </circle>
    <path d="M10,30 L90,30" stroke="#424242" stroke-width="2" stroke-dasharray="4 4"/>
  </g>
    </svg>
    
    </>
  )
}

export const ACVoltage = () => {
  return (
    <svg viewBox="0 0 100 60" style={{ width: "3rem" }}>
      <circle cx="50" cy="30" r="30" fill="#E1F5FE" stroke="#0288D1" strokeWidth="3" />
      <path
        d="M20,30 Q35,10 50,30 Q65,50 80,30"
        stroke="#0288D1"
        strokeWidth="3"
        fill="none"
      >
        <animate
          attributeName="d"
          values="M20,30 Q35,10 50,30 Q65,50 80,30;M20,30 Q35,50 50,30 Q65,10 80,30;M20,30 Q35,10 50,30 Q65,50 80,30"
          dur="1s"
          repeatCount="indefinite"
        />
      </path>
    </svg>
  );
};
export const DCVoltage = () => {
  return (
    <svg viewBox="0 0 100 60" style={{ width: "3rem"}}>
      <circle cx="50" cy="30" r="30" fill="#FFF8E1" stroke="#FFA000" strokeWidth="3" />
      <path
        d="M35,30 L45,15 L55,45 L65,30"
        stroke="#FFA000"
        strokeWidth="3"
        fill="none"
      >
        <animate
          attributeName="d"
          values="M35,30 L45,15 L55,45 L65,30;M35,30 L45,45 L55,15 L65,30;M35,30 L45,15 L55,45 L65,30"
          dur="2s"
          repeatCount="indefinite"
        />
      </path>
     
    </svg>
  );
};

export const Buzzer = () => {
  return (
    <svg viewBox="0 0 100 60" style={{ width: "3rem",}}>
      <circle cx="50" cy="30" r="30" fill="#EFEBE9" stroke="#5D4037" strokeWidth="3" />
      <path d="M35,20 L45,20 L60,10 L60,50 L45,40 L35,40 Z" fill="#5D4037">
        <animate
          attributeName="transform"
          values="translate(0,0);translate(2,0);translate(0,0)"
          dur="0.2s"
          repeatCount="indefinite"
        />
      </path>
      <path
        d="M65,20 Q80,30 65,40"
        stroke="#5D4037"
        strokeWidth="2"
        fill="none"
      >
        <animate
          attributeName="stroke-opacity"
          values="1;0;1"
          dur="0.2s"
          repeatCount="indefinite"
        />
      </path>
    </svg>
  );
};
export const FuseIcon = ({ size = 20, color = "#0D47A1", strokeWidth = 1.5 }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      {/* Outer casing */}
      <rect x="4" y="8" width="16" height="8" rx="2" />
      
      {/* End terminals */}
      <line x1="2" y1="12" x2="4" y2="12" />
      <line x1="20" y1="12" x2="22" y2="12" />
      
      {/* Inner fuse element */}
      <path d="M7 12h2" />
      <path d="M15 12h2" />
      <path d="M9 12C9 12 10 10 12 10S15 12 15 12" />
      
      {/* Rating marks */}
      <path d="M8 8v-1" />
      <path d="M16 8v-1" />
    </svg>
  );
};

  export const CellThresholdValues = () => {
    const {
      Mdata = {} 
      }=useContext(AppContext)
  
    if (!Mdata) {
      return { // Default values to prevent crashes
        HighVoltage: 0,
        LowVoltage: 0,
        HighTemperature: 0,
        BatteryAboutToDie: false,
        OpenBattery: false,
      };
    }
    const{
      highVoltage  ,
      lowVoltage  ,
      batteryAboutToDie  ,
      openBattery  ,
      highTemperature  ,
      lowTemperature  ,
      notCommnVoltage  ,
      notCommnTemperature  ,
      }=Mdata ||{}
  
    return {
      HighVoltage: highVoltage || 0,
      LowVoltage: lowVoltage || 0,
      HighTemperature: highTemperature || 0,
      BatteryAboutToDie: batteryAboutToDie || false,
      OpenBattery: openBattery || false,
    };
  };
  
  export const CellLegends = {
    CommnFail :<CommunicationFailed/>,
    BatteryLowVoltage: <BatteryLowVoltage/>,
    BatteryAboutToDie: <AboutToDie/>,
    OpenBattery: <OpenBattery/>,
    BatteryHighVoltage:<HighVoltage/>,
    BatteryHighTemperature:<HighTemperature/>,
    LegendCharging: <Charging/>,
    LegendDisCharging: <Discharging/>,
  }


  