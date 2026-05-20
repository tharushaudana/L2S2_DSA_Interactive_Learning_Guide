import { useState } from 'react';
import { Search, CheckCircle2, AlertTriangle, Info } from 'lucide-react';
import { SectionHeader } from '../components/ui/SectionHeader';
import { Card } from '../components/ui/Card';
import { TabBar } from '../components/ui/TabBar';
import { InfoBox } from '../components/ui/InfoBox';
import { CodeBlock } from '../components/ui/CodeBlock';
import { TreeGraph } from '../components/visualizations/TreeGraph';
import { useBST, treeToGraph } from '../hooks/useBST';
import { CODE } from '../data/codeSnippets';

const TABS = [
  { id: 'sandbox', label: '🎮 Sandbox' },
  { id: 'property', label: 'BST Property' },
  { id: 'search', label: 'Search' },
  { id: 'insert', label: 'Insert' },
  { id: 'code', label: 'Java Code' },
];

const BSTSandbox = () => {
  const [inputValue, setInputValue] = useState('');
  const bst = useBST();
  const { nodes, edges } = treeToGraph(bst.bstRoot);

  const doAction = (action) => {
    const val = parseInt(inputValue);
    if (isNaN(val)) return;
    bst[action](val);
    if (action !== 'delete') setInputValue('');
  };

  return (
    <Card className="border-l-4 border-l-indigo-500">
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-grow space-y-4">
          <h3 className="text-xl font-bold text-slate-800">Interactive BST Sandbox</h3>
          <p className="text-slate-600 text-sm">Watch the BST property (Left &lt; Root &lt; Right) in action. Step-by-step traversal path is highlighted.</p>

          <div className="flex gap-2 flex-wrap">
            <input
              type="number"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && doAction('insert')}
              placeholder="e.g. 45"
              disabled={bst.animating}
              className="border border-slate-300 rounded-lg px-3 py-2 w-24 text-center focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
            />
            <button onClick={() => doAction('search')} disabled={bst.animating || !inputValue}
              className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors">
              Search
            </button>
            <button onClick={() => doAction('insert')} disabled={bst.animating || !inputValue}
              className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors">
              Insert
            </button>
            <button onClick={() => doAction('delete')} disabled={bst.animating || !inputValue}
              className="bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors">
              Delete
            </button>
            <button onClick={bst.reset} disabled={bst.animating}
              className="bg-slate-200 hover:bg-slate-300 disabled:opacity-50 text-slate-700 px-4 py-2 rounded-lg font-medium text-sm transition-colors ml-auto">
              Reset
            </button>
          </div>

          <div className="bg-slate-100 border border-slate-200 text-slate-700 p-3 rounded-lg font-mono text-sm flex items-center gap-2 min-h-[48px]">
            <Info size={18} className="text-indigo-500 shrink-0" /> {bst.feedback}
          </div>

          {bst.deleteCase && (
            <div className={`p-3 rounded-lg border text-sm font-medium ${
              bst.deleteCase === 1 ? 'bg-green-50 border-green-200 text-green-800' :
              bst.deleteCase === 2 ? 'bg-blue-50 border-blue-200 text-blue-800' :
              'bg-red-50 border-red-200 text-red-800'
            }`}>
              Deletion Case {bst.deleteCase}: {
                bst.deleteCase === 1 ? 'Leaf node — remove directly' :
                bst.deleteCase === 2 ? 'One child — replace with child' :
                'Two children — replace with in-order successor'
              }
            </div>
          )}
        </div>

        <div className="w-full lg:w-1/2 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center p-4 min-h-[280px]">
          <TreeGraph
            nodes={nodes}
            edges={edges}
            highlightedNodes={bst.highlightPath}
            activeNode={bst.activeNode}
            className="h-64"
          />
        </div>
      </div>
    </Card>
  );
};

export default function BSTOperations() {
  const [activeTab, setActiveTab] = useState('sandbox');

  const content = {
    sandbox: <BSTSandbox />,

    property: (
      <Card className="border-l-4 border-l-amber-500 bg-amber-50/30">
        <h3 className="text-2xl font-bold text-amber-900 mb-4 flex items-center gap-2">
          <AlertTriangle className="text-amber-500" /> The Golden Rule
        </h3>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-amber-100">
          <p className="text-lg text-slate-700 mb-4">For <strong>EVERY</strong> node in a BST:</p>
          <ul className="space-y-3 text-slate-800 font-medium">
            <li className="flex items-center gap-3">
              <CheckCircle2 className="text-green-500" size={20} />
              All values in the LEFT subtree <span className="px-2 py-0.5 bg-slate-100 rounded text-amber-700 font-mono">&lt;</span> node's value
            </li>
            <li className="flex items-center gap-3">
              <CheckCircle2 className="text-green-500" size={20} />
              All values in the RIGHT subtree <span className="px-2 py-0.5 bg-slate-100 rounded text-amber-700 font-mono">&gt;</span> node's value
            </li>
            <li className="flex items-center gap-3">
              <CheckCircle2 className="text-green-500" size={20} />
              This property applies recursively to ALL subtrees.
            </li>
          </ul>
        </div>
        <InfoBox variant="exam" className="mt-4">
          In-order traversal of a BST ALWAYS produces a sorted (ascending) sequence — this is a direct consequence of the BST property.
        </InfoBox>
      </Card>
    ),

    search: (
      <div className="space-y-4">
        <Card>
          <h3 className="text-xl font-bold text-slate-800 mb-4">Search Operation</h3>
          <p className="text-slate-600 mb-4">The BST property lets us eliminate half the tree at each step — like binary search on a sorted array.</p>
          <ol className="space-y-3 text-sm text-slate-700">
            <li className="flex gap-3"><span className="bg-indigo-100 text-indigo-700 font-bold rounded-full w-7 h-7 flex items-center justify-center text-xs shrink-0">1</span>Start at the root.</li>
            <li className="flex gap-3"><span className="bg-indigo-100 text-indigo-700 font-bold rounded-full w-7 h-7 flex items-center justify-center text-xs shrink-0">2</span>If key = current node → FOUND!</li>
            <li className="flex gap-3"><span className="bg-indigo-100 text-indigo-700 font-bold rounded-full w-7 h-7 flex items-center justify-center text-xs shrink-0">3</span>If key &lt; current → search LEFT subtree (value cannot be in right).</li>
            <li className="flex gap-3"><span className="bg-indigo-100 text-indigo-700 font-bold rounded-full w-7 h-7 flex items-center justify-center text-xs shrink-0">4</span>If key &gt; current → search RIGHT subtree (value cannot be in left).</li>
            <li className="flex gap-3"><span className="bg-indigo-100 text-indigo-700 font-bold rounded-full w-7 h-7 flex items-center justify-center text-xs shrink-0">5</span>If reach null → NOT FOUND.</li>
          </ol>
          <div className="mt-4 bg-slate-50 p-4 rounded-lg border border-slate-200 text-sm font-mono">
            <span className="text-green-600 font-bold">Average (balanced): O(log n)</span><br />
            <span className="text-red-500 font-bold">Worst (skewed): O(n)</span>
          </div>
        </Card>
        <InfoBox variant="info">
          This is why it's called a "Binary SEARCH Tree" — the structure guarantees efficient search by halving the search space at each comparison, just like binary search.
        </InfoBox>
      </div>
    ),

    insert: (
      <div className="space-y-4">
        <Card>
          <h3 className="text-xl font-bold text-slate-800 mb-4">Insert Operation</h3>
          <InfoBox variant="exam" className="mb-4">
            <strong>Key insight:</strong> Insert ALWAYS places the new node at a leaf position.
          </InfoBox>
          <ol className="space-y-3 text-sm text-slate-700">
            <li className="flex gap-3"><span className="bg-emerald-100 text-emerald-700 font-bold rounded-full w-7 h-7 flex items-center justify-center text-xs shrink-0">1</span>Traverse the tree exactly like a Search.</li>
            <li className="flex gap-3"><span className="bg-emerald-100 text-emerald-700 font-bold rounded-full w-7 h-7 flex items-center justify-center text-xs shrink-0">2</span>When you reach a null pointer (leaf's child), that's the insertion point.</li>
            <li className="flex gap-3"><span className="bg-emerald-100 text-emerald-700 font-bold rounded-full w-7 h-7 flex items-center justify-center text-xs shrink-0">3</span>Insert as left child if new value &lt; parent.</li>
            <li className="flex gap-3"><span className="bg-emerald-100 text-emerald-700 font-bold rounded-full w-7 h-7 flex items-center justify-center text-xs shrink-0">4</span>Insert as right child if new value &gt; parent.</li>
          </ol>
          <p className="mt-4 text-sm text-slate-600 bg-amber-50 border border-amber-100 p-3 rounded-lg">
            ⚠️ Inserting sorted data (1, 2, 3, 4, 5...) creates a degenerate tree (right-skewed chain). This is why AVL trees exist!
          </p>
        </Card>
      </div>
    ),

    code: (
      <CodeBlock
        title="BST — Java Implementation"
        filename="BST.java"
        tabs={[
          { id: 'node', label: 'Node + Tree', code: CODE.bstNode },
          { id: 'search', label: 'Search', code: CODE.bstSearch },
          { id: 'insert', label: 'Insert', code: CODE.bstInsert },
        ]}
      />
    ),
  };

  return (
    <div className="space-y-6">
      <SectionHeader
        icon={Search}
        title="L5: Binary Search Tree"
        description="A specialized binary tree with an ordering property that enables efficient operations."
      />
      <TabBar tabs={TABS} activeTab={activeTab} onChange={setActiveTab} />
      <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
        {content[activeTab]}
      </div>
    </div>
  );
}
