import React, { useState, useEffect } from 'react';
import { Typography, Container, TextField, Button, MenuItem, Box } from '@mui/material';
import { useUser } from '../UserContext';
import { db } from '../firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

export default function Dashboard() {
  const { user } = useUser();

  const [profile, setProfile] = useState({
    height: '',
    weight: '',
    dietType: '',
    goal: ''
  });

  const [loading, setLoading] = useState(true);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        try {
          const userDocRef = doc(db, 'profiles', user.uid);
          const docSnap = await getDoc(userDocRef);
          if (docSnap.exists()) {
            setProfile(docSnap.data());
          } else {
            console.log('No profile data found for this user.');
          }
        } catch (error) {
          console.error('Error fetching profile:', error);
          setError('Failed to fetch profile data.');
        }
      }
      setLoading(false);
    };

    fetchProfile();
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    try {
      const userDocRef = doc(db, 'profiles', user.uid);
      await setDoc(userDocRef, profile);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Error saving profile:', error);
      setError('Failed to save profile.');
    }
  };

  if (loading) {
    return (
      <Container maxWidth="sm" sx={{ mt: 5, textAlign: 'center' }}>
        <Typography variant="h6">Loading profile...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>

      {user ? (
        <Typography variant="h5" sx={{ mb: 4 }}>
          Welcome, {user.displayName}!
        </Typography>
      ) : (
        <Typography variant="h5" sx={{ mb: 4 }}>
          Welcome to the Fitness App!
        </Typography>
      )}

      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 4 }}>
        <TextField
          label="Height (in in)"
          variant="outlined"
          fullWidth
          margin="normal"
          name="height"
          value={profile.height}
          onChange={handleChange}
          type="number"
          inputProps={{ min: "0" }}
        />
        <TextField
          label="Weight (in lbs)"
          variant="outlined"
          fullWidth
          margin="normal"
          name="weight"
          value={profile.weight}
          onChange={handleChange}
          type="number"
          inputProps={{ min: "0" }}
        />
        <TextField
          label="Diet Type"
          variant="outlined"
          fullWidth
          margin="normal"
          name="dietType"
          select
          value={profile.dietType}
          onChange={handleChange}
        >
          <MenuItem value="veg">Vegetarian</MenuItem>
          <MenuItem value="non-veg">Non-Vegetarian</MenuItem>
        </TextField>
        <TextField
          label="Goal"
          variant="outlined"
          fullWidth
          margin="normal"
          name="goal"
          select
          value={profile.goal}
          onChange={handleChange}
        >
          <MenuItem value="maintenance">Maintenance</MenuItem>
          <MenuItem value="weight loss">Weight Loss</MenuItem>
          <MenuItem value="bulking">Bulking</MenuItem>
        </TextField>
        
        {error && (
          <Typography color="error" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}

        <Button
          variant="contained"
          type="submit"
          fullWidth
          sx={{
            mt: 2,
            backgroundColor: 'black',
            color: 'red',
            '&:hover': {
              backgroundColor: '#333',
              color: '#ff4d4d'
            }
          }}
        >
          Save Profile
        </Button>

        {saveSuccess && (
          <Typography color="green" sx={{ mt: 2 }}>
            Profile saved successfully!
          </Typography>
        )}
      </Box>
    </Container>
  );
}
