const COLORS = {
  default:   { bar: 'bg-slate-300 dark:bg-slate-600',     text: 'text-slate-700 dark:text-slate-200',  border: 'border-slate-400 dark:border-slate-500' },
  comparing: { bar: 'bg-yellow-400 dark:bg-yellow-500',   text: 'text-yellow-900 dark:text-yellow-100',border: 'border-yellow-500 dark:border-yellow-400' },
  swapping:  { bar: 'bg-red-400 dark:bg-red-500',         text: 'text-red-900 dark:text-red-100',      border: 'border-red-500 dark:border-red-400' },
  sorted:    { bar: 'bg-emerald-400 dark:bg-emerald-500', text: 'text-emerald-900 dark:text-emerald-100',border: 'border-emerald-500 dark:border-emerald-400' },
  pivot:     { bar: 'bg-purple-400 dark:bg-purple-500',   text: 'text-purple-900 dark:text-purple-100',border: 'border-purple-500 dark:border-purple-400' },
  min:       { bar: 'bg-blue-400 dark:bg-blue-500',       text: 'text-blue-900 dark:text-blue-100',    border: 'border-blue-500 dark:border-blue-400' },
  inserting: { bar: 'bg-orange-400 dark:bg-orange-500',   text: 'text-orange-900 dark:text-orange-100',border: 'border-orange-500 dark:border-orange-400' },
  shifted:   { bar: 'bg-amber-300 dark:bg-amber-400',     text: 'text-amber-900 dark:text-amber-100',  border: 'border-amber-400 dark:border-amber-300' },
  dimmed:    { bar: 'bg-slate-100 dark:bg-slate-800',     text: 'text-slate-300 dark:text-slate-600',  border: 'border-slate-200 dark:border-slate-700' },
};

export const ArrayVisualizer = ({ array, highlights = {}, pointers = [], maxVal, mini = false }) => {
  if (!array || array.length === 0) return null;
  const max = maxVal || Math.max(...array, 1);
  const pointerMap = {};
  (pointers || []).forEach(p => {
    if (!pointerMap[p.index]) pointerMap[p.index] = [];
    pointerMap[p.index].push(p.name);
  });

  return (
    <div className={`flex flex-col ${mini ? 'gap-1' : 'gap-3'} w-full`}>
      <div className={`flex items-end justify-center gap-1.5 ${mini ? 'h-12' : 'h-36'} px-2`}>
        {array.map((val, idx) => {
          const colorKey = highlights[idx] || 'default';
          const colors = COLORS[colorKey] || COLORS.default;
          const heightPct = Math.max((val / max) * 100, 5);
          return (
            <div key={idx} className="flex flex-col items-center gap-1 flex-1 min-w-0">
              {!mini && <span className={`text-xs font-bold ${colors.text} truncate`}>{val}</span>}
              <div
                className={`w-full ${colors.bar} border ${colors.border} rounded-t-sm transition-all duration-300`}
                style={{ height: `${heightPct}%` }}
                title={mini ? val : ''}
              />
              {mini && <span className={`text-[8px] font-bold ${colors.text} truncate`}>{val}</span>}
            </div>
          );
        })}
      </div>

      {!mini && (
        <>
          <div className="flex justify-center gap-1.5 px-2">
            {array.map((_, idx) => (
              <div key={idx} className="flex-1 min-w-0 text-center">
                <span className="text-xs text-slate-400 dark:text-slate-500 font-mono">{idx}</span>
              </div>
            ))}
          </div>

          {Object.keys(pointerMap).length > 0 && (
            <div className="flex justify-center gap-1.5 px-2">
              {array.map((_, idx) => (
                <div key={idx} className="flex-1 min-w-0 text-center">
                  {pointerMap[idx] && (
                    <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/50 rounded px-1">
                      {pointerMap[idx].join(',')}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};
