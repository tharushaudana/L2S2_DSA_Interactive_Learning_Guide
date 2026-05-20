import { useState, useMemo, useEffect } from 'react';
import { ArrayVisualizer } from './ArrayVisualizer';
import { TreeLevelRow } from './TreeLevelRow';
import { VisualizerControls } from './VisualizerControls';
import { useAnimationStepper } from '../../hooks/useAnimationStepper';
import { generateMergeSortSteps } from '../../data/sortingAlgorithms';

export const MergeSortVisualizer = () => {
  const [inputStr, setInputStr] = useState('8, 3, 6, 1, 9, 4, 7, 2');
  const [inputError, setInputError] = useState('');

  const parsedArray = useMemo(() => {
    const arr = inputStr.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
    return arr.length >= 2 ? arr : [8, 3, 6, 1, 9, 4, 7, 2];
  }, [inputStr]);

  const steps = useMemo(() => {
    try { return generateMergeSortSteps(parsedArray); }
    catch { return []; }
  }, [parsedArray]);

  const { 
    currentStep, currentStepData, isPlaying, isComplete, speed, totalSteps, 
    play, pause, reset, stepForward, stepBack, setSpeed 
  } = useAnimationStepper(steps);

  useEffect(() => { reset(); }, [parsedArray]);

  const displayData = currentStepData || {
    array: parsedArray, highlights: {}, pointers: [],
    description: 'Press Play to start the Merge Sort visualization.',
    treeLevels: []
  };

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
    const arr = [...Array(8)].map(() => Math.floor(Math.random() * 20) + 1);
    setInputStr(arr.join(', '));
    setInputError('');
    reset();
  };

  const maxVal = useMemo(() => Math.max(...parsedArray, 1), [parsedArray]);

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex flex-col gap-1 flex-grow">
          <div className="flex gap-2 items-center">
            <input
              type="text" value={inputStr} onChange={handleInput}
              placeholder="e.g. 8, 3, 6, 1, 9"
              className="border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-lg px-3 py-2 text-sm flex-grow font-mono focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <button onClick={randomize}
              className="px-3 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-lg text-sm font-medium transition-colors whitespace-nowrap">
              Random
            </button>
          </div>
          {inputError && <p className="text-red-500 text-xs">{inputError}</p>}
        </div>
      </div>

      {/* Main Visualization Area */}
      <div className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl p-6 min-h-[500px] flex flex-col gap-6">
        {/* Main Array */}
        <div className="flex flex-col gap-2">
          <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">In-Place State</h4>
          <ArrayVisualizer array={displayData.array} highlights={displayData.highlights} pointers={displayData.pointers} />
        </div>

        {/* Tree History Area */}
        <div className="flex-grow flex flex-col gap-4 border-t border-slate-100 dark:border-slate-700/50 pt-6">
          <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Recursion Tree History</h4>
          {displayData.treeLevels && displayData.treeLevels.length > 0 ? (
            <div className="space-y-4">
              {displayData.treeLevels.map((levelNodes, depth) => (
                <div key={depth} className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[8px] font-bold text-slate-300 dark:text-slate-600 uppercase">L{depth}</span>
                    <div className="h-[1px] flex-grow bg-slate-50 dark:bg-slate-800/50"></div>
                  </div>
                  <TreeLevelRow 
                    levelNodes={levelNodes} 
                    totalLength={parsedArray.length} 
                    maxVal={maxVal}
                    activePointers={displayData.activePointers}
                    depth={depth}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex-grow flex items-center justify-center text-slate-400 dark:text-slate-500 text-sm italic">
              Divide and conquer steps will be visualized here...
            </div>
          )}
        </div>
      </div>

      {/* Description */}
      <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg p-3 min-h-[52px] text-sm text-slate-700 dark:text-slate-300 font-mono">
        {displayData.description}
      </div>

      <VisualizerControls 
        isPlaying={isPlaying}
        isComplete={isComplete}
        currentStep={currentStep}
        totalSteps={totalSteps}
        speed={speed}
        play={play}
        pause={pause}
        reset={reset}
        stepForward={stepForward}
        stepBack={stepBack}
        setSpeed={setSpeed}
      />
    </div>
  );
};
