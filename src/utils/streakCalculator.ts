import type { WorkoutSession } from '../types/workout';

export interface StreakData {
  currentStreak: number; // days
  longestStreak: number; // days
  totalWorkouts: number;
  lastWorkoutDate: string | null;
  streakStatus: 'active' | 'at-risk' | 'broken';
  daysUntilBreak: number; // days until streak is considered broken
  weeklyFrequency: {
    thisWeek: number;
    lastWeek: number;
    average: number;
  };
}

export interface StreakBadge {
  id: string;
  name: string;
  description: string;
  icon: string;
  threshold: number;
  achieved: boolean;
  progress: number;
}

/**
 * Calculate workout streak from sessions
 */
export function calculateStreak(sessions: WorkoutSession[]): StreakData {
  if (sessions.length === 0) {
    return {
      currentStreak: 0,
      longestStreak: 0,
      totalWorkouts: 0,
      lastWorkoutDate: null,
      streakStatus: 'broken',
      daysUntilBreak: 0,
      weeklyFrequency: {
        thisWeek: 0,
        lastWeek: 0,
        average: 0,
      },
    };
  }

  // Sort sessions by date
  const sortedSessions = [...sessions].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Get unique workout days (only count one workout per day)
  const uniqueDays = Array.from(
    new Set(
      sortedSessions.map((s) => new Date(s.date).toISOString().split('T')[0])
    )
  ).sort();

  // Calculate current streak
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let currentStreak = 0;
  let checkDate = new Date(today);

  // Check backwards from today
  for (let i = 0; i < 365; i++) {
    const dateStr = checkDate.toISOString().split('T')[0];
    
    if (uniqueDays.includes(dateStr)) {
      currentStreak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else if (i === 0) {
      // No workout today, check yesterday
      checkDate.setDate(checkDate.getDate() - 1);
      continue;
    } else {
      // Streak broken
      break;
    }
  }

  // Calculate longest streak
  let longestStreak = 0;
  let tempStreak = 0;
  let prevDate: Date | null = null;

  uniqueDays.forEach((dateStr) => {
    const currentDate = new Date(dateStr);
    currentDate.setHours(0, 0, 0, 0);

    if (prevDate) {
      const dayDiff = Math.floor(
        (currentDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (dayDiff === 1) {
        tempStreak++;
      } else {
        longestStreak = Math.max(longestStreak, tempStreak);
        tempStreak = 1;
      }
    } else {
      tempStreak = 1;
    }

    prevDate = currentDate;
  });
  longestStreak = Math.max(longestStreak, tempStreak);

  // Determine streak status
  const lastWorkoutDate = uniqueDays[uniqueDays.length - 1];
  const lastDate = new Date(lastWorkoutDate);
  lastDate.setHours(0, 0, 0, 0);
  const daysSinceLastWorkout = Math.floor(
    (today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  let streakStatus: 'active' | 'at-risk' | 'broken';
  let daysUntilBreak: number;

  if (daysSinceLastWorkout === 0) {
    streakStatus = 'active';
    daysUntilBreak = 2;
  } else if (daysSinceLastWorkout === 1) {
    streakStatus = 'at-risk';
    daysUntilBreak = 1;
  } else {
    streakStatus = 'broken';
    daysUntilBreak = 0;
  }

  // Calculate weekly frequency
  const weeklyFrequency = calculateWeeklyFrequency(sortedSessions);

  return {
    currentStreak: Math.max(0, currentStreak),
    longestStreak,
    totalWorkouts: sessions.length,
    lastWorkoutDate,
    streakStatus,
    daysUntilBreak,
    weeklyFrequency,
  };
}

/**
 * Calculate weekly workout frequency
 */
function calculateWeeklyFrequency(sessions: WorkoutSession[]) {
  const now = new Date();
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

  const thisWeek = sessions.filter(
    (s) => new Date(s.date) >= oneWeekAgo
  ).length;

  const lastWeek = sessions.filter(
    (s) => new Date(s.date) >= twoWeeksAgo && new Date(s.date) < oneWeekAgo
  ).length;

  // Calculate average over all time
  if (sessions.length === 0) {
    return { thisWeek: 0, lastWeek: 0, average: 0 };
  }

  const firstWorkout = new Date(sessions[0].date);
  const totalWeeks = Math.max(
    1,
    Math.ceil((now.getTime() - firstWorkout.getTime()) / (7 * 24 * 60 * 60 * 1000))
  );
  const average = sessions.length / totalWeeks;

  return {
    thisWeek,
    lastWeek,
    average: Math.round(average * 10) / 10,
  };
}

/**
 * Get streak badges based on current streak
 */
export function getStreakBadges(streakData: StreakData): StreakBadge[] {
  const badges: Omit<StreakBadge, 'achieved' | 'progress'>[] = [
    {
      id: 'first-workout',
      name: 'First Step',
      description: 'Complete your first workout',
      icon: '🎯',
      threshold: 1,
    },
    {
      id: '3-day-streak',
      name: '3-Day Warrior',
      description: 'Maintain a 3-day streak',
      icon: '🔥',
      threshold: 3,
    },
    {
      id: '7-day-streak',
      name: 'Week Champion',
      description: 'Maintain a 7-day streak',
      icon: '⚡',
      threshold: 7,
    },
    {
      id: '14-day-streak',
      name: 'Fortnight Fighter',
      description: 'Maintain a 14-day streak',
      icon: '💪',
      threshold: 14,
    },
    {
      id: '30-day-streak',
      name: 'Monthly Master',
      description: 'Maintain a 30-day streak',
      icon: '👑',
      threshold: 30,
    },
    {
      id: '50-day-streak',
      name: 'Unstoppable',
      description: 'Maintain a 50-day streak',
      icon: '🏆',
      threshold: 50,
    },
    {
      id: '100-day-streak',
      name: 'Legendary',
      description: 'Maintain a 100-day streak',
      icon: '⭐',
      threshold: 100,
    },
    {
      id: '10-workouts',
      name: 'Getting Started',
      description: 'Complete 10 total workouts',
      icon: '🎖️',
      threshold: 10,
    },
    {
      id: '50-workouts',
      name: 'Dedicated',
      description: 'Complete 50 total workouts',
      icon: '🥇',
      threshold: 50,
    },
    {
      id: '100-workouts',
      name: 'Century Club',
      description: 'Complete 100 total workouts',
      icon: '💯',
      threshold: 100,
    },
  ];

  return badges.map((badge) => {
    let value: number;
    let achieved: boolean;

    // Determine which metric to use
    if (badge.id.includes('workout')) {
      value = streakData.totalWorkouts;
      achieved = value >= badge.threshold;
    } else {
      value = Math.max(streakData.currentStreak, streakData.longestStreak);
      achieved = streakData.longestStreak >= badge.threshold;
    }

    return {
      ...badge,
      achieved,
      progress: Math.min(100, (value / badge.threshold) * 100),
    };
  });
}

/**
 * Get motivational message based on streak
 */
export function getStreakMessage(streakData: StreakData): string {
  const { currentStreak, streakStatus } = streakData;

  if (streakStatus === 'broken') {
    return "Start your comeback! Every champion has setbacks.";
  }

  if (streakStatus === 'at-risk') {
    return "⚠️ Streak at risk! Don't break the chain!";
  }

  if (currentStreak === 0) {
    return "Begin your journey! The first step is always the hardest.";
  }

  if (currentStreak >= 100) {
    return "🏆 LEGENDARY! You're an unstoppable force!";
  }

  if (currentStreak >= 50) {
    return "⭐ INCREDIBLE! You're rewriting what's possible!";
  }

  if (currentStreak >= 30) {
    return "👑 CHAMPION! One month of pure dedication!";
  }

  if (currentStreak >= 14) {
    return "💪 BEAST MODE! Two weeks of consistency!";
  }

  if (currentStreak >= 7) {
    return "⚡ ON FIRE! A full week conquered!";
  }

  if (currentStreak >= 3) {
    return "🔥 HEATING UP! Keep the momentum going!";
  }

  return "🎯 Great start! Build the habit one day at a time!";
}
