import { useState, useEffect, useMemo } from 'react';
import type { Workout, ExerciseProgress, WorkoutSession as WorkoutSessionType } from '../types/workout';
import CancelWorkoutDialog from './CancelWorkoutDialog';
import RoundTimer from './RoundTimer';
import { Button } from './ui/button';
import { getWorkoutOverloadInfo } from '../utils/progressiveOverload';

interface WorkoutSessionProps {
  workout: Workout;
  sessions: WorkoutSessionType[];
  onComplete: (exercises: ExerciseProgress[], sessionNotes: string, startTime: string, elapsedTime: number) => void;
  onCancel: () => void;
}

export default function WorkoutSession({ workout, sessions, onComplete, onCancel }: WorkoutSessionProps) {
  const [exercises, setExercises] = useState<ExerciseProgress[]>([]);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [sessionNotes, setSessionNotes] = useState('');
  const [startTime] = useState(new Date().toISOString());
  const [elapsedTime, setElapsedTime] = useState(0);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showNotesDialog, setShowNotesDialog] = useState(false);
  const [viewMode, setViewMode] = useState<'exercises' | 'timer'>('exercises');

  const typeColors = {
    home: 'fighter-home',
    gym: 'fighter-gym',
    bag: 'fighter-bag'
  };

  const typeGradients = {
    home: 'from-fighter-home to-green-600',
    gym: 'from-fighter-gym to-blue-600',
    bag: 'from-fighter-bag to-orange-600'
  };

  // Get overload info for current exercise
  const currentExercise = exercises[currentExerciseIndex];
  const overloadInfo = useMemo(() => {
    if (!currentExercise) return null;
    return getWorkoutOverloadInfo(currentExercise.exerciseName, sessions);
  }, [currentExercise, sessions]);

  // Initialize exercises with empty sets
  useEffect(() => {
    const initialExercises: ExerciseProgress[] = workout.exercises.map(exercise => {
      const numSets = parseInt(exercise.sets);
      return {
        exerciseName: exercise.name,
        targetSets: exercise.sets,
        targetReps: exercise.reps,
        notes: exercise.notes,
        completedSets: Array(numSets).fill(null).map(() => ({
          reps: 0,
          weight: 0,
          completed: false
        }))
      };
    });
    setExercises(initialExercises);
  }, [workout]);

  // Timer
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const start = new Date(startTime).getTime();
      setElapsedTime(Math.floor((now - start) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [startTime]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const updateSet = (setIndex: number, field: 'reps' | 'weight', value: number) => {
    const newExercises = [...exercises];
    newExercises[currentExerciseIndex].completedSets[setIndex][field] = value;
    if (field === 'reps' && value > 0) {
      newExercises[currentExerciseIndex].completedSets[setIndex].completed = true;
    }
    setExercises(newExercises);
  };

  const toggleSetComplete = (setIndex: number) => {
    const newExercises = [...exercises];
    const currentSet = newExercises[currentExerciseIndex].completedSets[setIndex];
    currentSet.completed = !currentSet.completed;
    setExercises(newExercises);
  };

  const getTotalSetsCompleted = () => {
    return exercises.reduce((total, exercise) => {
      return total + exercise.completedSets.filter(set => set.completed).length;
    }, 0);
  };

  const getTotalSets = () => {
    return exercises.reduce((total, exercise) => total + exercise.completedSets.length, 0);
  };

  const getCurrentExerciseCompletedSets = () => {
    if (!exercises[currentExerciseIndex]) return 0;
    return exercises[currentExerciseIndex].completedSets.filter(set => set.completed).length;
  };

  const getCurrentExerciseTotalSets = () => {
    if (!exercises[currentExerciseIndex]) return 0;
    return exercises[currentExerciseIndex].completedSets.length;
  };

  const completionPercentage = Math.round((getTotalSetsCompleted() / getTotalSets()) * 100);

  const handlePrevExercise = () => {
    if (currentExerciseIndex > 0) {
      setCurrentExerciseIndex(currentExerciseIndex - 1);
    }
  };

  const handleNextExercise = () => {
    if (currentExerciseIndex < exercises.length - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1);
    }
  };

  const handleComplete = () => {
    setShowNotesDialog(true);
  };

  const handleFinalComplete = () => {
    onComplete(exercises, sessionNotes, startTime, elapsedTime);
  };

  if (!currentExercise) return null;

  const isHeavyBag = workout.type === 'bag';

  // Heavy Bag Timer Configuration
  const heavyBagRounds = 8;
  const heavyBagLabels = [
    'Round 1: Warm Up - Light Combinations',
    'Round 2: Speed Work - Fast Flurries',
    'Round 3: Power Shots - Heavy Hits',
    'Round 4: Combinations - Mix It Up',
    'Round 5: Footwork - Move & Strike',
    'Round 6: Endurance - Keep Pace',
    'Round 7: Power Rounds - Give It All',
    'Round 8: Finisher - Leave Nothing'
  ];

  const handleTimerComplete = () => {
    // Auto-mark all exercises as somewhat complete when timer finishes
    console.log('Heavy bag timer completed!');
  };

  return (
    <div className="min-h-screen flex flex-col bg-arena-dark">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-arena-darker/95 backdrop-blur-sm border-b-2 border-arena-cage p-4">
        <div className="max-w-2xl mx-auto flex justify-between items-center">
          <div className="flex-1">
            <h1 className={`text-xl font-bold text-${typeColors[workout.type]}`}>
              {workout.name}
            </h1>
            <p className="text-sm text-arena-chalk">Day {workout.day}</p>
          </div>
          
          {/* View Toggle for Heavy Bag */}
          {isHeavyBag && (
            <div className="flex gap-2 mr-4">
              <Button
                variant={viewMode === 'exercises' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('exercises')}
                className={viewMode === 'exercises' ? `bg-fighter-bag text-white` : 'text-arena-chalk'}
              >
                📝 Exercises
              </Button>
              <Button
                variant={viewMode === 'timer' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('timer')}
                className={viewMode === 'timer' ? `bg-fighter-bag text-white` : 'text-arena-chalk'}
              >
                ⏱ Timer
              </Button>
            </div>
          )}
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowCancelDialog(true)}
            className="text-fighter-blood hover:bg-fighter-blood/10"
          >
            ✕
          </Button>
        </div>
      </div>

      {/* Main Content - Centered */}
      {viewMode === 'timer' && isHeavyBag ? (
        // Timer View for Heavy Bag
        <div className="flex-1 w-full">
          <RoundTimer
            totalRounds={heavyBagRounds}
            workDuration={180}
            restDuration={60}
            roundLabels={heavyBagLabels}
            onComplete={handleTimerComplete}
          />
        </div>
      ) : (
        // Exercise Tracking View
        <div className="flex-1 flex flex-col items-center justify-center p-4 max-w-2xl mx-auto w-full">
        {/* Exercise Info */}
        <div className="text-center mb-8 w-full">
          <div className="mb-2">
            <span className={`text-${typeColors[workout.type]} text-sm font-bold`}>
              Exercise {currentExerciseIndex + 1} of {exercises.length}
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
            {currentExercise.exerciseName}
          </h2>
          <p className="text-arena-chalk text-sm italic max-w-md mx-auto">
            {currentExercise.notes}
          </p>
          <div className={`mt-3 text-${typeColors[workout.type]} font-bold text-lg`}>
            Target: {currentExercise.targetSets} sets × {currentExercise.targetReps} reps
          </div>

          {/* Progressive Overload Indicator */}
          {overloadInfo?.recommendation && (
            <div className={`mt-4 p-4 rounded-lg border-2 ${
              overloadInfo.recommendation.type === 'increase_weight'
                ? 'bg-fighter-ring/10 border-fighter-ring'
                : overloadInfo.recommendation.type === 'maintain'
                ? 'bg-fighter-home/10 border-fighter-home'
                : 'bg-fighter-bag/10 border-fighter-bag'
            }`}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">
                  {overloadInfo.recommendation.type === 'increase_weight' ? '📈' :
                   overloadInfo.recommendation.type === 'maintain' ? '✅' : '💪'}
                </span>
                <span className={`font-bold ${
                  overloadInfo.recommendation.type === 'increase_weight'
                    ? 'text-fighter-ring'
                    : overloadInfo.recommendation.type === 'maintain'
                    ? 'text-fighter-home'
                    : 'text-fighter-bag'
                }`}>
                  {overloadInfo.recommendation.type === 'increase_weight'
                    ? 'TIME TO LEVEL UP!'
                    : overloadInfo.recommendation.type === 'maintain'
                    ? 'PERFECT RANGE'
                    : 'FOCUS ON FORM'}
                </span>
              </div>
              <p className="text-white text-sm mb-2">{overloadInfo.recommendation.message}</p>
              {overloadInfo.recommendation.suggestedWeight && (
                <div className="text-fighter-ring font-bold">
                  Try: {overloadInfo.recommendation.suggestedWeight}kg × {overloadInfo.recommendation.suggestedReps || 8} reps
                </div>
              )}
              <p className="text-arena-chalk text-xs mt-2">
                {overloadInfo.recommendation.reason}
              </p>
            </div>
          )}

          {/* Last 3 Sessions History */}
          {overloadInfo && overloadInfo.lastThreeSessions.length > 0 && (
            <div className="mt-4 p-3 bg-arena-darker rounded-lg border border-arena-cage">
              <div className="text-arena-chalk text-xs font-bold mb-2">LAST 3 SESSIONS</div>
              <div className="space-y-1">
                {overloadInfo.lastThreeSessions.slice(-3).reverse().map((session, idx) => (
                  <div key={session.sessionId} className="flex justify-between text-xs">
                    <span className="text-arena-chalk">
                      {new Date(session.date).toLocaleDateString()}
                    </span>
                    <span className="text-white font-bold">
                      {session.maxWeight}kg × {Math.round(session.averageReps)} reps avg
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Current Set Display */}
        <div className="w-full max-w-md mb-8">
          <div className="text-center mb-4">
            <div className="text-arena-chalk text-sm mb-2">
              Sets Completed
            </div>
            <div className="text-6xl font-bold text-white">
              {getCurrentExerciseCompletedSets()}/{getCurrentExerciseTotalSets()}
            </div>
          </div>

          {/* Sets Grid */}
          <div className="space-y-3">
            {currentExercise.completedSets.map((set, setIndex) => (
              <div
                key={setIndex}
                className={`p-4 rounded-lg border-2 transition-all ${
                  set.completed
                    ? `bg-${typeColors[workout.type]}/10 border-${typeColors[workout.type]}`
                    : 'bg-arena-darker border-arena-cage'
                }`}
              >
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toggleSetComplete(setIndex)}
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold transition-all flex-shrink-0 ${
                      set.completed
                        ? `bg-gradient-to-r ${typeGradients[workout.type]} text-white shadow-brutal`
                        : 'bg-arena-cage text-arena-steel hover:bg-arena-steel hover:text-white'
                    }`}
                  >
                    {set.completed ? '✓' : setIndex + 1}
                  </button>

                  <div className="flex-1 grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-arena-chalk text-xs mb-1">Reps</label>
                      <input
                        type="number"
                        min="0"
                        value={set.reps || ''}
                        onChange={(e) => updateSet(setIndex, 'reps', parseInt(e.target.value) || 0)}
                        className={`w-full px-3 py-2 bg-arena-floor border border-arena-cage rounded text-white text-center text-lg font-bold focus:outline-none focus:ring-2 focus:ring-${typeColors[workout.type]}`}
                        placeholder="0"
                      />
                    </div>

                    <div>
                      <label className="block text-arena-chalk text-xs mb-1">Weight (kg)</label>
                      <input
                        type="number"
                        min="0"
                        step="0.5"
                        value={set.weight || ''}
                        onChange={(e) => updateSet(setIndex, 'weight', parseFloat(e.target.value) || 0)}
                        className={`w-full px-3 py-2 bg-arena-floor border border-arena-cage rounded text-white text-center text-lg font-bold focus:outline-none focus:ring-2 focus:ring-${typeColors[workout.type]}`}
                        placeholder="0"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Controls */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <Button
            onClick={handlePrevExercise}
            disabled={currentExerciseIndex === 0}
            variant="ghost"
            className="text-arena-chalk hover:text-white disabled:opacity-30"
          >
            ← Prev
          </Button>

          <div className="text-center px-6">
            <div className="text-arena-chalk text-xs mb-1">Exercise</div>
            <div className={`text-2xl font-bold text-${typeColors[workout.type]}`}>
              {currentExerciseIndex + 1}/{exercises.length}
            </div>
          </div>

          <Button
            onClick={handleNextExercise}
            disabled={currentExerciseIndex === exercises.length - 1}
            variant="ghost"
            className="text-arena-chalk hover:text-white disabled:opacity-30"
          >
            Next →
          </Button>
        </div>
        </div>
      )}

      {/* Footer Stats - Only show in exercise view */}
      {viewMode === 'exercises' && (
        <div className="sticky bottom-0 bg-arena-darker/95 backdrop-blur-sm border-t-2 border-arena-cage p-4">
        <div className="max-w-2xl mx-auto">
          <div className="grid grid-cols-3 gap-4 text-center mb-3">
            <div>
              <div className="text-arena-chalk text-xs">Time</div>
              <div className="text-white font-bold">{formatTime(elapsedTime)}</div>
            </div>
            <div>
              <div className="text-arena-chalk text-xs">Total Sets</div>
              <div className={`text-${typeColors[workout.type]} font-bold`}>
                {getTotalSetsCompleted()}/{getTotalSets()}
              </div>
            </div>
            <div>
              <div className="text-arena-chalk text-xs">Progress</div>
              <div className={`text-${typeColors[workout.type]} font-bold`}>
                {completionPercentage}%
              </div>
            </div>
          </div>

          <Button
            onClick={handleComplete}
            className={`w-full py-6 text-lg font-bold bg-gradient-to-r ${typeGradients[workout.type]} text-white shadow-knockout hover:scale-[1.02] transition-transform`}
          >
            Complete Workout
          </Button>
        </div>
      </div>
      )}

      {/* Cancel Dialog */}
      <CancelWorkoutDialog
        open={showCancelDialog}
        onOpenChange={setShowCancelDialog}
        onConfirm={onCancel}
        workoutName={workout.name}
        completedSets={getTotalSetsCompleted()}
        totalSets={getTotalSets()}
      />

      {/* Notes Dialog */}
      {showNotesDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setShowNotesDialog(false)}>
          <div className="absolute inset-0 bg-black/80" />
          <div className="relative bg-arena-darker border-2 border-arena-cage rounded-lg p-6 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-2xl font-bold text-white mb-4">Session Notes</h3>
            <textarea
              value={sessionNotes}
              onChange={(e) => setSessionNotes(e.target.value)}
              placeholder="How did this workout feel? Any notes for next time?"
              className="w-full min-h-[120px] px-4 py-3 bg-arena-floor border border-arena-cage rounded text-white resize-y focus:outline-none focus:ring-2 focus:ring-fighter-ring"
              autoFocus
            />
            <div className="flex gap-3 mt-6">
              <Button
                onClick={() => setShowNotesDialog(false)}
                variant="outline"
                className="flex-1"
              >
                Back
              </Button>
              <Button
                onClick={handleFinalComplete}
                className={`flex-1 bg-gradient-to-r ${typeGradients[workout.type]} text-white`}
              >
                Finish Workout
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
