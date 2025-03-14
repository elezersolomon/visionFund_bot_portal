import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  TextField,
  Typography,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { createCustomer } from "../services/api";
import { useSelector } from "react-redux";
import { RootState } from "../redux";
import NotificationModal from "../components/NotificationModal";

const AddCustomerPage: React.FC = () => {
  const [formData, setFormData] = useState({
    telegramUserName: "",
    firstName: "",
    lastName: "",
    telegramID: "",
    phoneNumber: "",
    address: "",
    isCustomer: false,
  });

  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<"success" | "error" | "info">(
    "info"
  );
  const [isModalOpen, setModalOpen] = useState<boolean>(false);

  const navigate = useNavigate();
  const token = useSelector((state: RootState) => state.user.token);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });

    if (message) {
      setMessage(null);
      setMessageType("info");
    }
  };

  const validateForm = () => {
    const nameRegex = /^[a-zA-Z]{2,30}$/;
    if (
      !nameRegex.test(formData.firstName) ||
      !nameRegex.test(formData.lastName)
    ) {
      return "First name and last name must only contain letters and be 2-30 characters long.";
    }

    const phoneNumber = formData.phoneNumber;
    if (phoneNumber.length !== 10) {
      return "Phone number must be exactly 10 digits long.";
    }
    const phoneRegex = /^[0-9]+$/;
    if (!phoneRegex.test(phoneNumber)) {
      return "Phone number must contain only digits.";
    }

    if (!formData.telegramID) {
      return "Telegram ID is required.";
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validateForm();

    if (validationError) {
      setMessage(validationError);
      setMessageType("error");
      setModalOpen(true);
      return;
    }

    try {
      await createCustomer(formData, token);
      setMessage("Customer created successfully!");
      setMessageType("success");
      setModalOpen(true);
      setFormData({
        telegramUserName: "",
        firstName: "",
        lastName: "",
        telegramID: "",
        phoneNumber: "",
        address: "",
        isCustomer: false,
      });
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        "Error creating customer. Please try again.";
      setMessage(errorMessage);
      setMessageType("error");
      setModalOpen(true);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <Typography variant="h4">Add New Customer</Typography>
        <TextField
          label="Telegram Username"
          name="telegramUserName"
          value={formData.telegramUserName}
          onChange={handleChange}
          fullWidth
          required
          style={{ marginBottom: "16px" }}
        />
        <TextField
          label="First Name"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          fullWidth
          required
          style={{ marginBottom: "16px" }}
        />
        <TextField
          label="Last Name"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          fullWidth
          required
          style={{ marginBottom: "16px" }}
        />
        <TextField
          label="Telegram ID"
          name="telegramID"
          value={formData.telegramID}
          onChange={handleChange}
          fullWidth
          required
          style={{ marginBottom: "16px" }}
        />
        <TextField
          label="Phone Number"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleChange}
          fullWidth
          required
          style={{ marginBottom: "16px" }}
        />
        <TextField
          label="Address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          fullWidth
          required
          style={{ marginBottom: "16px" }}
        />

        <Button type="submit" variant="contained" color="primary">
          Add Customer
        </Button>
      </form>
      <NotificationModal
        message={message || ""}
        messageType={messageType}
        onClose={() => {
          setMessage(null);
          setMessageType("info");
          setModalOpen(false);
        }}
        isOpen={isModalOpen}
      />
    </div>
  );
};

export default AddCustomerPage;
