import { useState } from 'react';
import { BarChart2 } from 'lucide-react';
import { SectionHeader } from '../components/ui/SectionHeader';
import { Card } from '../components/ui/Card';
import { TabBar } from '../components/ui/TabBar';
import { InfoBox } from '../components/ui/InfoBox';
import { CodeBlock } from '../components/ui/CodeBlock';
import { ComplexityTable } from '../components/ui/ComplexityTable';
import { SortingVisualizer } from '../components/visualizations/SortingVisualizer';
import { CallStackVisualizer } from '../components/visualizations/CallStackVisualizer';
import { generateBubbleSortSteps, generateSelectionSortSteps, generateInsertionSortSteps } from '../data/sortingAlgorithms';
import { CODE } from '../data/codeSnippets';

const TABS = [
  { id: 'overview', label: 'DS Overview' },
  { id: 'bubble', label: 'Bubble Sort' },
  { id: 'selection', label: 'Selection Sort' },
  { id: 'insertion', label: 'Insertion Sort' },
  { id: 'comparison', label: 'Comparison' },
  { id: 'recursion', label: 'Recursion' },
];

const DSOverview = () => (
  <div className="space-y-6">
    <Card>
      <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">Data Structures Classification</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-xl p-5">
          <h4 className="font-bold text-blue-800 dark:text-blue-200 text-lg mb-3">Static Data Structures</h4>
          <ul className="space-y-1 text-blue-700 dark:text-blue-300 text-sm">
            <li>• Size is <strong>fixed</strong> at creation</li>
            <li>• Contiguous memory allocation</li>
            <li>• Faster data access</li>
            <li>• Potential waste if unused</li>
          </ul>
          <div className="mt-3 bg-blue-100 dark:bg-blue-900/40 rounded-lg px-3 py-2 text-sm font-medium text-blue-800 dark:text-blue-200">Examples: Arrays</div>
        </div>
        <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 rounded-xl p-5">
          <h4 className="font-bold text-indigo-800 dark:text-indigo-200 text-lg mb-3">Dynamic Data Structures</h4>
          <ul className="space-y-1 text-indigo-700 dark:text-indigo-300 text-sm">
            <li>• Size can <strong>change</strong> at runtime</li>
            <li>• Use pointers / references</li>
            <li>• Efficient memory usage</li>
            <li>• Slightly slower access</li>
          </ul>
          <div className="mt-3 bg-indigo-100 dark:bg-indigo-900/40 rounded-lg px-3 py-2 text-sm font-medium text-indigo-800 dark:text-indigo-200">Examples: Linked Lists, Trees, Graphs</div>
        </div>
      </div>
    </Card>
    <Card>
      <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">Linear vs Non-Linear</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h4 className="font-semibold text-slate-700 dark:text-slate-300 mb-2">Linear Data Structures</h4>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">Elements arranged sequentially.</p>
          <div className="flex gap-2 flex-wrap">
            {['Arrays', 'Linked Lists', 'Stacks', 'Queues'].map(item => (
              <span key={item} className="bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-full px-3 py-1 text-sm font-medium">{item}</span>
            ))}
          </div>
        </div>
        <div>
          <h4 className="font-semibold text-slate-700 dark:text-slate-300 mb-2">Non-Linear Data Structures</h4>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">Elements arranged hierarchically.</p>
          <div className="flex gap-2 flex-wrap">
            {['Trees', 'Graphs', 'Heaps', 'AVL Trees'].map(item => (
              <span key={item} className="bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 rounded-full px-3 py-1 text-sm font-medium">{item}</span>
            ))}
          </div>
        </div>
      </div>
    </Card>
    <Card>
      <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">Sorting Properties</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { title: 'In-Place Sorting', desc: 'Sorts using only O(1) extra memory.', ex: 'Bubble, Selection, Insertion, Quick Sort', color: 'bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-800 text-green-800 dark:text-green-200' },
          { title: 'Not-In-Place Sorting', desc: 'Requires extra memory proportional to input.', ex: 'Merge Sort (O(n) extra space)', color: 'bg-orange-50 dark:bg-orange-900/20 border-orange-100 dark:border-orange-800 text-orange-800 dark:text-orange-200' },
          { title: 'Stable Sorting', desc: 'Equal elements preserve original relative order.', ex: 'Bubble Sort, Insertion Sort, Merge Sort', color: 'bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800 text-blue-800 dark:text-blue-200' },
          { title: 'Unstable Sorting', desc: 'Equal elements may change relative order.', ex: 'Selection Sort, Quick Sort', color: 'bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-800 text-red-800 dark:text-red-200' },
        ].map(item => (
          <div key={item.title} className={`border rounded-xl p-4 ${item.color}`}>
            <h4 className="font-bold mb-1">{item.title}</h4>
            <p className="text-sm opacity-90">{item.desc}</p>
            <p className="text-xs font-medium mt-2 opacity-75">{item.ex}</p>
          </div>
        ))}
      </div>
    </Card>
  </div>
);

const SortSection = ({ generateSteps, algorithmId, title, how, note, colors }) => (
  <div className="space-y-6">
    <Card>
      <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-3">How {title} Works</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <ol className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
            {how.map((step, i) => (
              <li key={i} className="flex gap-3">
                <span className="bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 font-bold rounded-full w-6 h-6 flex items-center justify-center text-xs shrink-0">{i + 1}</span>
                {step}
              </li>
            ))}
          </ol>
          <InfoBox variant="exam" className="mt-4"><strong>Exam key:</strong> {note}</InfoBox>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs self-start">
          {colors.map(c => (
            <div key={c.label} className={`${c.bg} border ${c.border} rounded p-2 flex items-center gap-2`}>
              <span className={`w-4 h-4 ${c.bar} rounded-sm inline-block`}/><span className={c.text}>{c.label}</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
    <Card>
      <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">Interactive Visualization</h3>
      <SortingVisualizer generateSteps={generateSteps} algorithmId={algorithmId} />
    </Card>
    <CodeBlock title={`${title} — Java`} filename={`${title.replace(' ', '')}.java`}
      tabs={[{ id: 'code', label: 'Implementation', code: CODE[algorithmId + 'Sort'] || CODE.bubbleSort }]} />
  </div>
);

const ComparisonSection = () => (
  <div className="space-y-6">
    <Card>
      <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">Algorithm Comparison</h3>
      <ComplexityTable
        columns={['Algorithm', 'Best Case', 'Average Case', 'Worst Case', 'Space', 'Stable?', 'In-Place?']}
        rows={[
          ['Bubble Sort', 'O(n)*', 'O(n²)', 'O(n²)', 'O(1)', '✓ Yes', '✓ Yes'],
          ['Selection Sort', 'O(n²)', 'O(n²)', 'O(n²)', 'O(1)', '✗ No', '✓ Yes'],
          ['Insertion Sort', 'O(n)*', 'O(n²)', 'O(n²)', 'O(1)', '✓ Yes', '✓ Yes'],
        ]}
      />
      <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">* O(n) best case with optimization flag / sorted input.</p>
    </Card>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {[
        { title: 'Bubble Sort', when: 'Educational, nearly-sorted arrays with optimization. Rarely used in production.', color: 'border-l-blue-400' },
        { title: 'Selection Sort', when: 'When writes are expensive — only n-1 swaps regardless of input.', color: 'border-l-indigo-400' },
        { title: 'Insertion Sort', when: 'Small arrays, nearly-sorted data, online sorting. Best of the three simple algorithms.', color: 'border-l-purple-400' },
      ].map(item => (
        <Card key={item.title} className={`border-l-4 ${item.color}`}>
          <h4 className="font-bold text-slate-800 dark:text-slate-100 mb-2">When to use {item.title}?</h4>
          <p className="text-sm text-slate-600 dark:text-slate-400">{item.when}</p>
        </Card>
      ))}
    </div>
  </div>
);

const RecursionSection = () => (
  <div className="space-y-6">
    <Card>
      <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-3">What is Recursion?</h3>
      <p className="text-slate-600 dark:text-slate-400 mb-4">A function that calls itself with a smaller version of the problem until a base case is reached.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4">
          <h4 className="font-bold text-green-800 dark:text-green-200 mb-2">1. Base Case</h4>
          <p className="text-sm text-green-700 dark:text-green-300">Stops recursion. Without it → infinite recursion → stack overflow.</p>
          <code className="mt-2 block text-xs bg-green-100 dark:bg-green-900/50 p-2 rounded font-mono text-green-900 dark:text-green-200">if (n == 0) return 1;</code>
        </div>
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
          <h4 className="font-bold text-blue-800 dark:text-blue-200 mb-2">2. Recursive Case</h4>
          <p className="text-sm text-blue-700 dark:text-blue-300">Calls itself with a smaller argument, progressing toward the base case.</p>
          <code className="mt-2 block text-xs bg-blue-100 dark:bg-blue-900/50 p-2 rounded font-mono text-blue-900 dark:text-blue-200">return n * factorial(n - 1);</code>
        </div>
      </div>
    </Card>
    <Card>
      <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">Interactive Call Stack — factorial(n)</h3>
      <CallStackVisualizer />
    </Card>
  </div>
);

const BUBBLE_COLORS = [
  { label: 'Comparing', bar: 'bg-yellow-400', bg: 'bg-yellow-50 dark:bg-yellow-900/20', border: 'border-yellow-200 dark:border-yellow-800', text: 'text-yellow-900 dark:text-yellow-200' },
  { label: 'Swapping', bar: 'bg-red-400', bg: 'bg-red-50 dark:bg-red-900/20', border: 'border-red-200 dark:border-red-800', text: 'text-red-900 dark:text-red-200' },
  { label: 'Sorted', bar: 'bg-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-900/20', border: 'border-emerald-200 dark:border-emerald-800', text: 'text-emerald-900 dark:text-emerald-200' },
  { label: 'Unsorted', bar: 'bg-slate-300', bg: 'bg-slate-50 dark:bg-slate-800/50', border: 'border-slate-200 dark:border-slate-700', text: 'text-slate-900 dark:text-slate-200' },
];
const SEL_COLORS = [
  { label: 'Current Min', bar: 'bg-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/20', border: 'border-blue-200 dark:border-blue-800', text: 'text-blue-900 dark:text-blue-200' },
  { label: 'Scanning', bar: 'bg-yellow-400', bg: 'bg-yellow-50 dark:bg-yellow-900/20', border: 'border-yellow-200 dark:border-yellow-800', text: 'text-yellow-900 dark:text-yellow-200' },
  { label: 'Swapping', bar: 'bg-red-400', bg: 'bg-red-50 dark:bg-red-900/20', border: 'border-red-200 dark:border-red-800', text: 'text-red-900 dark:text-red-200' },
  { label: 'Sorted', bar: 'bg-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-900/20', border: 'border-emerald-200 dark:border-emerald-800', text: 'text-emerald-900 dark:text-emerald-200' },
];
const INS_COLORS = [
  { label: 'Key (inserting)', bar: 'bg-orange-400', bg: 'bg-orange-50 dark:bg-orange-900/20', border: 'border-orange-200 dark:border-orange-800', text: 'text-orange-900 dark:text-orange-200' },
  { label: 'Comparing', bar: 'bg-yellow-400', bg: 'bg-yellow-50 dark:bg-yellow-900/20', border: 'border-yellow-200 dark:border-yellow-800', text: 'text-yellow-900 dark:text-yellow-200' },
  { label: 'Shifted', bar: 'bg-amber-300', bg: 'bg-amber-50 dark:bg-amber-900/20', border: 'border-amber-200 dark:border-amber-800', text: 'text-amber-900 dark:text-amber-200' },
  { label: 'Sorted', bar: 'bg-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-900/20', border: 'border-emerald-200 dark:border-emerald-800', text: 'text-emerald-900 dark:text-emerald-200' },
];

export default function SortingBasics() {
  const [activeTab, setActiveTab] = useState('overview');
  const content = {
    overview: <DSOverview />,
    bubble: <SortSection generateSteps={generateBubbleSortSteps} algorithmId="bubble" title="Bubble Sort"
      how={['Compare adjacent elements.', 'If left > right, swap them.', 'After each pass, largest element "bubbles" to the end.', 'Repeat for n-1 passes (or until no swaps).']}
      note="Stable and in-place. Best case O(n) with the swapped-flag optimization."
      colors={BUBBLE_COLORS} />,
    selection: <SortSection generateSteps={generateSelectionSortSteps} algorithmId="selection" title="Selection Sort"
      how={['Find the minimum in the unsorted portion.', 'Swap it with the first unsorted element.', 'Sorted portion grows by 1.', 'Repeat for n-1 passes.']}
      note="Unstable and in-place. Always makes exactly n-1 swaps. O(n²) always — no best case."
      colors={SEL_COLORS} />,
    insertion: <SortSection generateSteps={generateInsertionSortSteps} algorithmId="insertion" title="Insertion Sort"
      how={['First element is trivially sorted.', 'Pick current element as "key".', 'Shift elements greater than key one position right.', 'Insert key at the gap.']}
      note="Stable and in-place. Best case O(n) on sorted input. Best of the three simple sorts."
      colors={INS_COLORS} />,
    comparison: <ComparisonSection />,
    recursion: <RecursionSection />,
  };

  return (
    <div className="space-y-6">
      <SectionHeader icon={BarChart2} title="L1: Basics & Sorting"
        description="Data structures classification, sorting algorithms, and recursion fundamentals." />
      <TabBar tabs={TABS} activeTab={activeTab} onChange={setActiveTab} />
      <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">{content[activeTab]}</div>
    </div>
  );
}
