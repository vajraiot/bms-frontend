import React, { useState } from "react";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import { createBrowserRouter, RouterProvider, Outlet, Navigate } from "react-router-dom";
import { AppProvider, AppContext } from "./services/AppContext.js";
import LoginPage from "./components/LoginPage/index.jsx";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import Sidebar from "./scenes/global/Sidebar";
import Dashboard from "./scenes/Dashboard/index.jsx";
import Livemonitoring from "./scenes/Livemonitoring/livemonitoring.jsx";
import Historical from "./scenes/Analytics/Historical/index.jsx";
import Alarms from "./scenes/Analytics/Alarms/index.jsx";
import Daywise from "./scenes/Analytics/Daywise/index.jsx";
import Monthly from "./scenes/Analytics/Monthly/index.jsx";
import PacketViewer from "./scenes/PacketViewer/index.jsx";
import SiteDetails from "./scenes/Preferences/SiteDetails/index.jsx";
import IssueTracking from "./scenes/Issuetracking/index.jsx";
import Users from "./scenes/Users/index.jsx";
import './index.css';
import { ProtectedRoute } from "./utils/ProtectedRoutes.js";
const AuthenticatedLayout = ({ isSidebar, setIsSidebar }) => {
  return (
    <div className="app">
      <Header />
      <div className="main-container">
        <Sidebar isSidebar={isSidebar} />
        <main className="content">
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
};

function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);

  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <AppProvider>
          <ProtectedRoute>
            <AuthenticatedLayout isSidebar={isSidebar} setIsSidebar={setIsSidebar} />
          </ProtectedRoute>
        </AppProvider>
      ),
      children: [
        { path: "/", element: <Dashboard /> },
        { path: "/livemonitoring", element: <Livemonitoring /> },
        { path: "/historical", element: <Historical /> },
        { path: "/alarms", element: <Alarms /> },
        { path: "/daywise", element: <Daywise /> },
        { path: "/monthly", element: <Monthly /> },
        { path: "/siteDetails", element: <SiteDetails /> },
        { path: "/issuetracking", element: <IssueTracking /> },
        { path: "/users", element: <Users /> },
        { path: "/packetviewer", element: <PacketViewer /> },
      ],
    },
    {
      path: "/login",
      element: (
        <AppProvider>
          <LoginPage />
        </AppProvider>
      ),
    },
    {
      path: "/unauthorized",
      element: (
        <AppProvider>
          <div>Unauthorized Access - You don’t have permission to view this page.</div>
        </AppProvider>
      ),
    },
  ]);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <RouterProvider router={router} />
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;