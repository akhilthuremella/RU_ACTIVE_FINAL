import React, { useState } from 'react';
import { TextField, Button, Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

function Goals() {
  const [oneRepWeight, setOneRepWeight] = useState('');
  const [oneRepReps, setOneRepReps] = useState('');
  const [oneRepMax, setOneRepMax] = useState(null);

  const [overloadWeight, setOverloadWeight] = useState('');
  const [overloadReps, setOverloadReps] = useState('');
  const [overloadSets, setOverloadSets] = useState('');
  const [overloadRest, setOverloadRest] = useState('');
  const [progressiveOverload, setProgressiveOverload] = useState(null);

  const [logs, setLogs] = useState([]); // State for tracking logs
  const [exercise, setExercise] = useState('');

  const roundToNearestFive = (num) => {
    return Math.round(num / 5) * 5;
  };

  const calculateOneRepMax = () => {
    const max = oneRepWeight * (1 + oneRepReps / 30);
    setOneRepMax(roundToNearestFive(max));
  };

  const calculateProgressiveOverload = () => {
    let newWeight = parseFloat(overloadWeight);
    let newReps = parseInt(overloadReps);
    let newSets = parseInt(overloadSets);

    if (newReps >= 10) {
      newWeight = roundToNearestFive(newWeight + 5);
      newReps = 8;
    } else {
      newReps += 1;
    }

    newSets = Math.min(3, newSets + 1);
    const decreasedRest = Math.max(0, overloadRest - 15);

    setProgressiveOverload({
      weight: newWeight,
      reps: newReps,
      sets: newSets,
      rest: decreasedRest,
    });

    // Add log entry
    setLogs(prevLogs => [
      ...prevLogs,
      {
        exercise,
        weight: overloadWeight,
        reps: overloadReps,
        date: new Date().toLocaleDateString(),
      }
    ]);
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4, p: 2, bgcolor: 'background.paper', borderRadius: 2 }}>
      <Typography variant="h4" gutterBottom>One-Rep Max Calculator</Typography>
      <TextField
        label="Weight (lbs)"
        type="number"
        fullWidth
        margin="normal"
        value={oneRepWeight}
        onChange={(e) => setOneRepWeight(e.target.value)}
      />
      <TextField
        label="Reps"
        type="number"
        fullWidth
        margin="normal"
        value={oneRepReps}
        onChange={(e) => setOneRepReps(e.target.value)}
      />
      <Button
        variant="contained"
        fullWidth
        onClick={calculateOneRepMax}
        sx={{ bgcolor: 'black', color: 'red', '&:hover': { bgcolor: 'red', color: 'black' } }}
      >
        Calculate 1RM
      </Button>
      {oneRepMax && <Typography variant="body1" mt={2}>One-Rep Max: {oneRepMax} lbs</Typography>}

      <Typography variant="h4" gutterBottom mt={4}>Progression + Suggestion</Typography>
      <TextField
        label="Exercise"
        fullWidth
        margin="normal"
        value={exercise}
        onChange={(e) => setExercise(e.target.value)}
      />
      <TextField
        label="Current Weight (lbs)"
        type="number"
        fullWidth
        margin="normal"
        value={overloadWeight}
        onChange={(e) => setOverloadWeight(e.target.value)}
      />
      <TextField
        label="Current Reps"
        type="number"
        fullWidth
        margin="normal"
        value={overloadReps}
        onChange={(e) => setOverloadReps(e.target.value)}
      />
      <TextField
        label="Current Sets"
        type="number"
        fullWidth
        margin="normal"
        value={overloadSets}
        onChange={(e) => setOverloadSets(e.target.value)}
      />
      <TextField
        label="Rest Time (seconds)"
        type="number"
        fullWidth
        margin="normal"
        value={overloadRest}
        onChange={(e) => setOverloadRest(e.target.value)}
      />
      <Button
        variant="contained"
        fullWidth
        onClick={calculateProgressiveOverload}
        sx={{ bgcolor: 'black', color: 'red', '&:hover': { bgcolor: 'red', color: 'black' } }}
      >
        Log Workout
      </Button>

      {progressiveOverload && (
        <Box mt={2}>
          <Typography variant="body1">Suggested Weight: {progressiveOverload.weight} lbs</Typography>
          <Typography variant="body1">Suggested Reps: {progressiveOverload.reps}</Typography>
          <Typography variant="body1">Suggested Sets: {progressiveOverload.sets}</Typography>
          <Typography variant="body1">Suggested Rest Time: {progressiveOverload.rest} seconds</Typography>
        </Box>
      )}

      <Typography variant="h5" mt={4}>Workout Log</Typography>
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Exercise</TableCell>
              <TableCell>Weight (lbs)</TableCell>
              <TableCell>Reps</TableCell>
              <TableCell>Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {logs.map((log, index) => (
              <TableRow key={index}>
                <TableCell>{log.exercise}</TableCell>
                <TableCell>{log.weight}</TableCell>
                <TableCell>{log.reps}</TableCell>
                <TableCell>{log.date}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default Goals;
