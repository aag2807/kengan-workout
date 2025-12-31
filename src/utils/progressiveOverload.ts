import type { WorkoutSession } from '../types/workout';

export interface ExerciseHistory {
  exerciseName: string;
  sessions: SessionData[];
  averageWeight: number;
  averageReps: number;
  trend: 'increasing' | 'stable' | 'decreasing';
  recommendation?: OverloadRecommendation;
}

export interface SessionData {
  date: string;
  sessionId: string;
  sets: {
    reps: number;
    weight: number;
    completed: boolean;
  }[];
  maxWeight: number;
  maxReps: number;
  averageReps: number;
}

export interface OverloadRecommendation {
  type: 'increase_weight' | 'increase_reps' | 'maintain';
  message: string;
  suggestedWeight?: number;
  suggestedReps?: number;
  confidence: 'high' | 'medium' | 'low';
  reason: string;
}

/**
 * Analyze workout history for a specific exercise
 */
export function analyzeExerciseProgression(
  exerciseName: string,
  sessions: WorkoutSession[],
  targetRepsRange: { min: number; max: number } = { min: 8, max: 12 }
): ExerciseHistory | null {
  // Filter sessions that contain this exercise
  const relevantSessions = sessions
    .filter((session) =>
      session.exercises.some((ex) => ex.exerciseName === exerciseName)
    )
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  if (relevantSessions.length === 0) return null;

  // Extract exercise data from each session
  const sessionData: SessionData[] = relevantSessions.map((session) => {
    const exercise = session.exercises.find((ex) => ex.exerciseName === exerciseName)!;
    const completedSets = exercise.completedSets.filter((set) => set.completed);

    const maxWeight = Math.max(...completedSets.map((s) => s.weight), 0);
    const maxReps = Math.max(...completedSets.map((s) => s.reps), 0);
    const averageReps =
      completedSets.length > 0
        ? completedSets.reduce((sum, s) => sum + s.reps, 0) / completedSets.length
        : 0;

    return {
      date: session.date,
      sessionId: session.id,
      sets: completedSets,
      maxWeight,
      maxReps,
      averageReps,
    };
  });

  // Calculate overall averages
  const totalSets = sessionData.reduce((sum, s) => sum + s.sets.length, 0);
  const averageWeight =
    totalSets > 0
      ? sessionData.reduce((sum, s) => sum + s.sets.reduce((s2, set) => s2 + set.weight, 0), 0) /
        totalSets
      : 0;
  const averageReps =
    totalSets > 0
      ? sessionData.reduce((sum, s) => sum + s.sets.reduce((s2, set) => s2 + set.reps, 0), 0) /
        totalSets
      : 0;

  // Determine trend (comparing first half vs second half of sessions)
  const trend = calculateTrend(sessionData);

  // Generate recommendation based on recent sessions
  const recommendation = generateRecommendation(sessionData, targetRepsRange);

  return {
    exerciseName,
    sessions: sessionData,
    averageWeight,
    averageReps,
    trend,
    recommendation,
  };
}

/**
 * Calculate trend by comparing recent sessions to older ones
 */
function calculateTrend(sessions: SessionData[]): 'increasing' | 'stable' | 'decreasing' {
  if (sessions.length < 2) return 'stable';

  const midPoint = Math.floor(sessions.length / 2);
  const olderSessions = sessions.slice(0, midPoint);
  const recentSessions = sessions.slice(midPoint);

  const olderAvgWeight =
    olderSessions.reduce((sum, s) => sum + s.maxWeight, 0) / olderSessions.length;
  const recentAvgWeight =
    recentSessions.reduce((sum, s) => sum + s.maxWeight, 0) / recentSessions.length;

  const difference = recentAvgWeight - olderAvgWeight;
  const threshold = olderAvgWeight * 0.05; // 5% threshold

  if (difference > threshold) return 'increasing';
  if (difference < -threshold) return 'decreasing';
  return 'stable';
}

/**
 * Generate progressive overload recommendation
 */
function generateRecommendation(
  sessions: SessionData[],
  targetRepsRange: { min: number; max: number }
): OverloadRecommendation | undefined {
  if (sessions.length < 2) return undefined;

  // Look at last 3 sessions
  const recentSessions = sessions.slice(-3);
  
  // Check if consistently hitting top of rep range
  const hittingTopReps = recentSessions.every((session) => {
    const topSets = session.sets.filter((set) => set.reps >= targetRepsRange.max);
    return topSets.length >= Math.ceil(session.sets.length / 2); // At least half the sets
  });

  // Check if struggling with reps
  const strugglingWithReps = recentSessions.every((session) => {
    const lowSets = session.sets.filter((set) => set.reps < targetRepsRange.min);
    return lowSets.length >= Math.ceil(session.sets.length / 2);
  });

  const currentWeight = recentSessions[recentSessions.length - 1].maxWeight;

  // INCREASE WEIGHT: Consistently hitting top rep range
  if (hittingTopReps && currentWeight > 0) {
    const increment = currentWeight < 20 ? 2.5 : currentWeight < 50 ? 5 : 10;
    const suggestedWeight = currentWeight + increment;

    return {
      type: 'increase_weight',
      message: `Time to level up! You're crushing ${targetRepsRange.max}+ reps consistently.`,
      suggestedWeight,
      suggestedReps: targetRepsRange.min,
      confidence: 'high',
      reason: `Last 3 sessions show consistent top rep performance`,
    };
  }

  // MAINTAIN: In the sweet spot
  if (!strugglingWithReps && !hittingTopReps) {
    return {
      type: 'maintain',
      message: `Keep it up! You're in the optimal range.`,
      confidence: 'high',
      reason: `Performance is stable within target range`,
    };
  }

  // INCREASE REPS: Struggling but improving
  if (strugglingWithReps) {
    return {
      type: 'increase_reps',
      message: `Focus on hitting ${targetRepsRange.min}+ reps before adding weight.`,
      suggestedReps: targetRepsRange.min,
      confidence: 'medium',
      reason: `Recent sessions show lower rep counts`,
    };
  }

  return undefined;
}

/**
 * Get all exercises with overload recommendations
 */
export function getAllOverloadRecommendations(
  sessions: WorkoutSession[]
): Map<string, ExerciseHistory> {
  const exerciseMap = new Map<string, ExerciseHistory>();

  // Get unique exercise names
  const exerciseNames = new Set<string>();
  sessions.forEach((session) => {
    session.exercises.forEach((ex) => {
      exerciseNames.add(ex.exerciseName);
    });
  });

  // Analyze each exercise
  exerciseNames.forEach((name) => {
    const history = analyzeExerciseProgression(name, sessions);
    if (history && history.recommendation) {
      exerciseMap.set(name, history);
    }
  });

  return exerciseMap;
}

/**
 * Get overload info for specific exercise during workout
 */
export function getWorkoutOverloadInfo(
  exerciseName: string,
  sessions: WorkoutSession[]
): {
  lastThreeSessions: SessionData[];
  recommendation?: OverloadRecommendation;
} | null {
  const history = analyzeExerciseProgression(exerciseName, sessions);
  
  if (!history) return null;

  return {
    lastThreeSessions: history.sessions.slice(-3),
    recommendation: history.recommendation,
  };
}
