export interface UserProfile {
  name: string;
  currentWeight: number;
  targetWeight: number;
  startWeight: number;
  height: number;
  age?: number;
  startDate: string;
  weeklyWeighIns: WeighIn[];
  nutritionLogs: NutritionLog[];
  nutritionTargets: NutritionTargets;
}

export interface WeighIn {
  id: string;
  date: string;
  weight: number;
  waist?: number;
  notes?: string;
}

export interface NutritionLog {
  id: string;
  date: string; // YYYY-MM-DD
  protein: number; // grams
  calories: number;
  water: number; // liters
  sleep: number; // hours
  notes?: string;
}

export interface NutritionTargets {
  protein: number; // default 170g
  caloriesMin: number; // default 2000
  caloriesMax: number; // default 2100
  waterMin: number; // default 3L
  waterMax: number; // default 4L
  sleepMin: number; // default 7h
  sleepMax: number; // default 8h
}
