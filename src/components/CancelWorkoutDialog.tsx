import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog"

interface CancelWorkoutDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  workoutName: string
  completedSets: number
  totalSets: number
}

export default function CancelWorkoutDialog({
  open,
  onOpenChange,
  onConfirm,
  workoutName,
  completedSets,
  totalSets
}: CancelWorkoutDialogProps) {
  const hasProgress = completedSets > 0
  const progressPercentage = Math.round((completedSets / totalSets) * 100)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-arena-darker border-2 border-arena-cage">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2 text-white">
            <span className="text-fighter-blood">⚠️</span>
            Cancel Workout?
          </DialogTitle>
          <DialogDescription className="text-base pt-2 text-arena-chalk">
            Are you sure you want to cancel <strong className="text-white">{workoutName}</strong>?
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {hasProgress ? (
            <div className="space-y-4">
              <div className="p-4 bg-arena-floor border border-arena-cage rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-arena-chalk text-sm">Your Progress:</span>
                  <span className="text-white font-bold">
                    {completedSets} / {totalSets} sets
                  </span>
                </div>
                <div className="h-2 bg-arena-cage rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-fighter-blood to-orange-600 transition-all"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
                <p className="text-xs text-arena-chalk mt-2">
                  {progressPercentage}% complete
                </p>
              </div>
              <div className="flex items-start gap-3 p-3 bg-fighter-blood/10 border-l-4 border-fighter-blood rounded">
                <span className="text-xl">💪</span>
                <p className="text-sm text-arena-chalk">
                  <strong className="text-white">All progress will be lost!</strong> Consider finishing your workout or saving your session notes.
                </p>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-arena-floor border border-arena-cage rounded-lg text-center">
              <p className="text-arena-chalk text-sm">
                No sets completed yet. You can start fresh anytime.
              </p>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <button
            onClick={() => onOpenChange(false)}
            className="btn-fighter px-6 py-2.5 bg-arena-floor text-white hover:bg-arena-cage border border-arena-cage"
          >
            Keep Training
          </button>
          <button
            onClick={() => {
              onConfirm()
              onOpenChange(false)
            }}
            className="btn-fighter px-6 py-2.5 bg-gradient-to-r from-fighter-blood to-red-600 text-white shadow-brutal"
          >
            Yes, Cancel
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
