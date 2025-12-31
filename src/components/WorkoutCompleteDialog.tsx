import { Button } from './ui/button';
import { getWorkoutCompletionQuote } from '../data/quotes';

interface WorkoutCompleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workoutName: string;
  workoutType: 'home' | 'gym' | 'bag';
  completedSets: number;
  totalSets: number;
  duration: string;
}

export default function WorkoutCompleteDialog({
  open,
  onOpenChange,
  workoutName,
  workoutType,
  completedSets,
  totalSets,
  duration
}: WorkoutCompleteDialogProps) {
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

  const completionPercentage = Math.round((completedSets / totalSets) * 100);
  const completionQuote = getWorkoutCompletionQuote();

  if (!open) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={() => onOpenChange(false)}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 animate-in fade-in" />
      
      {/* Modal */}
      <div 
        className="relative bg-arena-darker border-2 border-arena-cage rounded-2xl p-8 max-w-md w-full shadow-knockout animate-in zoom-in-95 slide-in-from-bottom-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Success Icon */}
        <div className="text-center mb-6">
          <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br ${typeGradients[workoutType]} shadow-knockout mb-4 animate-in zoom-in-95`}>
            <span className="text-5xl">✓</span>
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">
            Workout Complete!
          </h2>
          <p className="text-arena-chalk">
            {workoutName}
          </p>
        </div>

        {/* Stats */}
        <div className="space-y-4 mb-6">
          <div className="p-4 bg-arena-floor rounded-lg border border-arena-cage">
            <div className="flex justify-between items-center mb-2">
              <span className="text-arena-chalk text-sm">Sets Completed</span>
              <span className={`text-${typeColors[workoutType]} font-bold text-2xl`}>
                {completedSets}/{totalSets}
              </span>
            </div>
            <div className="h-2 bg-arena-cage rounded-full overflow-hidden">
              <div 
                className={`h-full bg-gradient-to-r ${typeGradients[workoutType]} transition-all duration-500`}
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-arena-floor rounded-lg border border-arena-cage text-center">
              <div className="text-arena-chalk text-xs mb-1">Duration</div>
              <div className="text-white font-bold text-xl">{duration}</div>
            </div>
            <div className="p-3 bg-arena-floor rounded-lg border border-arena-cage text-center">
              <div className="text-arena-chalk text-xs mb-1">Progress</div>
              <div className={`text-${typeColors[workoutType]} font-bold text-xl`}>
                {completionPercentage}%
              </div>
            </div>
          </div>
        </div>

        {/* Motivational Message */}
        <div className={`p-4 bg-gradient-to-r ${typeGradients[workoutType]}/10 border-l-4 border-${typeColors[workoutType]} rounded mb-6`}>
          <p className="text-white font-bold text-center mb-2">
            {completionPercentage === 100 
              ? "Perfect! You crushed it! 💪🔥" 
              : completionPercentage >= 80 
                ? "Great work! Keep it up! 💪"
                : "Good effort! Every rep counts! 👊"
            }
          </p>
          <div className="mt-3 pt-3 border-t border-arena-cage/50">
            <p className="text-white/90 italic text-sm text-center">
              "{completionQuote.text}"
            </p>
            {completionQuote.author && (
              <p className="text-arena-chalk text-xs text-center mt-1">
                — {completionQuote.author}
              </p>
            )}
          </div>
        </div>

        {/* Action Button */}
        <Button
          onClick={() => onOpenChange(false)}
          className={`w-full py-6 text-lg font-bold bg-gradient-to-r ${typeGradients[workoutType]} text-white shadow-brutal hover:shadow-knockout transition-all`}
        >
          Done
        </Button>

        {/* Recovery Reminder */}
        <p className="text-center text-arena-chalk text-xs mt-4">
          Remember: Rest 90-120s between sets next time 💧
        </p>
      </div>
    </div>
  );
}
