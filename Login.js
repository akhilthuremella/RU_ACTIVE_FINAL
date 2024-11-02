import React from 'react';
import { Button, Typography, Container } from '@mui/material';
import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../firebase';
import { useUser } from '../UserContext'; // Import useUser from UserContext
import { useNavigate } from 'react-router-dom';

function Login() {
  const { setUser } = useUser(); // Get setUser from context
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      setUser(user); // Set the user in the context
      navigate('/'); // Redirect to dashboard
    } catch (error) {
      console.error('Error during Google sign-in:', error);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 10, textAlign: 'center' }}>
      <Typography variant="h4" gutterBottom>
        Login
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={handleGoogleSignIn}
        sx={{ mt: 3 }}
      >
        Sign in with Google
      </Button>
    </Container>
  );
}

export default Login;
