import { useState, useEffect } from 'react';
import type { WorkoutSession } from '../types/workout';
import { storageManager, STORES } from '../utils/storage';

export function useWorkoutSessions() {
  const [sessions, setSessions] = useState<WorkoutSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize storage and load sessions
  useEffect(() => {
    const loadSessions = async () => {
      try {
        await storageManager.init();
        const loadedSessions = await storageManager.getAllItems<WorkoutSession>(STORES.SESSIONS);
        setSessions(Array.isArray(loadedSessions) ? loadedSessions : []);
      } catch (error) {
        console.error('Failed to load workout sessions:', error);
        setSessions([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadSessions();
  }, []);

  // Save session
  const saveSession = async (session: WorkoutSession): Promise<boolean> => {
    try {
      const success = await storageManager.saveItem(STORES.SESSIONS, session);
      if (success) {
        setSessions(prevSessions => [...prevSessions, session]);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to save workout session:', error);
      return false;
    }
  };

  // Delete session
  const deleteSession = async (sessionId: string): Promise<boolean> => {
    try {
      const success = await storageManager.deleteItem(STORES.SESSIONS, sessionId);
      if (success) {
        setSessions(prevSessions => prevSessions.filter(s => s.id !== sessionId));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to delete workout session:', error);
      return false;
    }
  };

  // Get recent sessions
  const getRecentSessions = (limit: number = 10) => {
    return [...sessions]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, limit);
  };

  // Get sessions for a specific date
  const getSessionsByDate = (date: string) => {
    return sessions.filter(session => {
      const sessionDate = new Date(session.date).toISOString().split('T')[0];
      return sessionDate === date;
    });
  };

  // Get workout stats
  const getStats = () => {
    const totalWorkouts = sessions.length;
    const workoutsByType = sessions.reduce((acc, session) => {
      acc[session.workoutType] = (acc[session.workoutType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const totalSetsCompleted = sessions.reduce((total, session) => {
      return total + session.exercises.reduce((exerciseTotal, exercise) => {
        return exerciseTotal + exercise.completedSets.filter(set => set.completed).length;
      }, 0);
    }, 0);

    return {
      totalWorkouts,
      workoutsByType,
      totalSetsCompleted
    };
  };

  // Clear all sessions (for reset/debugging)
  const clearAllSessions = async (): Promise<boolean> => {
    try {
      const success = await storageManager.clearStore(STORES.SESSIONS);
      if (success) {
        setSessions([]);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to clear sessions:', error);
      return false;
    }
  };

  return {
    sessions,
    isLoading,
    saveSession,
    deleteSession,
    getRecentSessions,
    getSessionsByDate,
    getStats,
    clearAllSessions
  };
}
