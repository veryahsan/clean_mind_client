# Authentication Context Usage Guide

## Overview

The `AuthContext` provides centralized authentication state management for the entire application. It handles user login, logout, registration, and provides authentication state throughout the app.

## Setup

The `AuthProvider` is already wrapped around your app in `App.jsx`:

```jsx
<AuthProvider>
  {/* Your app components */}
</AuthProvider>
```

## Using the Auth Context

### Import the hook

```jsx
import { useAuth } from "../context/AuthContext";
```

### Available Properties and Methods

```jsx
const {
  user,              // Current user object (null if not logged in)
  isAuthenticated,   // Boolean: true if user is logged in
  isLoading,         // Boolean: true while checking auth status
  token,             // Access token string (or null)
  login,             // Function to log in
  logout,            // Function to log out
  register,          // Function to register new user
  updateUser,        // Function to update user data
  checkAuth,         // Function to manually check auth status
} = useAuth();
```

## Examples

### 1. Conditional Rendering Based on Auth State

```jsx
import { useAuth } from "../context/AuthContext";

const MyComponent = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <div>
      {isAuthenticated ? (
        <div>
          <h1>Welcome, {user?.username}!</h1>
          <p>You are logged in.</p>
        </div>
      ) : (
        <div>
          <h1>Please log in</h1>
          <p>You need to be authenticated to view this content.</p>
        </div>
      )}
    </div>
  );
};
```

### 2. Using Login Function

```jsx
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const LoginComponent = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    const result = await login(username, password);
    
    if (result.success) {
      navigate("/dashboard");
    } else {
      console.error("Login failed:", result.error);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      {/* form fields */}
    </form>
  );
};
```

### 3. Using Logout Function

```jsx
import { useAuth } from "../context/AuthContext";

const LogoutButton = () => {
  const { logout } = useAuth();

  return (
    <button onClick={logout}>
      Logout
    </button>
  );
};
```

### 4. Protected Routes

Use the `ProtectedRoute` component to protect routes that require authentication:

```jsx
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Dashboard from "./pages/Dashboard";

// In your Routes:
<Route 
  path="/dashboard" 
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  } 
/>
```

### 5. Show Loading State

```jsx
import { useAuth } from "../context/AuthContext";

const MyComponent = () => {
  const { isLoading, isAuthenticated, user } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {isAuthenticated ? (
        <div>Welcome, {user?.username}!</div>
      ) : (
        <div>Please log in</div>
      )}
    </div>
  );
};
```

### 6. Navbar Example (Already Implemented)

```jsx
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <nav>
      {isAuthenticated ? (
        <>
          <span>Hello, {user?.username}</span>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </>
      )}
    </nav>
  );
};
```

## API Response Format

The context expects login responses in this format:

```json
{
  "access": "jwt-access-token",
  "refresh": "jwt-refresh-token",
  "user": {
    "username": "user123",
    "email": "user@example.com",
    "role": "member"
  }
}
```

If your API returns different field names (e.g., `access_token` instead of `access`), the context will handle both formats.

## User Data Storage

- **Access Token**: Stored in `localStorage` as `access_token`
- **Refresh Token**: Stored in `localStorage` as `refresh_token`
- **User Data**: Stored in `localStorage` as `user` (JSON stringified)

## Notes

- The context automatically checks authentication status on mount
- Tokens are included in API requests via the axios interceptor in `api.js`
- When logout is called, all stored tokens and user data are cleared
- The `isLoading` state is useful for showing loading indicators while checking auth status

