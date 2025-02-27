import React, { useState, useEffect, useContext } from "react";
import Login from "../../assets/images/login.jpg"; // Import the background image
import Watermark from "../../assets/images/png/watermark.png"; // Import the watermark image
import { fetchLoginRoles, fetchLoginDetails } from "../../services/apiService";
import { Navigate } from "react-router-dom";
import { AppContext } from "../../services/AppContext";
import Logo from "../../assets/images/png/vajra.png";
import MahaLogo from "../../assets/images/png/maha.png";

const LoginPage = () => {
  const [role, setRole] = useState("");
  const [roles, setRoles] = useState([]); // Initialize roles as an empty array
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { setIsAuthenticated, isAuthenticated, setUserRole } = useContext(AppContext);

  const fetchRoles = async () => {
    try {
      const response = await fetch("http://122.175.45.16:51270/getListofLoginRoles");
      if (!response.ok) {
        throw new Error("Failed to fetch roles");
      }
      const data = await response.json();
      setRoles(data || []); // Ensure roles is an array
    } catch (error) {
      console.error("Error fetching roles:", error);
      alert("Failed to fetch roles. Please try again later.");
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate that all fields are filled
    if (!role || !username || !password) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      // Call the login function from appService.js
      const data = await fetchLoginDetails(role, username, password);
      console.log("Login Response:", data);

      // Check if the response object is empty or has no success property
      if (!data || Object.keys(data).length === 0) {
        alert("Invalid credentials. Please try again.");
      } else {
        setIsAuthenticated(true); // Update authentication state
        setUserRole(role); // Set the user's role
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert("An error occurred during login. Please try again.");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  const styles = {
    background: {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundImage: `url(${Login})`,
      backgroundPosition: "center",
      zIndex: -1,
    },
    backgroundShade: {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      zIndex: 0,
    },
    wrapper: {
      width: "90%",
      maxWidth: "350px",
      padding: "20px",
      margin: "auto",
      border: "2px solid rgba(252, 7, 7, 0.2)",
      borderRadius: "15px",
      textAlign: "center",
      backgroundColor: "rgba(255, 255, 255, 0.5)", // Transparent white background
      backdropFilter: "blur(10px)", // Adds a blur effect for better visibility
      zIndex: 1,
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)", // Center the box
    },
    watermark: {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundImage: `url(${Watermark})`,
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center",
      backgroundSize: "100%", // Adjust the size
      opacity: 0.3, // Light color for the watermark
      zIndex: -1, // Ensure it's behind the content
    },
    title: {
      marginBottom: "20px",
      fontSize: "24px",
      fontWeight: "bold",
      color: "#666",
    },
    form: {
      display: "flex",
      flexDirection: "column",
      gap: "15px",
    },
    inputBox: {
      textAlign: "left",
    },
    label: {
      display: "block",
      marginBottom: "5px",
      fontSize: "14px",
      color: "#000000",
      fontWeight: "bold"
    },
    input: {
      width: "100%",
      padding: "10px",
      fontSize: "16px",
      border: "2px solid rgba(252, 7, 7, 0.2)", // Brighter border color
      borderRadius: "4px",
      backgroundColor: "rgba(255, 255, 255, 2)", // Fully white background
      color: "#000", // Dark text color for contrast
      boxSizing: "border-box",
      outline: "none",
    },
    passwordContainer: {
      position: "relative",
      display: "flex",
      alignItems: "center",
    },
    showPasswordButton: {
      position: "absolute",
      right: "10px",
      background: "none",
      border: "none",
      cursor: "pointer",
      fontSize: "18px",
      color: "#666",
      outline: "none",
    },
    button: {
      padding: "12px",
      fontSize: "16px",
      backgroundColor: "#007BFF",
      color: "white",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
      transition: "background-color 0.3s ease",
    },
    logoContainer: {
      position: "absolute",
      top: "20px",
      width: "100%",
      display: "flex",
      justifyContent: "space-between", // Aligns logos at left & right
      padding: "0 20px", // Adds some spacing from edges
      zIndex: 2, // Ensure it's above the background
    },
    Logo: {
      width: "120px", // Adjust size as needed
      height: "auto",
    },
    MahaLogo: {
      width: "120px", // Adjust size as needed
      height: "auto",
    },
    quoteContainer: {
      position: "fixed",
      bottom: "50px", // Adjust distance from the bottom
      right: "20px",  // Move it to the right side
      textAlign: "right", // Align text to the right
      fontSize: "20px",
      fontStyle: "italic",
      fontWeight: "bold",
      color: "orange", // Corrected color syntax
      padding: "8px 15px",
      borderRadius: "8px",
    }
  };

  // Redirect to home page if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  return (
    <div>
      <div style={styles.logoContainer}>
        <img src={Logo} alt="Logo" style={styles.Logo} />
        <img src={MahaLogo} alt="MahaLogo" style={styles.MahaLogo} />
      </div>
      <div style={styles.background}></div>
      <div style={styles.backgroundShade}></div>
      <div style={styles.wrapper}>
        <div style={styles.watermark}></div>
        <h2 style={styles.title}>Login</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputBox}>
            <label style={styles.label}>Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
              style={styles.input}
            >
              <option value="" disabled>
                Select your role
              </option>
              {Array.isArray(roles) && roles.length > 0 ? (
                roles.map((roleOption, index) => (
                  <option key={index} value={roleOption}>
                    {roleOption}
                  </option>
                ))
              ) : (
                <option disabled>Loading roles...</option>
              )}
            </select>
          </div>
          <div style={styles.inputBox}>
            <label style={styles.label}>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              style={styles.input}
            />
          </div>
          <div style={styles.inputBox}>
            <label style={styles.label}>Password</label>
            <div style={styles.passwordContainer}>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ ...styles.input, paddingRight: "40px" }}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                style={styles.showPasswordButton}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>
          <button type="submit" style={styles.button}>
            Login
          </button>
        </form>
      </div>
      <div style={styles.quoteContainer}>
        "A well-managed battery is the heart of a<br></br> sustainable future....!"
      </div>
    </div>
  );
};

export default LoginPage;