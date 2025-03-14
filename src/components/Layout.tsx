import React, { useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Paper,
} from "@mui/material";
import { AccountCircle } from "@mui/icons-material";
import { useSelector } from "react-redux";
import { RootState } from "../redux"; // Adjust the path as needed
import { useDispatch } from "react-redux";
import { setUser } from "../redux/userSlice";

interface LayoutProps {
  links: { to: string; text: string }[];
  role: string;
}

const Layout: React.FC<LayoutProps> = ({ links, role }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const userFirstName = useSelector((state: RootState) => state.user.username);
  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    navigate("/");
    dispatch(
      setUser({
        userID: 0,
        username: "",
        firstName: "",
        lastName: "",
        role: "",
        email: "",
        phoneNumber: "",
        token: "",
        status: "",
      })
    );
  };

  const handleSettings = () => {
    navigate(`/${role}/settings`);
    setAnchorEl(null);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar position="fixed" sx={{ width: "100%", zIndex: 1201 }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, pl: 2 }}>
            {role === "admin" ? "Admin Panel" : "User Panel"}
          </Typography>
          {userFirstName && (
            <Typography variant="h6" sx={{ mr: 2 }}>
              {userFirstName}
            </Typography>
          )}
          <IconButton edge="end" color="inherit" onClick={handleMenu}>
            <AccountCircle />
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            keepMounted
            transformOrigin={{ vertical: "top", horizontal: "right" }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={handleSettings}>Settings</MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        sx={{
          width: 240,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: 240,
            boxSizing: "border-box",
            top: "64x",
            bgcolor: "primary.main",
            color: "primary.contrastText",
            zIndex: 1100,
            boxShadow: 3,
          },
        }}
      >
        <List
          sx={{
            top: "100px",
          }}
        >
          {links.map((link) => (
            <Paper
              key={link.to}
              elevation={3}
              sx={{
                my: 1.5,
                mx: 2,
                bgcolor: "primary.light",
                color: "primary.contrastText",
                "&:hover": {
                  boxShadow: 6,
                },
              }}
            >
              <ListItem button component={Link} to={link.to}>
                <ListItemText
                  primary={link.text}
                  sx={{
                    textAlign: "center",
                  }}
                />
              </ListItem>
            </Paper>
          ))}
        </List>
      </Drawer>

      <Box
        sx={{
          boxShadow: 0,
          borderRadius: 2,
          width: "100%",
          // maxWidth: 1500,
        }}
      >
        <Container
          sx={{
            mt: "64px",
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start",
            // height: "calc(100vh - 64px)",
            width: "100%",
          }}
        >
          {" "}
          <Outlet />
        </Container>
      </Box>
    </Box>
  );
};

export default Layout;
