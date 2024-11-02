// Navbar.js
import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Menu, MenuItem } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../UserContext';

function Navbar() {
  const [anchorEl, setAnchorEl] = useState(null);
  const { user, setUser, logout } = useUser();
  const navigate = useNavigate();

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    setUser(null); // Clear user state to remove their name from the context
    handleMenuClose();
    navigate('/'); // Redirect to the Dashboard after logout
  };

  return (
    <AppBar 
      position="static" 
      sx={{
        background: 'linear-gradient(90deg, black, red)',
      }}
    >
      <Toolbar>
        <Typography
          variant="h6"
          sx={{
            flexGrow: 1,
            display: 'flex',
            alignItems: 'center',
            fontFamily: 'Poppins, sans-serif',
          }}
        >
          <span style={{ color: 'red' }}>RU</span>
          Active
        </Typography>

        {/* Main Navigation Buttons */}
        <Button 
          color="inherit" 
          component={Link} 
          to="/" 
          sx={{ '&:hover': { textDecoration: 'underline' } }}
        >
          Dashboard
        </Button>
        <Button 
          color="inherit" 
          component={Link} 
          to="/workouts" 
          sx={{ '&:hover': { textDecoration: 'underline' } }}
        >
          Workouts
        </Button>
        <Button 
          color="inherit" 
          component={Link} 
          to="/nutrition" 
          sx={{ '&:hover': { textDecoration: 'underline' } }}
        >
          Nutrition
        </Button>
        <Button 
          color="inherit" 
          component={Link} 
          to="/leaderboard" 
          sx={{ '&:hover': { textDecoration: 'underline' } }}
        >
          Leaderboard
        </Button>
        <Button 
          color="inherit" 
          component={Link} 
          to="/goals" 
          sx={{ '&:hover': { textDecoration: 'underline' } }}
        >
          Progressive Overload Calculator
        </Button>

        {/* Login button with Profile and Logout in dropdown */}
        <Button
          color="inherit"
          onClick={handleMenuOpen}
          sx={{ '&:hover': { textDecoration: 'underline' } }}
        >
          Login
        </Button>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          {user ? (
            <>
              <MenuItem 
                component={Link} 
                to="/profile" 
                onClick={handleMenuClose}
              >
                Profile
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                Logout
              </MenuItem>
            </>
          ) : (
            <MenuItem 
              component={Link} 
              to="/login" 
              onClick={handleMenuClose}
            >
              Login
            </MenuItem>
          )}
        </Menu>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
