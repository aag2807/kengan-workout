export interface NotificationSettings {
  enabled: boolean;
  workoutReminder: {
    enabled: boolean;
    time: string; // HH:MM format
    days: number[]; // 0-6, Sunday-Saturday
  };
  weighInReminder: {
    enabled: boolean;
    day: number; // 0-6, default Monday (1)
    time: string; // HH:MM format
  };
  waterReminder: {
    enabled: boolean;
    intervalMinutes: number; // default 120 (2 hours)
    startTime: string; // HH:MM
    endTime: string; // HH:MM
  };
  restDayReminder: {
    enabled: boolean;
    daysWithoutWorkout: number; // default 2
  };
}

const DEFAULT_SETTINGS: NotificationSettings = {
  enabled: false,
  workoutReminder: {
    enabled: true,
    time: '18:00',
    days: [1, 3, 5], // Monday, Wednesday, Friday
  },
  weighInReminder: {
    enabled: true,
    day: 1, // Monday
    time: '08:00',
  },
  waterReminder: {
    enabled: true,
    intervalMinutes: 120,
    startTime: '08:00',
    endTime: '20:00',
  },
  restDayReminder: {
    enabled: true,
    daysWithoutWorkout: 2,
  },
};

const STORAGE_KEY = 'workout-app-notifications';

/**
 * Request notification permission from the browser
 */
export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) {
    console.log('This browser does not support notifications');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
}

/**
 * Check if notifications are supported and permitted
 */
export function areNotificationsAvailable(): boolean {
  return 'Notification' in window && Notification.permission === 'granted';
}

/**
 * Send a notification
 */
export function sendNotification(title: string, options?: NotificationOptions) {
  if (!areNotificationsAvailable()) {
    console.log('Notifications not available');
    return null;
  }

  const defaultOptions: NotificationOptions = {
    icon: '/vite.svg',
    badge: '/vite.svg',
    vibrate: [200, 100, 200],
    ...options,
  };

  return new Notification(title, defaultOptions);
}

/**
 * Load notification settings from storage
 */
export function loadNotificationSettings(): NotificationSettings {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
    }
  } catch (error) {
    console.error('Failed to load notification settings:', error);
  }
  return DEFAULT_SETTINGS;
}

/**
 * Save notification settings to storage
 */
export function saveNotificationSettings(settings: NotificationSettings): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error('Failed to save notification settings:', error);
  }
}

/**
 * Schedule workout reminder
 */
export function scheduleWorkoutReminder(settings: NotificationSettings): void {
  if (!settings.enabled || !settings.workoutReminder.enabled) return;

  // Clear any existing reminders
  clearWorkoutReminders();

  const now = new Date();
  const currentDay = now.getDay();
  const [hours, minutes] = settings.workoutReminder.time.split(':').map(Number);

  // Check if today is a workout day and time hasn't passed
  if (settings.workoutReminder.days.includes(currentDay)) {
    const reminderTime = new Date(now);
    reminderTime.setHours(hours, minutes, 0, 0);

    if (reminderTime > now) {
      const timeUntilReminder = reminderTime.getTime() - now.getTime();
      const timerId = setTimeout(() => {
        sendNotification('🏋️ Time to Train!', {
          body: 'Your workout is scheduled for today. The King of Stranglers never misses training!',
          tag: 'workout-reminder',
        });
      }, timeUntilReminder);
      
      // Store timer ID
      sessionStorage.setItem('workout-reminder-timer', timerId.toString());
    }
  }
}

/**
 * Clear workout reminders
 */
export function clearWorkoutReminders(): void {
  const timerId = sessionStorage.getItem('workout-reminder-timer');
  if (timerId) {
    clearTimeout(Number(timerId));
    sessionStorage.removeItem('workout-reminder-timer');
  }
}

/**
 * Schedule weekly weigh-in reminder
 */
export function scheduleWeighInReminder(settings: NotificationSettings): void {
  if (!settings.enabled || !settings.weighInReminder.enabled) return;

  const now = new Date();
  const currentDay = now.getDay();
  const targetDay = settings.weighInReminder.day;
  const [hours, minutes] = settings.weighInReminder.time.split(':').map(Number);

  if (currentDay === targetDay) {
    const reminderTime = new Date(now);
    reminderTime.setHours(hours, minutes, 0, 0);

    if (reminderTime > now) {
      const timeUntilReminder = reminderTime.getTime() - now.getTime();
      setTimeout(() => {
        sendNotification('⚖️ Weekly Weigh-In Time!', {
          body: 'Log your weight to track your progress!',
          tag: 'weighin-reminder',
        });
      }, timeUntilReminder);
    }
  }
}

/**
 * Schedule water reminders throughout the day
 */
export function scheduleWaterReminders(settings: NotificationSettings): void {
  if (!settings.enabled || !settings.waterReminder.enabled) return;

  // Clear existing water reminders
  clearWaterReminders();

  const now = new Date();
  const [startHour, startMinute] = settings.waterReminder.startTime.split(':').map(Number);
  const [endHour, endMinute] = settings.waterReminder.endTime.split(':').map(Number);

  const startTime = new Date(now);
  startTime.setHours(startHour, startMinute, 0, 0);

  const endTime = new Date(now);
  endTime.setHours(endHour, endMinute, 0, 0);

  // Only schedule if we're within the active hours
  if (now >= startTime && now <= endTime) {
    const intervalMs = settings.waterReminder.intervalMinutes * 60 * 1000;
    
    const intervalId = setInterval(() => {
      const currentTime = new Date();
      const currentEndTime = new Date();
      currentEndTime.setHours(endHour, endMinute, 0, 0);

      if (currentTime >= currentEndTime) {
        clearWaterReminders();
        return;
      }

      sendNotification('💧 Hydration Check!', {
        body: 'Remember to drink water. Stay hydrated for optimal performance!',
        tag: 'water-reminder',
      });
    }, intervalMs);

    sessionStorage.setItem('water-reminder-interval', intervalId.toString());
  }
}

/**
 * Clear water reminders
 */
export function clearWaterReminders(): void {
  const intervalId = sessionStorage.getItem('water-reminder-interval');
  if (intervalId) {
    clearInterval(Number(intervalId));
    sessionStorage.removeItem('water-reminder-interval');
  }
}

/**
 * Check if user needs a rest day reminder
 */
export function checkRestDayReminder(
  settings: NotificationSettings,
  lastWorkoutDate: string | null
): void {
  if (!settings.enabled || !settings.restDayReminder.enabled || !lastWorkoutDate) return;

  const now = new Date();
  const lastWorkout = new Date(lastWorkoutDate);
  const daysSinceLastWorkout = Math.floor(
    (now.getTime() - lastWorkout.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (daysSinceLastWorkout >= settings.restDayReminder.daysWithoutWorkout) {
    sendNotification('🔥 Time for a Comeback!', {
      body: `It's been ${daysSinceLastWorkout} days since your last workout. The arena awaits!`,
      tag: 'rest-day-reminder',
    });
  }
}

/**
 * Initialize all notification schedules
 */
export function initializeNotifications(
  settings: NotificationSettings,
  lastWorkoutDate: string | null
): void {
  if (!settings.enabled || !areNotificationsAvailable()) return;

  scheduleWorkoutReminder(settings);
  scheduleWeighInReminder(settings);
  scheduleWaterReminders(settings);
  checkRestDayReminder(settings, lastWorkoutDate);
}

/**
 * Clear all notifications
 */
export function clearAllNotifications(): void {
  clearWorkoutReminders();
  clearWaterReminders();
}
