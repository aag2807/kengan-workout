import { useState } from 'react';
import { Button } from './ui/button';
import type { WorkoutSession } from '../types/workout';

interface WorkoutHistoryProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sessions: WorkoutSession[];
}

export default function WorkoutHistory({ open, onOpenChange, sessions }: WorkoutHistoryProps) {
  const [selectedMonth, setSelectedMonth] = useState(new Date());

  if (!open) return null;

  const typeColors = {
    home: 'fighter-home',
    gym: 'fighter-gym',
    bag: 'fighter-bag'
  };

  const typeEmojis = {
    home: '🏠',
    gym: '💪',
    bag: '🥊'
  };

  // Get calendar days for the selected month
  const getCalendarDays = () => {
    const year = selectedMonth.getFullYear();
    const month = selectedMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of month
    for (let i = 0; i < startDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  // Get workouts for a specific date
  const getWorkoutsForDate = (date: Date | null) => {
    if (!date) return [];
    const dateStr = date.toISOString().split('T')[0];
    return sessions.filter(session => {
      const sessionDate = new Date(session.date).toISOString().split('T')[0];
      return sessionDate === dateStr;
    });
  };

  // Navigation
  const previousMonth = () => {
    setSelectedMonth(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() - 1));
  };

  const nextMonth = () => {
    setSelectedMonth(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1));
  };

  const goToToday = () => {
    setSelectedMonth(new Date());
  };

  const monthName = selectedMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const calendarDays = getCalendarDays();
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Get stats
  const totalWorkouts = sessions.length;
  const workoutsByType = sessions.reduce((acc, session) => {
    acc[session.workoutType] = (acc[session.workoutType] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="fixed inset-0 z-50 bg-arena-dark">
      {/* Header */}
      <div className="sticky top-0 bg-arena-darker/95 backdrop-blur-sm border-b-2 border-arena-cage p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
              className="text-white"
            >
              ←
            </Button>
            <div>
              <h2 className="text-2xl font-bold text-white">Workout History</h2>
              <p className="text-arena-chalk text-sm">{totalWorkouts} workouts completed</p>
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-y-auto p-6 space-y-6" style={{ maxHeight: 'calc(100vh - 80px)' }}>
        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-gradient-to-br from-fighter-home/20 to-arena-darker border border-fighter-home/30 rounded-xl p-4 text-center">
            <div className="text-3xl mb-1">🏠</div>
            <div className="text-2xl font-bold text-white">{workoutsByType.home || 0}</div>
            <div className="text-xs text-arena-chalk uppercase">Home</div>
          </div>
          <div className="bg-gradient-to-br from-fighter-gym/20 to-arena-darker border border-fighter-gym/30 rounded-xl p-4 text-center">
            <div className="text-3xl mb-1">💪</div>
            <div className="text-2xl font-bold text-white">{workoutsByType.gym || 0}</div>
            <div className="text-xs text-arena-chalk uppercase">Gym</div>
          </div>
          <div className="bg-gradient-to-br from-fighter-bag/20 to-arena-darker border border-fighter-bag/30 rounded-xl p-4 text-center">
            <div className="text-3xl mb-1">🥊</div>
            <div className="text-2xl font-bold text-white">{workoutsByType.bag || 0}</div>
            <div className="text-xs text-arena-chalk uppercase">Bag</div>
          </div>
        </div>

        {/* Calendar Navigation */}
        <div className="bg-gradient-to-br from-arena-darker to-arena-floor border-2 border-arena-cage rounded-2xl p-6 shadow-brutal">
          <div className="flex items-center justify-between mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={previousMonth}
              className="text-white hover:text-fighter-ring"
            >
              ← Prev
            </Button>
            <div className="text-center">
              <h3 className="text-xl font-bold text-white">{monthName}</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={goToToday}
                className="text-arena-chalk text-xs hover:text-white"
              >
                Today
              </Button>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={nextMonth}
              className="text-white hover:text-fighter-ring"
            >
              Next →
            </Button>
          </div>

          {/* Calendar Grid */}
          <div>
            {/* Week days header */}
            <div className="grid grid-cols-7 gap-2 mb-2">
              {weekDays.map(day => (
                <div key={day} className="text-center text-xs font-bold text-arena-chalk uppercase">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar days */}
            <div className="grid grid-cols-7 gap-2">
              {calendarDays.map((date, index) => {
                const workouts = date ? getWorkoutsForDate(date) : [];
                const isToday = date && 
                  date.toISOString().split('T')[0] === new Date().toISOString().split('T')[0];
                const hasWorkout = workouts.length > 0;

                return (
                  <div
                    key={index}
                    className={`aspect-square rounded-lg p-1 flex flex-col items-center justify-center text-sm transition-all ${
                      !date 
                        ? 'bg-transparent' 
                        : isToday
                          ? 'bg-fighter-ring/30 border-2 border-fighter-ring'
                          : hasWorkout
                            ? `bg-${typeColors[workouts[0].workoutType]}/20 border border-${typeColors[workouts[0].workoutType]}/50 hover:bg-${typeColors[workouts[0].workoutType]}/30`
                            : 'bg-arena-floor border border-arena-cage hover:bg-arena-cage'
                    }`}
                  >
                    {date && (
                      <>
                        <div className={`font-bold mb-0.5 ${hasWorkout ? 'text-white' : 'text-arena-chalk'}`}>
                          {date.getDate()}
                        </div>
                        {hasWorkout && (
                          <div className="text-xs">
                            {workouts.map((workout, i) => (
                              <span key={i}>{typeEmojis[workout.workoutType]}</span>
                            ))}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Legend */}
          <div className="mt-6 pt-6 border-t border-arena-cage">
            <div className="flex items-center justify-center gap-6 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-fighter-home/20 border border-fighter-home/50"></div>
                <span className="text-arena-chalk">Home</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-fighter-gym/20 border border-fighter-gym/50"></div>
                <span className="text-arena-chalk">Gym</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-fighter-bag/20 border border-fighter-bag/50"></div>
                <span className="text-arena-chalk">Bag</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-fighter-ring/30 border-2 border-fighter-ring"></div>
                <span className="text-arena-chalk">Today</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Workouts List */}
        <div className="bg-gradient-to-br from-arena-darker to-arena-floor border-2 border-arena-cage rounded-2xl p-6 shadow-brutal">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span>📋</span>
            Recent Workouts
          </h3>
          {sessions.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-arena-chalk">No workouts completed yet.</p>
              <p className="text-arena-chalk text-sm mt-2">Start your first workout to see it here!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {sessions.slice(-10).reverse().map((session) => (
                <div
                  key={session.id}
                  className={`p-4 rounded-lg border-l-4 bg-arena-floor transition-all hover:bg-arena-cage border-${typeColors[session.workoutType]}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xl">{typeEmojis[session.workoutType]}</span>
                        <h4 className="text-white font-bold">{session.workoutName}</h4>
                      </div>
                      <div className="text-arena-chalk text-sm">
                        {new Date(session.date).toLocaleDateString('en-US', { 
                          weekday: 'short',
                          month: 'short', 
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </div>
                      {session.sessionNotes && (
                        <p className="text-arena-chalk text-xs mt-2 italic line-clamp-2">
                          {session.sessionNotes}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <div className={`text-${typeColors[session.workoutType]} font-bold text-lg`}>
                        {session.exercises.reduce((total, ex) => 
                          total + ex.completedSets.filter(set => set.completed).length, 0
                        )}
                      </div>
                      <div className="text-arena-chalk text-xs">sets</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
