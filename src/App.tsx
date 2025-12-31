import { useState, useEffect } from 'react';
import { cosmoProgram, programStats } from './data/cosmoProgram';
import WorkoutCard from './components/WorkoutCard';
import ProgramStatsCard from './components/ProgramStats';
import WorkoutSession from './components/WorkoutSession';
import ProfileSheet from './components/ProfileSheet';
import WorkoutHistory from './components/WorkoutHistory';
import WorkoutCompleteDialog from './components/WorkoutCompleteDialog';
import PRCelebrationDialog from './components/PRCelebrationDialog';
import NutritionTracker from './components/NutritionTracker';
import StreakDisplay from './components/StreakDisplay';
import NotificationSettings from './components/NotificationSettings';
import WorkoutBuilder from './components/WorkoutBuilder';
import { useWorkoutSessions } from './hooks/useWorkoutSessions';
import { useUserProfile } from './hooks/useUserProfile';
import { useCustomWorkouts } from './hooks/useCustomWorkouts';
import { useTheme } from './contexts/ThemeContext';
import { calculatePersonalRecords, checkForNewPRs, type PRUpdate } from './utils/personalRecords';
import { getRandomQuote, type Quote } from './data/quotes';
import type { Workout, ExerciseProgress } from './types/workout';
import { Button } from './components/ui/button';

function App() {
  const [filter, setFilter] = useState<'all' | 'home' | 'gym' | 'bag'>('all');
  const [activeWorkout, setActiveWorkout] = useState<Workout | null>(null);
  const [showProfile, setShowProfile] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showNutrition, setShowNutrition] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showWorkoutBuilder, setShowWorkoutBuilder] = useState(false);
  const [editingWorkout, setEditingWorkout] = useState<Workout | null>(null);
  const [showCompleteDialog, setShowCompleteDialog] = useState(false);
  const [showPRDialog, setShowPRDialog] = useState(false);
  const [newPRs, setNewPRs] = useState<PRUpdate[]>([]);
  const [completedWorkoutData, setCompletedWorkoutData] = useState<{
    name: string;
    type: 'home' | 'gym' | 'bag';
    completedSets: number;
    totalSets: number;
    duration: string;
  } | null>(null);
  const [dailyQuote, setDailyQuote] = useState<Quote>(getRandomQuote());
  const { sessions, saveSession } = useWorkoutSessions();
  const { profile, updateProfile, addWeighIn, getWeightProgress, addNutritionLog, updateNutritionTargets } = useUserProfile();
  const { customWorkouts, saveWorkout, deleteWorkout, duplicateWorkout } = useCustomWorkouts();
  const { theme, toggleTheme } = useTheme();

  // Refresh quote on mount
  useEffect(() => {
    setDailyQuote(getRandomQuote());
  }, []);

  // Combine default and custom workouts
  const allWorkouts = [...cosmoProgram.workouts, ...customWorkouts];

  const filteredWorkouts = filter === 'all'
    ? allWorkouts
    : allWorkouts.filter(w => w.type === filter);

  const workoutsByType = {
    home: cosmoProgram.workouts.filter(w => w.type === 'home'),
    gym: cosmoProgram.workouts.filter(w => w.type === 'gym'),
    bag: cosmoProgram.workouts.filter(w => w.type === 'bag'),
  };

  const handleStartWorkout = (workout: Workout) => {
    setActiveWorkout(workout);
  };

  const handleEditWorkout = (workout: Workout) => {
    setEditingWorkout(workout);
    setShowWorkoutBuilder(true);
  };

  const handleDeleteWorkout = async (workoutId: string) => {
    if (confirm('Are you sure you want to delete this custom workout?')) {
      await deleteWorkout(workoutId);
    }
  };

  const handleDuplicateWorkout = async (workoutId: string) => {
    const duplicate = await duplicateWorkout(workoutId);
    if (duplicate) {
      alert(`Created duplicate: ${duplicate.name}`);
    }
  };

  const handleSaveWorkout = async (workout: Workout) => {
    const success = await saveWorkout(workout);
    if (success) {
      setShowWorkoutBuilder(false);
      setEditingWorkout(null);
      alert(`Workout "${workout.name}" ${editingWorkout ? 'updated' : 'created'} successfully!`);
    } else {
      alert('Failed to save workout. Please try again.');
    }
  };

  const handleCloseBuilder = () => {
    setShowWorkoutBuilder(false);
    setEditingWorkout(null);
  };

  const handleCompleteWorkout = async (exercises: ExerciseProgress[], sessionNotes: string, startTime: string, elapsedTime: number) => {
    if (!activeWorkout) return;

    // Check for PRs before saving
    const existingRecords = calculatePersonalRecords(sessions);
    const currentSessionData = exercises.flatMap(exercise =>
      exercise.completedSets
        .filter(set => set.completed && set.weight > 0)
        .map(set => ({
          exerciseName: exercise.exerciseName,
          weight: set.weight,
          reps: set.reps
        }))
    );
    const detectedPRs = checkForNewPRs(currentSessionData, existingRecords);

    const now = new Date();
    const session = {
      id: `session-${Date.now()}`,
      workoutId: activeWorkout.id,
      workoutName: activeWorkout.name,
      workoutType: activeWorkout.type,
      date: now.toISOString(),
      startTime,
      endTime: now.toISOString(),
      exercises,
      sessionNotes
    };

    const success = await saveSession(session);
    
    if (success) {
      // Calculate completed sets
      const completedSets = exercises.reduce((total, exercise) => {
        return total + exercise.completedSets.filter(set => set.completed).length;
      }, 0);
      
      const totalSets = exercises.reduce((total, exercise) => {
        return total + exercise.completedSets.length;
      }, 0);

      // Format duration
      const mins = Math.floor(elapsedTime / 60);
      const secs = elapsedTime % 60;
      const duration = `${mins}:${secs.toString().padStart(2, '0')}`;

      // Store data for completion dialog
      setCompletedWorkoutData({
        name: activeWorkout.name,
        type: activeWorkout.type,
        completedSets,
        totalSets,
        duration
      });

      setActiveWorkout(null);
      setShowCompleteDialog(true);

      // If PRs detected, show celebration after completion dialog
      if (detectedPRs.length > 0) {
        setNewPRs(detectedPRs);
      }
    } else {
      alert('Failed to save workout. Please try again.');
    }
  };

  const handleCancelWorkout = () => {
    setActiveWorkout(null);
  };

  // If there's an active workout, show the session screen
  if (activeWorkout) {
    return (
      <WorkoutSession
        workout={activeWorkout}
        sessions={sessions}
        onComplete={handleCompleteWorkout}
        onCancel={handleCancelWorkout}
      />
    );
  }

  // If showing profile, render profile sheet
  if (showProfile) {
    return (
      <ProfileSheet
        open={showProfile}
        onOpenChange={setShowProfile}
        profile={profile}
        onUpdateProfile={updateProfile}
        onAddWeighIn={addWeighIn}
        weightProgress={getWeightProgress()}
        sessions={sessions}
      />
    );
  }

  // If showing history, render workout history
  if (showHistory) {
    return (
      <WorkoutHistory
        open={showHistory}
        onOpenChange={setShowHistory}
        sessions={sessions}
      />
    );
  }

  // If showing nutrition, render nutrition tracker
  if (showNutrition) {
    return (
      <div className="fixed inset-0 z-50 bg-arena-dark">
        {/* Header */}
        <div className="sticky top-0 bg-arena-darker/95 backdrop-blur-sm border-b-2 border-arena-cage p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowNutrition(false)}
                className="text-white"
              >
                ←
              </Button>
              <div>
                <h2 className="text-2xl font-bold text-white">Nutrition</h2>
                <p className="text-arena-chalk text-sm">Track your daily intake</p>
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-y-auto p-6" style={{ maxHeight: 'calc(100vh - 80px)' }}>
          <NutritionTracker
            logs={profile.nutritionLogs}
            targets={profile.nutritionTargets}
            onAddLog={addNutritionLog}
            onUpdateTargets={updateNutritionTargets}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-arena-dark to-arena-darker pb-20">
      {/* Header */}
      <div className="pt-8 pb-6 px-6">
        <h1 className="text-5xl font-bold text-white mb-2 uppercase tracking-tight">
          Workout
        </h1>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-white font-semibold">Cosmo Program</div>
            <div className="text-arena-chalk text-sm uppercase tracking-wide">
              The King of Stranglers
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="bg-arena-cage/50 hover:bg-arena-cage text-white rounded-full w-12 h-12"
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowNotifications(true)}
              className="bg-arena-cage/50 hover:bg-arena-cage text-white rounded-full w-12 h-12"
              title="Notifications & Reminders"
            >
              🔔
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowProfile(true)}
              className="bg-arena-cage/50 hover:bg-arena-cage text-white rounded-full w-12 h-12"
            >
              ☰
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowNutrition(true)}
              className="bg-arena-cage/50 hover:bg-arena-cage text-white rounded-full w-12 h-12"
            >
              🍗
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowHistory(true)}
              className="bg-arena-cage/50 hover:bg-arena-cage text-white rounded-full w-12 h-12"
            >
              ♥
            </Button>
          </div>
        </div>
      </div>

      {/* Daily Motivational Quote */}
      <div className="px-6 mb-6">
        <div className="bg-gradient-to-r from-fighter-ring/20 to-fighter-blood/20 border-2 border-fighter-ring/50 rounded-2xl p-6 shadow-brutal relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 text-9xl opacity-5 select-none">💪</div>
          
          <div className="relative z-10">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="flex-1">
                <div className="text-fighter-ring text-xs uppercase tracking-widest font-bold mb-2">
                  Quote of the Day
                </div>
                <p className="text-white text-lg md:text-xl font-semibold leading-relaxed italic">
                  "{dailyQuote.text}"
                </p>
                {dailyQuote.author && (
                  <p className="text-arena-chalk text-sm mt-2">
                    — {dailyQuote.author}
                  </p>
                )}
              </div>
              <button
                onClick={() => setDailyQuote(getRandomQuote())}
                className="bg-fighter-ring/20 hover:bg-fighter-ring/40 text-white rounded-full w-10 h-10 flex items-center justify-center transition-colors flex-shrink-0"
                title="Get new quote"
              >
                🔄
              </button>
            </div>
            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-fighter-ring/20">
              <span className="text-xs uppercase tracking-wider text-fighter-ring/80 font-semibold">
                {dailyQuote.category}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Program Stats Card */}
      <div className="px-6 mb-6">
        <ProgramStatsCard stats={programStats} />
      </div>

      {/* Streak Display */}
      <div className="px-6 mb-6">
        <StreakDisplay sessions={sessions} />
      </div>

      {/* Workout Category Cards */}
      <div className="px-6 space-y-4">
        {/* Home Workouts */}
        <div 
          className="bg-gradient-to-br from-arena-darker to-arena-floor border-2 border-fighter-home/30 rounded-2xl p-6 shadow-brutal hover:shadow-knockout transition-all cursor-pointer group"
          onClick={() => setFilter('home')}
        >
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-gradient-to-br from-fighter-home to-green-700 rounded-2xl flex items-center justify-center text-4xl shadow-lg">
              🏠
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-white mb-1 group-hover:text-fighter-home transition-colors">
                Home Workouts
              </h3>
              <p className="text-arena-chalk text-sm uppercase tracking-wider">
                {workoutsByType.home.length} workouts
              </p>
            </div>
            <div className="text-fighter-home text-2xl group-hover:translate-x-1 transition-transform">
              →
            </div>
          </div>
        </div>

        {/* Gym Workouts */}
        <div 
          className="bg-gradient-to-br from-arena-darker to-arena-floor border-2 border-fighter-gym/30 rounded-2xl p-6 shadow-brutal hover:shadow-knockout transition-all cursor-pointer group"
          onClick={() => setFilter('gym')}
        >
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-gradient-to-br from-fighter-gym to-blue-700 rounded-2xl flex items-center justify-center text-4xl shadow-lg">
              💪
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-white mb-1 group-hover:text-fighter-gym transition-colors">
                Gym Equipment
              </h3>
              <p className="text-arena-chalk text-sm uppercase tracking-wider">
                {workoutsByType.gym.length} workouts
              </p>
            </div>
            <div className="text-fighter-gym text-2xl group-hover:translate-x-1 transition-transform">
              →
            </div>
          </div>
        </div>

        {/* Heavy Bag */}
        <div 
          className="bg-gradient-to-br from-arena-darker to-arena-floor border-2 border-fighter-bag/30 rounded-2xl p-6 shadow-brutal hover:shadow-knockout transition-all cursor-pointer group"
          onClick={() => setFilter('bag')}
        >
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-gradient-to-br from-fighter-bag to-orange-700 rounded-2xl flex items-center justify-center text-4xl shadow-lg">
              🥊
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-white mb-1 group-hover:text-fighter-bag transition-colors">
                Heavy Bag
              </h3>
              <p className="text-arena-chalk text-sm uppercase tracking-wider">
                {workoutsByType.bag.length} workout
              </p>
            </div>
            <div className="text-fighter-bag text-2xl group-hover:translate-x-1 transition-transform">
              →
            </div>
          </div>
        </div>
      </div>

      {/* Create Custom Workout Button */}
      <div className="mt-6">
        <button
          onClick={() => setShowWorkoutBuilder(true)}
          className="w-full bg-gradient-to-r from-fighter-ring to-purple-700 border-2 border-fighter-ring rounded-2xl p-6 shadow-brutal hover:shadow-knockout transition-all group"
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-4xl">
              ➕
            </div>
            <div className="flex-1 text-left">
              <h3 className="text-2xl font-bold text-white mb-1">
                Create Custom Workout
              </h3>
              <p className="text-white/80 text-sm">
                Build your own training program
              </p>
            </div>
            <div className="text-white text-2xl group-hover:translate-x-1 transition-transform">
              →
            </div>
          </div>
        </button>
      </div>

      {/* Workout List Modal/Sheet */}
      {filter !== 'all' && (
        <div className="fixed inset-0 z-50 bg-arena-dark">
          {/* Header */}
          <div className="sticky top-0 bg-arena-darker/95 backdrop-blur-sm border-b-2 border-arena-cage p-4 flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setFilter('all')}
              className="text-white"
            >
              ←
            </Button>
            <div>
              <h2 className="text-2xl font-bold text-white">
                {filter === 'home' && '🏠 Home Workouts'}
                {filter === 'gym' && '💪 Gym Equipment'}
                {filter === 'bag' && '🥊 Heavy Bag'}
              </h2>
              <p className="text-arena-chalk text-sm">
                {filteredWorkouts.length} workout{filteredWorkouts.length !== 1 ? 's' : ''} available
              </p>
            </div>
          </div>

          {/* Workout List */}
          <div className="p-4 space-y-4 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 80px)' }}>
            {filteredWorkouts.map(workout => (
              <WorkoutCard 
                key={workout.id} 
                workout={workout}
                onStartWorkout={handleStartWorkout}
                onEditWorkout={workout.isCustom ? handleEditWorkout : undefined}
                onDeleteWorkout={workout.isCustom ? handleDeleteWorkout : undefined}
                onDuplicateWorkout={workout.isCustom ? handleDuplicateWorkout : undefined}
              />
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      {filter === 'all' && (
        <footer className="mt-12 px-6 pb-6">
          <div className="p-6 bg-arena-darker border-2 border-fighter-blood/30 rounded-2xl shadow-brutal">
            <h3 className="text-fighter-blood text-xl font-bold mb-4 text-center uppercase tracking-wide flex items-center justify-center gap-2">
              <span>⚡</span>
              Critical Reminders
              <span>⚡</span>
            </h3>
            <ul className="space-y-2.5 text-sm text-arena-chalk leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="text-fighter-blood font-bold">▸</span>
                <span><strong className="text-white">NUTRITION IS 80% OF THE RESULTS</strong> - Hit 170g protein and 2000-2100 calories daily</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-fighter-home font-bold">▸</span>
                <span>Track every workout - reps, sets, weights, difficulty level</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-fighter-gym font-bold">▸</span>
                <span>Rest 90-120 seconds between sets for strength work</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-fighter-bag font-bold">▸</span>
                <span>Sleep 7-8 hours, stay hydrated (3-4L water daily)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-fighter-ring font-bold">▸</span>
                <span>Weekly weigh-in every Monday morning (after bathroom, before eating)</span>
              </li>
            </ul>
          </div>
        </footer>
      )}

      {/* Workout Complete Dialog */}
      {completedWorkoutData && (
        <WorkoutCompleteDialog
          open={showCompleteDialog}
          onOpenChange={(open) => {
            setShowCompleteDialog(open);
            // Show PR dialog when completion dialog closes if there are PRs
            if (!open && newPRs.length > 0) {
              setTimeout(() => setShowPRDialog(true), 300);
            }
          }}
          workoutName={completedWorkoutData.name}
          workoutType={completedWorkoutData.type}
          completedSets={completedWorkoutData.completedSets}
          totalSets={completedWorkoutData.totalSets}
          duration={completedWorkoutData.duration}
        />
      )}

      {/* PR Celebration Dialog */}
      <PRCelebrationDialog
        open={showPRDialog}
        onOpenChange={(open) => {
          setShowPRDialog(open);
          if (!open) setNewPRs([]); // Clear PRs when dialog closes
        }}
        prs={newPRs}
      />

      {/* Notification Settings */}
      {showNotifications && (
        <NotificationSettings onClose={() => setShowNotifications(false)} />
      )}

      {/* Workout Builder */}
      {showWorkoutBuilder && (
        <WorkoutBuilder
          onClose={handleCloseBuilder}
          onSave={handleSaveWorkout}
          editWorkout={editingWorkout}
        />
      )}
    </div>
  );
}

export default App;
