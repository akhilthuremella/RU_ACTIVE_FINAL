// ruactiveclient/src/pages/Workouts.js
import React, { useState } from 'react';
import { Button, Box, Typography, IconButton } from '@mui/material';
import { ArrowBack, ArrowForward } from '@mui/icons-material';

function Workouts() {
  const [muscleGroup, setMuscleGroup] = useState(null); // No default muscle group
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const exercises = {
    biceps: [
      "Barbell Curl: Great for building mass and strength.",
      "Dumbbell Hammer Curl: Targets the brachialis for bicep thickness.",
      "Preacher Curl: Emphasizes isolation, preventing momentum and focusing on the bicep."
    ],
    triceps: [
      "Skull Crushers (Lying Tricep Extensions): Effective for overall tricep development.",
      "Tricep Dips: Great for adding mass to the triceps, especially if weighted.",
      "Overhead Tricep Extension: Hits the long head of the tricep, contributing to the shape."
    ],
    shoulders: [
      "Overhead Press (Barbell or Dumbbell): Fundamental for building shoulder strength and size.",
      "Lateral Raises: Isolates the lateral deltoid, adding width to the shoulders.",
      "Face Pulls: Works the rear delts and supports shoulder stability."
    ],
    chest: [
      "Bench Press (Barbell or Dumbbell): A compound lift that builds overall chest mass and strength.",
      "Incline Dumbbell Press: Targets the upper chest for balanced development.",
      "Chest Fly (Cable or Dumbbell): Great for chest isolation and stretch."
    ],
    back: [
      "Pull-Ups: Excellent for building width and strength in the upper back and lats.",
      "Bent Over Rows (Barbell or Dumbbell): Targets the middle and upper back, enhancing thickness.",
      "Deadlifts: Engages the entire back and core, providing strength and foundational stability."
    ],
    legs: [
      "Squats (Barbell): A compound lift for overall leg development, targeting the quads, glutes, and hamstrings.",
      "Deadlifts: Builds hamstring, glute, and lower back strength while engaging the entire posterior chain.",
      "Leg Press: Allows for a heavy load, focusing on quad and glute strength."
    ]
  };

  const images = {
    biceps: [
      'barberlcurl.png',
      'dumbellhammer.png',
      'preachercurl.png'
    ],
    triceps: [
      'skullcrusher.webp',
      'tricepdips.avif',
      'overheadextenstion.webp'
    ],
    shoulders: [
      'overheadpress.webp',
      'lateralraise.webp',
      'facepulls.webp'
    ],
    chest: [
      'benchpress.jpg',
      'inclinepress.webp',
      'chestfly.jpg'
    ],
    back: [
      'pullups.webp',
      'bentoverrows.webp',
      'deadlifts.jpeg'
    ],
    legs: [
      'squats.webp',
      'deadlifts.jpeg',
      'legpress.jpg'
    ]
  };

  const handleButtonClick = (group) => {
    setMuscleGroup(group);
    setCurrentImageIndex(0); // Reset to first image
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? images[muscleGroup].length - 1 : prevIndex - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === images[muscleGroup].length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom align="center">
        Explore effective workouts for each muscle group!
      </Typography>
      <Typography variant="h4" gutterBottom>Workouts</Typography>
      <Box sx={{ display: 'flex', gap: 3, mb: 4, justifyContent: 'center' }}>
        <Button variant="contained" color="error" onClick={() => handleButtonClick('biceps')} sx={{ px: 4, py: 2 }}>
          Biceps
        </Button>
        <Button variant="contained" color="error" onClick={() => handleButtonClick('triceps')} sx={{ px: 4, py: 2 }}>
          Triceps
        </Button>
        <Button variant="contained" color="error" onClick={() => handleButtonClick('shoulders')} sx={{ px: 4, py: 2 }}>
          Shoulders
        </Button>
        <Button variant="contained" color="error" onClick={() => handleButtonClick('chest')} sx={{ px: 4, py: 2 }}>
          Chest
        </Button>
        <Button variant="contained" color="error" onClick={() => handleButtonClick('back')} sx={{ px: 4, py: 2 }}>
          Back
        </Button>
        <Button variant="contained" color="error" onClick={() => handleButtonClick('legs')} sx={{ px: 4, py: 2 }}>
          Legs
        </Button>
      </Box>
      {muscleGroup && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>Exercises for {muscleGroup.charAt(0).toUpperCase() + muscleGroup.slice(1)}</Typography>
          <ul>
            {exercises[muscleGroup].map((exercise, index) => (
              <li key={index}>{exercise}</li>
            ))}
          </ul>
          {(muscleGroup === 'biceps' || muscleGroup === 'triceps' || muscleGroup === 'shoulders' || muscleGroup === 'chest' || muscleGroup === 'back' || muscleGroup === 'legs') && (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 4 }}>
              <IconButton onClick={handlePrevImage}>
                <ArrowBack />
              </IconButton>
              <img
                src={images[muscleGroup][currentImageIndex]}
                alt={`${muscleGroup} exercise ${currentImageIndex + 1}`}
                style={{ width: '30vw', height: 'auto' }}
              />
              <IconButton onClick={handleNextImage}>
                <ArrowForward />
              </IconButton>
            </Box>
          )}
        </Box>
      )}
    </div>
  );
}

export default Workouts;