import { useState } from 'react';
import { Zap } from 'lucide-react';
import { SectionHeader } from '../components/ui/SectionHeader';
import { Card } from '../components/ui/Card';
import { TabBar } from '../components/ui/TabBar';
import { InfoBox } from '../components/ui/InfoBox';
import { CodeBlock } from '../components/ui/CodeBlock';
import { ComplexityTable } from '../components/ui/ComplexityTable';
import { SortingVisualizer } from '../components/visualizations/SortingVisualizer';
import { generateQuickSortSteps } from '../data/sortingAlgorithms';
import { CODE } from '../data/codeSnippets';

const TABS = [
  { id: 'theory', label: 'How It Works' },
  { id: 'visualizer', label: 'Visualizer' },
  { id: 'pivot', label: 'Pivot Strategies' },
  { id: 'code', label: 'Java Code' },
  { id: 'analysis', label: 'Analysis' },
];

const Theory = () => (
  <div className="space-y-6">
    <Card>
      <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">Quick Sort — Partition &amp; Conquer</h3>
      <ol className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
        <li className="flex gap-3 items-start">
          <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 font-bold rounded-full w-7 h-7 flex items-center justify-center text-xs shrink-0">1</span>
          <div><strong>Choose a pivot</strong> — an element used as reference for partitioning.</div>
        </li>
        <li className="flex gap-3 items-start">
          <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 font-bold rounded-full w-7 h-7 flex items-center justify-center text-xs shrink-0">2</span>
          <div><strong>Partition</strong> — rearrange so elements ≤ pivot go left, elements &gt; pivot go right. The pivot lands in its final sorted position.</div>
        </li>
        <li className="flex gap-3 items-start">
          <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 font-bold rounded-full w-7 h-7 flex items-center justify-center text-xs shrink-0">3</span>
          <div><strong>Recurse</strong> — apply the same process to the left and right sub-arrays.</div>
        </li>
        <li className="flex gap-3 items-start">
          <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 font-bold rounded-full w-7 h-7 flex items-center justify-center text-xs shrink-0">4</span>
          <div><strong>Base case</strong> — sub-array with 0 or 1 element is already sorted.</div>
        </li>
      </ol>
    </Card>

    <Card>
      <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">Partitioning in Detail</h3>
      <div className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
        <p>Using two pointers (Lomuto partition scheme):</p>
        <ul className="space-y-2 ml-4">
          <li>• <code className="bg-slate-100 dark:bg-slate-700 px-1 rounded">i</code> tracks the boundary of elements ≤ pivot</li>
          <li>• <code className="bg-slate-100 dark:bg-slate-700 px-1 rounded">j</code> scans through the array</li>
          <li>• When <code className="bg-slate-100 dark:bg-slate-700 px-1 rounded">arr[j] ≤ pivot</code>: increment i, swap arr[i] with arr[j]</li>
          <li>• After loop: place pivot at position i+1</li>
        </ul>
      </div>
      <InfoBox variant="warning" className="mt-4">
        The pivot always ends up in its FINAL sorted position after partitioning — you never move it again!
      </InfoBox>
    </Card>
  </div>
);

const PivotStrategies = () => (
  <div className="space-y-4">
    <Card>
      <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">Pivot Selection Strategies</h3>
      <div className="space-y-4">
        {[
          {
            name: 'First / Last Element (Naïve)',
            desc: 'Simple to implement. Very fast selection. But terrible on sorted or reverse-sorted input — causes O(n²) worst case.',
            worst: 'O(n²) on sorted input',
            color: 'border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/20',
            headerColor: 'text-red-800 dark:text-red-200',
            textColor: 'text-slate-700 dark:text-slate-300',
            perfColor: 'text-slate-600 dark:text-slate-400',
          },
          {
            name: 'Middle Element',
            desc: 'Avoids worst case on sorted input. Still possible to hit bad partitions on specific inputs.',
            worst: 'Better on sorted input',
            color: 'border-yellow-300 dark:border-yellow-700 bg-yellow-50 dark:bg-yellow-900/20',
            headerColor: 'text-yellow-800 dark:text-yellow-200',
            textColor: 'text-slate-700 dark:text-slate-300',
            perfColor: 'text-slate-600 dark:text-slate-400',
          },
          {
            name: 'Random Pivot',
            desc: 'Expected O(n log n). Adversary cannot construct a worst-case input. Good in practice.',
            worst: 'Expected O(n log n)',
            color: 'border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/20',
            headerColor: 'text-blue-800 dark:text-blue-200',
            textColor: 'text-slate-700 dark:text-slate-300',
            perfColor: 'text-slate-600 dark:text-slate-400',
          },
          {
            name: 'Median of Three',
            desc: 'Look at first, middle, and last elements; use the median. Near-optimal for most inputs.',
            worst: 'Very good in practice',
            color: 'border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-900/20',
            headerColor: 'text-green-800 dark:text-green-200',
            textColor: 'text-slate-700 dark:text-slate-300',
            perfColor: 'text-slate-600 dark:text-slate-400',
          },
        ].map(s => (
          <div key={s.name} className={`border rounded-xl p-4 ${s.color}`}>
            <h4 className={`font-bold mb-1 ${s.headerColor}`}>{s.name}</h4>
            <p className={`text-sm ${s.textColor}`}>{s.desc}</p>
            <p className={`text-xs font-medium mt-2 ${s.perfColor}`}>Performance: {s.worst}</p>
          </div>
        ))}
      </div>
    </Card>
    <InfoBox variant="exam">
      In the visualizer, try different pivot strategies to see how they affect the number of steps!
    </InfoBox>
  </div>
);

const Analysis = () => (
  <div className="space-y-6">
    <Card>
      <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">Complexity Analysis</h3>
      <ComplexityTable
        columns={['Case', 'Time Complexity', 'When']}
        rows={[
          ['Best Case', 'O(n log n)', 'Pivot always splits array into two equal halves'],
          ['Average Case', 'O(n log n)', 'Random data with reasonable pivot selection'],
          ['Worst Case', 'O(n²)', 'Pivot is always min or max (sorted/reverse-sorted input)'],
          ['Space', 'O(log n)', 'Call stack depth (O(n) worst case if unbalanced)'],
        ]}
      />
    </Card>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <h4 className="font-bold text-green-700 dark:text-green-400 mb-3">✓ Why Use Quick Sort?</h4>
        <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
          <li>• In-place (O(1) extra space)</li>
          <li>• Excellent cache performance</li>
          <li>• Fast in practice for random data</li>
          <li>• Standard library implementations use it</li>
        </ul>
      </Card>
      <Card>
        <h4 className="font-bold text-red-700 dark:text-red-400 mb-3">✗ Disadvantages</h4>
        <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
          <li>• O(n²) worst case without care</li>
          <li>• Not stable — equal elements can reorder</li>
          <li>• Recursive depth can cause stack overflow</li>
          <li>• Harder to implement correctly than simpler sorts</li>
        </ul>
      </Card>
    </div>
  </div>
);

export default function QuickSort() {
  const [activeTab, setActiveTab] = useState('theory');

  const content = {
    theory: <Theory />,
    visualizer: (
      <Card>
        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">Quick Sort Visualizer</h3>
        <InfoBox variant="info" className="mb-4">
          <strong>Purple</strong> = pivot element. Try changing the pivot strategy in the dropdown to see how it affects partitioning!
        </InfoBox>
        <SortingVisualizer generateSteps={generateQuickSortSteps} title="Quick Sort" algorithmId="quick" />
      </Card>
    ),
    pivot: <PivotStrategies />,
    code: (
      <CodeBlock
        title="Quick Sort — Java"
        filename="QuickSort.java"
        tabs={[{ id: 'code', label: 'Implementation', code: CODE.quickSort }]}
      />
    ),
    analysis: <Analysis />,
  };

  return (
    <div className="space-y-6">
      <SectionHeader
        icon={Zap}
        title="L3: Quick Sort"
        description="Divide and conquer with in-place partitioning. Fast in practice, tricky in theory."
      />
      <TabBar tabs={TABS} activeTab={activeTab} onChange={setActiveTab} />
      <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
        {content[activeTab]}
      </div>
    </div>
  );
}
