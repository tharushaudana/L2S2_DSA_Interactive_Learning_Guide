import { useState } from 'react';
import { Trash2, Info } from 'lucide-react';
import { SectionHeader } from '../components/ui/SectionHeader';
import { Card } from '../components/ui/Card';
import { TabBar } from '../components/ui/TabBar';
import { InfoBox } from '../components/ui/InfoBox';
import { CodeBlock } from '../components/ui/CodeBlock';
import { ComplexityTable } from '../components/ui/ComplexityTable';
import { TreeGraph } from '../components/visualizations/TreeGraph';
import { useBST, treeToGraph } from '../hooks/useBST';
import { CODE } from '../data/codeSnippets';

const TABS = [
  { id: 'cases', label: 'Deletion Cases' },
  { id: 'interactive', label: '🎮 Try It' },
  { id: 'complexity', label: 'Complexity' },
  { id: 'code', label: 'Java Code' },
];

const DeletionCases = () => (
  <div className="space-y-4">
    <Card className="border-l-4 border-l-green-500">
      <div className="flex items-start gap-4">
        <div className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 font-bold text-xl rounded-xl w-12 h-12 flex items-center justify-center shrink-0">1</div>
        <div>
          <h4 className="font-bold text-lg text-slate-800 dark:text-slate-100 mb-2">Node has NO Children (Leaf Node)</h4>
          <p className="text-slate-600 dark:text-slate-400 mb-3">The simplest case. Simply remove the node by setting its parent's pointer to null.</p>
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800 rounded-lg p-3">
            <code className="text-sm font-mono text-green-800 dark:text-green-300">if (root.left == null) return root.right; // handles case 1 too</code>
          </div>
          <InfoBox variant="info" className="mt-3">
            The tree structure is preserved because removing a leaf doesn't affect any other node.
          </InfoBox>
        </div>
      </div>
    </Card>

    <Card className="border-l-4 border-l-blue-500">
      <div className="flex items-start gap-4">
        <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-bold text-xl rounded-xl w-12 h-12 flex items-center justify-center shrink-0">2</div>
        <div>
          <h4 className="font-bold text-lg text-slate-800 dark:text-slate-100 mb-2">Node has ONE Child</h4>
          <p className="text-slate-600 dark:text-slate-400 mb-3">Replace the node with its only child. The parent's pointer is updated to skip the deleted node and point directly to the child.</p>
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-lg p-3">
            <code className="text-sm font-mono text-blue-800 dark:text-blue-300">
              if (root.left == null) return root.right;<br />
              if (root.right == null) return root.left;
            </code>
          </div>
          <InfoBox variant="info" className="mt-3">
            BST property is preserved because the child's subtree already satisfied the ordering relative to the grandparent.
          </InfoBox>
        </div>
      </div>
    </Card>

    <Card className="border-l-4 border-l-red-500">
      <div className="flex items-start gap-4">
        <div className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 font-bold text-xl rounded-xl w-12 h-12 flex items-center justify-center shrink-0">3</div>
        <div>
          <h4 className="font-bold text-lg text-slate-800 dark:text-slate-100 mb-2">Node has TWO Children ⚠️ (Most Complex)</h4>
          <p className="text-slate-600 dark:text-slate-400 mb-3">We can't simply remove it — we need to maintain the BST structure. Use the <strong>in-order successor</strong> (or predecessor).</p>
          <ol className="space-y-2 text-sm text-slate-700 dark:text-slate-300 mb-3">
            <li className="flex gap-3"><span className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 font-bold rounded-full w-6 h-6 flex items-center justify-center text-xs shrink-0">1</span>Find the <strong>in-order successor</strong>: the leftmost node in the right subtree (smallest value greater than current).</li>
            <li className="flex gap-3"><span className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 font-bold rounded-full w-6 h-6 flex items-center justify-center text-xs shrink-0">2</span>Copy the successor's value to the node being deleted.</li>
            <li className="flex gap-3"><span className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 font-bold rounded-full w-6 h-6 flex items-center justify-center text-xs shrink-0">3</span>Recursively delete the in-order successor from the right subtree (it has at most 1 child, so it's Case 1 or 2).</li>
          </ol>
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-lg p-3 font-mono text-xs text-red-800 dark:text-red-300">
            In-order successor = findMin(root.right) = leftmost node of right subtree
          </div>
        </div>
      </div>
    </Card>

    <InfoBox variant="exam">
      <strong>Summary:</strong> Case 1 (leaf) → remove. Case 2 (one child) → link parent to grandchild. Case 3 (two children) → copy in-order successor value, delete successor.
    </InfoBox>
  </div>
);

const InteractiveDeletion = () => {
  const [inputValue, setInputValue] = useState('');
  const bst = useBST();
  const { nodes, edges } = treeToGraph(bst.bstRoot);

  return (
    <Card className="border-l-4 border-l-red-400">
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-grow space-y-4">
          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">Interactive Deletion Sandbox</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">Try deleting nodes to see which case applies and how the tree restructures itself.</p>
          <div className="flex gap-2 flex-wrap">
            <input
              type="number"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              placeholder="Node to delete"
              disabled={bst.animating}
              className="border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-lg px-3 py-2 w-36 text-center focus:outline-none focus:ring-2 focus:ring-red-400 disabled:opacity-50"
            />
            <button onClick={() => { bst.delete(parseInt(inputValue)); }}
              disabled={bst.animating || !inputValue}
              className="bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors">
              Delete Node
            </button>
            <button onClick={bst.reset} disabled={bst.animating}
              className="bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 px-4 py-2 rounded-lg font-medium text-sm">
              Reset Tree
            </button>
          </div>
          <div className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3 rounded-lg text-sm font-mono text-slate-700 dark:text-slate-300 flex items-center gap-2 min-h-[48px]">
            <Info size={16} className="text-red-400 shrink-0" /> {bst.feedback}
          </div>
          {bst.deleteCase && (
            <div className={`p-3 rounded-lg border text-sm font-semibold ${
              bst.deleteCase === 1 ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200' :
              bst.deleteCase === 2 ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200' :
              'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200'
            }`}>
              → Case {bst.deleteCase}: {
                bst.deleteCase === 1 ? 'Leaf node — removed directly' :
                bst.deleteCase === 2 ? 'One child — replaced with child' :
                'Two children — replaced with in-order successor'
              }
            </div>
          )}
          <div className="text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 p-2 rounded border border-slate-200 dark:border-slate-700">
            <strong>Try deleting:</strong> 20 (leaf), 30 (one child), 50 (root, two children)
          </div>
        </div>
        <div className="w-full lg:w-1/2 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 rounded-xl flex items-center justify-center p-4 min-h-[260px]">
          <TreeGraph nodes={nodes} edges={edges} highlightedNodes={bst.highlightPath} activeNode={bst.activeNode} className="h-56" />
        </div>
      </div>
    </Card>
  );
};

export default function BSTDeletion() {
  const [activeTab, setActiveTab] = useState('cases');

  const content = {
    cases: <DeletionCases />,
    interactive: <InteractiveDeletion />,
    complexity: (
      <div className="space-y-6">
        <Card>
          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">Time &amp; Space Complexity</h3>
          <ComplexityTable
            columns={['Operation', 'Average (Balanced)', 'Worst (Skewed)']}
            rows={[
              ['Search / Insert / Delete', 'O(log n)', 'O(n)'],
              ['Traversals (all types)', 'O(n)', 'O(n)'],
              ['Space (storage)', 'O(n)', 'O(n)'],
              ['Space (recursive DFS)', 'O(h) = O(log n)', 'O(n)'],
            ]}
          />
        </Card>
        <Card>
          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-3">Why Worst Case is O(n)</h3>
          <p className="text-slate-600 dark:text-slate-400 text-sm mb-3">When you insert sorted data (1, 2, 3, 4...), the BST degrades into a linked list:</p>
          <div className="bg-slate-900 rounded-lg p-4 font-mono text-sm text-emerald-400">
            1<br />
            {'  '}→ 2<br />
            {'      '}→ 3<br />
            {'          '}→ 4  (height = n-1)
          </div>
          <InfoBox variant="warning" className="mt-3">
            This is the fundamental problem that AVL Trees (L8-L9) solve by maintaining a balanced structure through rotations.
          </InfoBox>
        </Card>
      </div>
    ),
    code: (
      <CodeBlock
        title="BST Delete — Java"
        filename="BSTDelete.java"
        tabs={[{ id: 'delete', label: 'Delete + findMin', code: CODE.bstDelete }]}
      />
    ),
  };

  return (
    <div className="space-y-6">
      <SectionHeader
        icon={Trash2}
        title="L7: BST Deletion & Complexity"
        description="Three deletion cases and performance analysis of Binary Search Trees."
      />
      <TabBar tabs={TABS} activeTab={activeTab} onChange={setActiveTab} />
      <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
        {content[activeTab]}
      </div>
    </div>
  );
}
