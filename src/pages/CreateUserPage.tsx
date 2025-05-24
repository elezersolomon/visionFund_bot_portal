import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  TextField,
  Typography,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  SelectChangeEvent,
} from "@mui/material";
import { createUser, getBranches } from "../services/api";
import { useSelector } from "react-redux";
import { RootState } from "../redux";
import NotificationModal from "../components/NotificationModal";

const CreateUserPage: React.FC = () => {
  interface Branch {
    id: number;
    name: string;
  }

  const [branches, setBranches] = useState<Branch[]>([]);

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await getBranches();
        setBranches(response);
        // console.log("Branches:", response);
      } catch (error) {
        // console.error("Error fetching branches:", error);
      }
    };

    fetchBranches();
  }, []);

  const [formData, setFormData] = useState({
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    branch: "",
    role: "",
    phoneNumber: "",
  });

  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<"success" | "error" | "info">(
    "info"
  );
  const [isModalOpen, setModalOpen] = useState<boolean>(false);

  const navigate = useNavigate();
  const token = useSelector((state: RootState) => state.user.token);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear message when inputs are edited
    if (message) {
      setMessage(null);
      setMessageType("info");
    }
  };

  const handleRoleChange = (e: SelectChangeEvent<string>) => {
    setFormData({ ...formData, role: e.target.value });

    // Clear message when inputs are edited
    if (message) {
      setMessage(null);
      setMessageType("info");
    }
  };

  const validateForm = () => {
    // Validate name fields
    const nameRegex = /^[a-zA-Z]{2,30}$/;
    if (
      !nameRegex.test(formData.firstName) ||
      !nameRegex.test(formData.lastName)
    ) {
      return "First name and last name must only contain letters and be 2-30 characters long.";
    }

    // Validate phone number
    const phoneNumber = formData.phoneNumber;
    if (phoneNumber.length !== 10) {
      return "Phone number must be exactly 10 digits long.";
    }
    const phoneRegex = /^[0-9]+$/;
    if (!phoneRegex.test(phoneNumber)) {
      return "Phone number must contain only digits.";
    }

    return null;
  };

  // handle branch change
  const handleBranchChange = (e: SelectChangeEvent<string>) => {
    const selectedBranchID = e.target.value;
    // console.log("Branch selected:", selectedBranchID);
    setFormData({ ...formData, branch: e.target.value });
    // get branch details from api

    // Clear message when inputs are edited
    if (message) {
      setMessage(null);
      setMessageType("info");
    }
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
      await createUser(formData, token);
      setMessage("User created successfully!");
      setMessageType("success");
      setModalOpen(true);
      // Clear form fields
      setFormData({
        username: "",
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        branch:"",
        role: "",
        phoneNumber: "",
      });
    } catch (error: any) {
      // Handle error response
      const errorMessage =
        error.response?.data?.message ||
        "Error creating user. Please try again.";
      setMessage(errorMessage);
      setMessageType("error");
      setModalOpen(true);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <Typography
          textAlign="center"
          variant="h4"
          color="primary.main"
          gutterBottom
          sx={{ m: 4 }}
        >
          Create New User
        </Typography>
        <TextField
          label="Username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          fullWidth
          required
          style={{ marginBottom: "16px" }} // Add space between inputs
        />
        <TextField
          label="First Name"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          fullWidth
          required
          style={{ marginBottom: "16px" }} // Add space between inputs
        />
        <TextField
          label="Last Name"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          fullWidth
          required
          style={{ marginBottom: "16px" }} // Add space between inputs
        />
        <TextField
          label="Email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          fullWidth
          required
          style={{ marginBottom: "16px" }} // Add space between inputs
        />
        <FormControl fullWidth style={{ marginBottom: "16px" }}>
          <InputLabel>Branch *</InputLabel>
          <Select
            name="branch"
            value={formData.branch || ""}
            onChange={handleBranchChange}
            required
          >
            <MenuItem value="">Select Branch</MenuItem>
            {branches?.length > 0 &&
              branches.map((branch) => (
                <MenuItem key={branch.id} value={branch.id} color="primary.main">
                  {branch.name}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
        <FormControl fullWidth style={{ marginBottom: "16px" }}>
          <InputLabel>Role</InputLabel>
          <Select
            name="role"
            value={formData.role}
            onChange={handleRoleChange}
            required
          >
            <MenuItem value="admin">Admin</MenuItem>
            <MenuItem value="user">User</MenuItem>
          </Select>
        </FormControl>
        <TextField
          label="Phone Number"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleChange}
          fullWidth
          required
          style={{ marginBottom: "16px" }} // Add space between inputs
        />
        <Button type="submit" variant="contained" color="primary">
          Create User
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

export default CreateUserPage;
