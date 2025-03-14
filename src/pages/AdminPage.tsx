// src/pages/AdminPage.tsx
import React from "react";
import { useForm } from "react-hook-form";
import { Button, TextField, Container, Typography, Box } from "@mui/material";

const AdminPage: React.FC = () => {
  const { register, handleSubmit } = useForm();

  const onSubmit = (data: any) => {
    // Handle user creation logic
  };

  return (
    <Container maxWidth="sm">
      <Box mt={8}>
        <Typography variant="h4" component="h1" gutterBottom>
          Admin Page
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            {...register("username")}
            label="Username"
            variant="outlined"
            margin="normal"
            fullWidth
            required
          />
          <TextField
            {...register("password")}
            type="password"
            label="Password"
            variant="outlined"
            margin="normal"
            fullWidth
            required
          />
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Create User
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default AdminPage;
