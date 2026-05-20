// colorKey -> tailwind bg colors
const COLORS = {
  default:    { bar: 'bg-slate-300', text: 'text-slate-700', border: 'border-slate-400' },
  comparing:  { bar: 'bg-yellow-400', text: 'text-yellow-900', border: 'border-yellow-500' },
  swapping:   { bar: 'bg-red-400', text: 'text-red-900', border: 'border-red-500' },
  sorted:     { bar: 'bg-emerald-400', text: 'text-emerald-900', border: 'border-emerald-500' },
  pivot:      { bar: 'bg-purple-400', text: 'text-purple-900', border: 'border-purple-500' },
  min:        { bar: 'bg-blue-400', text: 'text-blue-900', border: 'border-blue-500' },
  inserting:  { bar: 'bg-orange-400', text: 'text-orange-900', border: 'border-orange-500' },
  shifted:    { bar: 'bg-amber-300', text: 'text-amber-900', border: 'border-amber-400' },
};

export const ArrayVisualizer = ({ array, highlights = {}, pointers = [], maxVal }) => {
  if (!array || array.length === 0) return null;

  const max = maxVal || Math.max(...array, 1);
  const pointerMap = {};
  (pointers || []).forEach(p => {
    if (!pointerMap[p.index]) pointerMap[p.index] = [];
    pointerMap[p.index].push(p.name);
  });

  return (
    <div className="flex flex-col gap-3 w-full">
      {/* Bars */}
      <div className="flex items-end justify-center gap-1.5 h-36 px-2">
        {array.map((val, idx) => {
          const colorKey = highlights[idx] || 'default';
          const colors = COLORS[colorKey] || COLORS.default;
          const heightPct = Math.max((val / max) * 100, 5);

          return (
            <div key={idx} className="flex flex-col items-center gap-1 flex-1 min-w-0">
              {/* Value on top */}
              <span className={`text-xs font-bold ${colors.text} truncate`}>{val}</span>
              {/* Bar */}
              <div
                className={`w-full ${colors.bar} border ${colors.border} rounded-t-sm transition-all duration-300`}
                style={{ height: `${heightPct}%` }}
              />
            </div>
          );
        })}
      </div>

      {/* Indices */}
      <div className="flex justify-center gap-1.5 px-2">
        {array.map((_, idx) => (
          <div key={idx} className="flex-1 min-w-0 text-center">
            <span className="text-xs text-slate-400 font-mono">{idx}</span>
          </div>
        ))}
      </div>

      {/* Pointer labels */}
      {Object.keys(pointerMap).length > 0 && (
        <div className="flex justify-center gap-1.5 px-2">
          {array.map((_, idx) => (
            <div key={idx} className="flex-1 min-w-0 text-center">
              {pointerMap[idx] && (
                <span className="text-xs font-bold text-indigo-600 bg-indigo-50 rounded px-1">
                  {pointerMap[idx].join(',')}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
