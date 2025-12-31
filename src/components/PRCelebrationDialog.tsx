import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import type { PRUpdate } from '../utils/personalRecords';
import { getPRQuote } from '../data/quotes';

interface PRCelebrationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  prs: PRUpdate[];
}

export default function PRCelebrationDialog({
  open,
  onOpenChange,
  prs,
}: PRCelebrationDialogProps) {
  if (prs.length === 0) return null;

  const prQuote = getPRQuote();

  const getPRIcon = (type: 'weight' | 'reps' | 'both') => {
    switch (type) {
      case 'weight':
        return '🏋️';
      case 'reps':
        return '🔥';
      case 'both':
        return '💪';
    }
  };

  const getPRTitle = (type: 'weight' | 'reps' | 'both') => {
    switch (type) {
      case 'weight':
        return 'New Weight PR!';
      case 'reps':
        return 'New Reps PR!';
      case 'both':
        return 'Double PR!';
    }
  };

  const getPRColor = (type: 'weight' | 'reps' | 'both') => {
    switch (type) {
      case 'weight':
        return 'fighter-ring';
      case 'reps':
        return 'fighter-home';
      case 'both':
        return 'fighter-bag';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gradient-to-br from-arena-darker to-arena-floor border-4 border-fighter-ring animate-pulse-slow max-w-md">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold text-center text-white flex flex-col items-center gap-3">
            <div className="text-6xl animate-bounce">🏆</div>
            <div>Personal Record!</div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* PR Message */}
          <div className="text-center mb-6">
            <p className="text-fighter-ring text-lg font-bold mb-2">
              {prs.length === 1 ? 'You crushed a new PR!' : `You crushed ${prs.length} new PRs!`}
            </p>
            <p className="text-arena-chalk text-sm">
              Keep pushing! The King of Stranglers never stops evolving.
            </p>
          </div>

          {/* PR Details */}
          <div className="space-y-3">
            {prs.map((pr, index) => (
              <div
                key={`${pr.exerciseName}-${index}`}
                className={`p-4 bg-arena-floor border-2 border-${getPRColor(pr.type)} rounded-lg`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-3xl">{getPRIcon(pr.type)}</span>
                  <div className="flex-1">
                    <div className={`text-${getPRColor(pr.type)} font-bold text-sm uppercase`}>
                      {getPRTitle(pr.type)}
                    </div>
                    <div className="text-white font-bold">{pr.exerciseName}</div>
                  </div>
                </div>

                {/* Weight PR Details */}
                {(pr.type === 'weight' || pr.type === 'both') && pr.newWeight && (
                  <div className="flex justify-between items-center py-2 border-t border-arena-cage">
                    <span className="text-arena-chalk text-sm">Max Weight</span>
                    <div className="text-right">
                      {pr.previousWeight && (
                        <div className="text-arena-chalk text-xs line-through">
                          {pr.previousWeight} kg
                        </div>
                      )}
                      <div className="text-fighter-ring font-bold text-lg">
                        {pr.newWeight} kg
                      </div>
                    </div>
                  </div>
                )}

                {/* Reps PR Details */}
                {(pr.type === 'reps' || pr.type === 'both') && pr.newReps && (
                  <div className="flex justify-between items-center py-2 border-t border-arena-cage">
                    <span className="text-arena-chalk text-sm">Max Reps</span>
                    <div className="text-right">
                      {pr.previousReps && (
                        <div className="text-arena-chalk text-xs line-through">
                          {pr.previousReps} reps
                        </div>
                      )}
                      <div className="text-fighter-home font-bold text-lg">
                        {pr.newReps} reps
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Motivational Quote */}
          <div className="p-4 bg-gradient-to-r from-fighter-ring/20 to-fighter-home/20 border border-fighter-ring/50 rounded-lg">
            <p className="text-white text-center italic text-sm">
              "{prQuote.text}"
            </p>
            {prQuote.author && (
              <p className="text-arena-chalk text-center text-xs mt-1">
                — {prQuote.author}
              </p>
            )}
          </div>

          {/* Close Button */}
          <Button
            onClick={() => onOpenChange(false)}
            className="w-full py-6 text-lg bg-gradient-to-r from-fighter-ring to-purple-600 text-white shadow-knockout"
          >
            ✨ Celebrate & Continue
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
