import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import type { Workout, Exercise } from '../types/workout';
import { EXERCISE_LIBRARY, searchExercises, type ExerciseTemplate } from '../data/exerciseLibrary';

interface WorkoutBuilderProps {
  onClose: () => void;
  onSave: (workout: Workout) => void;
  editWorkout?: Workout | null;
}

export default function WorkoutBuilder({ onClose, onSave, editWorkout }: WorkoutBuilderProps) {
  const [workoutName, setWorkoutName] = useState('');
  const [workoutType, setWorkoutType] = useState<'home' | 'gym' | 'bag'>('gym');
  const [exercises, setExercises] = useState<Exercise[]>([]);
  
  // Exercise library state
  const [showLibrary, setShowLibrary] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedEquipment, setSelectedEquipment] = useState<string>('all');

  // Load edit workout if provided
  useEffect(() => {
    if (editWorkout) {
      setWorkoutName(editWorkout.name);
      setWorkoutType(editWorkout.type);
      setExercises(editWorkout.exercises);
    }
  }, [editWorkout]);

  const filteredExercises = (): ExerciseTemplate[] => {
    let results = searchQuery ? searchExercises(searchQuery) : EXERCISE_LIBRARY;

    if (selectedCategory !== 'all') {
      results = results.filter(ex => ex.category === selectedCategory);
    }

    if (selectedEquipment !== 'all') {
      results = results.filter(ex => ex.equipment === selectedEquipment);
    }

    return results;
  };

  const addExerciseFromLibrary = (template: ExerciseTemplate) => {
    const newExercise: Exercise = {
      name: template.name,
      sets: template.defaultSets?.toString() || '3',
      reps: template.defaultReps || '10-12',
      notes: template.description,
    };
    setExercises([...exercises, newExercise]);
    setShowLibrary(false);
    setSearchQuery('');
  };

  const addBlankExercise = () => {
    const newExercise: Exercise = {
      name: '',
      sets: '3',
      reps: '10-12',
      notes: '',
    };
    setExercises([...exercises, newExercise]);
  };

  const updateExercise = (index: number, updates: Partial<Exercise>) => {
    const updated = exercises.map((ex, i) => (i === index ? { ...ex, ...updates } : ex));
    setExercises(updated);
  };

  const removeExercise = (index: number) => {
    setExercises(exercises.filter((_, i) => i !== index));
  };

  const moveExercise = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === exercises.length - 1)
    ) {
      return;
    }

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    const updated = [...exercises];
    [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
    setExercises(updated);
  };

  const handleSave = () => {
    if (!workoutName.trim()) {
      alert('Please enter a workout name');
      return;
    }

    if (exercises.length === 0) {
      alert('Please add at least one exercise');
      return;
    }

    // Validate all exercises have names
    const hasEmptyNames = exercises.some(ex => !ex.name.trim());
    if (hasEmptyNames) {
      alert('All exercises must have a name');
      return;
    }

    const workout: Workout = {
      id: editWorkout?.id || `custom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      day: 0,
      name: workoutName.trim(),
      type: workoutType,
      exercises,
      isCustom: true,
      createdAt: editWorkout?.createdAt || new Date().toISOString(),
    };

    onSave(workout);
  };

  const categories = [
    { value: 'all', label: 'All Categories', icon: '💪' },
    { value: 'push', label: 'Push', icon: '⬆️' },
    { value: 'pull', label: 'Pull', icon: '⬇️' },
    { value: 'legs', label: 'Legs', icon: '🦵' },
    { value: 'core', label: 'Core', icon: '🎯' },
    { value: 'cardio', label: 'Cardio', icon: '🏃' },
    { value: 'bag', label: 'Bag Work', icon: '🥊' },
    { value: 'flexibility', label: 'Flexibility', icon: '🧘' },
  ];

  const equipmentTypes = [
    { value: 'all', label: 'All Equipment' },
    { value: 'bodyweight', label: 'Bodyweight' },
    { value: 'dumbbells', label: 'Dumbbells' },
    { value: 'barbell', label: 'Barbell' },
    { value: 'machine', label: 'Machine' },
    { value: 'bag', label: 'Heavy Bag' },
    { value: 'none', label: 'No Equipment' },
  ];

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-arena-darker border-2 border-arena-cage rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-arena-darker border-b-2 border-arena-cage p-6 z-10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">
                {editWorkout ? '✏️ Edit Workout' : '🏗️ Create Custom Workout'}
              </h2>
              <p className="text-arena-chalk text-sm mt-1">
                Build your perfect training session
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
          {/* Workout Details */}
          <div className="space-y-4 p-4 bg-arena-floor rounded-lg border border-arena-cage">
            <h3 className="text-white font-semibold text-lg">Workout Details</h3>
            
            <div>
              <label className="text-arena-chalk text-sm mb-1 block">Workout Name *</label>
              <input
                type="text"
                value={workoutName}
                onChange={e => setWorkoutName(e.target.value)}
                placeholder="e.g., Upper Body Power, Core Blast, etc."
                className="bg-arena-cage border border-arena-steel rounded px-4 py-2 text-white w-full"
              />
            </div>

            <div>
              <label className="text-arena-chalk text-sm mb-2 block">Workout Type *</label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => setWorkoutType('home')}
                  className={`py-3 px-4 rounded font-semibold transition-all ${
                    workoutType === 'home'
                      ? 'bg-fighter-home text-white border-2 border-fighter-home'
                      : 'bg-arena-cage text-arena-chalk hover:bg-arena-steel border-2 border-transparent'
                  }`}
                >
                  🏠 Home
                </button>
                <button
                  onClick={() => setWorkoutType('gym')}
                  className={`py-3 px-4 rounded font-semibold transition-all ${
                    workoutType === 'gym'
                      ? 'bg-fighter-gym text-white border-2 border-fighter-gym'
                      : 'bg-arena-cage text-arena-chalk hover:bg-arena-steel border-2 border-transparent'
                  }`}
                >
                  🏋️ Gym
                </button>
                <button
                  onClick={() => setWorkoutType('bag')}
                  className={`py-3 px-4 rounded font-semibold transition-all ${
                    workoutType === 'bag'
                      ? 'bg-fighter-bag text-white border-2 border-fighter-bag'
                      : 'bg-arena-cage text-arena-chalk hover:bg-arena-steel border-2 border-transparent'
                  }`}
                >
                  🥊 Bag
                </button>
              </div>
            </div>
          </div>

          {/* Exercises List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-white font-semibold text-lg">
                Exercises ({exercises.length})
              </h3>
              <div className="flex gap-2">
                <Button
                  onClick={() => setShowLibrary(!showLibrary)}
                  className="bg-fighter-ring hover:bg-fighter-ring/80 text-white"
                >
                  📚 Exercise Library
                </Button>
                <Button
                  onClick={addBlankExercise}
                  className="bg-fighter-gym hover:bg-fighter-gym/80 text-white"
                >
                  ➕ Add Blank
                </Button>
              </div>
            </div>

            {/* Exercise Library Modal */}
            {showLibrary && (
              <div className="p-4 bg-arena-floor rounded-lg border-2 border-fighter-ring space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-white font-semibold">Exercise Library</h4>
                  <Button
                    onClick={() => setShowLibrary(false)}
                    variant="ghost"
                    className="text-arena-chalk hover:text-white"
                  >
                    Close
                  </Button>
                </div>

                {/* Search */}
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="🔍 Search exercises..."
                  className="bg-arena-cage border border-arena-steel rounded px-4 py-2 text-white w-full"
                />

                {/* Filters */}
                <div className="grid grid-cols-2 gap-3">
                  <select
                    value={selectedCategory}
                    onChange={e => setSelectedCategory(e.target.value)}
                    className="bg-arena-cage border border-arena-steel rounded px-3 py-2 text-white"
                  >
                    {categories.map(cat => (
                      <option key={cat.value} value={cat.value}>
                        {cat.icon} {cat.label}
                      </option>
                    ))}
                  </select>

                  <select
                    value={selectedEquipment}
                    onChange={e => setSelectedEquipment(e.target.value)}
                    className="bg-arena-cage border border-arena-steel rounded px-3 py-2 text-white"
                  >
                    {equipmentTypes.map(eq => (
                      <option key={eq.value} value={eq.value}>
                        {eq.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Exercise List */}
                <div className="max-h-64 overflow-y-auto space-y-2">
                  {filteredExercises().map(exercise => (
                    <button
                      key={exercise.id}
                      onClick={() => addExerciseFromLibrary(exercise)}
                      className="w-full text-left p-3 bg-arena-cage hover:bg-arena-steel rounded border border-arena-steel transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="text-white font-semibold">{exercise.name}</div>
                          <div className="text-arena-chalk text-xs mt-1">
                            {exercise.category} • {exercise.equipment} • {exercise.difficulty}
                          </div>
                          <div className="text-arena-chalk text-xs mt-1">
                            {exercise.musclesTargeted.join(', ')}
                          </div>
                        </div>
                        <div className="text-fighter-gym text-xl">+</div>
                      </div>
                    </button>
                  ))}
                  {filteredExercises().length === 0 && (
                    <div className="text-arena-chalk text-center py-8">
                      No exercises found. Try different filters.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Exercise Cards */}
            {exercises.length === 0 ? (
              <div className="text-center py-12 text-arena-chalk bg-arena-floor rounded-lg border border-arena-cage">
                <div className="text-5xl mb-3">💪</div>
                <div className="text-lg font-semibold mb-2">No exercises yet</div>
                <div className="text-sm">
                  Add exercises from the library or create your own
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {exercises.map((exercise, index) => (
                  <div
                    key={index}
                    className="p-4 bg-arena-floor rounded-lg border border-arena-cage space-y-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 space-y-3">
                        <input
                          type="text"
                          value={exercise.name}
                          onChange={e =>
                            updateExercise(index, { name: e.target.value })
                          }
                          placeholder="Exercise name"
                          className="bg-arena-cage border border-arena-steel rounded px-3 py-2 text-white w-full font-semibold"
                        />

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-arena-chalk text-xs mb-1 block">
                              Sets
                            </label>
                            <input
                              type="text"
                              value={exercise.sets}
                              onChange={e =>
                                updateExercise(index, { sets: e.target.value })
                              }
                              placeholder="3"
                              className="bg-arena-cage border border-arena-steel rounded px-3 py-2 text-white w-full"
                            />
                          </div>
                          <div>
                            <label className="text-arena-chalk text-xs mb-1 block">
                              Reps
                            </label>
                            <input
                              type="text"
                              value={exercise.reps}
                              onChange={e =>
                                updateExercise(index, { reps: e.target.value })
                              }
                              placeholder="10-12"
                              className="bg-arena-cage border border-arena-steel rounded px-3 py-2 text-white w-full"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-arena-chalk text-xs mb-1 block">
                            Notes (optional)
                          </label>
                          <textarea
                            value={exercise.notes}
                            onChange={e =>
                              updateExercise(index, { notes: e.target.value })
                            }
                            placeholder="Form cues, tempo, rest time, etc."
                            rows={2}
                            className="bg-arena-cage border border-arena-steel rounded px-3 py-2 text-white w-full text-sm"
                          />
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-col gap-2">
                        <button
                          onClick={() => moveExercise(index, 'up')}
                          disabled={index === 0}
                          className="p-2 bg-arena-cage hover:bg-arena-steel text-white rounded disabled:opacity-30 disabled:cursor-not-allowed"
                          title="Move up"
                        >
                          ▲
                        </button>
                        <button
                          onClick={() => moveExercise(index, 'down')}
                          disabled={index === exercises.length - 1}
                          className="p-2 bg-arena-cage hover:bg-arena-steel text-white rounded disabled:opacity-30 disabled:cursor-not-allowed"
                          title="Move down"
                        >
                          ▼
                        </button>
                        <button
                          onClick={() => removeExercise(index)}
                          className="p-2 bg-fighter-blood/20 hover:bg-fighter-blood text-white rounded"
                          title="Remove"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-arena-darker border-t-2 border-arena-cage p-4 flex gap-3">
          <Button
            onClick={onClose}
            variant="ghost"
            className="flex-1 bg-arena-cage hover:bg-arena-steel text-white"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="flex-1 bg-fighter-home hover:bg-fighter-home/80 text-white font-semibold"
          >
            {editWorkout ? 'Update Workout' : 'Create Workout'}
          </Button>
        </div>
      </div>
    </div>
  );
}
