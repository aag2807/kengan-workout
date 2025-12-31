export interface ExerciseTemplate {
  id: string;
  name: string;
  category: 'push' | 'pull' | 'legs' | 'core' | 'cardio' | 'bag' | 'flexibility';
  equipment: 'bodyweight' | 'dumbbells' | 'barbell' | 'machine' | 'bag' | 'none';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  description: string;
  musclesTargeted: string[];
  defaultSets?: number;
  defaultReps?: string;
  defaultRest?: number;
}

export const EXERCISE_LIBRARY: ExerciseTemplate[] = [
  // PUSH EXERCISES
  {
    id: 'push-up',
    name: 'Push-ups',
    category: 'push',
    equipment: 'bodyweight',
    difficulty: 'beginner',
    description: 'Classic upper body exercise targeting chest, shoulders, and triceps',
    musclesTargeted: ['Chest', 'Shoulders', 'Triceps', 'Core'],
    defaultSets: 3,
    defaultReps: '10-15',
    defaultRest: 60,
  },
  {
    id: 'dumbbell-press',
    name: 'Dumbbell Bench Press',
    category: 'push',
    equipment: 'dumbbells',
    difficulty: 'intermediate',
    description: 'Horizontal pressing movement for chest development',
    musclesTargeted: ['Chest', 'Shoulders', 'Triceps'],
    defaultSets: 4,
    defaultReps: '8-12',
    defaultRest: 90,
  },
  {
    id: 'overhead-press',
    name: 'Overhead Press',
    category: 'push',
    equipment: 'dumbbells',
    difficulty: 'intermediate',
    description: 'Vertical pressing for shoulder strength',
    musclesTargeted: ['Shoulders', 'Triceps', 'Upper Chest'],
    defaultSets: 4,
    defaultReps: '8-10',
    defaultRest: 90,
  },
  {
    id: 'dips',
    name: 'Dips',
    category: 'push',
    equipment: 'bodyweight',
    difficulty: 'intermediate',
    description: 'Compound pressing movement for triceps and chest',
    musclesTargeted: ['Triceps', 'Chest', 'Shoulders'],
    defaultSets: 3,
    defaultReps: '8-12',
    defaultRest: 90,
  },
  
  // PULL EXERCISES
  {
    id: 'pull-up',
    name: 'Pull-ups',
    category: 'pull',
    equipment: 'bodyweight',
    difficulty: 'intermediate',
    description: 'King of back exercises, full upper body pull',
    musclesTargeted: ['Lats', 'Biceps', 'Upper Back', 'Core'],
    defaultSets: 3,
    defaultReps: '5-10',
    defaultRest: 120,
  },
  {
    id: 'dumbbell-row',
    name: 'Dumbbell Rows',
    category: 'pull',
    equipment: 'dumbbells',
    difficulty: 'beginner',
    description: 'Horizontal pulling for back thickness',
    musclesTargeted: ['Lats', 'Upper Back', 'Biceps'],
    defaultSets: 4,
    defaultReps: '10-12',
    defaultRest: 60,
  },
  {
    id: 'bicep-curl',
    name: 'Bicep Curls',
    category: 'pull',
    equipment: 'dumbbells',
    difficulty: 'beginner',
    description: 'Isolated bicep development',
    musclesTargeted: ['Biceps', 'Forearms'],
    defaultSets: 3,
    defaultReps: '10-15',
    defaultRest: 60,
  },
  {
    id: 'inverted-row',
    name: 'Inverted Rows',
    category: 'pull',
    equipment: 'bodyweight',
    difficulty: 'beginner',
    description: 'Horizontal bodyweight pulling movement',
    musclesTargeted: ['Upper Back', 'Lats', 'Biceps'],
    defaultSets: 3,
    defaultReps: '10-15',
    defaultRest: 60,
  },

  // LEGS
  {
    id: 'squat',
    name: 'Squats',
    category: 'legs',
    equipment: 'bodyweight',
    difficulty: 'beginner',
    description: 'Fundamental lower body movement',
    musclesTargeted: ['Quads', 'Glutes', 'Hamstrings', 'Core'],
    defaultSets: 4,
    defaultReps: '12-15',
    defaultRest: 90,
  },
  {
    id: 'goblet-squat',
    name: 'Goblet Squats',
    category: 'legs',
    equipment: 'dumbbells',
    difficulty: 'beginner',
    description: 'Front-loaded squat variation',
    musclesTargeted: ['Quads', 'Glutes', 'Core'],
    defaultSets: 4,
    defaultReps: '10-12',
    defaultRest: 90,
  },
  {
    id: 'lunge',
    name: 'Lunges',
    category: 'legs',
    equipment: 'bodyweight',
    difficulty: 'beginner',
    description: 'Unilateral leg strength and stability',
    musclesTargeted: ['Quads', 'Glutes', 'Hamstrings'],
    defaultSets: 3,
    defaultReps: '10-12 each',
    defaultRest: 60,
  },
  {
    id: 'rdl',
    name: 'Romanian Deadlifts',
    category: 'legs',
    equipment: 'dumbbells',
    difficulty: 'intermediate',
    description: 'Hip hinge pattern for posterior chain',
    musclesTargeted: ['Hamstrings', 'Glutes', 'Lower Back'],
    defaultSets: 4,
    defaultReps: '8-12',
    defaultRest: 90,
  },
  {
    id: 'calf-raise',
    name: 'Calf Raises',
    category: 'legs',
    equipment: 'bodyweight',
    difficulty: 'beginner',
    description: 'Isolated calf development',
    musclesTargeted: ['Calves'],
    defaultSets: 3,
    defaultReps: '15-20',
    defaultRest: 45,
  },

  // CORE
  {
    id: 'plank',
    name: 'Plank',
    category: 'core',
    equipment: 'bodyweight',
    difficulty: 'beginner',
    description: 'Isometric core stability',
    musclesTargeted: ['Abs', 'Core', 'Lower Back'],
    defaultSets: 3,
    defaultReps: '30-60 sec',
    defaultRest: 45,
  },
  {
    id: 'crunch',
    name: 'Crunches',
    category: 'core',
    equipment: 'bodyweight',
    difficulty: 'beginner',
    description: 'Upper ab flexion',
    musclesTargeted: ['Abs'],
    defaultSets: 3,
    defaultReps: '15-20',
    defaultRest: 45,
  },
  {
    id: 'leg-raise',
    name: 'Leg Raises',
    category: 'core',
    equipment: 'bodyweight',
    difficulty: 'intermediate',
    description: 'Lower ab strength',
    musclesTargeted: ['Lower Abs', 'Hip Flexors'],
    defaultSets: 3,
    defaultReps: '10-15',
    defaultRest: 60,
  },
  {
    id: 'russian-twist',
    name: 'Russian Twists',
    category: 'core',
    equipment: 'bodyweight',
    difficulty: 'beginner',
    description: 'Rotational core strength',
    musclesTargeted: ['Obliques', 'Abs'],
    defaultSets: 3,
    defaultReps: '20-30',
    defaultRest: 45,
  },
  {
    id: 'mountain-climber',
    name: 'Mountain Climbers',
    category: 'core',
    equipment: 'bodyweight',
    difficulty: 'intermediate',
    description: 'Dynamic core and cardio exercise',
    musclesTargeted: ['Core', 'Hip Flexors', 'Shoulders'],
    defaultSets: 3,
    defaultReps: '20-30',
    defaultRest: 60,
  },

  // CARDIO
  {
    id: 'jumping-jack',
    name: 'Jumping Jacks',
    category: 'cardio',
    equipment: 'bodyweight',
    difficulty: 'beginner',
    description: 'Full body cardio warm-up',
    musclesTargeted: ['Full Body', 'Cardiovascular'],
    defaultSets: 3,
    defaultReps: '30-60 sec',
    defaultRest: 30,
  },
  {
    id: 'burpee',
    name: 'Burpees',
    category: 'cardio',
    equipment: 'bodyweight',
    difficulty: 'intermediate',
    description: 'Full body explosive cardio',
    musclesTargeted: ['Full Body', 'Cardiovascular'],
    defaultSets: 3,
    defaultReps: '10-15',
    defaultRest: 60,
  },
  {
    id: 'high-knee',
    name: 'High Knees',
    category: 'cardio',
    equipment: 'bodyweight',
    difficulty: 'beginner',
    description: 'Running in place with high knee drive',
    musclesTargeted: ['Hip Flexors', 'Cardiovascular'],
    defaultSets: 3,
    defaultReps: '30-45 sec',
    defaultRest: 45,
  },

  // BAG WORK
  {
    id: 'jab-cross',
    name: 'Jab-Cross Combo',
    category: 'bag',
    equipment: 'bag',
    difficulty: 'beginner',
    description: 'Basic 1-2 punch combination',
    musclesTargeted: ['Shoulders', 'Core', 'Cardiovascular'],
    defaultSets: 3,
    defaultReps: '3 min rounds',
    defaultRest: 60,
  },
  {
    id: 'hook-uppercut',
    name: 'Hook-Uppercut Combo',
    category: 'bag',
    equipment: 'bag',
    difficulty: 'intermediate',
    description: 'Power punches from close range',
    musclesTargeted: ['Core', 'Shoulders', 'Back'],
    defaultSets: 3,
    defaultReps: '3 min rounds',
    defaultRest: 60,
  },

  // FLEXIBILITY
  {
    id: 'hamstring-stretch',
    name: 'Hamstring Stretch',
    category: 'flexibility',
    equipment: 'none',
    difficulty: 'beginner',
    description: 'Static hamstring flexibility',
    musclesTargeted: ['Hamstrings', 'Lower Back'],
    defaultSets: 2,
    defaultReps: '30-60 sec',
    defaultRest: 0,
  },
  {
    id: 'quad-stretch',
    name: 'Quad Stretch',
    category: 'flexibility',
    equipment: 'none',
    difficulty: 'beginner',
    description: 'Standing quad stretch',
    musclesTargeted: ['Quads', 'Hip Flexors'],
    defaultSets: 2,
    defaultReps: '30-60 sec each',
    defaultRest: 0,
  },
];

// Helper functions
export function getExercisesByCategory(category: ExerciseTemplate['category']): ExerciseTemplate[] {
  return EXERCISE_LIBRARY.filter(ex => ex.category === category);
}

export function getExercisesByEquipment(equipment: ExerciseTemplate['equipment']): ExerciseTemplate[] {
  return EXERCISE_LIBRARY.filter(ex => ex.equipment === equipment);
}

export function searchExercises(query: string): ExerciseTemplate[] {
  const lowerQuery = query.toLowerCase();
  return EXERCISE_LIBRARY.filter(
    ex =>
      ex.name.toLowerCase().includes(lowerQuery) ||
      ex.description.toLowerCase().includes(lowerQuery) ||
      ex.musclesTargeted.some(muscle => muscle.toLowerCase().includes(lowerQuery))
  );
}

export function getExerciseById(id: string): ExerciseTemplate | undefined {
  return EXERCISE_LIBRARY.find(ex => ex.id === id);
}
