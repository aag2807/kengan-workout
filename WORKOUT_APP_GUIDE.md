# Cosmo Training Program - Workout App

This React app displays the Complete Cosmo Training Program with all workouts pre-loaded.

## What's Included

The app now contains:

1. **All Home Calisthenics Workouts** (Days 1, 2, 4, 5)
   - Upper Pull, Lower Push, Upper Push, Lower Pull + Core
   - Equipment: Pull-up bar, push-up bars, resistance bands

2. **All Gym Equipment Workouts** (Days 1, 2, 4, 5)
   - Upper Pull, Lower Push, Upper Push, Lower Pull + Core
   - Equipment: Multi-station, Smith machine, dumbbells

3. **Heavy Bag Conditioning Workout** (Day 6 - Optional)
   - 8-round protocol with technical focus
   - Warm-up combinations, speed work, power striking, kicks, knees, MMA combos

4. **Program Stats Overview**
   - Current weight/height: 95kg / 1.74m
   - Target: 78-80kg at 8-10% body fat
   - Timeline: 6-9 months
   - Training schedule: 4 days/week + optional conditioning

## Features

- **Filter Workouts** by type: All, Home, Gym, or Heavy Bag
- **Color-coded workout cards**:
  - Green = Home Calisthenics
  - Blue = Gym Equipment
  - Orange = Heavy Bag
- **Exercise details** showing sets, reps, and coaching notes
- **Critical reminders** footer with nutrition and training guidelines

## Running the App

```bash
npm install
npm run dev
```

Then open http://localhost:5174 in your browser.

## File Structure

```
src/
├── types/
│   └── workout.ts              # TypeScript interfaces
├── data/
│   └── cosmoProgram.ts         # All workout data from the PDF
├── components/
│   ├── WorkoutCard.tsx         # Individual workout display
│   └── ProgramStats.tsx        # Program overview stats
└── App.tsx                     # Main app with filtering
```

## Next Steps (Optional Enhancements)

- Add workout logging/tracking functionality
- Add progress tracking with weight/measurements
- Add timer for heavy bag rounds (3min work / 1min rest)
- Save completed workouts to localStorage
- Add weekly calendar view
- Add progression tracking (weights, reps, etc.)

## Training Philosophy from the PDF

- Nutrition is 80% of results (170g protein, 2000-2100 calories daily)
- Track every workout
- Progressive overload when hitting top rep ranges
- Rest 90-120s between strength sets
- Sleep 7-8 hours, drink 3-4L water daily
- Weekly Monday weigh-ins
