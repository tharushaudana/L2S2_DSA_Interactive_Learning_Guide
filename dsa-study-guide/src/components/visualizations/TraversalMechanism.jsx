import { Layers, MoveRight } from 'lucide-react';

export const TraversalMechanism = ({ type, stack = [], queue = [], activeNode = null }) => {
  const isDFS = ['pre', 'in', 'post'].includes(type);

  if (isDFS) {
    return (
      <div className="flex flex-col h-full gap-3">
        <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
          <Layers size={18} />
          <h4 className="text-xs font-bold uppercase tracking-widest">Call Stack (DFS)</h4>
        </div>
        
        <div className="flex-grow bg-slate-900/10 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700 p-4 flex flex-col-reverse gap-2 overflow-y-auto min-h-[300px]">
          {stack.length === 0 ? (
            <div className="flex-grow flex items-center justify-center text-slate-400 dark:text-slate-500 text-sm italic text-center">
              Stack is empty.<br/>Recursion starts at Root.
            </div>
          ) : (
            stack.map((frame, idx) => {
              const isActive = idx === stack.length - 1;
              return (
                <div 
                  key={`${frame.id}-${idx}`}
                  className={`px-4 py-2.5 rounded-lg font-mono text-sm border transition-all duration-300 flex justify-between items-center animate-in slide-in-from-bottom-2
                    ${isActive ? 'bg-indigo-600 border-indigo-400 text-white shadow-lg scale-105' : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 opacity-80'}`}
                >
                  <div className="flex flex-col">
                    <span className="font-bold">DFS({frame.id})</span>
                    <span className={`text-[10px] ${isActive ? 'text-indigo-200' : 'text-slate-400'}`}>
                      {frame.status}
                    </span>
                  </div>
                  {isActive && <span className="text-[10px] font-bold animate-pulse">ACTIVE</span>}
                </div>
              );
            })
          )}
        </div>
        <div className="text-center text-[10px] font-bold text-slate-400 uppercase">Top of Stack ↑</div>
      </div>
    );
  }

  // BFS Queue
  return (
    <div className="flex flex-col h-full gap-3">
      <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
        <MoveRight size={18} />
        <h4 className="text-xs font-bold uppercase tracking-widest">Processing Queue (BFS)</h4>
      </div>
      
      <div className="bg-slate-900/10 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700 p-6 flex items-center gap-3 overflow-x-auto min-h-[120px]">
        {queue.length === 0 ? (
          <div className="flex-grow flex items-center justify-center text-slate-400 dark:text-slate-500 text-sm italic">
            Queue is empty.
          </div>
        ) : (
          queue.map((nodeId, idx) => (
            <div 
              key={`${nodeId}-${idx}`}
              className={`w-12 h-12 rounded-lg flex items-center justify-center font-bold font-mono text-lg border transition-all duration-300 animate-in slide-in-from-right-4
                ${idx === 0 ? 'bg-emerald-600 border-emerald-400 text-white shadow-lg scale-110' : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'}`}
            >
              {nodeId}
              {idx === 0 && <div className="absolute -top-6 text-[10px] text-emerald-500 font-bold">FRONT</div>}
              {idx === queue.length - 1 && queue.length > 1 && <div className="absolute -bottom-6 text-[10px] text-slate-400 font-bold">REAR</div>}
            </div>
          ))
        )}
      </div>
      <p className="text-[10px] text-slate-400 text-center font-medium italic">
        Nodes enter from the rear and are processed from the front.
      </p>
    </div>
  );
};
