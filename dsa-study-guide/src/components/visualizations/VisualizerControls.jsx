import { Play, Pause, SkipBack, SkipForward, RotateCcw } from 'lucide-react';

export const VisualizerControls = ({ 
  isPlaying, 
  isComplete, 
  currentStep, 
  totalSteps, 
  speed, 
  play, 
  pause, 
  reset, 
  stepForward, 
  stepBack, 
  setSpeed 
}) => {
  return (
    <div className="space-y-4">
      {/* Progress bar */}
      <div className="flex items-center gap-2">
        <div className="flex-grow bg-slate-200 dark:bg-slate-700 rounded-full h-1.5">
          <div className="bg-indigo-500 h-1.5 rounded-full transition-all duration-300"
            style={{ width: totalSteps > 0 ? `${((currentStep + 1) / totalSteps) * 100}%` : '0%' }} />
        </div>
        <span className="text-xs text-slate-500 dark:text-slate-400 font-mono whitespace-nowrap">
          {currentStep >= 0 ? currentStep + 1 : 0} / {totalSteps}
        </span>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-2 flex-wrap">
        <button onClick={reset} className="p-2 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 transition-colors">
          <RotateCcw size={18} />
        </button>
        <button onClick={stepBack} disabled={currentStep <= -1}
          className="p-2 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 disabled:opacity-40 text-slate-600 dark:text-slate-300 transition-colors">
          <SkipBack size={18} />
        </button>
        <button onClick={isPlaying ? pause : play}
          className="flex items-center gap-2 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors min-w-[120px] justify-center">
          {isPlaying ? <Pause size={18} /> : <Play size={18} />}
          {isPlaying ? 'Pause' : isComplete ? 'Replay' : 'Play'}
        </button>
        <button onClick={stepForward} disabled={isComplete}
          className="p-2 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 disabled:opacity-40 text-slate-600 dark:text-slate-300 transition-colors">
          <SkipForward size={18} />
        </button>

        <div className="flex items-center gap-1 ml-auto">
          <span className="text-xs text-slate-500 dark:text-slate-400">Speed:</span>
          {[0.5, 1, 2].map(s => (
            <button key={s} onClick={() => setSpeed(s)}
              className={`px-2 py-1 text-xs rounded font-medium transition-colors
                ${speed === s ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'}`}>
              {s}x
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
