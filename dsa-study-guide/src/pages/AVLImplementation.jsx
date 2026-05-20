import { useState } from 'react';
import { RefreshCw, Plus } from 'lucide-react';
import { SectionHeader } from '../components/ui/SectionHeader';
import { Card } from '../components/ui/Card';
import { TabBar } from '../components/ui/TabBar';
import { InfoBox } from '../components/ui/InfoBox';
import { CodeBlock } from '../components/ui/CodeBlock';
import { TreeGraph } from '../components/visualizations/TreeGraph';
import { useAVL, avlToGraph } from '../hooks/useAVL';
import { CODE } from '../data/codeSnippets';

const TABS = [
  { id: 'visualizer', label: '🎮 Visualizer' },
  { id: 'steps', label: 'Insertion Steps' },
  { id: 'code', label: 'Java Code' },
];

const PRESETS = [
  { label: 'LL Rotation', values: [30, 20, 10], desc: 'Triggers LL case → right rotation' },
  { label: 'RR Rotation', values: [10, 20, 30], desc: 'Triggers RR case → left rotation' },
  { label: 'LR Rotation', values: [30, 10, 20], desc: 'Triggers LR case → double rotation' },
  { label: 'RL Rotation', values: [10, 30, 20], desc: 'Triggers RL case → double rotation' },
];

const AVLVisualizer = () => {
  const avl = useAVL();
  const [inputValue, setInputValue] = useState('');

  const { nodes, edges } = avl.graph;

  // Build balance factor map from nodes
  const bfMap = {};
  nodes.forEach(n => { bfMap[n.id] = n.balance; });

  const doInsert = () => {
    const val = parseInt(inputValue);
    if (!isNaN(val)) {
      avl.insert(val);
      setInputValue('');
    }
  };

  const loadPreset = (preset) => {
    avl.reset();
    // Insert with delay to show steps
    preset.values.forEach((v, i) => {
      setTimeout(() => avl.insert(v), i * 100);
    });
  };

  // Get nodes with key for display
  const displayNodes = nodes.map(n => ({ id: n.id, x: n.x, y: n.y, key: n.key }));

  return (
    <div className="space-y-4">
      {/* Preset buttons */}
      <div className="flex flex-wrap gap-2">
        {PRESETS.map(preset => (
          <button
            key={preset.label}
            onClick={() => loadPreset(preset)}
            className="px-3 py-1.5 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 rounded-lg text-sm font-medium transition-colors"
            title={preset.desc}
          >
            {preset.label}
          </button>
        ))}
        <button onClick={avl.reset} className="px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-sm font-medium flex items-center gap-1">
          <RefreshCw size={14} /> Reset
        </button>
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <input
          type="number"
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && doInsert()}
          placeholder="Insert value..."
          className="border border-slate-300 rounded-lg px-3 py-2 text-sm flex-grow focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        <button onClick={doInsert} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium">
          <Plus size={16} /> Insert
        </button>
      </div>

      {/* Tree visualization */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 min-h-[280px] flex items-center justify-center">
        {displayNodes.length === 0 ? (
          <p className="text-slate-400 text-sm">Insert values or select a preset to see the AVL tree.</p>
        ) : (
          <TreeGraph
            nodes={displayNodes}
            edges={edges}
            labelKey="key"
            balanceFactors={bfMap}
            className="h-64 w-full"
          />
        )}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 text-xs">
        <div className="flex items-center gap-1.5"><span className="w-4 h-4 rounded-full bg-indigo-500 inline-block"/><span className="text-slate-600">+n = left-heavy (BF)</span></div>
        <div className="flex items-center gap-1.5"><span className="w-4 h-4 rounded-full bg-indigo-300 inline-block"/><span className="text-slate-600">-n = right-heavy (BF)</span></div>
        <div className="flex items-center gap-1.5"><span className="w-4 h-4 rounded-full bg-red-300 border border-red-400 inline-block"/><span className="text-slate-600">Red = unbalanced (|BF|>1)</span></div>
      </div>

      {/* Log of operations */}
      {avl.log.length > 0 && (
        <Card>
          <h4 className="font-bold text-slate-700 mb-3 text-sm">Operation Log</h4>
          <div className="space-y-1 max-h-40 overflow-y-auto">
            {avl.log.slice(-10).map((entry, i) => (
              <div key={i} className={`text-xs font-mono px-2 py-1 rounded ${
                entry.type === 'rotate' ? 'bg-orange-100 text-orange-800 font-bold' :
                entry.type === 'insert' ? 'bg-green-50 text-green-800' :
                entry.type === 'duplicate' ? 'bg-yellow-50 text-yellow-800' :
                'bg-slate-50 text-slate-700'
              }`}>
                {entry.rotationType && <span className="bg-orange-200 px-1 rounded mr-1">{entry.rotationType}</span>}
                {entry.description}
              </div>
            ))}
          </div>
        </Card>
      )}

      {avl.lastRotation && (
        <InfoBox variant="warning">
          <strong>Last rotation: {avl.lastRotation.rotationType} Case</strong> — {avl.lastRotation.description}
        </InfoBox>
      )}
    </div>
  );
};

const InsertionSteps = () => (
  <div className="space-y-4">
    <Card>
      <h3 className="text-xl font-bold text-slate-800 mb-4">5-Step AVL Insertion Algorithm</h3>
      <div className="space-y-4">
        {[
          { step: 1, title: 'BST Insert', desc: 'Insert the new key using the standard BST insertion algorithm — traverse left or right based on comparison, insert at the empty leaf position.', color: 'bg-blue-100 text-blue-700' },
          { step: 2, title: 'Update Heights', desc: 'Walk back up the path from the inserted node to the root. At each ancestor, update the height: height = 1 + max(height(left), height(right)).', color: 'bg-indigo-100 text-indigo-700' },
          { step: 3, title: 'Check Balance Factor', desc: 'At each ancestor, compute BF = height(left) - height(right). If |BF| ≤ 1, the node is balanced. Continue up.', color: 'bg-purple-100 text-purple-700' },
          { step: 4, title: 'Identify Rotation Case', desc: 'If |BF| > 1, identify which rotation case applies: LL, RR, LR, or RL based on BF and the direction of the new key vs. the child.', color: 'bg-orange-100 text-orange-700' },
          { step: 5, title: 'Perform Rotation', desc: 'Execute the appropriate rotation(s) to restore balance. After rotation, the subtree root changes, so return the new root to the parent.', color: 'bg-red-100 text-red-700' },
        ].map(item => (
          <div key={item.step} className="flex gap-4 items-start">
            <div className={`w-10 h-10 rounded-xl ${item.color} font-bold text-xl flex items-center justify-center shrink-0`}>{item.step}</div>
            <div>
              <h4 className="font-semibold text-slate-800 mb-1">{item.title}</h4>
              <p className="text-sm text-slate-600">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>

    <InfoBox variant="exam">
      <div className="space-y-1">
        <p><strong>Rotation conditions (for insert key k):</strong></p>
        <p>• LL: BF &gt; 1 && k &lt; node.left.key → rightRotate(node)</p>
        <p>• RR: BF &lt; -1 && k &gt; node.right.key → leftRotate(node)</p>
        <p>• LR: BF &gt; 1 && k &gt; node.left.key → leftRotate(left), rightRotate(node)</p>
        <p>• RL: BF &lt; -1 && k &lt; node.right.key → rightRotate(right), leftRotate(node)</p>
      </div>
    </InfoBox>
  </div>
);

export default function AVLImplementation() {
  const [activeTab, setActiveTab] = useState('visualizer');

  const content = {
    visualizer: <AVLVisualizer />,
    steps: <InsertionSteps />,
    code: (
      <CodeBlock
        title="AVL Tree — Java Implementation"
        filename="AVLTree.java"
        tabs={[
          { id: 'node', label: 'Node + Helpers', code: CODE.avlNode },
          { id: 'rotations', label: 'Rotations', code: CODE.avlRotations },
          { id: 'insert', label: 'Insert', code: CODE.avlInsert },
        ]}
      />
    ),
  };

  return (
    <div className="space-y-6">
      <SectionHeader
        icon={RefreshCw}
        title="L9: AVL Implementation"
        description="Interactive AVL insertion with rotation animations and Java code."
      />
      <TabBar tabs={TABS} activeTab={activeTab} onChange={setActiveTab} />
      <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
        {content[activeTab]}
      </div>
    </div>
  );
}
