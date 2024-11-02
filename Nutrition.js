import React, { useState } from 'react';
import { TextField, Button, Box, MenuItem, Typography, Slide } from '@mui/material';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';

// Register the necessary components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

function Nutrition() {
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [activityLevel, setActivityLevel] = useState('');
  const [calories, setCalories] = useState(null);
  const [goals, setGoals] = useState({ maintenance: null, loss: null, bulking: null });
  const [protein, setProtein] = useState(null);
  const [carbs, setCarbs] = useState(null);
  const [fats, setFats] = useState(null);
  const [water, setWater] = useState(null);
  const [showAdvice, setShowAdvice] = useState(false);

  const calculateCalories = () => {
    const weightInKg = weight * 0.453592;
    let bmr;

    if (gender === 'male') {
      bmr = 88.362 + (13.397 * weightInKg) + (4.799 * (height * 2.54)) - (5.677 * age);
    } else if (gender === 'female') {
      bmr = 447.593 + (9.247 * weightInKg) + (3.098 * (height * 2.54)) - (4.330 * age);
    }

    const activityMultiplier = {
      sedentary: 1.2,
      lightly_active: 1.375,
      moderately_active: 1.55,
      very_active: 1.725,
      extra_active: 1.9,
    };

    const maintenanceCalories = bmr * activityMultiplier[activityLevel];
    const lossCalories = maintenanceCalories - 500;
    const bulkingCalories = maintenanceCalories + 500;

    setCalories(maintenanceCalories);
    setGoals({
      maintenance: maintenanceCalories,
      loss: lossCalories,
      bulking: bulkingCalories,
    });

    const proteinMultiplier = {
      sedentary: 0.8,
      lightly_active: 1.0,
      moderately_active: 1.2,
      very_active: 1.4,
      extra_active: 1.6,
    };
    const proteinIntake = weightInKg * proteinMultiplier[activityLevel];
    setProtein(proteinIntake);

    const carbsIntake = (maintenanceCalories * 0.5) / 4;
    const fatsIntake = (maintenanceCalories * 0.25) / 9;
    setCarbs(carbsIntake);
    setFats(fatsIntake);

    const waterIntake = weightInKg * 35 / 1000;
    setWater(waterIntake);

    setShowAdvice(true);
  };

  const barData = {
    labels: ['Maintenance', 'Weight Loss', 'Bulking'],
    datasets: [
      {
        label: 'Calories',
        data: [goals.maintenance, goals.loss, goals.bulking],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(75, 192, 192, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(75, 192, 192, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const pieData = {
    labels: ['Protein (g)', 'Carbohydrates (g)', 'Fats (g)', 'Water (L)'],
    datasets: [
      {
        data: [protein, carbs, fats, water],
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
        ],
      },
    ],
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>Calorie Calculator</Typography>
      <Box sx={{ display: 'flex', gap: 4 }}>
        <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 400 }}>
          <TextField label="Age" type="number" value={age} onChange={(e) => setAge(e.target.value)} />
          <TextField
            select
            label="Gender"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
          >
            <MenuItem value="male">Male</MenuItem>
            <MenuItem value="female">Female</MenuItem>
          </TextField>
          <TextField label="Height (inches)" type="number" value={height} onChange={(e) => setHeight(e.target.value)} />
          <TextField label="Weight (lbs)" type="number" value={weight} onChange={(e) => setWeight(e.target.value)} />
          <TextField
            select
            label="Activity Level"
            value={activityLevel}
            onChange={(e) => setActivityLevel(e.target.value)}
          >
            <MenuItem value="sedentary">Sedentary</MenuItem>
            <MenuItem value="lightly_active">Lightly Active</MenuItem>
            <MenuItem value="moderately_active">Moderately Active</MenuItem>
            <MenuItem value="very_active">Very Active</MenuItem>
            <MenuItem value="extra_active">Extra Active</MenuItem>
          </TextField>
          <Button
            variant="contained"
            onClick={calculateCalories}
            sx={{
              backgroundColor: 'black',
              color: 'red',
              '&:hover': {
                backgroundColor: 'darkgray',
              },
            }}
          >
            Calculate
          </Button>
        </Box>

        {calories && (
          <Box sx={{ display: 'flex', gap: 4 }}>
            <Box sx={{ width: 300, height: 300 }}>
              <Bar data={barData} options={{ maintainAspectRatio: false }} />
            </Box>
            <Box sx={{ width: 200, height: 200 }}>
              <Pie data={pieData} />
            </Box>
          </Box>
        )}
      </Box>

      {calories && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6">Recommended Calorie Intake:</Typography>
          <Typography>Maintenance: {Math.round(goals.maintenance)} kcal/day</Typography>
          <Typography>Weight Loss: {Math.round(goals.loss)} kcal/day</Typography>
          <Typography>Bulking: {Math.round(goals.bulking)} kcal/day</Typography>
          <Typography>Protein: {Math.round(protein)} grams/day</Typography>
          <Typography>Carbohydrates: {Math.round(carbs)} grams/day</Typography>
          <Typography>Fats: {Math.round(fats)} grams/day</Typography>
          <Typography>Water: {Math.round(water * 100) / 100} liters/day</Typography>
        </Box>
      )}

      <Slide direction="left" in={showAdvice} mountOnEnter unmountOnExit timeout={1000}>
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>Protein Options</Typography>
          <Typography variant="h6">For Vegetarians:</Typography>
          <Typography>- Tofu & Tempeh: High in protein and versatile for various dishes.</Typography>
          <Typography>- Lentils: A great source of protein and fiber, ideal for soups and salads.</Typography>
          <Typography>- Greek Yogurt: Provides concentrated protein, if dairy is acceptable.</Typography>
          <Typography variant="h6" sx={{ mt: 2 }}>For Non-Vegetarians:</Typography>
          <Typography>- Chicken Breast: A lean, high-protein option that’s easy to prepare.</Typography>
          <Typography>- Salmon: Offers both protein and omega-3 fatty acids.</Typography>
          <Typography>- Eggs: Versatile, affordable, and nutrient-dense.</Typography>
          <Typography variant="h6" sx={{ mt: 2 }}>For Those Avoiding Dairy and Eggs:</Typography>
          <Typography>- Lentils & Beans: Consistently high in protein and fiber, great in a variety of dishes.</Typography>
          <Typography>- Plant-Based Protein Powders: Convenient and effective for protein supplementation.</Typography>
          <Typography>- Nuts & Seeds (like almonds, hemp, and pumpkin seeds): Provide protein, healthy fats, and nutrients.</Typography>
        </Box>
      </Slide>
    </div>
  );
}

export default Nutrition;

