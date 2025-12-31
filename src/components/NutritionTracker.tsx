import { useState, useMemo } from 'react';
import { Button } from './ui/button';
import type { NutritionLog, NutritionTargets } from '../types/user';

interface NutritionTrackerProps {
  logs: NutritionLog[];
  targets: NutritionTargets;
  onAddLog: (log: Omit<NutritionLog, 'id'>) => void;
  onUpdateTargets?: (targets: NutritionTargets) => void;
}

export default function NutritionTracker({
  logs = [],
  targets,
  onAddLog,
  onUpdateTargets,
}: NutritionTrackerProps) {
  const today = new Date().toISOString().split('T')[0];
  const [showForm, setShowForm] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [editedTargets, setEditedTargets] = useState(targets);
  
  const [logData, setLogData] = useState<Omit<NutritionLog, 'id'>>({
    date: today,
    protein: 0,
    calories: 0,
    water: 0,
    sleep: 0,
    notes: '',
  });

  // Get today's log
  const todayLog = useMemo(() => {
    return logs.find((log) => log.date === today);
  }, [logs, today]);

  // Calculate weekly averages
  const weeklyStats = useMemo(() => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const recentLogs = logs.filter(
      (log) => new Date(log.date) >= oneWeekAgo
    );

    if (recentLogs.length === 0) {
      return { protein: 0, calories: 0, water: 0, sleep: 0, days: 0 };
    }

    const totals = recentLogs.reduce(
      (acc, log) => ({
        protein: acc.protein + log.protein,
        calories: acc.calories + log.calories,
        water: acc.water + log.water,
        sleep: acc.sleep + log.sleep,
      }),
      { protein: 0, calories: 0, water: 0, sleep: 0 }
    );

    return {
      protein: Math.round(totals.protein / recentLogs.length),
      calories: Math.round(totals.calories / recentLogs.length),
      water: (totals.water / recentLogs.length).toFixed(1),
      sleep: (totals.sleep / recentLogs.length).toFixed(1),
      days: recentLogs.length,
    };
  }, [logs]);

  const handleSaveLog = () => {
    onAddLog(logData);
    setLogData({
      date: today,
      protein: 0,
      calories: 0,
      water: 0,
      sleep: 0,
      notes: '',
    });
    setShowForm(false);
  };

  const handleSaveTargets = () => {
    onUpdateTargets?.(editedTargets);
    setShowSettings(false);
  };

  const getProgressColor = (value: number, min: number, max: number) => {
    if (value < min) return 'fighter-blood';
    if (value >= min && value <= max) return 'fighter-home';
    return 'fighter-bag';
  };

  const getProgressPercentage = (value: number, target: number) => {
    return Math.min(100, (value / target) * 100);
  };

  if (logs.length === 0 && !showForm) {
    return (
      <div className="p-8 text-center">
        <div className="text-6xl mb-4">🍗</div>
        <h3 className="text-2xl font-bold text-white mb-2">Start Tracking Nutrition</h3>
        <p className="text-arena-chalk mb-6">
          Nutrition is 80% of results. Track your daily intake!
        </p>
        <Button
          onClick={() => setShowForm(true)}
          className="bg-gradient-to-r from-fighter-home to-green-600 text-white"
        >
          + Log Today's Nutrition
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-white">Today's Nutrition</h3>
          <p className="text-arena-chalk text-sm">{new Date(today).toLocaleDateString()}</p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => setShowSettings(!showSettings)}
            variant="ghost"
            size="sm"
            className="text-arena-chalk"
          >
            ⚙️ Targets
          </Button>
          {!todayLog && !showForm && (
            <Button
              onClick={() => setShowForm(true)}
              size="sm"
              className="bg-fighter-home text-white"
            >
              + Log Today
            </Button>
          )}
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="bg-arena-darker border-2 border-arena-cage rounded-lg p-6">
          <h4 className="text-lg font-bold text-white mb-4">Daily Targets</h4>
          <div className="space-y-4">
            <div>
              <label className="block text-arena-chalk text-sm mb-2">Protein (g)</label>
              <input
                type="number"
                value={editedTargets.protein}
                onChange={(e) =>
                  setEditedTargets({ ...editedTargets, protein: Number(e.target.value) })
                }
                className="w-full px-4 py-2 bg-arena-floor border border-arena-cage rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-fighter-home"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-arena-chalk text-sm mb-2">Calories (min)</label>
                <input
                  type="number"
                  value={editedTargets.caloriesMin}
                  onChange={(e) =>
                    setEditedTargets({ ...editedTargets, caloriesMin: Number(e.target.value) })
                  }
                  className="w-full px-4 py-2 bg-arena-floor border border-arena-cage rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-fighter-home"
                />
              </div>
              <div>
                <label className="block text-arena-chalk text-sm mb-2">Calories (max)</label>
                <input
                  type="number"
                  value={editedTargets.caloriesMax}
                  onChange={(e) =>
                    setEditedTargets({ ...editedTargets, caloriesMax: Number(e.target.value) })
                  }
                  className="w-full px-4 py-2 bg-arena-floor border border-arena-cage rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-fighter-home"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-arena-chalk text-sm mb-2">Water (L min)</label>
                <input
                  type="number"
                  step="0.1"
                  value={editedTargets.waterMin}
                  onChange={(e) =>
                    setEditedTargets({ ...editedTargets, waterMin: Number(e.target.value) })
                  }
                  className="w-full px-4 py-2 bg-arena-floor border border-arena-cage rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-fighter-home"
                />
              </div>
              <div>
                <label className="block text-arena-chalk text-sm mb-2">Water (L max)</label>
                <input
                  type="number"
                  step="0.1"
                  value={editedTargets.waterMax}
                  onChange={(e) =>
                    setEditedTargets({ ...editedTargets, waterMax: Number(e.target.value) })
                  }
                  className="w-full px-4 py-2 bg-arena-floor border border-arena-cage rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-fighter-home"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-arena-chalk text-sm mb-2">Sleep (h min)</label>
                <input
                  type="number"
                  step="0.5"
                  value={editedTargets.sleepMin}
                  onChange={(e) =>
                    setEditedTargets({ ...editedTargets, sleepMin: Number(e.target.value) })
                  }
                  className="w-full px-4 py-2 bg-arena-floor border border-arena-cage rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-fighter-home"
                />
              </div>
              <div>
                <label className="block text-arena-chalk text-sm mb-2">Sleep (h max)</label>
                <input
                  type="number"
                  step="0.5"
                  value={editedTargets.sleepMax}
                  onChange={(e) =>
                    setEditedTargets({ ...editedTargets, sleepMax: Number(e.target.value) })
                  }
                  className="w-full px-4 py-2 bg-arena-floor border border-arena-cage rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-fighter-home"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={() => {
                  setEditedTargets(targets);
                  setShowSettings(false);
                }}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveTargets}
                className="flex-1 bg-gradient-to-r from-fighter-home to-green-600 text-white"
              >
                Save Targets
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Log Form */}
      {showForm && !todayLog && (
        <div className="bg-arena-darker border-2 border-fighter-home rounded-lg p-6">
          <h4 className="text-lg font-bold text-white mb-4">Log Today's Nutrition</h4>
          <div className="space-y-4">
            <div>
              <label className="block text-arena-chalk text-sm mb-2">
                Protein (g) - Target: {targets.protein}g
              </label>
              <input
                type="number"
                value={logData.protein || ''}
                onChange={(e) => setLogData({ ...logData, protein: Number(e.target.value) })}
                className="w-full px-4 py-2 bg-arena-floor border border-arena-cage rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-fighter-home"
              />
            </div>
            <div>
              <label className="block text-arena-chalk text-sm mb-2">
                Calories - Target: {targets.caloriesMin}-{targets.caloriesMax}
              </label>
              <input
                type="number"
                value={logData.calories || ''}
                onChange={(e) => setLogData({ ...logData, calories: Number(e.target.value) })}
                className="w-full px-4 py-2 bg-arena-floor border border-arena-cage rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-fighter-home"
              />
            </div>
            <div>
              <label className="block text-arena-chalk text-sm mb-2">
                Water (L) - Target: {targets.waterMin}-{targets.waterMax}L
              </label>
              <input
                type="number"
                step="0.1"
                value={logData.water || ''}
                onChange={(e) => setLogData({ ...logData, water: Number(e.target.value) })}
                className="w-full px-4 py-2 bg-arena-floor border border-arena-cage rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-fighter-home"
              />
            </div>
            <div>
              <label className="block text-arena-chalk text-sm mb-2">
                Sleep (hours) - Target: {targets.sleepMin}-{targets.sleepMax}h
              </label>
              <input
                type="number"
                step="0.5"
                value={logData.sleep || ''}
                onChange={(e) => setLogData({ ...logData, sleep: Number(e.target.value) })}
                className="w-full px-4 py-2 bg-arena-floor border border-arena-cage rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-fighter-home"
              />
            </div>
            <div>
              <label className="block text-arena-chalk text-sm mb-2">Notes (optional)</label>
              <textarea
                value={logData.notes}
                onChange={(e) => setLogData({ ...logData, notes: e.target.value })}
                placeholder="How did you feel today?"
                className="w-full px-4 py-2 bg-arena-floor border border-arena-cage rounded-lg text-white resize-none focus:outline-none focus:ring-2 focus:ring-fighter-home"
                rows={2}
              />
            </div>
            <div className="flex gap-3">
              <Button
                onClick={() => setShowForm(false)}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveLog}
                className="flex-1 bg-gradient-to-r from-fighter-home to-green-600 text-white"
              >
                Save Log
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Today's Progress */}
      {todayLog && (
        <div className="bg-arena-darker border-2 border-fighter-home rounded-lg p-6">
          <h4 className="text-lg font-bold text-white mb-4">Today's Progress</h4>
          
          <div className="space-y-4">
            {/* Protein */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-arena-chalk text-sm">🥩 Protein</span>
                <span className={`text-${getProgressColor(todayLog.protein, targets.protein * 0.9, targets.protein * 1.1)} font-bold`}>
                  {todayLog.protein}g / {targets.protein}g
                </span>
              </div>
              <div className="h-3 bg-arena-cage rounded-full overflow-hidden">
                <div
                  className={`h-full bg-${getProgressColor(todayLog.protein, targets.protein * 0.9, targets.protein * 1.1)} transition-all`}
                  style={{ width: `${getProgressPercentage(todayLog.protein, targets.protein)}%` }}
                />
              </div>
            </div>

            {/* Calories */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-arena-chalk text-sm">🔥 Calories</span>
                <span className={`text-${getProgressColor(todayLog.calories, targets.caloriesMin, targets.caloriesMax)} font-bold`}>
                  {todayLog.calories} / {targets.caloriesMin}-{targets.caloriesMax}
                </span>
              </div>
              <div className="h-3 bg-arena-cage rounded-full overflow-hidden">
                <div
                  className={`h-full bg-${getProgressColor(todayLog.calories, targets.caloriesMin, targets.caloriesMax)} transition-all`}
                  style={{ width: `${getProgressPercentage(todayLog.calories, targets.caloriesMax)}%` }}
                />
              </div>
            </div>

            {/* Water */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-arena-chalk text-sm">💧 Water</span>
                <span className={`text-${getProgressColor(todayLog.water, targets.waterMin, targets.waterMax)} font-bold`}>
                  {todayLog.water}L / {targets.waterMin}-{targets.waterMax}L
                </span>
              </div>
              <div className="h-3 bg-arena-cage rounded-full overflow-hidden">
                <div
                  className={`h-full bg-${getProgressColor(todayLog.water, targets.waterMin, targets.waterMax)} transition-all`}
                  style={{ width: `${getProgressPercentage(todayLog.water, targets.waterMax)}%` }}
                />
              </div>
            </div>

            {/* Sleep */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-arena-chalk text-sm">😴 Sleep</span>
                <span className={`text-${getProgressColor(todayLog.sleep, targets.sleepMin, targets.sleepMax)} font-bold`}>
                  {todayLog.sleep}h / {targets.sleepMin}-{targets.sleepMax}h
                </span>
              </div>
              <div className="h-3 bg-arena-cage rounded-full overflow-hidden">
                <div
                  className={`h-full bg-${getProgressColor(todayLog.sleep, targets.sleepMin, targets.sleepMax)} transition-all`}
                  style={{ width: `${getProgressPercentage(todayLog.sleep, targets.sleepMax)}%` }}
                />
              </div>
            </div>
          </div>

          {todayLog.notes && (
            <div className="mt-4 p-3 bg-arena-floor rounded-lg">
              <p className="text-arena-chalk text-sm italic">{todayLog.notes}</p>
            </div>
          )}
        </div>
      )}

      {/* Weekly Summary */}
      {weeklyStats.days > 0 && (
        <div className="bg-gradient-to-br from-arena-darker to-arena-floor border-2 border-arena-cage rounded-lg p-6">
          <h4 className="text-lg font-bold text-white mb-4">
            7-Day Average ({weeklyStats.days} days logged)
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-arena-floor rounded-lg">
              <div className="text-arena-chalk text-xs mb-1">Protein</div>
              <div className="text-white font-bold text-xl">{weeklyStats.protein}g</div>
            </div>
            <div className="text-center p-3 bg-arena-floor rounded-lg">
              <div className="text-arena-chalk text-xs mb-1">Calories</div>
              <div className="text-white font-bold text-xl">{weeklyStats.calories}</div>
            </div>
            <div className="text-center p-3 bg-arena-floor rounded-lg">
              <div className="text-arena-chalk text-xs mb-1">Water</div>
              <div className="text-white font-bold text-xl">{weeklyStats.water}L</div>
            </div>
            <div className="text-center p-3 bg-arena-floor rounded-lg">
              <div className="text-arena-chalk text-xs mb-1">Sleep</div>
              <div className="text-white font-bold text-xl">{weeklyStats.sleep}h</div>
            </div>
          </div>
        </div>
      )}

      {/* Recent Logs */}
      {logs.length > 0 && (
        <div className="bg-arena-darker border-2 border-arena-cage rounded-lg p-6">
          <h4 className="text-lg font-bold text-white mb-4">Recent Logs</h4>
          <div className="space-y-3">
            {logs
              .slice(-7)
              .reverse()
              .map((log) => (
                <div key={log.id} className="p-3 bg-arena-floor rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-white font-bold">
                      {new Date(log.date).toLocaleDateString()}
                    </span>
                    <span className="text-arena-chalk text-xs">
                      {log.date === today ? 'Today' : ''}
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-xs">
                    <div className="text-center">
                      <div className="text-arena-chalk">Protein</div>
                      <div className="text-white font-bold">{log.protein}g</div>
                    </div>
                    <div className="text-center">
                      <div className="text-arena-chalk">Calories</div>
                      <div className="text-white font-bold">{log.calories}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-arena-chalk">Water</div>
                      <div className="text-white font-bold">{log.water}L</div>
                    </div>
                    <div className="text-center">
                      <div className="text-arena-chalk">Sleep</div>
                      <div className="text-white font-bold">{log.sleep}h</div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
