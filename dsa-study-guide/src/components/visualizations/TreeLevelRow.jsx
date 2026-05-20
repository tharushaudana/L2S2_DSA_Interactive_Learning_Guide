import { ArrayVisualizer } from './ArrayVisualizer';

export const TreeLevelRow = ({ levelNodes, totalLength, maxVal, activePointers, depth }) => {
  return (
    <div 
      className="grid gap-x-1 w-full animate-in fade-in slide-in-from-top-1 duration-300"
      style={{ gridTemplateColumns: `repeat(${totalLength}, minmax(0, 1fr))` }}
    >
      {levelNodes.map((node, idx) => {
        const isMerging = node.status === 'merging';
        const isSorted = node.status === 'sorted';
        const isPartitioning = node.status === 'partitioning';
        const isPartitioned = node.status === 'partitioned';
        
        let containerClass = "rounded border transition-all duration-300 p-1 ";
        if (isMerging || isPartitioning) containerClass += "border-indigo-400 bg-indigo-50/30 dark:border-indigo-500/50 dark:bg-indigo-900/10 shadow-sm";
        else if (isSorted) containerClass += "border-emerald-400 bg-emerald-50/30 dark:border-emerald-500/50 dark:bg-emerald-900/10";
        else if (isPartitioned) containerClass += "border-purple-400 bg-purple-50/30 dark:border-purple-500/50 dark:bg-purple-900/10";
        else containerClass += "border-slate-200 bg-slate-50/50 dark:border-slate-700/50 dark:bg-slate-800/30 opacity-80";

        // Determine highlights for this mini array
        const highlights = {};
        if (activePointers && activePointers.depth === depth) {
            if (node.start === activePointers.leftStart) {
                highlights[activePointers.leftIdx] = 'min';
            }
            if (node.start === activePointers.rightStart) {
                highlights[activePointers.rightIdx] = 'comparing';
            }
        }
        
        // Pivot highlight for Quick Sort
        if (node.pivotIdx !== -1 && node.pivotIdx !== undefined) {
            const localPivotIdx = node.pivotIdx - node.start;
            if (localPivotIdx >= 0 && localPivotIdx < node.values.length) {
                highlights[localPivotIdx] = 'pivot';
            }
        }

        return (
          <div 
            key={`${node.start}-${node.end}-${idx}`}
            className={containerClass}
            style={{ 
              gridColumn: `${node.start + 1} / span ${node.end - node.start + 1}` 
            }}
          >
            <ArrayVisualizer 
              array={node.values} 
              maxVal={maxVal} 
              highlights={highlights}
              mini 
            />
          </div>
        );
      })}
    </div>
  );
};
