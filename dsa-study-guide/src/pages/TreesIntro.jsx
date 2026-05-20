import { useState } from 'react';
import { Network, Zap } from 'lucide-react';
import { SectionHeader } from '../components/ui/SectionHeader';
import { Card } from '../components/ui/Card';
import { TabBar } from '../components/ui/TabBar';
import { InfoBox } from '../components/ui/InfoBox';
import { TreeGraph } from '../components/visualizations/TreeGraph';
import { TREE_TYPES, TERM_TREE } from '../data/treeData';

const TABS = [
  { id: 'terminology', label: 'Terminology' },
  { id: 'properties', label: 'Key Properties' },
  { id: 'types', label: 'Tree Types' },
];

const TERMS = [
  { title: 'Root Node', desc: 'The topmost node. Has no parent. Every tree has exactly ONE root.', highlights: { nodes: ['Root'], active: 'Root', edges: [] } },
  { title: 'Leaf Node', desc: 'A node with NO children (both left and right are null). Also called terminal nodes.', highlights: { nodes: ['LL', 'LR', 'RL'], active: null, edges: [] } },
  { title: 'Parent & Child', desc: 'A node with branches to other nodes is a "parent". Nodes directly below it are "children".', highlights: { nodes: ['L', 'LL', 'LR'], active: 'L', edges: [['L', 'LL'], ['L', 'LR']] } },
  { title: 'Siblings', desc: 'Nodes that share the same parent. They are at the same level.', highlights: { nodes: ['LL', 'LR'], active: null, edges: [] } },
  { title: 'Height', desc: 'Total edges from a node to the furthest leaf below it. Height of root = height of tree. Leaf height = 0.', highlights: { nodes: ['Root', 'L', 'LL'], active: null, edges: [['Root', 'L'], ['L', 'LL']] } },
  { title: 'Depth / Level', desc: 'Total edges from the root to a node. Root depth = 0. Nodes at same depth = same level.', highlights: { nodes: ['Root', 'R', 'RL'], active: 'RL', edges: [['Root', 'R'], ['R', 'RL']] } },
  { title: 'Internal Node', desc: 'Any node with at least one child. The root is also an internal node (if tree has > 1 node).', highlights: { nodes: ['Root', 'L', 'R'], active: null, edges: [['Root', 'L'], ['Root', 'R']] } },
  { title: 'Subtree', desc: 'Each child of a node forms a subtree recursively. Every node is the root of its own subtree.', highlights: { nodes: ['L', 'LL', 'LR'], active: null, edges: [['L', 'LL'], ['L', 'LR']] } },
];

const Terminology = () => {
  const [activeTerm, setActiveTerm] = useState(null);

  const activeData = TERMS.find(t => t.title === activeTerm)?.highlights || { nodes: [], active: null, edges: [] };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-2">
          {TERMS.map((item) => (
            <Card
              key={item.title}
              className={`transition-all duration-200 cursor-pointer p-4 ${activeTerm === item.title ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 shadow-md scale-[1.01]' : 'hover:border-indigo-300 hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}
              onMouseEnter={() => setActiveTerm(item.title)}
              onMouseLeave={() => setActiveTerm(null)}
            >
              <h3 className={`font-semibold mb-1 ${activeTerm === item.title ? 'text-indigo-700 dark:text-indigo-300' : 'text-slate-800 dark:text-slate-100'}`}>{item.title}</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm">{item.desc}</p>
            </Card>
          ))}
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 flex flex-col items-center justify-center lg:sticky lg:top-6 min-h-[400px]">
          <div className="bg-slate-50 dark:bg-slate-900/50 w-full rounded-lg border border-slate-100 dark:border-slate-700 flex items-center justify-center p-4 flex-grow">
            <TreeGraph
              nodes={TERM_TREE.nodes}
              edges={TERM_TREE.edges}
              highlightedNodes={activeData.nodes}
              highlightedEdges={activeData.edges}
              activeNode={activeData.active}
              className="h-72"
            />
          </div>
          <p className="text-sm font-medium text-slate-400 dark:text-slate-500 mt-4 uppercase tracking-wider">
            {activeTerm ? `Highlighting: ${activeTerm}` : 'Hover a term to highlight'}
          </p>
        </div>
      </div>
    </div>
  );
};

const Properties = () => (
  <div className="space-y-6">
    <Card className="bg-indigo-50 dark:bg-indigo-900/20 border-indigo-100 dark:border-indigo-800">
      <h3 className="text-xl font-bold text-indigo-900 dark:text-indigo-100 mb-4 flex items-center gap-2">
        <Zap size={20} className="text-indigo-600 dark:text-indigo-400" /> Key Formulas to Memorize
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          { label: 'Max Nodes at Level L', formula: '2^L', note: 'e.g. Level 3 → max 8 nodes' },
          { label: 'Max Nodes in Tree of Height H', formula: '2^(H+1) - 1', note: 'e.g. H=2 → max 7 nodes' },
          { label: 'Min Height for N Nodes', formula: '⌊log₂N⌋', note: 'e.g. 15 nodes → min height 3' },
          { label: 'Total Edges (N nodes)', formula: 'N - 1', note: 'Always. Every node except root has 1 incoming edge.' },
        ].map(p => (
          <div key={p.label} className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <span className="block text-xs text-slate-500 dark:text-slate-400 font-medium mb-1">{p.label}</span>
            <span className="block text-3xl font-mono text-indigo-700 dark:text-indigo-300 mb-1">{p.formula}</span>
            <span className="block text-xs text-slate-500 dark:text-slate-400 italic">{p.note}</span>
          </div>
        ))}
      </div>
    </Card>

    <Card>
      <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">Tree Terminology Clarification</h3>
      <div className="space-y-3">
        {[
          { term: 'Height vs Depth', desc: 'Height is measured from a node DOWN to the furthest leaf. Depth is measured from the root DOWN to the node. Both of root: height = tree height, depth = 0.' },
          { term: 'Level', desc: 'Level = depth. Root is at Level 0 (some books say Level 1 — check your course!). Nodes at Level k are exactly k edges from root.' },
          { term: 'Degree', desc: 'Number of children a node has. Leaf nodes have degree 0. In a binary tree, max degree = 2.' },
          { term: 'Ancestor / Descendant', desc: 'Ancestors of node X: X itself plus all nodes from X to the root. Descendants: X itself plus all nodes reachable from X going downward.' },
        ].map(item => (
          <div key={item.term} className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4 border border-slate-100 dark:border-slate-700">
            <h4 className="font-semibold text-slate-800 dark:text-slate-100 mb-1">{item.term}</h4>
            <p className="text-sm text-slate-600 dark:text-slate-400">{item.desc}</p>
          </div>
        ))}
      </div>
    </Card>

    <InfoBox variant="exam">
      <strong>Common exam question:</strong> "A binary tree has 15 nodes. What is its minimum possible height?" → ⌊log₂15⌋ = ⌊3.9⌋ = 3 (a perfect binary tree of height 3 has 2⁴-1 = 15 nodes).
    </InfoBox>
  </div>
);

const TreeTypes = () => (
  <div className="space-y-4">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {TREE_TYPES.map((tree, idx) => (
        <Card key={idx} className="flex flex-col hover:shadow-md transition-shadow hover:border-indigo-200 dark:hover:border-indigo-700">
          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">{tree.name}</h3>
          <p className="text-slate-600 dark:text-slate-400 mb-4 flex-grow text-sm">{tree.desc}</p>
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-100 dark:border-slate-700 flex items-center justify-center">
            <TreeGraph nodes={tree.nodes} edges={tree.edges} className="h-40" />
          </div>
        </Card>
      ))}
    </div>
    <InfoBox variant="info">
      A <strong>Perfect Binary Tree</strong> is both Full and Complete. A Complete Binary Tree is NOT necessarily Full. These are hierarchical: Perfect ⊂ Complete ⊂ Full ⊂ Binary Tree.
    </InfoBox>
  </div>
);

export default function TreesIntro() {
  const [activeTab, setActiveTab] = useState('terminology');

  const content = {
    terminology: <Terminology />,
    properties: <Properties />,
    types: <TreeTypes />,
  };

  return (
    <div className="space-y-6">
      <SectionHeader
        icon={Network}
        title="L4: Trees Introduction"
        description="Tree data structure concepts, terminology, and binary tree classifications."
      />
      <TabBar tabs={TABS} activeTab={activeTab} onChange={setActiveTab} />
      <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
        {content[activeTab]}
      </div>
    </div>
  );
}
