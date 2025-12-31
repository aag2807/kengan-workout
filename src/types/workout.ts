export interface Exercise {
  name: string;
  sets: string;
  reps: string;
  notes: string;
}

export interface Workout {
  id: string;
  day: number;
  name: string;
  type: 'home' | 'gym' | 'bag';
  exercises: Exercise[];
  isCustom?: boolean;
  createdAt?: string;
}

export interface TrainingProgram {
  name: string;
  description: string;
  workouts: Workout[];
}

export interface ProgramStats {
  currentWeight: string;
  currentHeight: string;
  targetWeight: string;
  targetBodyFat: string;
  timeline: string;
  trainingDays: string;
}

export interface CompletedSet {
  reps: number;
  weight: number;
  completed: boolean;
}

export interface ExerciseProgress {
  exerciseName: string;
  targetSets: string;
  targetReps: string;
  notes: string;
  completedSets: CompletedSet[];
}

export interface WorkoutSession {
  id: string;
  workoutId: string;
  workoutName: string;
  workoutType: 'home' | 'gym' | 'bag';
  date: string;
  startTime: string;
  endTime?: string;
  exercises: ExerciseProgress[];
  sessionNotes?: string;
}
