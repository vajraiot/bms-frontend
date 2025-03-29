// Role-based access rules
const pageAccessRules = {
    SUPERADMIN: [
      "/",              // Dashboard
      "/livemonitoring", // Live Data
      "/historical",    // Analytics
      "/packetviewer",  // RealTimeView (assuming PacketViewer maps to this)
      "/alarms",        // Alarm
      "/daywise",       // DayWise
      "/monthly",       // Monthly
      "/issuetracking", // Issue Tracking
      "/siteDetails",   // Site Details
      "/users",         // Users
      "/packetviewer",  // PacketViewer (already included, but listed separately in your rules)
    ],

    ENGINEER: [
      "/",              // Dashboard
      "/livemonitoring", // Live Data
      "/historical",    // Analytics
      "/alarms",        // Alarm
      "/daywise",       // DayWise
      "/monthly",       // Monthly
      "/issuetracking", // Issue Tracking
    ],
    SITE_ENGINEER: [
      "/",              // Dashboard
      "/livemonitoring", // Live Data
      "/historical",    // Analytics
      "/alarms",        // Alarm
      "/daywise",       // DayWise
      "/monthly",       // Monthly
      "/issuetracking", // Issue Tracking
      "/siteDetails",   // Site Details
    ],
    USER: [
      "/",              // Dashboard
      "/livemonitoring", // Live Data
      "/historical",    // Analytics
      "/alarms",        // Alarm
      "/daywise",       // DayWise
      "/monthly",       // Monthly
      "/issuetracking", // Issue Tracking
    ],
  };
  export function decodeJWT(token) {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error("Invalid JWT token:", error);
      return null;
    }
  }
  
  export function getUserRole(token) {
    const decoded = decodeJWT(token);
    return decoded ? decoded.role || null : null; // Adjust 'role' to match your token's key
  }

  export function getUsername(token) {
    const decoded = decodeJWT(token);
    return decoded ? decoded.sub || null : null; // Adjust 'role' to match your token's key
  }

  import { Navigate, useLocation } from "react-router-dom";

export const ProtectedRoute = ({ children, allowedPath }) => {
  const token = sessionStorage.getItem("token"); // Get token from sessionStorage
  const location = useLocation(); // Get the current route path
  const currentPath = location.pathname;

  if (!token) {
    return <Navigate to="/login" replace />; // Redirect to login if no token
  }

  const userRole = getUserRole(token);
  if (!userRole || !pageAccessRules[userRole]) {
    return <Navigate to="/" replace />; // Redirect if role is invalid
  }

  const allowedPaths = pageAccessRules[userRole];
  if (allowedPaths.includes(currentPath)) {
    return children; // Allow access if the path is permitted for the role
  }

  return <Navigate to="/" replace />; // Redirect if access is denied
};