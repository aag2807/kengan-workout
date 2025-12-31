import { useState, useEffect } from 'react';
import type { UserProfile, WeighIn, NutritionLog, NutritionTargets } from '../types/user';
import { storageManager, STORES } from '../utils/storage';

const PROFILE_ID = 'user-profile-main';
const DEFAULT_PROFILE: UserProfile = {
  name: '',
  currentWeight: 95,
  startWeight: 95,
  targetWeight: 80,
  height: 1.74,
  startDate: new Date().toISOString(),
  weeklyWeighIns: [],
  nutritionLogs: [],
  nutritionTargets: {
    protein: 170,
    caloriesMin: 2000,
    caloriesMax: 2100,
    waterMin: 3,
    waterMax: 4,
    sleepMin: 7,
    sleepMax: 8,
  },
};

export function useUserProfile() {
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [isLoading, setIsLoading] = useState(true);

  // Load profile from storage
  useEffect(() => {
    const loadProfile = async () => {
      try {
        await storageManager.init();
        const loadedProfile = await storageManager.getItem<UserProfile>(
          STORES.PROFILE,
          PROFILE_ID
        );
        
        if (loadedProfile) {
          // Migrate old profiles to include new fields
          const migratedProfile = {
            ...loadedProfile,
            startWeight: loadedProfile.startWeight || loadedProfile.currentWeight,
            nutritionLogs: loadedProfile.nutritionLogs || [],
            nutritionTargets: loadedProfile.nutritionTargets || {
              protein: 170,
              caloriesMin: 2000,
              caloriesMax: 2100,
              waterMin: 3,
              waterMax: 4,
              sleepMin: 7,
              sleepMax: 8,
            },
          };
          setProfile(migratedProfile);
          // Save the migrated profile
          if (!loadedProfile.nutritionLogs || !loadedProfile.nutritionTargets) {
            await storageManager.saveItem(STORES.PROFILE, {
              ...migratedProfile,
              id: PROFILE_ID
            });
          }
        } else {
          // Save default profile if none exists
          await storageManager.saveItem(STORES.PROFILE, {
            ...DEFAULT_PROFILE,
            id: PROFILE_ID
          });
        }
      } catch (error) {
        console.error('Failed to load user profile:', error);
        setProfile(DEFAULT_PROFILE);
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, []);

  // Save profile
  const saveProfile = async (updatedProfile: UserProfile): Promise<boolean> => {
    try {
      const success = await storageManager.saveItem(STORES.PROFILE, {
        ...updatedProfile,
        id: PROFILE_ID
      });
      
      if (success) {
        setProfile(updatedProfile);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to save user profile:', error);
      return false;
    }
  };

  // Update profile fields
  const updateProfile = async (updates: Partial<UserProfile>): Promise<boolean> => {
    const updatedProfile = { ...profile, ...updates };
    return await saveProfile(updatedProfile);
  };

  // Add weigh-in
  const addWeighIn = async (weighIn: Omit<WeighIn, 'id'>): Promise<boolean> => {
    const newWeighIn: WeighIn = {
      ...weighIn,
      id: `weighin-${Date.now()}`
    };
    
    const updatedProfile = {
      ...profile,
      currentWeight: weighIn.weight,
      weeklyWeighIns: [...profile.weeklyWeighIns, newWeighIn]
    };
    
    return await saveProfile(updatedProfile);
  };

  // Delete weigh-in
  const deleteWeighIn = async (weighInId: string): Promise<boolean> => {
    const updatedProfile = {
      ...profile,
      weeklyWeighIns: profile.weeklyWeighIns.filter(w => w.id !== weighInId)
    };
    
    return await saveProfile(updatedProfile);
  };

  // Get weight progress
  const getWeightProgress = () => {
    const startWeight = profile.startWeight || profile.weeklyWeighIns[0]?.weight || profile.currentWeight;
    const currentWeight = profile.currentWeight;
    const targetWeight = profile.targetWeight;
    const totalToLose = startWeight - targetWeight;
    const lostSoFar = startWeight - currentWeight;
    const percentComplete = totalToLose > 0 ? (lostSoFar / totalToLose) * 100 : 0;
    
    return {
      startWeight,
      currentWeight,
      targetWeight,
      lostSoFar,
      remaining: currentWeight - targetWeight,
      percentComplete: Math.max(0, Math.min(100, percentComplete))
    };
  };

  // Add nutrition log
  const addNutritionLog = async (log: Omit<NutritionLog, 'id'>): Promise<boolean> => {
    // Check if log for this date already exists
    const existingLogIndex = profile.nutritionLogs.findIndex(l => l.date === log.date);
    
    let updatedLogs;
    if (existingLogIndex >= 0) {
      // Update existing log
      updatedLogs = [...profile.nutritionLogs];
      updatedLogs[existingLogIndex] = {
        ...log,
        id: profile.nutritionLogs[existingLogIndex].id
      };
    } else {
      // Add new log
      const newLog: NutritionLog = {
        ...log,
        id: `nutrition-${Date.now()}`
      };
      updatedLogs = [...profile.nutritionLogs, newLog];
    }
    
    const updatedProfile = {
      ...profile,
      nutritionLogs: updatedLogs
    };
    
    return await saveProfile(updatedProfile);
  };

  // Update nutrition targets
  const updateNutritionTargets = async (targets: NutritionTargets): Promise<boolean> => {
    const updatedProfile = {
      ...profile,
      nutritionTargets: targets
    };
    
    return await saveProfile(updatedProfile);
  };

  return {
    profile,
    isLoading,
    updateProfile,
    addWeighIn,
    deleteWeighIn,
    getWeightProgress,
    addNutritionLog,
    updateNutritionTargets,
  };
}
