import React, { useEffect, useState } from 'react';
import { useUser } from '../UserContext';
import { db } from '../firebase';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { Container, Typography, Button, Card, CardContent, Box, CircularProgress, Alert } from '@mui/material';

export default function FriendRequests() {
  const { user } = useUser();
  const [friendRequests, setFriendRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFriendRequests = async () => {
      if (user) {
        try {
          const friendRequestsRef = collection(db, 'friendRequests');
          const q = query(friendRequestsRef, where('toUserId', '==', user.uid), where('status', '==', 'pending'));
          const querySnapshot = await getDocs(q);

          const requests = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setFriendRequests(requests);
        } catch (error) {
          console.error('Error fetching friend requests:', error);
          setError('Failed to load friend requests');
        }
        setLoading(false);
      }
    };

    fetchFriendRequests();
  }, [user]);

  const handleAccept = async (requestId) => {
    try {
      const requestRef = doc(db, 'friendRequests', requestId);
      await updateDoc(requestRef, { status: 'accepted' });
      setFriendRequests((prev) => prev.filter((req) => req.id !== requestId));
    } catch (error) {
      console.error('Error accepting friend request:', error);
      setError('Failed to accept friend request');
    }
  };

  const handleReject = async (requestId) => {
    try {
      const requestRef = doc(db, 'friendRequests', requestId);
      await updateDoc(requestRef, { status: 'rejected' });
      setFriendRequests((prev) => prev.filter((req) => req.id !== requestId));
    } catch (error) {
      console.error('Error rejecting friend request:', error);
      setError('Failed to reject friend request');
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Typography variant="h4" gutterBottom>Friend Requests</Typography>
      
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {friendRequests.length > 0 ? (
        friendRequests.map((request) => (
          <Card key={request.id} sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="body1">Friend request from: {request.fromUserId}</Typography>
              <Box mt={2}>
                <Button variant="contained" color="primary" onClick={() => handleAccept(request.id)} sx={{ mr: 1 }}>
                  Accept
                </Button>
                <Button variant="outlined" color="secondary" onClick={() => handleReject(request.id)}>
                  Reject
                </Button>
              </Box>
            </CardContent>
          </Card>
        ))
      ) : (
        <Typography>No friend requests at this time.</Typography>
      )}
    </Container>
  );
}
