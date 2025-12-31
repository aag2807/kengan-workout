import { useState, useEffect, useRef } from 'react';
import { Button } from './ui/button';

interface RoundTimerProps {
  totalRounds: number;
  workDuration?: number;  // seconds (default 180 = 3 min)
  restDuration?: number;  // seconds (default 60 = 1 min)
  roundLabels?: string[];
  onComplete?: () => void;
}

type TimerState = 'ready' | 'working' | 'resting' | 'paused' | 'finished';

export default function RoundTimer({
  totalRounds: initialRounds,
  workDuration: initialWorkDuration = 180,
  restDuration: initialRestDuration = 60,
  roundLabels = [],
  onComplete
}: RoundTimerProps) {
  // Configurable settings
  const [totalRounds, setTotalRounds] = useState(initialRounds);
  const [workDuration, setWorkDuration] = useState(initialWorkDuration);
  const [restDuration, setRestDuration] = useState(initialRestDuration);
  const [showSettings, setShowSettings] = useState(true);
  
  // Timer state
  const [currentRound, setCurrentRound] = useState(1);
  const [timeLeft, setTimeLeft] = useState(workDuration);
  const [timerState, setTimerState] = useState<TimerState>('ready');
  const [totalElapsed, setTotalElapsed] = useState(0);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const intervalRef = useRef<number | null>(null);

  // Initialize Web Audio API
  useEffect(() => {
    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      audioContextRef.current?.close();
    };
  }, []);

  // Timer logic
  useEffect(() => {
    if (timerState === 'working' || timerState === 'resting') {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handlePhaseComplete();
            return 0;
          }
          return prev - 1;
        });
        setTotalElapsed(prev => prev + 1);
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [timerState]);

  // Sound effects using Web Audio API
  const playBeep = (frequency: number, duration: number) => {
    const ctx = audioContextRef.current;
    if (!ctx) return;

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + duration);
  };

  const playStartBeep = () => {
    playBeep(800, 0.2);
    setTimeout(() => playBeep(1000, 0.3), 100);
  };

  const playEndBeep = () => {
    playBeep(600, 0.15);
    setTimeout(() => playBeep(600, 0.15), 150);
    setTimeout(() => playBeep(600, 0.3), 300);
  };

  const playCountdown = () => {
    playBeep(400, 0.1);
  };

  // Handle countdown beeps
  useEffect(() => {
    if (timerState === 'working' || timerState === 'resting') {
      if (timeLeft <= 3 && timeLeft > 0) {
        playCountdown();
      }
    }
  }, [timeLeft, timerState]);

  const handlePhaseComplete = () => {
    if (timerState === 'working') {
      // Work phase done, start rest
      playEndBeep();
      if (currentRound < totalRounds) {
        setTimerState('resting');
        setTimeLeft(restDuration);
      } else {
        // Workout complete
        setTimerState('finished');
        onComplete?.();
      }
    } else if (timerState === 'resting') {
      // Rest done, start next round
      playStartBeep();
      setCurrentRound(prev => prev + 1);
      setTimerState('working');
      setTimeLeft(workDuration);
    }
  };

  const handleStart = () => {
    playStartBeep();
    setShowSettings(false);
    setTimeLeft(workDuration);
    setTimerState('working');
  };

  const handlePause = () => {
    setTimerState('paused');
  };

  const handleResume = () => {
    if (timerState === 'paused') {
      const wasWorking = timeLeft <= workDuration && currentRound <= totalRounds;
      setTimerState(wasWorking ? 'working' : 'resting');
    }
  };

  const handleReset = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setCurrentRound(1);
    setTimeLeft(workDuration);
    setTimerState('ready');
    setTotalElapsed(0);
    setShowSettings(true);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatTotalTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = () => {
    if (timerState === 'working') {
      return ((workDuration - timeLeft) / workDuration) * 100;
    } else if (timerState === 'resting') {
      return ((restDuration - timeLeft) / restDuration) * 100;
    }
    return 0;
  };

  const getCurrentRoundLabel = () => {
    if (roundLabels[currentRound - 1]) {
      return roundLabels[currentRound - 1];
    }
    return `Round ${currentRound}`;
  };

  // Settings Panel
  if (showSettings && timerState === 'ready') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] p-6">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-bold text-white mb-2 text-center">
            ⏱ Timer Settings
          </h2>
          <p className="text-arena-chalk text-sm text-center mb-8">
            Customize your heavy bag session
          </p>

          {/* Settings Form */}
          <div className="space-y-6 bg-arena-darker border-2 border-arena-cage rounded-lg p-6 mb-6">
            {/* Total Rounds */}
            <div>
              <label className="block text-white font-bold mb-2">
                Total Rounds
              </label>
              <div className="flex items-center gap-4">
                <Button
                  onClick={() => setTotalRounds(Math.max(1, totalRounds - 1))}
                  variant="outline"
                  size="icon"
                  className="h-12 w-12 text-xl"
                >
                  −
                </Button>
                <div className="flex-1 text-center">
                  <div className="text-4xl font-bold text-fighter-bag">
                    {totalRounds}
                  </div>
                  <div className="text-arena-chalk text-xs mt-1">rounds</div>
                </div>
                <Button
                  onClick={() => setTotalRounds(Math.min(20, totalRounds + 1))}
                  variant="outline"
                  size="icon"
                  className="h-12 w-12 text-xl"
                >
                  +
                </Button>
              </div>
            </div>

            {/* Work Duration */}
            <div>
              <label className="block text-white font-bold mb-2">
                Work Duration
              </label>
              <div className="flex items-center gap-4">
                <Button
                  onClick={() => setWorkDuration(Math.max(30, workDuration - 30))}
                  variant="outline"
                  size="icon"
                  className="h-12 w-12 text-xl"
                >
                  −
                </Button>
                <div className="flex-1 text-center">
                  <div className="text-4xl font-bold text-fighter-bag">
                    {Math.floor(workDuration / 60)}:{(workDuration % 60).toString().padStart(2, '0')}
                  </div>
                  <div className="text-arena-chalk text-xs mt-1">minutes</div>
                </div>
                <Button
                  onClick={() => setWorkDuration(Math.min(600, workDuration + 30))}
                  variant="outline"
                  size="icon"
                  className="h-12 w-12 text-xl"
                >
                  +
                </Button>
              </div>
            </div>

            {/* Rest Duration */}
            <div>
              <label className="block text-white font-bold mb-2">
                Rest Duration
              </label>
              <div className="flex items-center gap-4">
                <Button
                  onClick={() => setRestDuration(Math.max(15, restDuration - 15))}
                  variant="outline"
                  size="icon"
                  className="h-12 w-12 text-xl"
                >
                  −
                </Button>
                <div className="flex-1 text-center">
                  <div className="text-4xl font-bold text-fighter-gym">
                    {Math.floor(restDuration / 60)}:{(restDuration % 60).toString().padStart(2, '0')}
                  </div>
                  <div className="text-arena-chalk text-xs mt-1">minutes</div>
                </div>
                <Button
                  onClick={() => setRestDuration(Math.min(300, restDuration + 15))}
                  variant="outline"
                  size="icon"
                  className="h-12 w-12 text-xl"
                >
                  +
                </Button>
              </div>
            </div>
          </div>

          {/* Quick Presets */}
          <div className="mb-6">
            <div className="text-arena-chalk text-sm font-bold mb-3 text-center">
              QUICK PRESETS
            </div>
            <div className="grid grid-cols-3 gap-3">
              <Button
                onClick={() => {
                  setTotalRounds(5);
                  setWorkDuration(180);
                  setRestDuration(60);
                }}
                variant="outline"
                className="flex flex-col h-auto py-3"
              >
                <div className="text-lg font-bold">Beginner</div>
                <div className="text-xs text-arena-chalk">5×3:00/1:00</div>
              </Button>
              <Button
                onClick={() => {
                  setTotalRounds(8);
                  setWorkDuration(180);
                  setRestDuration(60);
                }}
                variant="outline"
                className="flex flex-col h-auto py-3"
              >
                <div className="text-lg font-bold">Standard</div>
                <div className="text-xs text-arena-chalk">8×3:00/1:00</div>
              </Button>
              <Button
                onClick={() => {
                  setTotalRounds(10);
                  setWorkDuration(180);
                  setRestDuration(45);
                }}
                variant="outline"
                className="flex flex-col h-auto py-3"
              >
                <div className="text-lg font-bold">Fighter</div>
                <div className="text-xs text-arena-chalk">10×3:00/0:45</div>
              </Button>
            </div>
          </div>

          {/* Total Session Time */}
          <div className="p-4 bg-arena-floor border border-fighter-bag/30 rounded-lg mb-6 text-center">
            <div className="text-arena-chalk text-xs mb-1">Total Session Time</div>
            <div className="text-white font-bold text-xl">
              {Math.floor((workDuration * totalRounds + restDuration * (totalRounds - 1)) / 60)}:
              {((workDuration * totalRounds + restDuration * (totalRounds - 1)) % 60).toString().padStart(2, '0')} min
            </div>
          </div>

          {/* Start Button */}
          <Button
            onClick={handleStart}
            className="w-full py-6 text-xl bg-gradient-to-r from-fighter-bag to-orange-600 text-white shadow-brutal"
          >
            Start Timer
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] p-6">
      {/* Round Info */}
      <div className="text-center mb-8">
        <div className="text-fighter-bag text-sm font-bold uppercase tracking-wider mb-2">
          {timerState === 'ready' && 'Ready'}
          {timerState === 'working' && '🥊 WORK'}
          {timerState === 'resting' && '💧 REST'}
          {timerState === 'paused' && '⏸ PAUSED'}
          {timerState === 'finished' && '✓ COMPLETE'}
        </div>
        <h2 className="text-4xl font-bold text-white mb-2">
          {getCurrentRoundLabel()}
        </h2>
        <div className="text-arena-chalk text-sm">
          Round {currentRound} of {totalRounds}
        </div>
      </div>

      {/* Timer Display */}
      <div className="relative mb-8">
        {/* Circular Progress */}
        <svg className="transform -rotate-90" width="280" height="280">
          <circle
            cx="140"
            cy="140"
            r="130"
            stroke="currentColor"
            strokeWidth="12"
            fill="none"
            className="text-arena-cage"
          />
          <circle
            cx="140"
            cy="140"
            r="130"
            stroke="currentColor"
            strokeWidth="12"
            fill="none"
            strokeDasharray={`${2 * Math.PI * 130}`}
            strokeDashoffset={`${2 * Math.PI * 130 * (1 - getProgressPercentage() / 100)}`}
            className={`transition-all duration-1000 ${
              timerState === 'working' ? 'text-fighter-bag' :
              timerState === 'resting' ? 'text-fighter-gym' :
              'text-arena-steel'
            }`}
            strokeLinecap="round"
          />
        </svg>
        
        {/* Time Display */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className={`text-7xl font-bold transition-colors ${
              timerState === 'working' ? 'text-fighter-bag' :
              timerState === 'resting' ? 'text-fighter-gym' :
              'text-white'
            }`}>
              {formatTime(timeLeft)}
            </div>
            {timerState !== 'ready' && timerState !== 'finished' && (
              <div className="text-arena-chalk text-sm mt-2">
                {timerState === 'working' ? 'Work Time' : 'Rest Time'}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="w-full max-w-sm mb-8 grid grid-cols-2 gap-4">
        <div className="p-3 bg-arena-darker rounded-lg border border-arena-cage text-center">
          <div className="text-arena-chalk text-xs mb-1">Total Time</div>
          <div className="text-white font-bold">{formatTotalTime(totalElapsed)}</div>
        </div>
        <div className="p-3 bg-arena-darker rounded-lg border border-arena-cage text-center">
          <div className="text-arena-chalk text-xs mb-1">Remaining</div>
          <div className="text-white font-bold">{totalRounds - currentRound + 1} rounds</div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-4">
        {timerState === 'ready' && (
          <Button
            onClick={handleStart}
            className="px-8 py-6 text-xl bg-gradient-to-r from-fighter-bag to-orange-600 text-white shadow-brutal"
          >
            Start Timer
          </Button>
        )}

        {(timerState === 'working' || timerState === 'resting') && (
          <>
            <Button
              onClick={handlePause}
              variant="outline"
              className="px-6 py-6 text-lg"
            >
              ⏸ Pause
            </Button>
            <Button
              onClick={handleReset}
              variant="ghost"
              className="px-6 py-6 text-lg text-arena-chalk"
            >
              Reset
            </Button>
          </>
        )}

        {timerState === 'paused' && (
          <>
            <Button
              onClick={handleResume}
              className="px-6 py-6 text-lg bg-gradient-to-r from-fighter-bag to-orange-600 text-white"
            >
              ▶ Resume
            </Button>
            <Button
              onClick={handleReset}
              variant="ghost"
              className="px-6 py-6 text-lg text-arena-chalk"
            >
              Reset
            </Button>
          </>
        )}

        {timerState === 'finished' && (
          <Button
            onClick={handleReset}
            className="px-8 py-6 text-xl bg-gradient-to-r from-fighter-home to-green-600 text-white shadow-brutal"
          >
            Start Again
          </Button>
        )}
      </div>

      {/* Settings Button */}
      {timerState === 'ready' && (
        <div className="mt-8">
          <Button
            onClick={() => setShowSettings(true)}
            variant="outline"
            className="text-arena-chalk"
          >
            ⚙️ Change Settings
          </Button>
        </div>
      )}
    </div>
  );
}
