import { useState } from 'react';
import { BarChart2, ArrowDownUp, Layers, Cpu } from 'lucide-react';
import { SectionHeader } from '../components/ui/SectionHeader';
import { Card } from '../components/ui/Card';
import { TabBar } from '../components/ui/TabBar';
import { InfoBox } from '../components/ui/InfoBox';
import { CodeBlock } from '../components/ui/CodeBlock';
import { ComplexityTable } from '../components/ui/ComplexityTable';
import { SortingVisualizer } from '../components/visualizations/SortingVisualizer';
import { CallStackVisualizer } from '../components/visualizations/CallStackVisualizer';
import {
  generateBubbleSortSteps,
  generateSelectionSortSteps,
  generateInsertionSortSteps,
} from '../data/sortingAlgorithms';
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
      <h3 className="text-xl font-bold text-slate-800 mb-4">Data Structures Classification</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-5">
          <h4 className="font-bold text-blue-800 text-lg mb-3">Static Data Structures</h4>
          <ul className="space-y-1 text-blue-700 text-sm">
            <li>• Size is <strong>fixed</strong> at creation</li>
            <li>• Contiguous memory allocation</li>
            <li>• Faster data access</li>
            <li>• Potential waste if unused</li>
          </ul>
          <div className="mt-3 bg-blue-100 rounded-lg px-3 py-2 text-sm font-medium text-blue-800">Examples: Arrays</div>
        </div>
        <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-5">
          <h4 className="font-bold text-indigo-800 text-lg mb-3">Dynamic Data Structures</h4>
          <ul className="space-y-1 text-indigo-700 text-sm">
            <li>• Size can <strong>change</strong> at runtime</li>
            <li>• Use pointers / references</li>
            <li>• Efficient memory usage</li>
            <li>• Slightly slower access</li>
          </ul>
          <div className="mt-3 bg-indigo-100 rounded-lg px-3 py-2 text-sm font-medium text-indigo-800">Examples: Linked Lists, Trees, Graphs</div>
        </div>
      </div>
    </Card>

    <Card>
      <h3 className="text-xl font-bold text-slate-800 mb-4">Linear vs Non-Linear</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h4 className="font-semibold text-slate-700 mb-2">Linear Data Structures</h4>
          <p className="text-sm text-slate-600 mb-2">Elements arranged sequentially, each connected to previous and next.</p>
          <div className="flex gap-2 flex-wrap">
            {['Arrays', 'Linked Lists', 'Stacks', 'Queues'].map(item => (
              <span key={item} className="bg-slate-100 text-slate-700 rounded-full px-3 py-1 text-sm font-medium">{item}</span>
            ))}
          </div>
        </div>
        <div>
          <h4 className="font-semibold text-slate-700 mb-2">Non-Linear Data Structures</h4>
          <p className="text-sm text-slate-600 mb-2">Elements arranged hierarchically; one element can connect to many others.</p>
          <div className="flex gap-2 flex-wrap">
            {['Trees', 'Graphs', 'Heaps', 'AVL Trees'].map(item => (
              <span key={item} className="bg-indigo-100 text-indigo-700 rounded-full px-3 py-1 text-sm font-medium">{item}</span>
            ))}
          </div>
        </div>
      </div>
    </Card>

    <Card>
      <h3 className="text-xl font-bold text-slate-800 mb-4">Sorting Properties</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-green-50 border border-green-100 rounded-xl p-4">
          <h4 className="font-bold text-green-800 mb-2">In-Place Sorting</h4>
          <p className="text-sm text-green-700">Sorts using only O(1) extra memory — rearranges within the original array.</p>
          <p className="text-xs mt-2 text-green-600 font-medium">Examples: Bubble, Selection, Insertion, Heap, Quick Sort</p>
        </div>
        <div className="bg-orange-50 border border-orange-100 rounded-xl p-4">
          <h4 className="font-bold text-orange-800 mb-2">Not-In-Place Sorting</h4>
          <p className="text-sm text-orange-700">Requires extra memory proportional to input — creates temporary arrays.</p>
          <p className="text-xs mt-2 text-orange-600 font-medium">Example: Merge Sort (O(n) extra space)</p>
        </div>
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
          <h4 className="font-bold text-blue-800 mb-2">Stable Sorting</h4>
          <p className="text-sm text-blue-700">Equal elements maintain their original relative order in the sorted output.</p>
          <p className="text-xs mt-2 text-blue-600 font-medium">Examples: Bubble Sort, Insertion Sort, Merge Sort</p>
        </div>
        <div className="bg-red-50 border border-red-100 rounded-xl p-4">
          <h4 className="font-bold text-red-800 mb-2">Unstable Sorting</h4>
          <p className="text-sm text-red-700">Equal elements may change relative order in the sorted output.</p>
          <p className="text-xs mt-2 text-red-600 font-medium">Examples: Selection Sort, Quick Sort</p>
        </div>
      </div>
    </Card>
  </div>
);

const BubbleSortSection = () => (
  <div className="space-y-6">
    <Card>
      <h3 className="text-xl font-bold text-slate-800 mb-3">How Bubble Sort Works</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <ol className="space-y-2 text-sm text-slate-700">
            <li className="flex gap-3"><span className="bg-indigo-100 text-indigo-700 font-bold rounded-full w-6 h-6 flex items-center justify-center text-xs shrink-0">1</span>Compare adjacent elements.</li>
            <li className="flex gap-3"><span className="bg-indigo-100 text-indigo-700 font-bold rounded-full w-6 h-6 flex items-center justify-center text-xs shrink-0">2</span>If left &gt; right, swap them.</li>
            <li className="flex gap-3"><span className="bg-indigo-100 text-indigo-700 font-bold rounded-full w-6 h-6 flex items-center justify-center text-xs shrink-0">3</span>After each pass, the largest element "bubbles" to the end.</li>
            <li className="flex gap-3"><span className="bg-indigo-100 text-indigo-700 font-bold rounded-full w-6 h-6 flex items-center justify-center text-xs shrink-0">4</span>Repeat for n-1 passes (or until no swaps — optimization).</li>
          </ol>
          <InfoBox variant="exam" className="mt-4">
            <strong>Exam key:</strong> Bubble Sort is <strong>stable</strong> and <strong>in-place</strong>. Best case O(n) with the "swapped" flag optimization.
          </InfoBox>
        </div>
        <div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-yellow-50 border border-yellow-200 rounded p-2 flex items-center gap-2"><span className="w-4 h-4 bg-yellow-400 rounded-sm inline-block"/><span>Comparing</span></div>
            <div className="bg-red-50 border border-red-200 rounded p-2 flex items-center gap-2"><span className="w-4 h-4 bg-red-400 rounded-sm inline-block"/><span>Swapping</span></div>
            <div className="bg-emerald-50 border border-emerald-200 rounded p-2 flex items-center gap-2"><span className="w-4 h-4 bg-emerald-400 rounded-sm inline-block"/><span>Sorted</span></div>
            <div className="bg-slate-50 border border-slate-200 rounded p-2 flex items-center gap-2"><span className="w-4 h-4 bg-slate-300 rounded-sm inline-block"/><span>Unsorted</span></div>
          </div>
        </div>
      </div>
    </Card>

    <Card>
      <h3 className="text-xl font-bold text-slate-800 mb-4">Interactive Visualization</h3>
      <SortingVisualizer generateSteps={generateBubbleSortSteps} title="Bubble Sort" algorithmId="bubble" />
    </Card>

    <CodeBlock
      title="Bubble Sort — Java"
      filename="BubbleSort.java"
      tabs={[{ id: 'code', label: 'Implementation', code: CODE.bubbleSort }]}
    />
  </div>
);

const SelectionSortSection = () => (
  <div className="space-y-6">
    <Card>
      <h3 className="text-xl font-bold text-slate-800 mb-3">How Selection Sort Works</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <ol className="space-y-2 text-sm text-slate-700">
            <li className="flex gap-3"><span className="bg-indigo-100 text-indigo-700 font-bold rounded-full w-6 h-6 flex items-center justify-center text-xs shrink-0">1</span>Find the minimum in the unsorted portion.</li>
            <li className="flex gap-3"><span className="bg-indigo-100 text-indigo-700 font-bold rounded-full w-6 h-6 flex items-center justify-center text-xs shrink-0">2</span>Swap it with the first unsorted element.</li>
            <li className="flex gap-3"><span className="bg-indigo-100 text-indigo-700 font-bold rounded-full w-6 h-6 flex items-center justify-center text-xs shrink-0">3</span>The sorted portion grows by 1.</li>
            <li className="flex gap-3"><span className="bg-indigo-100 text-indigo-700 font-bold rounded-full w-6 h-6 flex items-center justify-center text-xs shrink-0">4</span>Repeat for n-1 passes.</li>
          </ol>
          <InfoBox variant="warning" className="mt-4">
            <strong>Note:</strong> Selection Sort always makes exactly n-1 swaps regardless of the input. It's <strong>unstable</strong> and <strong>in-place</strong>. O(n²) always — no best case optimization.
          </InfoBox>
        </div>
        <div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-blue-50 border border-blue-200 rounded p-2 flex items-center gap-2"><span className="w-4 h-4 bg-blue-400 rounded-sm inline-block"/><span>Current Min</span></div>
            <div className="bg-yellow-50 border border-yellow-200 rounded p-2 flex items-center gap-2"><span className="w-4 h-4 bg-yellow-400 rounded-sm inline-block"/><span>Scanning</span></div>
            <div className="bg-red-50 border border-red-200 rounded p-2 flex items-center gap-2"><span className="w-4 h-4 bg-red-400 rounded-sm inline-block"/><span>Swapping</span></div>
            <div className="bg-emerald-50 border border-emerald-200 rounded p-2 flex items-center gap-2"><span className="w-4 h-4 bg-emerald-400 rounded-sm inline-block"/><span>Sorted</span></div>
          </div>
        </div>
      </div>
    </Card>

    <Card>
      <h3 className="text-xl font-bold text-slate-800 mb-4">Interactive Visualization</h3>
      <SortingVisualizer generateSteps={generateSelectionSortSteps} title="Selection Sort" algorithmId="selection" />
    </Card>

    <CodeBlock
      title="Selection Sort — Java"
      filename="SelectionSort.java"
      tabs={[{ id: 'code', label: 'Implementation', code: CODE.selectionSort }]}
    />
  </div>
);

const InsertionSortSection = () => (
  <div className="space-y-6">
    <Card>
      <h3 className="text-xl font-bold text-slate-800 mb-3">How Insertion Sort Works</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-slate-600 mb-3 italic">Think of sorting playing cards in your hand — pick one card and insert it in the right place among already-sorted cards.</p>
          <ol className="space-y-2 text-sm text-slate-700">
            <li className="flex gap-3"><span className="bg-indigo-100 text-indigo-700 font-bold rounded-full w-6 h-6 flex items-center justify-center text-xs shrink-0">1</span>Start with the second element (index 1). First element is trivially sorted.</li>
            <li className="flex gap-3"><span className="bg-indigo-100 text-indigo-700 font-bold rounded-full w-6 h-6 flex items-center justify-center text-xs shrink-0">2</span>Pick the current element as "key".</li>
            <li className="flex gap-3"><span className="bg-indigo-100 text-indigo-700 font-bold rounded-full w-6 h-6 flex items-center justify-center text-xs shrink-0">3</span>Shift elements in sorted portion that are greater than key one position right.</li>
            <li className="flex gap-3"><span className="bg-indigo-100 text-indigo-700 font-bold rounded-full w-6 h-6 flex items-center justify-center text-xs shrink-0">4</span>Insert key at the gap.</li>
          </ol>
          <InfoBox variant="exam" className="mt-4">
            <strong>Exam key:</strong> Best case O(n) for nearly-sorted data. Stable and in-place. Best for small or nearly-sorted arrays.
          </InfoBox>
        </div>
        <div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-orange-50 border border-orange-200 rounded p-2 flex items-center gap-2"><span className="w-4 h-4 bg-orange-400 rounded-sm inline-block"/><span>Key (inserting)</span></div>
            <div className="bg-yellow-50 border border-yellow-200 rounded p-2 flex items-center gap-2"><span className="w-4 h-4 bg-yellow-400 rounded-sm inline-block"/><span>Comparing</span></div>
            <div className="bg-amber-50 border border-amber-200 rounded p-2 flex items-center gap-2"><span className="w-4 h-4 bg-amber-300 rounded-sm inline-block"/><span>Shifted</span></div>
            <div className="bg-emerald-50 border border-emerald-200 rounded p-2 flex items-center gap-2"><span className="w-4 h-4 bg-emerald-400 rounded-sm inline-block"/><span>Sorted</span></div>
          </div>
        </div>
      </div>
    </Card>

    <Card>
      <h3 className="text-xl font-bold text-slate-800 mb-4">Interactive Visualization</h3>
      <SortingVisualizer generateSteps={generateInsertionSortSteps} title="Insertion Sort" algorithmId="insertion" />
    </Card>

    <CodeBlock
      title="Insertion Sort — Java"
      filename="InsertionSort.java"
      tabs={[{ id: 'code', label: 'Implementation', code: CODE.insertionSort }]}
    />
  </div>
);

const ComparisonSection = () => (
  <div className="space-y-6">
    <Card>
      <h3 className="text-xl font-bold text-slate-800 mb-4">Algorithm Comparison</h3>
      <ComplexityTable
        columns={['Algorithm', 'Best Case', 'Average Case', 'Worst Case', 'Space', 'Stable?', 'In-Place?']}
        rows={[
          ['Bubble Sort', 'O(n)*', 'O(n²)', 'O(n²)', 'O(1)', '✓ Yes', '✓ Yes'],
          ['Selection Sort', 'O(n²)', 'O(n²)', 'O(n²)', 'O(1)', '✗ No', '✓ Yes'],
          ['Insertion Sort', 'O(n)*', 'O(n²)', 'O(n²)', 'O(1)', '✓ Yes', '✓ Yes'],
        ]}
      />
      <p className="text-xs text-slate-500 mt-2">* O(n) best case requires optimization: Bubble Sort needs the "swapped" flag; Insertion Sort naturally achieves O(n) on sorted input.</p>
    </Card>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="border-l-4 border-l-blue-400">
        <h4 className="font-bold text-slate-800 mb-2">When to use Bubble Sort?</h4>
        <p className="text-sm text-slate-600">Educational purposes. Nearly-sorted arrays with the optimization flag. Avoid for production — almost always worse than Insertion Sort.</p>
      </Card>
      <Card className="border-l-4 border-l-indigo-400">
        <h4 className="font-bold text-slate-800 mb-2">When to use Selection Sort?</h4>
        <p className="text-sm text-slate-600">When the number of writes is critical (only n-1 swaps). Small arrays. Memory writes are expensive.</p>
      </Card>
      <Card className="border-l-4 border-l-purple-400">
        <h4 className="font-bold text-slate-800 mb-2">When to use Insertion Sort?</h4>
        <p className="text-sm text-slate-600">Small arrays. Nearly-sorted data. Online sorting (elements arrive one by one). Best of the three simple algorithms.</p>
      </Card>
    </div>
  </div>
);

const RecursionSection = () => (
  <div className="space-y-6">
    <Card>
      <h3 className="text-xl font-bold text-slate-800 mb-3">What is Recursion?</h3>
      <p className="text-slate-600 mb-4">A function that calls itself with a smaller version of the problem until it reaches a simple base case.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <h4 className="font-bold text-green-800 mb-2">1. Base Case</h4>
          <p className="text-sm text-green-700">The condition that stops recursion. Without it → infinite recursion → stack overflow.</p>
          <code className="mt-2 block text-xs bg-green-100 p-2 rounded font-mono text-green-900">if (n == 0) return 1; // base case</code>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <h4 className="font-bold text-blue-800 mb-2">2. Recursive Case</h4>
          <p className="text-sm text-blue-700">The function calling itself with a smaller/simpler argument, progressing toward the base case.</p>
          <code className="mt-2 block text-xs bg-blue-100 p-2 rounded font-mono text-blue-900">return n * factorial(n - 1); // recursive</code>
        </div>
      </div>
    </Card>

    <Card>
      <h3 className="text-xl font-bold text-slate-800 mb-3">What's in Each Stack Frame?</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Function Arguments', desc: 'Input params (e.g., n=4)', color: 'bg-blue-100 text-blue-800' },
          { label: 'Local Variables', desc: 'Variables declared inside', color: 'bg-green-100 text-green-800' },
          { label: 'Return Address', desc: 'Where to return after finishing', color: 'bg-purple-100 text-purple-800' },
          { label: 'Return Value', desc: 'Result passed back to caller', color: 'bg-orange-100 text-orange-800' },
        ].map(item => (
          <div key={item.label} className={`rounded-lg p-3 ${item.color}`}>
            <p className="font-semibold text-xs mb-1">{item.label}</p>
            <p className="text-xs opacity-80">{item.desc}</p>
          </div>
        ))}
      </div>
    </Card>

    <Card>
      <h3 className="text-xl font-bold text-slate-800 mb-4">Interactive Call Stack — factorial(n)</h3>
      <CallStackVisualizer />
    </Card>
  </div>
);

export default function SortingBasics() {
  const [activeTab, setActiveTab] = useState('overview');

  const content = {
    overview: <DSOverview />,
    bubble: <BubbleSortSection />,
    selection: <SelectionSortSection />,
    insertion: <InsertionSortSection />,
    comparison: <ComparisonSection />,
    recursion: <RecursionSection />,
  };

  return (
    <div className="space-y-6">
      <SectionHeader
        icon={BarChart2}
        title="L1: Basics & Sorting"
        description="Data structures classification, sorting algorithms, and recursion fundamentals."
      />
      <TabBar tabs={TABS} activeTab={activeTab} onChange={setActiveTab} />
      <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
        {content[activeTab]}
      </div>
    </div>
  );
}
