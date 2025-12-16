import React, { useState } from "react";
import api from "../../services/api";
import { Link } from "react-router-dom";
import "./accounts.scss";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("login/", { username, password });
      console.log("User logged in:", res.data);
      // Store tokens if provided (TokenObtainPairView returns 'access' and 'refresh')
      if (res.data.access) {
        localStorage.setItem("access_token", res.data.access);
      }
      if (res.data.refresh) {
        localStorage.setItem("refresh_token", res.data.refresh);
      }
      // Also handle alternative token field names
      if (res.data.access_token) {
        localStorage.setItem("access_token", res.data.access_token);
      }
      if (res.data.refresh_token) {
        localStorage.setItem("refresh_token", res.data.refresh_token);
      }
      alert("Login successful!");
      setUsername("");
      setPassword("");
    } catch (err) {
      console.error("Login error:", err);
      console.error("Error response:", err.response?.data);
      
      // Collect all validation errors
      const errors = [];
      
      if (err.response?.data) {
        const errorData = err.response.data;
        
        if (errorData.non_field_errors) {
          const nonFieldErrors = Array.isArray(errorData.non_field_errors) 
            ? errorData.non_field_errors 
            : [errorData.non_field_errors];
          errors.push(...nonFieldErrors);
        }
        
        if (errorData.username) {
          const usernameErrors = Array.isArray(errorData.username) ? errorData.username : [errorData.username];
          errors.push(`Username: ${usernameErrors[0]}`);
        }
        
        if (errorData.password) {
          const passwordErrors = Array.isArray(errorData.password) ? errorData.password : [errorData.password];
          errors.push(`Password: ${passwordErrors[0]}`);
        }
        
        if (errorData.detail) {
          errors.push(errorData.detail);
        }
      }
      
      const errorMessage = errors.length > 0 
        ? errors.join('\n') 
        : err.message || "Login failed!";
      
      alert(`Login failed:\n\n${errorMessage}`);
    }
  };

  return (
    <div className="accounts-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin} noValidate>
        <label>Username</label>
        <input
          type="text"
          placeholder="Enter your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <label>Password</label>
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
        <div className="login-link">
          Don't have an account? <Link to="/register">Register</Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
