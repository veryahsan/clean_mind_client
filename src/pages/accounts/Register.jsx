import React, { useState } from "react";
import api from "../../services/api";
import { Link } from "react-router-dom";
import "./accounts.scss";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    try {
      console.log("Sending registration request:", { username, email, password: "***", password2: "***" });
      const res = await api.post("register/", { username, email, password, password2: confirmPassword });
      console.log("User registered:", res.data);
      alert("Registration successful!");
      setUsername("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error("Registration error:", err);
      console.error("Error response:", err.response?.data);
      
      // Collect all validation errors
      const errors = [];
      
      if (err.response?.data) {
        const errorData = err.response.data;
        
        // Handle Django REST Framework errors - collect all field errors
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
        
        if (errorData.email) {
          const emailErrors = Array.isArray(errorData.email) ? errorData.email : [errorData.email];
          errors.push(`Email: ${emailErrors[0]}`);
        }
        
        if (errorData.password) {
          const passwordErrors = Array.isArray(errorData.password) ? errorData.password : [errorData.password];
          errors.push(`Password: ${passwordErrors[0]}`);
        }
        
        if (errorData.password2) {
          const password2Errors = Array.isArray(errorData.password2) ? errorData.password2 : [errorData.password2];
          errors.push(`Confirm Password: ${password2Errors[0]}`);
        }
        
        if (errorData.message) {
          errors.push(errorData.message);
        } else if (errorData.error) {
          errors.push(errorData.error);
        } else if (errorData.detail) {
          errors.push(errorData.detail);
        }
      }
      
      const errorMessage = errors.length > 0 
        ? errors.join('\n') 
        : err.message || "Registration failed!";
      
      alert(`Registration failed:\n\n${errorMessage}`);
    }
  };

  return (
    <div className="accounts-container">
      <h2>Join Us</h2>
      <form onSubmit={handleRegister} noValidate>
        <label>Username</label>
        <input
          type="text"
          placeholder="Letters, numbers, and @/./+/-/_ only"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          pattern="[a-zA-Z0-9@.+\-_]+"
        />
        <label>Email</label>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label>Password (min. 8 characters)</label>
        <input
          type="password"
          placeholder="At least 8 characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={8}
        />
        <label>Confirm Password</label>
        <input
          type="password"
          placeholder="Confirm password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <button type="submit">Register</button>
        <div className="login-link">
          Already have an account? <Link to="/login">Login</Link>
        </div>
      </form>
    </div>
  );
};

export default Register;
