import { useState, useMemo, useEffect } from 'react';
import { Footprints, AlertTriangle } from 'lucide-react';
import { SectionHeader } from '../components/ui/SectionHeader';
import { Card } from '../components/ui/Card';
import { TabBar } from '../components/ui/TabBar';
import { InfoBox } from '../components/ui/InfoBox';
import { CodeBlock } from '../components/ui/CodeBlock';
import { TreeGraph } from '../components/visualizations/TreeGraph';
import { VisualizerControls } from '../components/visualizations/VisualizerControls';
import { TraversalMechanism } from '../components/visualizations/TraversalMechanism';
import { useAnimationStepper } from '../hooks/useAnimationStepper';
import { TRAVERSAL_TREE } from '../data/treeData';
import { CODE } from '../data/codeSnippets';

const TABS = [
  { id: 'animator', label: '▶ Animation' },
  { id: 'theory', label: 'Theory' },
  { id: 'code', label: 'Java Code' },
];

const DESCRIPTIONS = {
  pre: {
    name: 'Pre-order',
    order: 'Root → Left → Right',
    mnemonic: 'Visit BEFORE going deeper',
    use: 'Tree copying/cloning, prefix expression evaluation, serializing tree structure.',
    code: `PreOrder(node):
  if node != NULL:
    print node.data      // Root FIRST
    PreOrder(node.left)  // Then Left
    PreOrder(node.right) // Then Right`,
  },
  in: {
    name: 'In-order',
    order: 'Left → Root → Right',
    mnemonic: 'Visit BETWEEN left and right',
    use: 'Produces SORTED output for BST! Also used to verify if a tree is a valid BST.',
    code: `InOrder(node):
  if node != NULL:
    InOrder(node.left)   // Left first
    print node.data      // Root MIDDLE
    InOrder(node.right)  // Right last`,
  },
  post: {
    name: 'Post-order',
    order: 'Left → Right → Root',
    mnemonic: 'Visit AFTER both children',
    use: 'Tree deletion (delete children before parent), postfix expression evaluation, bottom-up computations.',
    code: `PostOrder(node):
  if node != NULL:
    PostOrder(node.left)  // Left first
    PostOrder(node.right) // Right second
    print node.data       // Root LAST`,
  },
  level: {
    name: 'Level-order (BFS)',
    order: 'Level by Level, Left to Right',
    mnemonic: 'Use a QUEUE, visit level by level',
    use: 'Shortest path problems, finding nodes at a specific level, serializing by level.',
    code: `LevelOrder(root):
  Q = empty Queue
  Q.enqueue(root)
  while Q is not empty:
    node = Q.dequeue()
    print node.data
    if node.left:  Q.enqueue(node.left)
    if node.right: Q.enqueue(node.right)`,
  },
};

function generateTraversalSteps(type, root) {
  const steps = [];
  const sequence = [];
  
  if (type === 'level') {
    const queue = [root];
    steps.push({
      queue: [root.id],
      activeNode: null,
      visitedNodes: [],
      description: "Starting Level-order traversal. Enqueuing the Root node to begin."
    });

    while (queue.length > 0) {
      const node = queue.shift();
      sequence.push(node.id);
      
      steps.push({
        queue: queue.map(n => n.id),
        activeNode: node.id,
        visitedNodes: [...sequence],
        description: `Dequeueing node ${node.id} and visiting it.`
      });

      if (node.left || node.right) {
        let desc = `Checking children of ${node.id}. `;
        if (node.left) {
          queue.push(node.left);
          desc += `Enqueuing Left child ${node.left.id}. `;
        }
        if (node.right) {
          queue.push(node.right);
          desc += `Enqueuing Right child ${node.right.id}. `;
        }
        steps.push({
          queue: queue.map(n => n.id),
          activeNode: node.id,
          visitedNodes: [...sequence],
          description: desc
        });
      }
    }
  } else {
    // DFS Simulation
    const stack = [];
    
    function dfs(node) {
      if (!node) return;

      // 1. Enter Node
      stack.push({ id: node.id, status: 'Visiting' });
      steps.push({
        stack: [...stack],
        activeNode: node.id,
        visitedNodes: [...sequence],
        description: `Calling DFS(${node.id}). Pushing frame to stack.`
      });

      // Pre-order Visit
      if (type === 'pre') {
        sequence.push(node.id);
        stack[stack.length - 1].status = 'Printing Root';
        steps.push({
          stack: [...stack],
          activeNode: node.id,
          visitedNodes: [...sequence],
          description: `Pre-order: Printing node ${node.id} BEFORE visiting children.`
        });
      }

      // 2. Go Left
      stack[stack.length - 1].status = 'Moving Left';
      steps.push({
        stack: [...stack],
        activeNode: node.id,
        visitedNodes: [...sequence],
        description: `Recursively calling DFS for the Left child of ${node.id}.`
      });
      dfs(node.left);

      // In-order Visit
      if (type === 'in') {
        sequence.push(node.id);
        stack[stack.length - 1].status = 'Printing Root';
        steps.push({
          stack: [...stack],
          activeNode: node.id,
          visitedNodes: [...sequence],
          description: `In-order: Left subtree finished. Printing node ${node.id} now.`
        });
      }

      // 3. Go Right
      stack[stack.length - 1].status = 'Moving Right';
      steps.push({
        stack: [...stack],
        activeNode: node.id,
        visitedNodes: [...sequence],
        description: `Recursively calling DFS for the Right child of ${node.id}.`
      });
      dfs(node.right);

      // Post-order Visit
      if (type === 'post') {
        sequence.push(node.id);
        stack[stack.length - 1].status = 'Printing Root';
        steps.push({
          stack: [...stack],
          activeNode: node.id,
          visitedNodes: [...sequence],
          description: `Post-order: Both subtrees finished. Finally printing node ${node.id}.`
        });
      }

      // 4. Leave Node
      stack.pop();
      steps.push({
        stack: [...stack],
        activeNode: stack.length > 0 ? stack[stack.length - 1].id : null,
        visitedNodes: [...sequence],
        description: `DFS(${node.id}) finished. Popping frame and returning to parent.`
      });
    }

    dfs(root);
  }

  // Final step
  steps.push({
    stack: [],
    queue: [],
    activeNode: null,
    visitedNodes: [...sequence],
    description: `Traversal Complete! Final Sequence: [${sequence.join(', ')}]`
  });

  return steps;
}

const TraversalAnimator = () => {
  const [activeType, setActiveType] = useState('pre');

  const steps = useMemo(() => {
    return generateTraversalSteps(activeType, TRAVERSAL_TREE.structure);
  }, [activeType]);

  const { 
    currentStep, currentStepData, isPlaying, isComplete, speed, totalSteps, 
    play, pause, reset, stepForward, stepBack, setSpeed 
  } = useAnimationStepper(steps);

  useEffect(() => { reset(); }, [activeType]);

  const displayData = currentStepData || {
      highlightedNodes: [],
      activeNode: null,
      description: 'Press Play to start the traversal visualization.',
      stack: [],
      queue: [],
      visitedNodes: []
  };

  const handleTypeChange = (type) => {
    setActiveType(type);
    reset();
  };

  const desc = DESCRIPTIONS[activeType];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tree + Mechanism */}
        <Card className="flex flex-col">
          <div className="flex w-full border-b border-slate-200 dark:border-slate-700 pb-2 mb-4 gap-1 overflow-x-auto">
            {Object.keys(DESCRIPTIONS).map(key => (
              <button
                key={key}
                onClick={() => handleTypeChange(key)}
                className={`px-3 py-1.5 rounded-t font-semibold text-xs transition-colors relative whitespace-nowrap ${activeType === key ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20' : 'text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
              >
                {DESCRIPTIONS[key].name}
                {activeType === key && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 dark:bg-indigo-400 rounded-t" />}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 flex-grow">
            {/* Tree Graph */}
            <div className="md:col-span-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-100 dark:border-slate-700 flex flex-col items-center justify-center min-h-[300px]">
              <TreeGraph
                nodes={TRAVERSAL_TREE.nodes}
                edges={TRAVERSAL_TREE.edges}
                highlightedNodes={displayData.visitedNodes}
                activeNode={displayData.activeNode}
                highlightedEdges={
                    activeType !== 'level' && displayData.stack ? 
                    displayData.stack.slice(0, -1).map((frame, i) => [frame.id, displayData.stack[i+1].id]) : 
                    []
                }
                className="h-64"
              />
            </div>

            {/* Stack/Queue Mechanism */}
            <div className="md:col-span-2">
              <TraversalMechanism 
                type={activeType} 
                stack={displayData.stack} 
                queue={displayData.queue} 
                activeNode={displayData.activeNode} 
              />
            </div>
          </div>

          {/* Sequence Display */}
          <div className="w-full mt-6 flex flex-col gap-2">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Visitation Sequence</h4>
            <div className="flex flex-wrap gap-2 justify-center font-mono text-sm">
                {displayData.visitedNodes.map((nodeId, idx) => (
                <div
                    key={idx}
                    className="w-9 h-9 rounded-full flex items-center justify-center font-bold bg-indigo-100 dark:bg-indigo-900/40 text-indigo-800 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 animate-in zoom-in duration-300"
                >
                    {nodeId}
                </div>
                ))}
                {displayData.visitedNodes.length === 0 && (
                    <div className="text-slate-400 italic text-xs py-2">Waiting for first visit...</div>
                )}
            </div>
          </div>

          {/* Description */}
          <div className="w-full mt-6 mb-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg p-3 min-h-[52px] text-sm text-slate-700 dark:text-slate-300 font-mono">
            {displayData.description}
          </div>

          <div className="w-full border-t border-slate-100 dark:border-slate-800 pt-4">
              <VisualizerControls 
                  isPlaying={isPlaying}
                  isComplete={isComplete}
                  currentStep={currentStep}
                  totalSteps={totalSteps}
                  speed={speed}
                  play={play}
                  pause={pause}
                  reset={reset}
                  stepForward={stepForward}
                  stepBack={stepBack}
                  setSpeed={setSpeed}
              />
          </div>
        </Card>

        {/* Info card */}
        <div className="space-y-4 flex flex-col">
          <div className="bg-indigo-900 text-white rounded-xl p-6 shadow-md">
            <h3 className="text-2xl font-bold mb-1">{desc.name}</h3>
            <p className="text-indigo-200 font-mono bg-indigo-950/50 px-3 py-1 rounded inline-block mb-4 text-sm">{desc.order}</p>
            <div className="space-y-3">
              <div>
                <span className="text-indigo-300 text-xs uppercase font-bold tracking-wider">Pattern / Mnemonic</span>
                <p className="text-white">{desc.mnemonic}</p>
              </div>
              <div>
                <span className="text-indigo-300 text-xs uppercase font-bold tracking-wider">Use Cases</span>
                <p className="text-white text-sm">{desc.use}</p>
              </div>
              {activeType === 'in' && (
                <div className="bg-amber-500/20 border border-amber-500/50 rounded-lg p-3 flex gap-3 items-start mt-2">
                  <AlertTriangle size={18} className="shrink-0 text-amber-300 mt-0.5" />
                  <p className="text-amber-200 text-sm font-medium">
                    Critical Exam Fact: In-order traversal of a BST ALWAYS yields elements in sorted (ascending) order!
                  </p>
                </div>
              )}
            </div>
          </div>

          <Card className="flex-grow">
            <h4 className="font-bold text-slate-700 dark:text-slate-300 mb-3 text-xs uppercase tracking-wider">Algorithm Skeleton</h4>
            <pre className="bg-slate-900 text-green-400 p-4 rounded-lg overflow-x-auto font-mono text-xs leading-relaxed">
              {desc.code}
            </pre>
          </Card>
        </div>
      </div>
    </div>
  );
};

const Theory = () => (
  <div className="space-y-4">
    <Card>
      <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">DFS vs BFS</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-xl p-4">
          <h4 className="font-bold text-blue-800 dark:text-blue-200 mb-2">Depth-First Search (DFS)</h4>
          <p className="text-sm text-blue-700 dark:text-blue-300 mb-2">Goes as deep as possible along each branch before backtracking.</p>
          <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
            <li>• Uses a <strong>stack</strong> (or recursion)</li>
            <li>• Pre-order, In-order, Post-order</li>
            <li>• Space: O(h) for recursive call stack</li>
          </ul>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800 rounded-xl p-4">
          <h4 className="font-bold text-green-800 dark:text-green-200 mb-2">Breadth-First Search (BFS)</h4>
          <p className="text-sm text-green-700 dark:text-green-300 mb-2">Visits all nodes level by level, from left to right.</p>
          <ul className="text-sm text-green-700 dark:text-green-300 space-y-1">
            <li>• Uses a <strong>queue</strong></li>
            <li>• Level-order traversal</li>
            <li>• Space: O(w) where w is max width</li>
          </ul>
        </div>
      </div>
    </Card>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {Object.entries(DESCRIPTIONS).map(([key, d]) => (
        <Card key={key} className="border-l-4 border-l-indigo-400">
          <h4 className="font-bold text-slate-800 dark:text-slate-100 mb-1">{d.name}</h4>
          <p className="text-indigo-600 dark:text-indigo-400 font-mono text-sm mb-2">{d.order}</p>
          <p className="text-slate-600 dark:text-slate-400 text-sm">{d.use}</p>
        </Card>
      ))}
    </div>

    <InfoBox variant="exam">
      <div className="space-y-1">
        <p><strong>Must memorize:</strong></p>
        <p>• Pre-order: <code className="bg-indigo-100 dark:bg-indigo-900/30 px-1 rounded">Root → L → R</code> → useful for copying/cloning</p>
        <p>• In-order: <code className="bg-indigo-100 dark:bg-indigo-900/30 px-1 rounded">L → Root → R</code> → gives SORTED output for BST!</p>
        <p>• Post-order: <code className="bg-indigo-100 dark:bg-indigo-900/30 px-1 rounded">L → R → Root</code> → useful for deletion</p>
        <p>• Level-order: <code className="bg-indigo-100 dark:bg-indigo-900/30 px-1 rounded">Level by level</code> → uses Queue (BFS)</p>
      </div>
    </InfoBox>
  </div>
);

export default function Traversals() {
  const [activeTab, setActiveTab] = useState('animator');

  const content = {
    animator: <TraversalAnimator />,
    theory: <Theory />,
    code: (
      <CodeBlock
        title="Tree Traversals — Java"
        filename="Traversals.java"
        tabs={[{ id: 'all', label: 'All Traversals', code: CODE.bstTraversals }]}
      />
    ),
  };

  return (
    <div className="space-y-6">
      <SectionHeader
        icon={Footprints}
        title="L6: Tree Traversals"
        description="Visiting every node exactly once in a specific order. DFS (Pre/In/Post) and BFS (Level-order)."
      />
      <TabBar tabs={TABS} activeTab={activeTab} onChange={setActiveTab} />
      <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
        {content[activeTab]}
      </div>
    </div>
  );
}
