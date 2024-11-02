import React, { useState, useEffect } from 'react';
import { Container, Typography, List, ListItem, ListItemText, Button, CircularProgress, Box, Divider, Alert } from '@mui/material';
import { useUser } from '../UserContext';
import { db } from '../firebase';
import { collection, query, where, getDocs, updateDoc, onSnapshot, doc, getDoc } from 'firebase/firestore';

function Leaderboard() {
  const { user } = useUser();
  const [leaderboard, setLeaderboard] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const [acceptedMessage, setAcceptedMessage] = useState(''); // State to hold accepted message
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) return;

    setLoading(true);
    setError(null);

    // Fetch leaderboard data
    const fetchLeaderboard = async () => {
      try {
        const leaderboardQuery = query(collection(db, 'users'));
        const querySnapshot = await getDocs(leaderboardQuery);
        const leaderboardData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        // Sort by workoutCount
        leaderboardData.sort((a, b) => (b.workoutCount || 0) - (a.workoutCount || 0));
        setLeaderboard(leaderboardData);
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
        setError('Failed to load leaderboard');
      }
      setLoading(false);
    };

    // Fetch friend requests with display names
    const fetchFriendRequests = async () => {
      try {
        const friendRequestsQuery = query(
          collection(db, 'friendRequests'),
          where('toUserId', '==', user.uid),
          where('status', '==', 'pending')
        );

        const querySnapshot = await getDocs(friendRequestsQuery);

        const requestsWithNames = await Promise.all(
          querySnapshot.docs.map(async (requestDoc) => {
            const request = requestDoc.data();
            const userDoc = await getDoc(doc(db, 'users', request.fromUserId));
            const displayName = userDoc.exists() ? userDoc.data().displayName : 'Unknown User';
            return { id: requestDoc.id, fromUserId: request.fromUserId, displayName };
          })
        );

        setFriendRequests(requestsWithNames);
      } catch (error) {
        console.error('Error fetching friend requests:', error);
        setError('Failed to load friend requests');
      }
    };

    // Set up real-time listener for friend requests
    const friendRequestsListener = onSnapshot(
      query(
        collection(db, 'friendRequests'),
        where('toUserId', '==', user.uid),
        where('status', '==', 'pending')
      ),
      async (snapshot) => {
        const requestsWithNames = await Promise.all(snapshot.docs.map(async (requestDoc) => {
          const request = requestDoc.data();
          const userDoc = await getDoc(doc(db, 'users', request.fromUserId));
          const displayName = userDoc.exists() ? userDoc.data().displayName : 'Unknown User';
          return { id: requestDoc.id, fromUserId: request.fromUserId, displayName };
        }));
        setFriendRequests(requestsWithNames);
      },
      (error) => {
        console.error('Error fetching friend requests:', error);
        setError('Failed to load friend requests');
      }
    );

    fetchLeaderboard();
    fetchFriendRequests();

    // Cleanup listener on component unmount
    return () => {
      friendRequestsListener();
    };
  }, [user]);

  const handleFriendRequest = async (requestId, action, displayName) => {
    try {
      const requestRef = doc(db, 'friendRequests', requestId);
      await updateDoc(requestRef, { status: action === 'accept' ? 'accepted' : 'rejected' });

      if (action === 'accept') {
        setAcceptedMessage(`Request accepted, ${displayName} is now your friend`);
      }

      setFriendRequests(prevRequests => prevRequests.filter(req => req.id !== requestId));
    } catch (error) {
      console.error('Error responding to friend request:', error);
      setError('Failed to respond to friend request');
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
    <Container maxWidth="sm">
      <Typography variant="h4" component="h2" gutterBottom>
        Leaderboard
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <List>
        {leaderboard.length > 0 ? (
          leaderboard.map((entry) => (
            <ListItem key={entry.id}>
              <ListItemText primary={`${entry.displayName}: ${entry.workoutCount || 0} workouts`} />
            </ListItem>
          ))
        ) : (
          <Typography variant="body1" color="textSecondary">
            No leaderboard data available.
          </Typography>
        )}
      </List>

      <Divider sx={{ my: 2 }} />

      <Typography variant="h5" component="h3" gutterBottom>
        Friend Requests
      </Typography>
      
      {acceptedMessage && (
        <Typography variant="body1" color="primary" sx={{ mt: 2 }}>
          {acceptedMessage}
        </Typography>
      )}

      <List>
        {friendRequests.length > 0 ? (
          friendRequests.map((request) => (
            <ListItem key={request.id} secondaryAction={
              <>
                <Button 
                  variant="contained" 
                  color="primary" 
                  size="small" 
                  onClick={() => handleFriendRequest(request.id, 'accept', request.displayName)}
                  sx={{ mr: 1 }}
                >
                  Accept
                </Button>
                <Button 
                  variant="outlined" 
                  color="secondary" 
                  size="small" 
                  onClick={() => handleFriendRequest(request.id, 'reject')}
                >
                  Reject
                </Button>
              </>
            }>
              <ListItemText primary={`Request from: ${request.displayName || 'Unknown User'}`} />
            </ListItem>
          ))
        ) : (
          !acceptedMessage && ( // Show only if no accepted message is present
            <Typography variant="body1" color="textSecondary">
              No friend requests at this time.
            </Typography>
          )
        )}
      </List>
    </Container>
  );
}

export default Leaderboard;
