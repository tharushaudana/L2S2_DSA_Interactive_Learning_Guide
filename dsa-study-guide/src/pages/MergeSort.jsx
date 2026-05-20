import { useState } from 'react';
import { GitMerge } from 'lucide-react';
import { SectionHeader } from '../components/ui/SectionHeader';
import { Card } from '../components/ui/Card';
import { TabBar } from '../components/ui/TabBar';
import { InfoBox } from '../components/ui/InfoBox';
import { CodeBlock } from '../components/ui/CodeBlock';
import { ComplexityTable } from '../components/ui/ComplexityTable';
import { SortingVisualizer } from '../components/visualizations/SortingVisualizer';
import { generateMergeSortSteps } from '../data/sortingAlgorithms';
import { CODE } from '../data/codeSnippets';

const TABS = [
  { id: 'theory', label: 'How It Works' },
  { id: 'visualizer', label: 'Visualizer' },
  { id: 'code', label: 'Java Code' },
  { id: 'analysis', label: 'Analysis' },
];

const Theory = () => (
  <div className="space-y-6">
    <Card>
      <h3 className="text-xl font-bold text-slate-800 mb-4">Divide and Conquer</h3>
      <p className="text-slate-600 mb-4">Merge Sort recursively splits the array into halves until trivially sorted (single elements), then merges sorted halves.</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-red-50 border border-red-100 rounded-xl p-4 text-center">
          <div className="text-2xl mb-2">✂️</div>
          <h4 className="font-bold text-red-800 mb-1">1. Divide</h4>
          <p className="text-sm text-red-700">Split array in half repeatedly until subarrays have 1 element.</p>
        </div>
        <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 text-center">
          <div className="text-2xl mb-2">🔒</div>
          <h4 className="font-bold text-amber-800 mb-1">2. Conquer</h4>
          <p className="text-sm text-amber-700">Single-element subarrays are trivially sorted (base case).</p>
        </div>
        <div className="bg-green-50 border border-green-100 rounded-xl p-4 text-center">
          <div className="text-2xl mb-2">🔗</div>
          <h4 className="font-bold text-green-800 mb-1">3. Combine</h4>
          <p className="text-sm text-green-700">Merge sorted pairs into larger sorted arrays until one sorted array remains.</p>
        </div>
      </div>
    </Card>

    <Card>
      <h3 className="text-xl font-bold text-slate-800 mb-4">The Merge Operation</h3>
      <p className="text-slate-600 mb-3">The key step: merging two sorted arrays into one sorted array.</p>
      <ol className="space-y-2 text-sm text-slate-700">
        <li className="flex gap-3 items-start"><span className="bg-indigo-100 text-indigo-700 font-bold rounded-full w-6 h-6 flex items-center justify-center text-xs shrink-0">1</span>Use two pointers, one for each sorted half.</li>
        <li className="flex gap-3 items-start"><span className="bg-indigo-100 text-indigo-700 font-bold rounded-full w-6 h-6 flex items-center justify-center text-xs shrink-0">2</span>Compare elements at both pointers; place the smaller into result.</li>
        <li className="flex gap-3 items-start"><span className="bg-indigo-100 text-indigo-700 font-bold rounded-full w-6 h-6 flex items-center justify-center text-xs shrink-0">3</span>Advance the pointer of the half that contributed the element.</li>
        <li className="flex gap-3 items-start"><span className="bg-indigo-100 text-indigo-700 font-bold rounded-full w-6 h-6 flex items-center justify-center text-xs shrink-0">4</span>Append remaining elements from whichever half has leftovers.</li>
      </ol>
      <div className="mt-4 bg-slate-900 rounded-xl p-4">
        <p className="text-indigo-300 font-mono text-sm">Left:  [1, 4, 7]</p>
        <p className="text-indigo-300 font-mono text-sm">Right: [2, 5, 8]</p>
        <p className="text-emerald-300 font-mono text-sm mt-2">Merged: [1, 2, 4, 5, 7, 8]</p>
      </div>
    </Card>

    <InfoBox variant="exam">
      <strong>Critical Exam Fact:</strong> Merge Sort has O(n log n) time complexity in ALL cases (best, average, worst). This is because the split always creates balanced halves, and each merge level processes n elements total across log n levels.
    </InfoBox>
  </div>
);

const Analysis = () => (
  <div className="space-y-6">
    <Card>
      <h3 className="text-xl font-bold text-slate-800 mb-4">Complexity Analysis</h3>
      <ComplexityTable
        columns={['Case', 'Time Complexity', 'Reason']}
        rows={[
          ['Best Case', 'O(n log n)', 'Always splits evenly; n comparisons per log n levels'],
          ['Average Case', 'O(n log n)', 'Same as best — split is always balanced'],
          ['Worst Case', 'O(n log n)', 'No bad pivot — guaranteed balanced halves'],
          ['Space Complexity', 'O(n)', 'Temporary arrays needed for merge operations'],
        ]}
      />
    </Card>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <h4 className="font-bold text-green-700 mb-3 flex items-center gap-2">✓ Advantages</h4>
        <ul className="space-y-2 text-sm text-slate-700">
          <li>• <strong>Stable:</strong> Preserves relative order of equal elements</li>
          <li>• <strong>Guaranteed O(n log n):</strong> No worst-case degradation</li>
          <li>• <strong>Parallelizable:</strong> Each half can be sorted independently</li>
          <li>• <strong>External sorting:</strong> Great for data too large to fit in memory</li>
        </ul>
      </Card>
      <Card>
        <h4 className="font-bold text-red-700 mb-3 flex items-center gap-2">✗ Disadvantages</h4>
        <ul className="space-y-2 text-sm text-slate-700">
          <li>• <strong>O(n) space:</strong> Not in-place — requires extra arrays</li>
          <li>• <strong>Overhead:</strong> Slower than Insertion Sort for small arrays</li>
          <li>• <strong>Same cost always:</strong> Can't skip work if input is nearly sorted</li>
          <li>• <strong>Stack depth:</strong> O(log n) recursive calls on call stack</li>
        </ul>
      </Card>
    </div>
  </div>
);

export default function MergeSort() {
  const [activeTab, setActiveTab] = useState('theory');

  const content = {
    theory: <Theory />,
    visualizer: (
      <Card>
        <h3 className="text-xl font-bold text-slate-800 mb-4">Merge Sort Visualizer</h3>
        <InfoBox variant="info" className="mb-4">
          Watch as the array splits (yellow) and merges (green). The description shows each comparison and placement step.
        </InfoBox>
        <SortingVisualizer generateSteps={generateMergeSortSteps} title="Merge Sort" algorithmId="merge" />
      </Card>
    ),
    code: (
      <CodeBlock
        title="Merge Sort — Java"
        filename="MergeSort.java"
        tabs={[{ id: 'code', label: 'Implementation', code: CODE.mergeSort }]}
      />
    ),
    analysis: <Analysis />,
  };

  return (
    <div className="space-y-6">
      <SectionHeader
        icon={GitMerge}
        title="L2: Merge Sort"
        description="Divide and conquer sorting with guaranteed O(n log n) performance."
      />
      <TabBar tabs={TABS} activeTab={activeTab} onChange={setActiveTab} />
      <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
        {content[activeTab]}
      </div>
    </div>
  );
}
