// src/pages/Profile.js
import React, { useState, useEffect } from 'react';
import { Typography, Container, Box, Avatar, Divider, Paper } from '@mui/material';
import { useUser } from '../UserContext';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

export default function Profile() {
  const { user } = useUser();
  const [profile, setProfile] = useState({
    height: '',
    weight: '',
    dietType: '',
    goal: '',
  });

  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        try {
          const userDocRef = doc(db, 'profiles', user.uid);
          const docSnap = await getDoc(userDocRef);
          if (docSnap.exists()) {
            setProfile(docSnap.data());
          }
        } catch (error) {
          console.error('Error fetching profile:', error);
        }
      }
    };

    fetchProfile();
  }, [user]);

  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
      <Paper 
        elevation={3} 
        sx={{ 
          p: 4, 
          borderRadius: 2, 
          backgroundColor: '#1c1c1c', // Dark background
          color: 'white', // Text color for contrast
        }}
      >
        <Box display="flex" alignItems="center" mb={3}>
          <Avatar
            sx={{
              width: 80,
              height: 80,
              mr: 3,
              bgcolor: '#333', // Dark background for avatar
              color: 'white', // White icon color
              fontSize: 40,
            }}
            src={user?.photoURL || ''}
          >
            {!user?.photoURL && <AccountCircleIcon fontSize="large" />}
          </Avatar>
          <Box>
            <Typography variant="h4" component="div" fontWeight="bold" color="white">
              {user?.displayName || 'User Name'}
            </Typography>
            <Typography variant="body1" color="white">
              {user?.email}
            </Typography>
          </Box>
        </Box>
        <Divider sx={{ bgcolor: 'red', my: 2 }} />
        <Box mt={3}>
          <Typography variant="h6" fontWeight="bold" color="red" gutterBottom>
            Profile Details
          </Typography>
          <Box display="flex" flexDirection="column" gap={2} mt={2}>
            <Box display="flex" justifyContent="space-between">
              <Typography variant="body1" fontWeight="bold" color="white">
                Height:
              </Typography>
              <Typography variant="body1" color="white">{profile.height} cm</Typography>
            </Box>
            <Box display="flex" justifyContent="space-between">
              <Typography variant="body1" fontWeight="bold" color="white">
                Weight:
              </Typography>
              <Typography variant="body1" color="white">{profile.weight} lbs</Typography>
            </Box>
            <Box display="flex" justifyContent="space-between">
              <Typography variant="body1" fontWeight="bold" color="white">
                Diet Type:
              </Typography>
              <Typography variant="body1" color="white">{profile.dietType}</Typography>
            </Box>
            <Box display="flex" justifyContent="space-between">
              <Typography variant="body1" fontWeight="bold" color="white">
                Goal:
              </Typography>
              <Typography variant="body1" color="white">{profile.goal}</Typography>
            </Box>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}
