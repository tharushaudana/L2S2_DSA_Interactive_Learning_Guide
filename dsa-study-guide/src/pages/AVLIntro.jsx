import { useState } from 'react';
import { Scale } from 'lucide-react';
import { SectionHeader } from '../components/ui/SectionHeader';
import { Card } from '../components/ui/Card';
import { TabBar } from '../components/ui/TabBar';
import { InfoBox } from '../components/ui/InfoBox';
import { TreeGraph } from '../components/visualizations/TreeGraph';

const TABS = [
  { id: 'why', label: 'Why AVL?' },
  { id: 'balance', label: 'Balance Factor' },
  { id: 'rotations', label: 'Rotations' },
];

// BST skewed example
const SKEWED_BST = {
  nodes: [
    { id: '10', x: 50, y: 10 },
    { id: '20', x: 65, y: 30 },
    { id: '30', x: 80, y: 50 },
    { id: '40', x: 90, y: 70 },
    { id: '50', x: 90, y: 90 },
  ],
  edges: [['10', '20'], ['20', '30'], ['30', '40'], ['40', '50']],
};

const BALANCED_AVL = {
  nodes: [
    { id: '30', x: 50, y: 15 },
    { id: '20', x: 25, y: 45 },
    { id: '40', x: 75, y: 45 },
    { id: '10', x: 12, y: 75 },
    { id: '50', x: 90, y: 75 },
  ],
  edges: [['30', '20'], ['30', '40'], ['20', '10'], ['40', '50']],
};

const BF_TREE = {
  nodes: [
    { id: 'A', x: 50, y: 15 },
    { id: 'B', x: 25, y: 45 },
    { id: 'C', x: 75, y: 45 },
    { id: 'D', x: 12, y: 75 },
    { id: 'E', x: 40, y: 75 },
  ],
  edges: [['A', 'B'], ['A', 'C'], ['B', 'D'], ['B', 'E']],
};

const WhyAVL = () => (
  <div className="space-y-6">
    <Card>
      <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">The Problem with Regular BST</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="font-semibold text-red-700 dark:text-red-400 mb-2">BST — Degenerate (Skewed)</h4>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">Inserting 10, 20, 30, 40, 50 in order:</p>
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-xl p-4 flex justify-center">
            <TreeGraph nodes={SKEWED_BST.nodes} edges={SKEWED_BST.edges} className="h-52" />
          </div>
          <div className="mt-2 text-xs text-red-600 dark:text-red-400 font-medium text-center">Height = 4 → Search O(n) ❌</div>
        </div>
        <div>
          <h4 className="font-semibold text-green-700 dark:text-green-400 mb-2">AVL Tree — Balanced</h4>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">Same values, AVL keeps it balanced:</p>
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800 rounded-xl p-4 flex justify-center">
            <TreeGraph nodes={BALANCED_AVL.nodes} edges={BALANCED_AVL.edges} className="h-52" />
          </div>
          <div className="mt-2 text-xs text-green-600 dark:text-green-400 font-medium text-center">Height = 2 → Search O(log n) ✓</div>
        </div>
      </div>
    </Card>

    <Card>
      <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-3">AVL Tree Key Facts</h3>
      <div className="space-y-3">
        {[
          { label: 'Named after', value: 'Adelson-Velsky and Landis (1962) — first self-balancing BST' },
          { label: 'Property', value: 'Balance factor of every node is in {-1, 0, +1}' },
          { label: 'Guarantee', value: 'Height is always O(log n)' },
          { label: 'Operations', value: 'Search, Insert, Delete all O(log n) — guaranteed' },
          { label: 'Used when', value: 'Frequent lookups with less frequent modifications. In-memory databases, dictionaries.' },
        ].map(item => (
          <div key={item.label} className="flex gap-3 items-start">
            <span className="text-sm font-semibold text-slate-500 dark:text-slate-400 min-w-[120px]">{item.label}:</span>
            <span className="text-sm text-slate-700 dark:text-slate-300">{item.value}</span>
          </div>
        ))}
      </div>
    </Card>

    <InfoBox variant="exam">
      AVL trees are best when the application needs to <strong>look up data much more frequently than it inserts or deletes</strong>.
    </InfoBox>
  </div>
);

const BalanceFactor = () => {
  const [hoverNode, setHoverNode] = useState(null);

  const tree = {
    nodes: [
      { id: 'root', key: 40, x: 50, y: 12, h: 3, lh: 2, rh: 1, bf: 1 },
      { id: 'L', key: 20, x: 25, y: 35, h: 2, lh: 1, rh: 0, bf: 1 },
      { id: 'R', key: 60, x: 75, y: 35, h: 1, lh: 0, rh: 0, bf: 0 },
      { id: 'LL', key: 10, x: 12, y: 58, h: 1, lh: 0, rh: 0, bf: 0 },
      { id: 'LR', key: 30, x: 40, y: 58, h: 0, lh: -1, rh: -1, bf: 0 },
    ],
    edges: [['root', 'L'], ['root', 'R'], ['L', 'LL'], ['L', 'LR']],
  };

  const activeNodeInfo = tree.nodes.find(n => n.id === hoverNode);

  const bfNodes = {};
  tree.nodes.forEach(n => { bfNodes[n.id] = n.bf; });

  return (
    <div className="space-y-6">
      <Card>
        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">Balance Factor Formula</h3>
        <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 rounded-xl p-4 text-center">
          <p className="text-2xl font-mono font-bold text-indigo-700 dark:text-indigo-300">BF(X) = height(left subtree) − height(right subtree)</p>
          <p className="text-sm text-indigo-600 dark:text-indigo-400 mt-2">Height of null subtree = −1 (or 0, depending on convention — our definition counts edges)</p>
        </div>
        <div className="grid grid-cols-3 gap-3 mt-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-lg p-3 text-center">
            <p className="font-bold text-blue-700 dark:text-blue-300 text-xl">BF = 0</p>
            <p className="text-xs text-blue-600 dark:text-blue-400">Perfectly balanced</p>
          </div>
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800 rounded-lg p-3 text-center">
            <p className="font-bold text-amber-700 dark:text-amber-300 text-xl">BF = +1</p>
            <p className="text-xs text-amber-600 dark:text-amber-400">Left-heavy (OK)</p>
          </div>
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800 rounded-lg p-3 text-center">
            <p className="font-bold text-amber-700 dark:text-amber-300 text-xl">BF = −1</p>
            <p className="text-xs text-amber-600 dark:text-amber-400">Right-heavy (OK)</p>
          </div>
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-lg p-3 text-center col-span-3">
            <p className="font-bold text-red-700 dark:text-red-300 text-xl">|BF| &gt; 1 → UNBALANCED → Rotation needed!</p>
          </div>
        </div>
      </Card>

      <Card>
        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">Hover nodes to see balance factors</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 flex items-center justify-center min-h-[200px]">
            <TreeGraph
              nodes={tree.nodes.map(n => ({ id: n.id, x: n.x, y: n.y }))}
              edges={tree.edges}
              highlightedNodes={hoverNode ? [hoverNode] : []}
              activeNode={null}
              balanceFactors={bfNodes}
              className="h-48"
              onNodeClick={setHoverNode}
            />
          </div>
          <div className="flex flex-col justify-center">
            {activeNodeInfo ? (
              <div className="space-y-3">
                <h4 className="font-bold text-slate-800 dark:text-slate-100">Node: {activeNodeInfo.key}</h4>
                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Left subtree height:</span>
                    <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{activeNodeInfo.lh}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Right subtree height:</span>
                    <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{activeNodeInfo.rh}</span>
                  </div>
                  <div className="flex justify-between border-t border-slate-200 dark:border-slate-700 pt-2">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">Balance Factor:</span>
                    <span className={`font-mono font-bold text-lg ${Math.abs(activeNodeInfo.bf) > 1 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                      {activeNodeInfo.bf > 0 ? `+${activeNodeInfo.bf}` : activeNodeInfo.bf}
                    </span>
                  </div>
                  <div className={`text-center py-1 rounded font-medium text-sm ${Math.abs(activeNodeInfo.bf) <= 1 ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'}`}>
                    {Math.abs(activeNodeInfo.bf) <= 1 ? '✓ Balanced' : '✗ UNBALANCED'}
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-slate-400 dark:text-slate-500 text-sm text-center">Click a node to see its balance factor calculation.</p>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

const ROTATIONS = [
  {
    id: 'LL',
    name: 'LL — Left-Left Case',
    cause: 'Node inserted into left subtree of left child → node becomes left-heavy (BF > 1).',
    fix: 'Single RIGHT rotation on the unbalanced node.',
    before: { nodes: [{ id: 'A', x: 65, y: 15 }, { id: 'B', x: 40, y: 40 }, { id: 'C', x: 20, y: 65 }], edges: [['A', 'B'], ['B', 'C']], unbalanced: 'A' },
    after: { nodes: [{ id: 'B', x: 40, y: 15 }, { id: 'C', x: 20, y: 40 }, { id: 'A', x: 60, y: 40 }], edges: [['B', 'C'], ['B', 'A']] },
    borderColor: 'border-blue-400 dark:border-blue-600',
    bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    headerColor: 'text-blue-800 dark:text-blue-200',
  },
  {
    id: 'RR',
    name: 'RR — Right-Right Case',
    cause: 'Node inserted into right subtree of right child → node becomes right-heavy (BF < -1).',
    fix: 'Single LEFT rotation on the unbalanced node.',
    before: { nodes: [{ id: 'A', x: 35, y: 15 }, { id: 'B', x: 60, y: 40 }, { id: 'C', x: 80, y: 65 }], edges: [['A', 'B'], ['B', 'C']], unbalanced: 'A' },
    after: { nodes: [{ id: 'B', x: 60, y: 15 }, { id: 'A', x: 40, y: 40 }, { id: 'C', x: 80, y: 40 }], edges: [['B', 'A'], ['B', 'C']] },
    borderColor: 'border-green-400 dark:border-green-600',
    bgColor: 'bg-green-50 dark:bg-green-900/20',
    headerColor: 'text-green-800 dark:text-green-200',
  },
  {
    id: 'LR',
    name: 'LR — Left-Right Case',
    cause: 'Node is left-heavy (BF > 1) but its left child is right-heavy.',
    fix: 'Two rotations: LEFT rotation on left child, then RIGHT rotation on the unbalanced node.',
    before: { nodes: [{ id: 'A', x: 70, y: 15 }, { id: 'B', x: 40, y: 40 }, { id: 'C', x: 55, y: 65 }], edges: [['A', 'B'], ['B', 'C']], unbalanced: 'A' },
    after: { nodes: [{ id: 'C', x: 55, y: 15 }, { id: 'B', x: 35, y: 40 }, { id: 'A', x: 75, y: 40 }], edges: [['C', 'B'], ['C', 'A']] },
    borderColor: 'border-orange-400 dark:border-orange-600',
    bgColor: 'bg-orange-50 dark:bg-orange-900/20',
    headerColor: 'text-orange-800 dark:text-orange-200',
  },
  {
    id: 'RL',
    name: 'RL — Right-Left Case',
    cause: 'Node is right-heavy (BF < -1) but its right child is left-heavy.',
    fix: 'Two rotations: RIGHT rotation on right child, then LEFT rotation on the unbalanced node.',
    before: { nodes: [{ id: 'A', x: 30, y: 15 }, { id: 'B', x: 60, y: 40 }, { id: 'C', x: 45, y: 65 }], edges: [['A', 'B'], ['B', 'C']], unbalanced: 'A' },
    after: { nodes: [{ id: 'C', x: 45, y: 15 }, { id: 'A', x: 25, y: 40 }, { id: 'B', x: 65, y: 40 }], edges: [['C', 'A'], ['C', 'B']] },
    borderColor: 'border-purple-400 dark:border-purple-600',
    bgColor: 'bg-purple-50 dark:bg-purple-900/20',
    headerColor: 'text-purple-800 dark:text-purple-200',
  },
];

const Rotations = () => (
  <div className="space-y-4">
    <InfoBox variant="info">
      After any insertion/deletion that causes |BF| &gt; 1, the AVL tree performs at most 2 rotations to restore balance. Rotations run in O(1) time.
    </InfoBox>

    {ROTATIONS.map(r => (
      <Card key={r.id} className={`border-l-4 ${r.borderColor}`}>
        <h4 className={`font-bold text-lg mb-1 ${r.headerColor}`}>{r.name}</h4>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-1"><strong>Cause:</strong> {r.cause}</p>
        <p className="text-sm text-slate-700 dark:text-slate-300 mb-4"><strong>Fix:</strong> {r.fix}</p>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wider">Before (unbalanced)</p>
            <div className={`${r.bgColor} rounded-xl p-3 flex justify-center`}>
              <TreeGraph
                nodes={r.before.nodes}
                edges={r.before.edges}
                highlightedNodes={[r.before.unbalanced]}
                className="h-28"
              />
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wider">After (balanced)</p>
            <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-3 flex justify-center">
              <TreeGraph
                nodes={r.after.nodes}
                edges={r.after.edges}
                className="h-28"
              />
            </div>
          </div>
        </div>
      </Card>
    ))}

    <Card className="bg-slate-50 dark:bg-slate-800/50">
      <h4 className="font-bold text-slate-800 dark:text-slate-100 mb-3">Quick Reference Table</h4>
      <table className="w-full text-sm">
        <thead className="bg-slate-100 dark:bg-slate-700/50">
          <tr>
            <th className="p-2 text-left text-slate-600 dark:text-slate-300">Case</th>
            <th className="p-2 text-left text-slate-600 dark:text-slate-300">Condition</th>
            <th className="p-2 text-left text-slate-600 dark:text-slate-300">Fix</th>
          </tr>
        </thead>
        <tbody>
          {[
            ['LL', 'BF > 1 AND key < node.left.key', 'Right Rotation'],
            ['RR', 'BF < -1 AND key > node.right.key', 'Left Rotation'],
            ['LR', 'BF > 1 AND key > node.left.key', 'Left on left child, then Right'],
            ['RL', 'BF < -1 AND key < node.right.key', 'Right on right child, then Left'],
          ].map(([c, cond, fix]) => (
            <tr key={c} className="border-b border-slate-100 dark:border-slate-700">
              <td className="p-2 font-bold text-indigo-700 dark:text-indigo-300 font-mono">{c}</td>
              <td className="p-2 text-slate-600 dark:text-slate-400 font-mono text-xs">{cond}</td>
              <td className="p-2 text-slate-700 dark:text-slate-300 font-medium">{fix}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  </div>
);

export default function AVLIntro() {
  const [activeTab, setActiveTab] = useState('why');

  const content = {
    why: <WhyAVL />,
    balance: <BalanceFactor />,
    rotations: <Rotations />,
  };

  return (
    <div className="space-y-6">
      <SectionHeader
        icon={Scale}
        title="L8: AVL Trees Introduction"
        description="Self-balancing BSTs that guarantee O(log n) operations through automatic rotations."
      />
      <TabBar tabs={TABS} activeTab={activeTab} onChange={setActiveTab} />
      <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
        {content[activeTab]}
      </div>
    </div>
  );
}
