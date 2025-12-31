import type { WorkoutSession } from '../types/workout';

export interface PersonalRecord {
  exerciseName: string;
  maxWeight: number;
  maxWeightReps: number;
  maxWeightDate: string;
  maxWeightSessionId: string;
  maxReps: number;
  maxRepsWeight: number;
  maxRepsDate: string;
  maxRepsSessionId: string;
  totalSets: number;
  totalSessions: number;
  lastPerformed: string;
}

export interface PRUpdate {
  exerciseName: string;
  type: 'weight' | 'reps' | 'both';
  previousWeight?: number;
  newWeight?: number;
  previousReps?: number;
  newReps?: number;
}

export function calculatePersonalRecords(sessions: WorkoutSession[]): Map<string, PersonalRecord> {
  const records = new Map<string, PersonalRecord>();

  sessions.forEach((session) => {
    session.exercises.forEach((exercise) => {
      const exerciseName = exercise.exerciseName;
      const currentRecord = records.get(exerciseName);

      exercise.completedSets.forEach((set) => {
        if (!set.completed || set.weight === 0) return;

        if (!currentRecord) {
          // First record for this exercise
          records.set(exerciseName, {
            exerciseName,
            maxWeight: set.weight,
            maxWeightReps: set.reps,
            maxWeightDate: session.date,
            maxWeightSessionId: session.id,
            maxReps: set.reps,
            maxRepsWeight: set.weight,
            maxRepsDate: session.date,
            maxRepsSessionId: session.id,
            totalSets: 1,
            totalSessions: 1,
            lastPerformed: session.date,
          });
        } else {
          // Update existing record
          let updated = false;

          // Check for max weight PR
          if (set.weight > currentRecord.maxWeight) {
            currentRecord.maxWeight = set.weight;
            currentRecord.maxWeightReps = set.reps;
            currentRecord.maxWeightDate = session.date;
            currentRecord.maxWeightSessionId = session.id;
            updated = true;
          }

          // Check for max reps PR (at same or higher weight)
          if (
            set.reps > currentRecord.maxReps ||
            (set.reps === currentRecord.maxReps && set.weight > currentRecord.maxRepsWeight)
          ) {
            currentRecord.maxReps = set.reps;
            currentRecord.maxRepsWeight = set.weight;
            currentRecord.maxRepsDate = session.date;
            currentRecord.maxRepsSessionId = session.id;
            updated = true;
          }

          currentRecord.totalSets++;
          if (new Date(session.date) > new Date(currentRecord.lastPerformed)) {
            currentRecord.lastPerformed = session.date;
            currentRecord.totalSessions++;
          }
        }
      });
    });
  });

  return records;
}

export function checkForNewPRs(
  currentSession: { exerciseName: string; weight: number; reps: number }[],
  existingRecords: Map<string, PersonalRecord>
): PRUpdate[] {
  const newPRs: PRUpdate[] = [];

  currentSession.forEach((set) => {
    const record = existingRecords.get(set.exerciseName);
    if (!record) return; // No previous record to compare

    let prType: 'weight' | 'reps' | 'both' | null = null;
    const update: PRUpdate = {
      exerciseName: set.exerciseName,
      type: 'weight',
    };

    // Check for weight PR
    if (set.weight > record.maxWeight) {
      prType = 'weight';
      update.previousWeight = record.maxWeight;
      update.newWeight = set.weight;
    }

    // Check for reps PR
    if (
      set.reps > record.maxReps ||
      (set.reps === record.maxReps && set.weight > record.maxRepsWeight)
    ) {
      if (prType === 'weight') {
        prType = 'both';
      } else {
        prType = 'reps';
      }
      update.previousReps = record.maxReps;
      update.newReps = set.reps;
    }

    if (prType) {
      update.type = prType;
      newPRs.push(update);
    }
  });

  return newPRs;
}

export function formatPRDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return date.toLocaleDateString();
}
