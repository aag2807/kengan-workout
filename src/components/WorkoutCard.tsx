import type { Workout } from '../types/workout';

interface WorkoutCardProps {
  workout: Workout;
  onStartWorkout: (workout: Workout) => void;
  onEditWorkout?: (workout: Workout) => void;
  onDeleteWorkout?: (workoutId: string) => void;
  onDuplicateWorkout?: (workoutId: string) => void;
}

export default function WorkoutCard({ 
  workout, 
  onStartWorkout,
  onEditWorkout,
  onDeleteWorkout,
  onDuplicateWorkout 
}: WorkoutCardProps) {
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

  const typeLabels = {
    home: '🏠 Home Calisthenics',
    gym: '💪 Gym Equipment',
    bag: '🥊 Heavy Bag'
  };

  const typeBorders = {
    home: 'border-fighter-home',
    gym: 'border-fighter-gym',
    bag: 'border-fighter-bag'
  };

  return (
    <div className={`fighter-card ${typeBorders[workout.type]} hover:scale-[1.01] transition-transform`}>
      {/* Header */}
      <div className="mb-4 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-3">
          {workout.isCustom ? (
            <span className="bg-fighter-ring text-white px-3 py-1 rounded font-bold text-xs uppercase tracking-wider shadow-md">
              Custom
            </span>
          ) : (
            <span className={`bg-${typeColors[workout.type]} text-white px-3 py-1 rounded font-bold text-xs uppercase tracking-wider shadow-md`}>
              Day {workout.day}
            </span>
          )}
          <span className="text-arena-chalk text-xs uppercase tracking-wide">
            {typeLabels[workout.type]}
          </span>
        </div>
      </div>

      <h2 className={`text-2xl font-bold mb-4 text-${typeColors[workout.type]}`}>
        {workout.name}
      </h2>

      {/* Start Workout Button */}
      <button
        onClick={() => onStartWorkout(workout)}
        className={`w-full btn-fighter py-3.5 mb-5 bg-gradient-to-r ${typeGradients[workout.type]} text-white shadow-brutal hover:shadow-knockout uppercase tracking-wide text-base`}
      >
        ⚡ Start Workout
      </button>

      {/* Custom Workout Actions */}
      {workout.isCustom && (onEditWorkout || onDeleteWorkout || onDuplicateWorkout) && (
        <div className="flex gap-2 mb-5">
          {onEditWorkout && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEditWorkout(workout);
              }}
              className="flex-1 py-2 bg-arena-cage hover:bg-arena-steel text-white rounded border border-arena-steel transition-colors text-sm"
            >
              ✏️ Edit
            </button>
          )}
          {onDuplicateWorkout && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDuplicateWorkout(workout.id);
              }}
              className="flex-1 py-2 bg-arena-cage hover:bg-arena-steel text-white rounded border border-arena-steel transition-colors text-sm"
            >
              📋 Copy
            </button>
          )}
          {onDeleteWorkout && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDeleteWorkout(workout.id);
              }}
              className="flex-1 py-2 bg-fighter-blood/20 hover:bg-fighter-blood text-white rounded border border-fighter-blood transition-colors text-sm"
            >
              🗑️ Delete
            </button>
          )}
        </div>
      )}

      {/* Exercises */}
      <div className="space-y-3">
        {workout.exercises.map((exercise, index) => (
          <div
            key={index}
            className="p-4 bg-arena-floor rounded-lg border border-arena-cage hover:border-arena-steel transition-colors"
          >
            <div className="flex justify-between items-start mb-2 gap-3">
              <h3 className="font-bold text-white text-base flex-1">
                {exercise.name}
              </h3>
              <span className={`text-${typeColors[workout.type]} font-bold text-sm whitespace-nowrap`}>
                {exercise.sets} × {exercise.reps}
              </span>
            </div>
            <p className="text-arena-chalk text-xs italic leading-relaxed">
              {exercise.notes}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
