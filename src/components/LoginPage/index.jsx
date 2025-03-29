import { useState, useEffect, useContext, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Add this
import Login from "../../assets/images/login.png";
import Watermark from "../../assets/images/watermark.jpeg";
import { Navigate } from "react-router-dom";
import { AppContext } from "../../services/AppContext";
import Logo from "../../assets/images/png/vajra.png";
import MahaLogo from "../../assets/images/png/maha.png";

const LoginPage = () => {
  const [role, setRole] = useState("");
  const [roles, setRoles] = useState([]);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [captchaInput, setCaptchaInput] = useState("");
  const [captchaText, setCaptchaText] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [validationMessages, setValidationMessages] = useState([]);
  const captchaCanvasRef = useRef(null);
  const { token, setToken, setUserRole, username, setUsername } = useContext(AppContext);
  const navigate = useNavigate(); // Add this

  const BASE_URL = "http://122.175.45.16:51270"; // Match your backend port

  const fetchRoles = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/getListofLoginRoles`);
      setRoles(response.data || []);
    } catch (error) {
      console.error("Error fetching roles:", error);
      setValidationMessages(["Failed to fetch roles. Please try again later."]);
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

    ctx.font = "24px Arial";
    ctx.fillStyle = "#333";
    for (let i = 0; i < newCaptchaText.length; i++) {
      ctx.save();
      ctx.translate(25 * i + 15, 35);
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
  }, [captchaCanvasRef]);

  const fetchLoginDetails = async (role, username, password) => {
    try {
      const response = await axios.post(`${BASE_URL}/authenticate`, {
        role,
        username,
        password,
      });
      console.log("Login Response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error during login:", error.response?.data || error.message);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitted(true);

    const messages = [];
    if (!role) messages.push("Please select a role.");
    if (!username) messages.push("Please enter the username.");
    if (!password) messages.push("Please enter the password.");
    if (!captchaInput) messages.push("Please enter the CAPTCHA.");

    if (captchaInput && captchaInput !== captchaText) {
      messages.push("Invalid CAPTCHA. Please try again.");
      setCaptchaInput("");
      generateCaptcha();
    }

    setValidationMessages(messages);

    if (messages.length > 0) return;

    try {
      const data = await fetchLoginDetails(role, username, password);
      if (!data || !data.jwt) {
        setValidationMessages(["Invalid credentials. Please try again."]);
      } else {
        sessionStorage.setItem("token", data.jwt);
        setToken(data.jwt);
        setUserRole(role);
        navigate("/"); // Redirect to home page
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "An error occurred during login. Please try again.";
      setValidationMessages([errorMessage]);
    }
  };
  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  const styles = {
    // Your existing styles remain unchanged
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
      width: "85%",
      maxWidth: "320px",
      padding: "20px",
      margin: "auto",
      border: "1px solid rgba(255, 255, 255, 0.3)",
      borderRadius: "10px",
      textAlign: "center",
      backgroundColor: "rgba(255, 255, 255, 0.8)",
      backdropFilter: "blur(10px)",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      position: "absolute",
      top: "50%",
      left: "80%",
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
      paddingTop: 1,
    },
    form: {
      display: "flex",
      flexDirection: "column",
      gap: "10px",
    },
    inputBox: {
      textAlign: "left",
    },
    label: {
      display: "block",
      marginBottom: "3px",
      fontSize: "12px",
      color: "#333",
      fontWeight: "bold",
    },
    input: {
      width: "100%",
      padding: "8px",
      fontSize: "12px",
      border: "1px solid #ccc",
      borderRadius: "4px",
      backgroundColor: "#fff",
      color: "#333",
      boxSizing: "border-box",
      outline: "none",
    },
    captchaInput: {
      width: "100%",
      padding: "8px",
      fontSize: "12px",
      border: "1px solid #ccc",
      borderRadius: "4px",
      backgroundColor: "#fff",
      color: "#333",
      boxSizing: "border-box",
      outline: "none",
      "::placeholder": {
        fontSize: "10px",
        color: "#999",
      },
    },
    passwordContainer: {
      position: "relative",
      display: "flex",
      alignItems: "center",
    },
    showPasswordButton: {
      position: "absolute",
      right: "8px",
      background: "none",
      border: "none",
      cursor: "pointer",
      fontSize: "16px",
      color: "#666",
      outline: "none",
    },
    button: {
      padding: "10px",
      fontSize: "14px",
      backgroundColor: "#007BFF",
      color: "white",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
      transition: "background-color 0.3s ease",
    },
    logoContainer: {
      position: "absolute",
      top: "15px",
      width: "100%",
      display: "flex",
      justifyContent: "space-between",
      padding: "0 15px",
      zIndex: 2,
    },
    Logo: {
      width: "100px",
      height: "auto",
    },
    MahaLogo: {
      width: "100px",
      height: "auto",
    },
    quoteContainer: {
      position: "fixed",
      bottom: "15px",
      left: "15px",
      textAlign: "center",
      fontSize: "20px",
      fontStyle: "italic",
      fontWeight: "bold",
      color: "orange",
      padding: "6px 10px",
      borderRadius: "6px",
    },
    captchaContainer: {
      marginTop: "10px",
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      gap: "10px",
    },
    captchaCanvas: {
      border: "1px solid #ccc",
      borderRadius: "4px",
      width: "120px",
      height: "50px",
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
    validationContainer: {
      textAlign: "center",
      marginBottom: "10px",
    },
    validationMessage: {
      color: "red",
      fontSize: "12px",
      marginBottom: "4px",
    },
  };

  if (token) return <Navigate to="/" />;

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
          {validationMessages.length > 0 && (
            <div style={styles.validationContainer}>
              {validationMessages.map((message, index) => (
                <div key={index} style={styles.validationMessage}>
                  {message}
                </div>
              ))}
            </div>
          )}
          <div style={styles.inputBox}>
            <label style={styles.label}>Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
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
                style={{ ...styles.input, paddingRight: "30px" }}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                style={styles.showPasswordButton}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "🙊" : "👀"}
              </button>
            </div>
          </div>
          <div style={styles.captchaContainer}>
            <canvas
              ref={captchaCanvasRef}
              width="160"
              height="50"
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
              style={styles.captchaInput}
            />
          </div>
          <button type="submit" style={styles.button}>
            Login
          </button>
        </form>
      </div>
      <div style={styles.quoteContainer}>
        "Enhancing Battery Life with Smart Prediction & Fault Detection... !"
      </div>
    </div>
  );
};

export default LoginPage;