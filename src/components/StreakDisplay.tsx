import { useMemo } from 'react';
import { calculateStreak, getStreakBadges, getStreakMessage } from '../utils/streakCalculator';
import type { WorkoutSession } from '../types/workout';

interface StreakDisplayProps {
  sessions: WorkoutSession[];
}

export default function StreakDisplay({ sessions }: StreakDisplayProps) {
  const streakData = useMemo(() => calculateStreak(sessions), [sessions]);
  const badges = useMemo(() => getStreakBadges(streakData), [streakData]);
  const message = useMemo(() => getStreakMessage(streakData), [streakData]);

  const achievedBadges = badges.filter((b) => b.achieved);
  const nextBadge = badges.find((b) => !b.achieved);

  const getStreakColor = () => {
    if (streakData.streakStatus === 'broken') return 'fighter-blood';
    if (streakData.streakStatus === 'at-risk') return 'fighter-bag';
    return 'fighter-home';
  };

  const getStreakIcon = () => {
    if (streakData.currentStreak >= 100) return '🏆';
    if (streakData.currentStreak >= 50) return '⭐';
    if (streakData.currentStreak >= 30) return '👑';
    if (streakData.currentStreak >= 14) return '💪';
    if (streakData.currentStreak >= 7) return '⚡';
    if (streakData.currentStreak >= 3) return '🔥';
    return '🎯';
  };

  return (
    <div className="space-y-4">
      {/* Main Streak Card */}
      <div className={`bg-gradient-to-br from-arena-darker to-arena-floor border-2 border-${getStreakColor()} rounded-2xl p-6 shadow-brutal`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <span>🔥</span>
            Workout Streak
          </h3>
          {streakData.streakStatus === 'at-risk' && (
            <span className="px-3 py-1 bg-fighter-bag/20 border border-fighter-bag rounded-full text-fighter-bag text-xs font-bold animate-pulse">
              ⚠️ AT RISK
            </span>
          )}
        </div>

        {/* Current Streak */}
        <div className="text-center mb-6">
          <div className="text-7xl mb-2">{getStreakIcon()}</div>
          <div className={`text-6xl font-bold text-${getStreakColor()} mb-2`}>
            {streakData.currentStreak}
          </div>
          <div className="text-arena-chalk text-sm uppercase tracking-wider">
            {streakData.currentStreak === 1 ? 'Day Streak' : 'Days Streak'}
          </div>
        </div>

        {/* Motivational Message */}
        <div className={`p-4 bg-${getStreakColor()}/10 border-l-4 border-${getStreakColor()} rounded mb-4`}>
          <p className="text-white font-bold text-center">{message}</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3 bg-arena-floor rounded-lg text-center">
            <div className="text-arena-chalk text-xs mb-1">Longest</div>
            <div className="text-white font-bold text-xl">{streakData.longestStreak}</div>
          </div>
          <div className="p-3 bg-arena-floor rounded-lg text-center">
            <div className="text-arena-chalk text-xs mb-1">Total</div>
            <div className="text-white font-bold text-xl">{streakData.totalWorkouts}</div>
          </div>
          <div className="p-3 bg-arena-floor rounded-lg text-center">
            <div className="text-arena-chalk text-xs mb-1">This Week</div>
            <div className="text-white font-bold text-xl">{streakData.weeklyFrequency.thisWeek}</div>
          </div>
        </div>

        {/* Weekly Frequency Comparison */}
        {streakData.totalWorkouts > 0 && (
          <div className="mt-4 p-3 bg-arena-floor rounded-lg">
            <div className="flex justify-between items-center text-xs mb-2">
              <span className="text-arena-chalk">Weekly Average</span>
              <span className="text-white font-bold">{streakData.weeklyFrequency.average}/week</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-arena-chalk">Last Week</span>
                  <span className="text-white">{streakData.weeklyFrequency.lastWeek}</span>
                </div>
                <div className="h-2 bg-arena-cage rounded-full overflow-hidden">
                  <div
                    className="h-full bg-arena-steel transition-all"
                    style={{ width: `${(streakData.weeklyFrequency.lastWeek / 7) * 100}%` }}
                  />
                </div>
              </div>
              <div className="flex-1">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-arena-chalk">This Week</span>
                  <span className="text-white">{streakData.weeklyFrequency.thisWeek}</span>
                </div>
                <div className="h-2 bg-arena-cage rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-${getStreakColor()} transition-all`}
                    style={{ width: `${(streakData.weeklyFrequency.thisWeek / 7) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Badges Section */}
      <div className="bg-gradient-to-br from-arena-darker to-arena-floor border-2 border-arena-cage rounded-2xl p-6 shadow-brutal">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <span>🏅</span>
          Achievements
          <span className="text-sm text-arena-chalk font-normal">
            ({achievedBadges.length}/{badges.length})
          </span>
        </h3>

        {/* Next Badge to Earn */}
        {nextBadge && (
          <div className="mb-4 p-4 bg-fighter-ring/10 border border-fighter-ring rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-3xl filter grayscale opacity-50">{nextBadge.icon}</span>
                <div>
                  <div className="text-white font-bold">{nextBadge.name}</div>
                  <div className="text-arena-chalk text-xs">{nextBadge.description}</div>
                </div>
              </div>
              <div className="text-fighter-ring font-bold text-sm">
                {Math.round(nextBadge.progress)}%
              </div>
            </div>
            <div className="h-2 bg-arena-cage rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-fighter-ring to-purple-600 transition-all"
                style={{ width: `${nextBadge.progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Earned Badges */}
        {achievedBadges.length > 0 ? (
          <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
            {achievedBadges.map((badge) => (
              <div
                key={badge.id}
                className="flex flex-col items-center p-3 bg-arena-floor rounded-lg border border-fighter-home/30 hover:border-fighter-home transition-colors"
                title={badge.description}
              >
                <span className="text-3xl mb-1">{badge.icon}</span>
                <span className="text-white text-xs font-bold text-center leading-tight">
                  {badge.name.split(' ')[0]}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6">
            <div className="text-4xl mb-2">🎯</div>
            <p className="text-arena-chalk text-sm">
              Complete workouts to earn badges!
            </p>
          </div>
        )}

        {/* Locked Badges Preview */}
        {achievedBadges.length > 0 && nextBadge && (
          <div className="mt-4 pt-4 border-t border-arena-cage">
            <div className="text-arena-chalk text-xs mb-2">LOCKED</div>
            <div className="flex gap-2 overflow-x-auto">
              {badges
                .filter((b) => !b.achieved)
                .slice(0, 5)
                .map((badge) => (
                  <div
                    key={badge.id}
                    className="flex-shrink-0 flex flex-col items-center p-2 bg-arena-darker rounded-lg opacity-50"
                    title={badge.description}
                  >
                    <span className="text-2xl filter grayscale">{badge.icon}</span>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
