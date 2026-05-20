import { useState, useMemo } from 'react';
import { Play, Pause, SkipBack, SkipForward, RotateCcw } from 'lucide-react';
import { ArrayVisualizer } from './ArrayVisualizer';
import { useAnimationStepper } from '../../hooks/useAnimationStepper';

const DEFAULT_ARRAYS = {
  small: [8, 3, 6, 1, 9, 4, 7, 2],
  medium: [15, 3, 9, 8, 5, 2, 4, 7, 1, 14],
};

export const SortingVisualizer = ({ generateSteps, title, algorithmId }) => {
  const [inputStr, setInputStr] = useState('8, 3, 6, 1, 9, 4, 7, 2');
  const [pivotStrategy, setPivotStrategy] = useState('last');
  const [inputError, setInputError] = useState('');

  const parsedArray = useMemo(() => {
    const arr = inputStr.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
    return arr.length >= 2 ? arr : [8, 3, 6, 1, 9, 4];
  }, [inputStr]);

  const steps = useMemo(() => {
    try {
      return generateSteps(parsedArray, pivotStrategy);
    } catch {
      return [];
    }
  }, [parsedArray, pivotStrategy]);

  const { currentStep, currentStepData, isPlaying, isComplete, speed, totalSteps, play, pause, reset, stepForward, stepBack, setSpeed } = useAnimationStepper(steps);

  const displayData = currentStepData || { array: parsedArray, highlights: {}, description: 'Press Play to start the animation, or use the step controls.', pointers: [] };

  const handleInput = (e) => {
    const val = e.target.value;
    setInputStr(val);
    const arr = val.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
    if (arr.length < 2) setInputError('Enter at least 2 numbers');
    else if (arr.length > 12) setInputError('Max 12 numbers for clarity');
    else setInputError('');
    reset();
  };

  const randomize = () => {
    const n = 8;
    const arr = [...Array(n)].map(() => Math.floor(Math.random() * 20) + 1);
    setInputStr(arr.join(', '));
    setInputError('');
    reset();
  };

  return (
    <div className="space-y-4">
      {/* Input controls */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex flex-col gap-1 flex-grow">
          <div className="flex gap-2 items-center">
            <input
              type="text"
              value={inputStr}
              onChange={handleInput}
              placeholder="e.g. 8, 3, 6, 1, 9"
              className="border border-slate-300 rounded-lg px-3 py-2 text-sm flex-grow font-mono focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <button
              onClick={randomize}
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition-colors whitespace-nowrap"
            >
              Random
            </button>
          </div>
          {inputError && <p className="text-red-500 text-xs">{inputError}</p>}
        </div>

        {algorithmId === 'quick' && (
          <select
            value={pivotStrategy}
            onChange={e => { setPivotStrategy(e.target.value); reset(); }}
            className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            <option value="last">Pivot: Last element</option>
            <option value="first">Pivot: First element</option>
            <option value="middle">Pivot: Middle element</option>
            <option value="median">Pivot: Median of three</option>
          </select>
        )}
      </div>

      {/* Visualization */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 min-h-[200px] flex flex-col justify-end">
        <ArrayVisualizer
          array={displayData.array}
          highlights={displayData.highlights}
          pointers={displayData.pointers}
        />
      </div>

      {/* Step description */}
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 min-h-[52px] text-sm text-slate-700 font-mono">
        {displayData.description}
      </div>

      {/* Progress */}
      <div className="flex items-center gap-2">
        <div className="flex-grow bg-slate-200 rounded-full h-1.5">
          <div
            className="bg-indigo-500 h-1.5 rounded-full transition-all duration-300"
            style={{ width: totalSteps > 0 ? `${((currentStep + 1) / totalSteps) * 100}%` : '0%' }}
          />
        </div>
        <span className="text-xs text-slate-500 font-mono whitespace-nowrap">
          {currentStep >= 0 ? currentStep + 1 : 0} / {totalSteps}
        </span>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-2 flex-wrap">
        <button onClick={reset} className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors">
          <RotateCcw size={18} />
        </button>
        <button onClick={stepBack} disabled={currentStep <= -1} className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-600 transition-colors">
          <SkipBack size={18} />
        </button>
        <button
          onClick={isPlaying ? pause : play}
          className="flex items-center gap-2 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
        >
          {isPlaying ? <Pause size={18} /> : <Play size={18} />}
          {isPlaying ? 'Pause' : isComplete ? 'Replay' : 'Play'}
        </button>
        <button onClick={stepForward} disabled={isComplete} className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-600 transition-colors">
          <SkipForward size={18} />
        </button>

        {/* Speed */}
        <div className="flex items-center gap-1 ml-auto">
          <span className="text-xs text-slate-500">Speed:</span>
          {[0.5, 1, 2].map(s => (
            <button
              key={s}
              onClick={() => setSpeed(s)}
              className={`px-2 py-1 text-xs rounded font-medium transition-colors ${speed === s ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
            >
              {s}x
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
