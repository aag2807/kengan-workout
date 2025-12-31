import type { TrainingProgram, ProgramStats } from '../types/workout';

export const programStats: ProgramStats = {
  currentWeight: '95kg',
  currentHeight: '1.74m',
  targetWeight: '78-80kg',
  targetBodyFat: '8-10%',
  timeline: '6-9 months',
  trainingDays: '4 days per week + 1 optional conditioning day'
};

export const cosmoProgram: TrainingProgram = {
  name: 'Complete Cosmo Training Program',
  description: 'Home Calisthenics • Gym Equipment Alternatives • Heavy Bag Conditioning',
  workouts: [
    {
      id: 'home-day1',
      day: 1,
      name: 'Upper Pull (Home)',
      type: 'home',
      exercises: [
        {
          name: 'Pull-ups',
          sets: '4',
          reps: '6-12',
          notes: 'Add weight when you hit 12 reps'
        },
        {
          name: 'Band Rows',
          sets: '3',
          reps: '15',
          notes: 'Squeeze shoulder blades together'
        },
        {
          name: 'Negative Pull-ups',
          sets: '2',
          reps: '3',
          notes: 'Slow 5-second descent'
        },
        {
          name: 'Band Pull-aparts',
          sets: '3',
          reps: '20',
          notes: 'Focus on rear delts'
        },
        {
          name: 'Plank',
          sets: '3',
          reps: '45sec',
          notes: "Keep core tight, don't sag"
        }
      ]
    },
    {
      id: 'home-day2',
      day: 2,
      name: 'Lower Push (Home)',
      type: 'home',
      exercises: [
        {
          name: 'Pistol Squat Progression',
          sets: '4',
          reps: '6-10 each',
          notes: 'Use assistance if needed'
        },
        {
          name: 'Bulgarian Split Squats',
          sets: '3',
          reps: '12-15 each',
          notes: 'Rear foot elevated'
        },
        {
          name: 'Jump Squats',
          sets: '3',
          reps: '10',
          notes: 'Explosive power'
        },
        {
          name: 'Calf Raises',
          sets: '4',
          reps: '15-20',
          notes: 'Full range of motion'
        },
        {
          name: 'Hanging L-sit',
          sets: '3',
          reps: '20-30sec',
          notes: 'Keep legs straight if possible'
        }
      ]
    },
    {
      id: 'home-day4',
      day: 4,
      name: 'Upper Push (Home)',
      type: 'home',
      exercises: [
        {
          name: 'Pike Push-ups',
          sets: '4',
          reps: '8-12',
          notes: 'Progress toward handstand push-ups'
        },
        {
          name: 'Push-ups (on bars)',
          sets: '3',
          reps: '15-20',
          notes: 'Add weight or elevate feet'
        },
        {
          name: 'Dips (or bench dips)',
          sets: '3',
          reps: '8-12',
          notes: 'Lean forward for chest focus'
        },
        {
          name: 'Diamond Push-ups',
          sets: '3',
          reps: '10-15',
          notes: 'Elbows close to body'
        },
        {
          name: 'Band Lateral Raises',
          sets: '3',
          reps: '12-15',
          notes: 'Slow and controlled'
        },
        {
          name: 'Plank Shoulder Taps',
          sets: '3',
          reps: '20 each',
          notes: 'Minimal hip rotation'
        }
      ]
    },
    {
      id: 'home-day5',
      day: 5,
      name: 'Lower Pull + Core (Home)',
      type: 'home',
      exercises: [
        {
          name: 'Nordic Curl Negatives',
          sets: '4',
          reps: '5-8',
          notes: 'Control the descent - critical'
        },
        {
          name: 'Single Leg RDL',
          sets: '3',
          reps: '12 each',
          notes: 'Feel the hamstring stretch'
        },
        {
          name: 'Glute Bridges',
          sets: '3',
          reps: '15-20',
          notes: 'Squeeze at top for 2 seconds'
        },
        {
          name: "Wrestler's Bridge",
          sets: '3',
          reps: '45sec',
          notes: 'Neck strength & conditioning'
        },
        {
          name: 'Hollow Body Rocks',
          sets: '3',
          reps: '20',
          notes: 'Keep lower back pressed down'
        },
        {
          name: 'Dead Bugs',
          sets: '3',
          reps: '15 each',
          notes: 'Slow and controlled'
        }
      ]
    },
    {
      id: 'gym-day1',
      day: 1,
      name: 'Upper Pull (Gym)',
      type: 'gym',
      exercises: [
        {
          name: 'Lat Pulldowns',
          sets: '4',
          reps: '6-12',
          notes: 'Add weight progressively'
        },
        {
          name: 'Seated Cable Rows',
          sets: '3',
          reps: '12-15',
          notes: 'Squeeze shoulder blades'
        },
        {
          name: 'Single Arm DB Rows',
          sets: '3',
          reps: '10-12 each',
          notes: 'Control the weight'
        },
        {
          name: 'Face Pulls (low cable)',
          sets: '3',
          reps: '15-20',
          notes: 'Target rear delts'
        },
        {
          name: 'DB Bicep Curls',
          sets: '3',
          reps: '10-12',
          notes: 'Strict form, no swinging'
        },
        {
          name: 'Plank',
          sets: '3',
          reps: '45-60sec',
          notes: 'Keep core tight'
        }
      ]
    },
    {
      id: 'gym-day2',
      day: 2,
      name: 'Lower Push (Gym)',
      type: 'gym',
      exercises: [
        {
          name: 'Goblet Squats (DB)',
          sets: '4',
          reps: '10-15',
          notes: 'Hold dumbbell at chest'
        },
        {
          name: 'Bulgarian Split Squats',
          sets: '3',
          reps: '12-15 each',
          notes: 'Hold dumbbells for resistance'
        },
        {
          name: 'Smith Machine Squats',
          sets: '3',
          reps: '8-12',
          notes: 'Optional - learn the movement'
        },
        {
          name: 'DB Calf Raises',
          sets: '4',
          reps: '15-20',
          notes: 'Full range of motion'
        },
        {
          name: 'Hanging Knee Raises',
          sets: '3',
          reps: '12-15',
          notes: 'Or use ab crunch machine'
        }
      ]
    },
    {
      id: 'gym-day4',
      day: 4,
      name: 'Upper Push (Gym)',
      type: 'gym',
      exercises: [
        {
          name: 'DB Shoulder Press',
          sets: '4',
          reps: '8-12',
          notes: 'Standing or seated'
        },
        {
          name: 'DB Floor Press',
          sets: '3',
          reps: '10-15',
          notes: 'Lie on floor, press dumbbells up'
        },
        {
          name: 'Smith Incline Press',
          sets: '3',
          reps: '8-12',
          notes: 'Set bench to 30-45 degrees'
        },
        {
          name: 'DB Lateral Raises',
          sets: '3',
          reps: '12-15',
          notes: 'Light weight, strict form'
        },
        {
          name: 'Dips or Diamond Push-ups',
          sets: '3',
          reps: '10-15',
          notes: 'Find parallel bars if available'
        },
        {
          name: 'Plank Shoulder Taps',
          sets: '3',
          reps: '20 each',
          notes: 'Minimal hip rotation'
        }
      ]
    },
    {
      id: 'gym-day5',
      day: 5,
      name: 'Lower Pull + Core (Gym)',
      type: 'gym',
      exercises: [
        {
          name: 'Romanian Deadlifts (DB)',
          sets: '4',
          reps: '10-12',
          notes: 'Feel the hamstring stretch'
        },
        {
          name: 'Single Leg RDL (DB)',
          sets: '3',
          reps: '12 each',
          notes: 'Balance and hamstring work'
        },
        {
          name: 'Weighted Glute Bridges',
          sets: '3',
          reps: '15-20',
          notes: 'Place dumbbell on hips'
        },
        {
          name: "Wrestler's Bridge",
          sets: '3',
          reps: '45sec',
          notes: 'Neck strength'
        },
        {
          name: 'Hollow Body Rocks',
          sets: '3',
          reps: '20',
          notes: 'Lower back pressed down'
        },
        {
          name: 'Dead Bugs',
          sets: '3',
          reps: '15 each',
          notes: 'Slow and controlled'
        }
      ]
    },
    {
      id: 'bag-conditioning',
      day: 6,
      name: 'Heavy Bag Conditioning',
      type: 'bag',
      exercises: [
        {
          name: 'Warm-up Combinations',
          sets: '1',
          reps: '3 min',
          notes: 'Jab-Cross-Hook / 1-2-3 / Light intensity, get timing'
        },
        {
          name: 'Speed Work',
          sets: '1',
          reps: '3 min',
          notes: 'Fast jabs, double jabs, focus on hand speed / High volume'
        },
        {
          name: 'Power Striking',
          sets: '1',
          reps: '3 min',
          notes: 'Hard crosses, hooks, overhands / Full power, good form'
        },
        {
          name: 'Kick Combinations',
          sets: '1',
          reps: '3 min',
          notes: 'Low kicks, body kicks, head kicks / Mix with punches'
        },
        {
          name: 'Knees + Clinch',
          sets: '1',
          reps: '3 min',
          notes: 'Clinch position, knee strikes / Muay Thai style'
        },
        {
          name: 'MMA Combinations',
          sets: '1',
          reps: '3 min',
          notes: 'Mix punches, elbows, knees / Realistic combos'
        },
        {
          name: 'Conditioning Round',
          sets: '1',
          reps: '3 min',
          notes: "Non-stop movement / High volume, don't stop"
        },
        {
          name: 'Finishing Round',
          sets: '1',
          reps: '3 min',
          notes: 'Everything - punch, kick, knee / Go hard, finish strong'
        }
      ]
    }
  ]
};
