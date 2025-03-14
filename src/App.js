import { useState, useContext, useContext } from "react";
import Footer from "./components/Footer/Footer";
import Sidebar from "./scenes/global/Sidebar";
import Dashboard from "./scenes/Dashboard/index.jsx";
import LoginPage from "../src/components/LoginPage/index.jsx";
import Header from "./components/Header/Header";
import Livemonitoring from "./scenes/Livemonitoring/livemonitoring.jsx";
import Historical from "./scenes/Analytics/Historical/index.jsx";
import Alarms from "./scenes/Analytics/Alarms/index.jsx";
import Daywise from "./scenes/Analytics/Daywise/index.jsx";
import Monthly from "./scenes/Analytics/Monthly/index.jsx";
import SiteDetails from "./scenes/Preferences/SiteDetails/index.jsx";
// import VendorInfo from "./scenes/Preferences/VendorInfo/index.jsx";
import IssueTracking from "./scenes/Issuetracking/index.jsx";
// import Events from "./scenes/Events/index.jsx";
import { CssBaseline, ThemeProvider,  } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import Users from "./scenes/Users/index.jsx";
import { createBrowserRouter, RouterProvider, Outlet, Navigate } from "react-router-dom";
import { AppContext } from "./services/AppContext.js";

import './index.css';
// Auto-refresh hook

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
function AuthenticatedRoute({children}){
  const { isAuthenticated} = useContext(AppContext);
  if(isAuthenticated){
    return children
  }
  return <Navigate to="/login"/>
}

function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);

  const router = createBrowserRouter([
    {
      path: "/login",
      element: <LoginPage />, // LoginPage handles authentication
    },
    {
      path: "/",
      element: (
        <AuthenticatedRoute>
          <AuthenticatedLayout 
            isSidebar={isSidebar} 
            setIsSidebar={setIsSidebar} 
          />
        </AuthenticatedRoute>
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
      ],
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
