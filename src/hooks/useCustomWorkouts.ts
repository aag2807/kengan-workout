import { useState, useEffect } from 'react';
import type { Workout } from '../types/workout';
import { StorageManager } from '../utils/storage';

const STORAGE_KEY = 'custom-workouts';
const storage = new StorageManager();

export function useCustomWorkouts() {
  const [customWorkouts, setCustomWorkouts] = useState<Workout[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load custom workouts on mount
  useEffect(() => {
    loadWorkouts();
  }, []);

  const loadWorkouts = async () => {
    try {
      await storage.init();
      const workouts = await storage.getAllItems<Workout>(STORAGE_KEY);
      setCustomWorkouts(workouts.sort((a, b) => 
        new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
      ));
    } catch (error) {
      console.error('Failed to load custom workouts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveWorkout = async (workout: Workout): Promise<boolean> => {
    try {
      await storage.init();
      const workoutToSave = {
        ...workout,
        isCustom: true,
        createdAt: workout.createdAt || new Date().toISOString(),
      };
      
      await storage.saveItem(STORAGE_KEY, workoutToSave);
      await loadWorkouts();
      return true;
    } catch (error) {
      console.error('Failed to save custom workout:', error);
      return false;
    }
  };

  const updateWorkout = async (id: string, updates: Partial<Workout>): Promise<boolean> => {
    try {
      await storage.init();
      const existing = customWorkouts.find(w => w.id === id);
      if (!existing) return false;

      const updated = { ...existing, ...updates };
      await storage.saveItem(STORAGE_KEY, updated);
      await loadWorkouts();
      return true;
    } catch (error) {
      console.error('Failed to update custom workout:', error);
      return false;
    }
  };

  const deleteWorkout = async (id: string): Promise<boolean> => {
    try {
      await storage.init();
      await storage.deleteItem(STORAGE_KEY, id);
      await loadWorkouts();
      return true;
    } catch (error) {
      console.error('Failed to delete custom workout:', error);
      return false;
    }
  };

  const duplicateWorkout = async (id: string): Promise<Workout | null> => {
    try {
      const original = customWorkouts.find(w => w.id === id);
      if (!original) return null;

      const duplicate: Workout = {
        ...original,
        id: `custom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: `${original.name} (Copy)`,
        createdAt: new Date().toISOString(),
      };

      await saveWorkout(duplicate);
      return duplicate;
    } catch (error) {
      console.error('Failed to duplicate workout:', error);
      return null;
    }
  };

  const clearAllWorkouts = async (): Promise<boolean> => {
    try {
      await storage.init();
      await storage.clearStore(STORAGE_KEY);
      setCustomWorkouts([]);
      return true;
    } catch (error) {
      console.error('Failed to clear custom workouts:', error);
      return false;
    }
  };

  return {
    customWorkouts,
    isLoading,
    saveWorkout,
    updateWorkout,
    deleteWorkout,
    duplicateWorkout,
    clearAllWorkouts,
    reloadWorkouts: loadWorkouts,
  };
}
