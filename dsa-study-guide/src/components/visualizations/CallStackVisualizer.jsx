import { Play, RotateCcw, SkipForward, SkipBack } from 'lucide-react';
import { useState, useMemo } from 'react';

function generateFactorialSteps(n = 5) {
  const steps = [];
  for (let i = n; i >= 0; i--) {
    const frames = [];
    for (let k = n; k > i; k--) frames.push({ label: `factorial(${k})`, status: 'waiting', arg: k });
    frames.push({ label: `factorial(${i})`, status: 'active', arg: i });
    steps.push({
      frames, phase: 'descend',
      description: i === 0 ? `Base case reached! factorial(0) = 1. Now we return values back up.` : `Calling factorial(${i}). Adding frame to call stack.`,
    });
  }
  let returnVal = 1;
  for (let i = 0; i <= n; i++) {
    const frames = [];
    const prev = returnVal;
    for (let k = n; k > i; k--) frames.push({ label: `factorial(${k})`, status: 'waiting', arg: k });
    if (i < n) frames.push({ label: `factorial(${i})`, status: 'returned', arg: i, returnValue: returnVal });
    if (i < n) returnVal = (i + 1) * returnVal;
    steps.push({
      frames, phase: 'ascend',
      description: i === 0 ? `factorial(0) returns 1. Popping frame.` : i === n ? `factorial(${n}) returns ${prev}. Stack empty — done!` : `factorial(${i}) returns ${prev}. factorial(${i + 1}) = ${i + 1} × ${prev} = ${returnVal}.`,
      result: i === n ? prev : null,
    });
  }
  return steps;
}

export const CallStackVisualizer = () => {
  const [n, setN] = useState(5);
  const [stepIdx, setStepIdx] = useState(-1);
  const steps = useMemo(() => generateFactorialSteps(n), [n]);
  const currentStep = stepIdx >= 0 ? steps[stepIdx] : null;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">factorial(</span>
          <input type="number" min={1} max={8} value={n}
            onChange={e => { setN(Math.min(8, Math.max(1, parseInt(e.target.value) || 1))); setStepIdx(-1); }}
            className="border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded px-2 py-1 w-14 text-center text-sm" />
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">)</span>
        </div>
        <div className="flex items-center gap-2 ml-auto">
          <button onClick={() => setStepIdx(-1)} className="p-2 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300"><RotateCcw size={16} /></button>
          <button onClick={() => setStepIdx(s => Math.max(s - 1, -1))} disabled={stepIdx < 0}
            className="p-2 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 disabled:opacity-40 text-slate-600 dark:text-slate-300"><SkipBack size={16} /></button>
          <button onClick={() => setStepIdx(s => Math.min(s + 1, steps.length - 1))} disabled={stepIdx >= steps.length - 1}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-lg text-sm font-medium">
            <SkipForward size={16} />
            {stepIdx < 0 ? 'Start' : stepIdx >= steps.length - 1 ? 'Done' : 'Next Step'}
          </button>
        </div>
      </div>

      <div className="bg-slate-900 rounded-xl p-4 min-h-[280px] flex flex-col justify-between">
        <div className="flex flex-col-reverse gap-2 flex-grow">
          {(!currentStep || currentStep.frames.length === 0) && (
            <div className="text-slate-500 text-sm font-mono text-center mt-8">Call stack is empty. Press "Start".</div>
          )}
          {currentStep?.frames.map((frame, i) => (
            <div key={i}
              className={`px-4 py-2.5 rounded-lg font-mono text-sm border transition-all duration-300 flex justify-between items-center
                ${frame.status === 'active' ? 'bg-indigo-600 border-indigo-400 text-white shadow-lg' :
                  frame.status === 'returned' ? 'bg-emerald-700 border-emerald-500 text-white' :
                  'bg-slate-700 border-slate-600 text-slate-200'}`}>
              <span>{frame.label}</span>
              {frame.status === 'active' && <span className="text-indigo-200 text-xs">← executing</span>}
              {frame.status === 'returned' && <span className="text-emerald-200 text-xs">→ returns {frame.returnValue}</span>}
            </div>
          ))}
        </div>
        <div className="mt-3 flex items-center gap-2">
          <div className="h-px flex-grow bg-slate-600" />
          <span className="text-slate-500 text-xs font-mono">CALL STACK (top ↑)</span>
          <div className="h-px flex-grow bg-slate-600" />
        </div>
      </div>

      <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg p-3 text-sm text-slate-700 dark:text-slate-300 min-h-[48px]">
        {currentStep ? currentStep.description : 'Step through the recursion to see the call stack grow and shrink.'}
      </div>

      <div className="flex items-center gap-2">
        <div className="flex-grow bg-slate-200 dark:bg-slate-700 rounded-full h-1.5">
          <div className="bg-indigo-500 h-1.5 rounded-full transition-all"
            style={{ width: `${((stepIdx + 1) / steps.length) * 100}%` }} />
        </div>
        <span className="text-xs text-slate-500 dark:text-slate-400">{Math.max(stepIdx + 1, 0)} / {steps.length}</span>
      </div>
    </div>
  );
};
