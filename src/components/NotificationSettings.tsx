import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import {
  requestNotificationPermission,
  areNotificationsAvailable,
  loadNotificationSettings,
  saveNotificationSettings,
  initializeNotifications,
  clearAllNotifications,
  type NotificationSettings,
} from '../utils/notifications';
import { useWorkoutSessions } from '../hooks/useWorkoutSessions';

interface NotificationSettingsProps {
  onClose: () => void;
}

export default function NotificationSettingsDialog({ onClose }: NotificationSettingsProps) {
  const [settings, setSettings] = useState<NotificationSettings>(loadNotificationSettings());
  const [permissionGranted, setPermissionGranted] = useState(areNotificationsAvailable());
  const { sessions } = useWorkoutSessions();

  useEffect(() => {
    // Initialize notifications when settings change
    if (settings.enabled && permissionGranted) {
      const lastSession = sessions[0];
      const lastWorkoutDate = lastSession ? lastSession.date : null;
      initializeNotifications(settings, lastWorkoutDate);
    } else {
      clearAllNotifications();
    }
  }, [settings, permissionGranted, sessions]);

  const handleRequestPermission = async () => {
    const granted = await requestNotificationPermission();
    setPermissionGranted(granted);
    if (granted) {
      const newSettings = { ...settings, enabled: true };
      setSettings(newSettings);
      saveNotificationSettings(newSettings);
    }
  };

  const handleToggleEnabled = () => {
    const newSettings = { ...settings, enabled: !settings.enabled };
    setSettings(newSettings);
    saveNotificationSettings(newSettings);
  };

  const handleUpdateSettings = (updates: Partial<NotificationSettings>) => {
    const newSettings = { ...settings, ...updates };
    setSettings(newSettings);
    saveNotificationSettings(newSettings);
  };

  const handleToggleDay = (day: number) => {
    const days = settings.workoutReminder.days.includes(day)
      ? settings.workoutReminder.days.filter(d => d !== day)
      : [...settings.workoutReminder.days, day].sort();

    handleUpdateSettings({
      workoutReminder: { ...settings.workoutReminder, days },
    });
  };

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-arena-darker border-2 border-arena-cage rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-arena-darker border-b-2 border-arena-cage p-6 z-10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">🔔 Notifications & Reminders</h2>
              <p className="text-arena-chalk text-sm mt-1">
                Stay on track with smart reminders
              </p>
            </div>
            <Button
              variant="ghost"
              onClick={onClose}
              className="text-arena-chalk hover:text-white text-2xl"
            >
              ✕
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Permission Request */}
          {!permissionGranted && (
            <div className="bg-fighter-ring/10 border-2 border-fighter-ring rounded-lg p-4">
              <div className="flex items-start gap-3">
                <span className="text-3xl">🔔</span>
                <div className="flex-1">
                  <h3 className="text-white font-semibold mb-2">Enable Notifications</h3>
                  <p className="text-arena-chalk text-sm mb-3">
                    Allow notifications to receive workout reminders, weigh-in alerts, and hydration checks.
                  </p>
                  <Button
                    onClick={handleRequestPermission}
                    className="bg-fighter-ring hover:bg-fighter-ring/80 text-white font-semibold"
                  >
                    Allow Notifications
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Master Toggle */}
          {permissionGranted && (
            <div className="flex items-center justify-between p-4 bg-arena-floor rounded-lg border border-arena-cage">
              <div>
                <h3 className="text-white font-semibold">Enable All Notifications</h3>
                <p className="text-arena-chalk text-sm">Master switch for all reminders</p>
              </div>
              <button
                onClick={handleToggleEnabled}
                className={`relative w-14 h-8 rounded-full transition-colors ${
                  settings.enabled ? 'bg-fighter-home' : 'bg-arena-cage'
                }`}
              >
                <div
                  className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform ${
                    settings.enabled ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          )}

          {settings.enabled && permissionGranted && (
            <>
              {/* Workout Reminder */}
              <div className="space-y-3 p-4 bg-arena-floor rounded-lg border border-arena-cage">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🏋️</span>
                    <div>
                      <h3 className="text-white font-semibold">Workout Reminder</h3>
                      <p className="text-arena-chalk text-xs">Daily training notifications</p>
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      handleUpdateSettings({
                        workoutReminder: {
                          ...settings.workoutReminder,
                          enabled: !settings.workoutReminder.enabled,
                        },
                      })
                    }
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      settings.workoutReminder.enabled ? 'bg-fighter-gym' : 'bg-arena-cage'
                    }`}
                  >
                    <div
                      className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                        settings.workoutReminder.enabled ? 'translate-x-6' : 'translate-x-0.5'
                      }`}
                    />
                  </button>
                </div>

                {settings.workoutReminder.enabled && (
                  <>
                    <div>
                      <label className="text-arena-chalk text-sm mb-1 block">Time</label>
                      <input
                        type="time"
                        value={settings.workoutReminder.time}
                        onChange={e =>
                          handleUpdateSettings({
                            workoutReminder: { ...settings.workoutReminder, time: e.target.value },
                          })
                        }
                        className="bg-arena-cage border border-arena-steel rounded px-3 py-2 text-white w-full"
                      />
                    </div>

                    <div>
                      <label className="text-arena-chalk text-sm mb-2 block">Days</label>
                      <div className="flex gap-2">
                        {dayNames.map((day, index) => (
                          <button
                            key={day}
                            onClick={() => handleToggleDay(index)}
                            className={`flex-1 py-2 rounded font-semibold transition-colors ${
                              settings.workoutReminder.days.includes(index)
                                ? 'bg-fighter-gym text-white'
                                : 'bg-arena-cage text-arena-chalk hover:bg-arena-steel'
                            }`}
                          >
                            {day}
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Weigh-In Reminder */}
              <div className="space-y-3 p-4 bg-arena-floor rounded-lg border border-arena-cage">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">⚖️</span>
                    <div>
                      <h3 className="text-white font-semibold">Weekly Weigh-In</h3>
                      <p className="text-arena-chalk text-xs">Track your progress</p>
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      handleUpdateSettings({
                        weighInReminder: {
                          ...settings.weighInReminder,
                          enabled: !settings.weighInReminder.enabled,
                        },
                      })
                    }
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      settings.weighInReminder.enabled ? 'bg-fighter-home' : 'bg-arena-cage'
                    }`}
                  >
                    <div
                      className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                        settings.weighInReminder.enabled ? 'translate-x-6' : 'translate-x-0.5'
                      }`}
                    />
                  </button>
                </div>

                {settings.weighInReminder.enabled && (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-arena-chalk text-sm mb-1 block">Day</label>
                      <select
                        value={settings.weighInReminder.day}
                        onChange={e =>
                          handleUpdateSettings({
                            weighInReminder: {
                              ...settings.weighInReminder,
                              day: Number(e.target.value),
                            },
                          })
                        }
                        className="bg-arena-cage border border-arena-steel rounded px-3 py-2 text-white w-full"
                      >
                        {dayNames.map((day, index) => (
                          <option key={day} value={index}>
                            {day}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-arena-chalk text-sm mb-1 block">Time</label>
                      <input
                        type="time"
                        value={settings.weighInReminder.time}
                        onChange={e =>
                          handleUpdateSettings({
                            weighInReminder: { ...settings.weighInReminder, time: e.target.value },
                          })
                        }
                        className="bg-arena-cage border border-arena-steel rounded px-3 py-2 text-white w-full"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Water Reminder */}
              <div className="space-y-3 p-4 bg-arena-floor rounded-lg border border-arena-cage">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">💧</span>
                    <div>
                      <h3 className="text-white font-semibold">Hydration Reminders</h3>
                      <p className="text-arena-chalk text-xs">Regular water intake checks</p>
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      handleUpdateSettings({
                        waterReminder: {
                          ...settings.waterReminder,
                          enabled: !settings.waterReminder.enabled,
                        },
                      })
                    }
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      settings.waterReminder.enabled ? 'bg-fighter-gym' : 'bg-arena-cage'
                    }`}
                  >
                    <div
                      className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                        settings.waterReminder.enabled ? 'translate-x-6' : 'translate-x-0.5'
                      }`}
                    />
                  </button>
                </div>

                {settings.waterReminder.enabled && (
                  <div className="space-y-3">
                    <div>
                      <label className="text-arena-chalk text-sm mb-1 block">
                        Interval (minutes)
                      </label>
                      <input
                        type="number"
                        min="30"
                        max="240"
                        step="30"
                        value={settings.waterReminder.intervalMinutes}
                        onChange={e =>
                          handleUpdateSettings({
                            waterReminder: {
                              ...settings.waterReminder,
                              intervalMinutes: Number(e.target.value),
                            },
                          })
                        }
                        className="bg-arena-cage border border-arena-steel rounded px-3 py-2 text-white w-full"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-arena-chalk text-sm mb-1 block">Start Time</label>
                        <input
                          type="time"
                          value={settings.waterReminder.startTime}
                          onChange={e =>
                            handleUpdateSettings({
                              waterReminder: {
                                ...settings.waterReminder,
                                startTime: e.target.value,
                              },
                            })
                          }
                          className="bg-arena-cage border border-arena-steel rounded px-3 py-2 text-white w-full"
                        />
                      </div>
                      <div>
                        <label className="text-arena-chalk text-sm mb-1 block">End Time</label>
                        <input
                          type="time"
                          value={settings.waterReminder.endTime}
                          onChange={e =>
                            handleUpdateSettings({
                              waterReminder: {
                                ...settings.waterReminder,
                                endTime: e.target.value,
                              },
                            })
                          }
                          className="bg-arena-cage border border-arena-steel rounded px-3 py-2 text-white w-full"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Rest Day Reminder */}
              <div className="space-y-3 p-4 bg-arena-floor rounded-lg border border-arena-cage">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🔥</span>
                    <div>
                      <h3 className="text-white font-semibold">Rest Day Alert</h3>
                      <p className="text-arena-chalk text-xs">Comeback reminders</p>
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      handleUpdateSettings({
                        restDayReminder: {
                          ...settings.restDayReminder,
                          enabled: !settings.restDayReminder.enabled,
                        },
                      })
                    }
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      settings.restDayReminder.enabled ? 'bg-fighter-blood' : 'bg-arena-cage'
                    }`}
                  >
                    <div
                      className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                        settings.restDayReminder.enabled ? 'translate-x-6' : 'translate-x-0.5'
                      }`}
                    />
                  </button>
                </div>

                {settings.restDayReminder.enabled && (
                  <div>
                    <label className="text-arena-chalk text-sm mb-1 block">
                      Days without workout before reminder
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="7"
                      value={settings.restDayReminder.daysWithoutWorkout}
                      onChange={e =>
                        handleUpdateSettings({
                          restDayReminder: {
                            ...settings.restDayReminder,
                            daysWithoutWorkout: Number(e.target.value),
                          },
                        })
                      }
                      className="bg-arena-cage border border-arena-steel rounded px-3 py-2 text-white w-full"
                    />
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-arena-darker border-t-2 border-arena-cage p-4">
          <Button
            onClick={onClose}
            className="w-full bg-fighter-ring hover:bg-fighter-ring/80 text-white font-semibold py-3"
          >
            Done
          </Button>
        </div>
      </div>
    </div>
  );
}
