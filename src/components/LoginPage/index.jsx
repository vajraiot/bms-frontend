import { useState, useEffect, useContext, useRef } from "react";
import Login from "../../assets/images/login.png";
import Watermark from "../../assets/images/watermark.jpeg";
import { fetchLoginDetails } from "../../services/apiService";
import { Navigate } from "react-router-dom";
import { AppContext } from "../../services/AppContext";
import Logo from "../../assets/images/png/vajra.png";
import MahaLogo from "../../assets/images/png/maha.png";
import { AlignCenter } from "lucide-react";

const LoginPage = () => {
  const [role, setRole] = useState("");
  const [roles, setRoles] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [captchaInput, setCaptchaInput] = useState("");
  const [captchaText, setCaptchaText] = useState("");
  const captchaCanvasRef = useRef(null);
  const { setIsAuthenticated, isAuthenticated, setUserRole } = useContext(AppContext);

  const fetchRoles = async () => {
    try {
      const response = await fetch("http://122.175.45.16:51270/getListofLoginRoles");
      if (!response.ok) throw new Error("Failed to fetch roles");
      const data = await response.json();
      setRoles(data || []);
    } catch (error) {
      console.error("Error fetching roles:", error);
      alert("Failed to fetch roles. Please try again later.");
    }
  };

  const generateCaptcha = () => {
    const canvas = captchaCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const newCaptchaText = Array(6)
      .fill()
      .map(() => characters.charAt(Math.floor(Math.random() * characters.length)))
      .join("");
    setCaptchaText(newCaptchaText);

    ctx.fillStyle = "#f0f0f0";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = "24px Arial"; // Reduced font size for compactness
    ctx.fillStyle = "#333";
    for (let i = 0; i < newCaptchaText.length; i++) {
      ctx.save();
      ctx.translate(25 * i + 15, 35); // Adjusted spacing
      ctx.rotate((Math.random() - 0.5) * 0.4);
      ctx.fillText(newCaptchaText[i], 0, 0);
      ctx.restore();
    }

    for (let i = 0; i < 5; i++) {
      ctx.beginPath();
      ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.strokeStyle = "#aaa";
      ctx.stroke();
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  useEffect(() => {
    if (captchaCanvasRef.current) {
      generateCaptcha();
    }
  }, [captchaCanvasRef.current]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!role || !username || !password || !captchaInput) {
      alert("Please fill in all fields, including the CAPTCHA.");
      return;
    }

    if (captchaInput.toLowerCase() !== captchaText.toLowerCase()) {
      alert("Invalid CAPTCHA. Please try again.");
      setCaptchaInput("");
      generateCaptcha();
      return;
    }

    try {
      const data = await fetchLoginDetails(role, username, password);
      console.log("Login Response:", data);

      if (!data || Object.keys(data).length === 0) {
        alert("Invalid credentials. Please try again.");
      } else {
        setIsAuthenticated(true);
        setUserRole(role);
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert("An error occurred during login. Please try again.");
    }
  };

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  const styles = {
    background: {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundImage: `url(${Login})`,
      backgroundPosition: "center",
      backgroundSize: "cover",
      zIndex: -1,
    },
    wrapper: {
      width: "85%", // Reduced from 90%
      maxWidth: "320px", // Reduced from 400px
      padding: "20px", // Reduced from 30px
      margin: "auto",
      border: "1px solid rgba(255, 255, 255, 0.3)",
      borderRadius: "10px", // Slightly smaller radius
      textAlign: "center",
      backgroundColor: "rgba(255, 255, 255, 0.8)",
      backdropFilter: "blur(10px)",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      zIndex: 1,
    },
    watermark: {
      position: "absolute",
      top: 25,
      left: 0,
      width: "100%",
      height: "80%",
      
      backgroundImage: `url(${Watermark})`,
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center",
      backgroundSize: "cover",
      opacity: 0.2,
      zIndex: -1,
      paddingTop:1
    },
    form: {
      display: "flex",
      flexDirection: "column",
      gap: "10px", // Reduced from 15px
    },
    inputBox: {
      textAlign: "left",
    },
    label: {
      display: "block",
      marginBottom: "3px", // Reduced from 5px
      fontSize: "12px", // Reduced from 14px
      color: "#333",
      fontWeight: "bold",
    },
    input: {
      width: "100%",
      padding: "8px", // Reduced from 10px
      fontSize: "12px", // Reduced from 14px
      border: "1px solid #ccc",
      borderRadius: "4px",
      backgroundColor: "#fff",
      color: "#333",
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
      right: "8px", // Adjusted for smaller input
      background: "none",
      border: "none",
      cursor: "pointer",
      fontSize: "16px", // Slightly smaller
      color: "#666",
      outline: "none",
    },
    button: {
      padding: "10px", // Reduced from 12px
      fontSize: "14px", // Reduced from 16px
      backgroundColor: "#007BFF",
      color: "white",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
      transition: "background-color 0.3s ease",
    },
    logoContainer: {
      position: "absolute",
      top: "15px", // Slightly closer to top
      width: "100%",
      display: "flex",
      justifyContent: "space-between",
      padding: "0 15px", // Reduced from 20px
      zIndex: 2,
    },
    Logo: {
      width: "100px", // Reduced from 120px
      height: "auto",
    },
    MahaLogo: {
      width: "100px", // Reduced from 120px
      height: "auto",
    },
    quoteContainer: {
      position: "fixed",
      bottom: "15px", // Closer to bottom
      right: "15px", // Closer to right
      textAlign: "right",
      fontSize: "20px", // Reduced from 16px
      fontStyle: "italic",
      fontWeight: "bold",
      color: "orange",
      padding: "6px 10px", // Reduced padding
      borderRadius: "6px", // Smaller radius
    },
    captchaContainer: {
      marginTop: "10px", // Reduced from 15px
      display: "flex",
      flexDirection: "row", // Changed to row for side-by-side layout
      alignItems: "center",
      gap: "10px",
    },
    captchaCanvas: {
      border: "1px solid #ccc",
      borderRadius: "4px",
      width: "160px", // Reduced canvas width
      height: "50px", // Reduced canvas height
    },
    reloadButton: {
      background: "none",
      border: "none",
      cursor: "pointer",
      fontSize: "18px",
      color: "#666",
      padding: "0",
      outline: "none",
    },
  };

  if (isAuthenticated) return <Navigate to="/" />;

  return (
    <div>
      <div style={styles.logoContainer}>
        <img src={Logo} alt="Logo" style={styles.Logo} />
        <img src={MahaLogo} alt="MahaLogo" style={styles.MahaLogo} />
      </div>
      <div style={styles.background}></div>
      <div style={styles.wrapper}>
        <div style={styles.watermark}></div>
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputBox}>
            <label style={styles.label}>Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
              style={styles.input}
            >
              <option value="" disabled>Select your role</option>
              {Array.isArray(roles) && roles.length > 0 ? (
                roles.map((roleOption, index) => (
                  <option key={index} value={roleOption}>{roleOption}</option>
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
                style={{ ...styles.input, paddingRight: "30px" }} // Adjusted padding
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
          <div style={styles.captchaContainer}>
            <canvas
              ref={captchaCanvasRef}
              width="160" // Matches style
              height="50" // Matches style
              style={styles.captchaCanvas}
            />
            <button
              type="button"
              onClick={generateCaptcha}
              style={styles.reloadButton}
              aria-label="Refresh CAPTCHA"
            >
              🔄
            </button>
            <input
              type="text"
              value={captchaInput}
              onChange={(e) => setCaptchaInput(e.target.value)}
              placeholder="Enter CAPTCHA"
              required
              style={styles.input}
            />
          </div>
          <button type="submit" style={styles.button}>
            Login
          </button>
        </form>
      </div>
      <div style={styles.quoteContainer}>
      "Enhancing Battery Life with Smart Prediction & Fault Detection...!"
      </div>
    </div>
  );
};

export default LoginPage;