import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  SelectChangeEvent,
  InputLabel,
  FormControl,
} from "@mui/material";
import { resetUserPassword, updateUser } from "../services/api";
import { RootState } from "../redux";
import { useSelector } from "react-redux";
import NotificationModal from "../components/NotificationModal";
const EditUser: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const token = useSelector((state: RootState) => state.user.token);
  const user = location.state?.user;

  const initialFormData = {
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    phoneNumber: user?.phoneNumber || "",
    role: user?.role || "",
    email: user?.email || "",
    userName: user?.userName || "",
    userID: user?.userID || "",
    password: "",
    status: user?.status || "Active", // New status field
  };

  const [formData, setFormData] = useState(initialFormData);
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<"success" | "error" | "info">(
    "info"
  );
  const [isModalOpen, setModalOpen] = useState<boolean>(false);

  // Handle changes for TextField inputs
  const handleTextFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    if (message) {
      setMessage(null);
      setMessageType("info");
    }
  };

  // Handle changes for the Select input
  const handleSelectChange = (e: SelectChangeEvent) => {
    setFormData({
      ...formData,
      [e.target.name as string]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await updateUser(formData, token);

      // Set success message and show modal
      setMessage("User updated successfully!");
      setMessageType("success");
      setModalOpen(true);

      // Reset the form to blank values after submission
      setFormData({
        firstName: "",
        lastName: "",
        phoneNumber: "",
        role: "",
        email: "",
        userName: "",
        userID: "",
        password: "",
        status: "", // Or default status value
      });
    } catch (error) {
      setMessage("Failed to update user. Please try again.");
      setMessageType("error");
      setModalOpen(true);
    }
  };

  function resetPassword(e: React.MouseEvent) {
    resetUserPassword(
      {
        username: formData.userName,
        userID: formData.userID,
        firstName: formData.firstName,
        phoneNumber: formData.phoneNumber,
      },
      token
    ).catch((error) => {
      setMessage("Failed to reset user password. Please try again.");
      setMessageType("error");
      setModalOpen(true);
    });
  }

  return (
    <Box
      component="form"
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        mt: 8,
        width: "100%",
      }}
      onSubmit={handleSubmit}
    >
      <Typography textAlign="center" variant="h4">
        Edit User
      </Typography>
      <TextField
        label="First Name"
        name="firstName"
        value={formData.firstName}
        onChange={handleTextFieldChange}
        required
      />
      <TextField
        label="Last Name"
        name="lastName"
        value={formData.lastName}
        onChange={handleTextFieldChange}
        required
      />
      <TextField
        label="Phone Number"
        name="phoneNumber"
        type="number"
        value={formData.phoneNumber}
        onChange={handleTextFieldChange}
        required
      />
      <TextField
        label="Email"
        name="email"
        value={formData.email}
        onChange={handleTextFieldChange}
        required
      />
      <TextField
        label="Role"
        name="role"
        value={formData.role}
        onChange={handleTextFieldChange}
        required
      />
      <TextField
        label="Username"
        name="userName"
        value={formData.userName}
        onChange={handleTextFieldChange}
        required
      />
      <FormControl fullWidth>
        <InputLabel id="status-label">Status</InputLabel>
        <Select
          labelId="status-label"
          label="Status"
          name="status"
          value={formData.status}
          onChange={handleSelectChange}
        >
          <MenuItem value="Active">Active</MenuItem>
          <MenuItem value="Disabled">Disabled</MenuItem>
        </Select>
      </FormControl>

      <Box
        component="form"
        sx={{ display: "flex", flexDirection: "row", gap: 2, mt: 8 }}
        onSubmit={handleSubmit}
      >
        <Button type="submit" variant="contained" color="primary">
          Save
        </Button>
        <Button onClick={resetPassword} variant="contained" color="primary">
          Reset password
        </Button>
      </Box>

      <NotificationModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        message={message!}
        messageType={messageType}
      />
    </Box>
  );
};

export default EditUser;
