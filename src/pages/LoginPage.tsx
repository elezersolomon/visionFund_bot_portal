import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Container, Typography } from "@mui/material";
import { loginUser } from "../services/api";
import { setUser } from "../redux/userSlice";

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const validateInputs = () => {
    if (!username.trim()) {
      setError("Username cannot be empty.");
      return false;
    }
    if (username.length < 3) {
      setError("Username must be at least 3 characters long.");
      return false;
    }
    if (!password.trim()) {
      setError("Password cannot be empty.");
      return false;
    }
    if (password.length < 3) {
      setError("Password must be at least 6 characters long.");
      return false;
    }
    setError("");
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateInputs()) {
      return;
    }

    try {
      const response = await loginUser(dispatch, username, password);

      // Check if the user is disabled
      if (response.status === "Disabled") {
        setError(
          "Your account is disabled. Please contact the website administrator."
        );
        return;
      }

      // If user is enabled, proceed with the login
      if (response.role === "admin") {
        navigate("/admin/admin-dashboard");
      } else {
        navigate("/user/user-dashboard");
      }
    } catch (err: any) {
      console.log("consoleData_ err.message", err.message);

      setError(err.message || "An error occurred during login.");
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" align="center" gutterBottom>
        Login
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Username"
          variant="outlined"
          fullWidth
          margin="normal"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          error={Boolean(error && error.includes("Username"))}
          helperText={error && error.includes("Username") ? error : ""}
        />
        <TextField
          label="Password"
          type="password"
          variant="outlined"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={Boolean(error && error.includes("Password"))}
          helperText={error && error.includes("Password") ? error : ""}
        />
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Login
        </Button>
        {error &&
          !error.includes("Username") &&
          !error.includes("Password") && (
            <Typography color="error" align="center" marginTop="1rem">
              {error}
            </Typography>
          )}
      </form>
    </Container>
  );
};

export default LoginPage;
