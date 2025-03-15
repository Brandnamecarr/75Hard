import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";



const Login = () => {
    // defining some state vars.
  const [formData, setFormData] = useState({ email: "", password: ""});
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState({email: '', uuid: ''});

  // useNavigate to navigate from this page.
  const navigate = useNavigate();

  const updateUserData = (email, uuid) => {
    setUserData({'email': email, 'uuid': uuid});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  }; // handleInputChange //

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const { email, password } = formData;

    if (!email || !password) {
      setError("Both fields are required.");
      return;
    }

    setIsLoading(true);

    try {
      // Replace with your login API endpoint
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();
      console.log(result);

      if (response.ok) {
        alert(`Welcome, ${email}!`);
        updateUserData(email, result.uuid);
        navigate('/Dashboard', {state: {email: email, uuid: result.uuid}});
      } 
      else 
      {
        setError(result.error || "Login failed.");
      }
    } 
    catch (error) {
      setError("An error occurred. Please try again.");
    }

    setIsLoading(false);
  }; // handleSubmit //

  return (
    <div className="login-container" style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h2>Login</h2>
        {error && <p style={styles.error}>{error}</p>}
        <div style={styles.inputGroup}>
          <label htmlFor="email">email</label>
          <input
            type="text"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Enter your email"
            required
          />
        </div>
        <div style={styles.inputGroup}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Enter your password"
            required
          />
        </div>
        <button type="submit" disabled={isLoading} style={styles.button}>
          {isLoading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#f5f5f5",
  },
  form: {
    padding: "20px",
    backgroundColor: "#fff",
    borderRadius: "8px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    width: "300px",
  },
  inputGroup: {
    marginBottom: "15px",
  },
  error: {
    color: "red",
    fontSize: "0.9rem",
    marginBottom: "15px",
  },
  button: {
    width: "100%",
    padding: "10px",
    backgroundColor: "#007BFF",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
};

export default Login;
