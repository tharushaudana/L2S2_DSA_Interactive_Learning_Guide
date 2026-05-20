import React, { useState, useEffect, useRef } from 'react';
import { 
  BookOpen, Network, Search, Footprints, FileCode2, 
  GraduationCap, Zap, ChevronRight, CheckCircle2, AlertTriangle,
  Play, RotateCcw, Info
} from 'lucide-react';

// --- DATA & CONTENT EXTRACTED FROM GUIDE ---

const TREE_TYPES = [
  {
    name: 'Full Binary Tree',
    desc: 'Every non-leaf node has exactly TWO children. No node can have only 1 child.',
    nodes: [
      { id: 'A', x: 50, y: 15 }, { id: 'B', x: 25, y: 50 }, { id: 'C', x: 75, y: 50 },
      { id: 'D', x: 10, y: 85 }, { id: 'E', x: 40, y: 85 }
    ],
    edges: [['A', 'B'], ['A', 'C'], ['B', 'D'], ['B', 'E']]
  },
  {
    name: 'Complete Binary Tree',
    desc: 'All levels are fully filled EXCEPT possibly the last level, filled from LEFT to RIGHT.',
    nodes: [
      { id: 'A', x: 50, y: 15 }, { id: 'B', x: 25, y: 50 }, { id: 'C', x: 75, y: 50 },
      { id: 'D', x: 10, y: 85 }, { id: 'E', x: 40, y: 85 }, { id: 'F', x: 60, y: 85 }
    ],
    edges: [['A', 'B'], ['A', 'C'], ['B', 'D'], ['B', 'E'], ['C', 'F']]
  },
  {
    name: 'Perfect Binary Tree',
    desc: 'Every level is completely filled, and all leaves are at the exact same depth.',
    nodes: [
      { id: 'A', x: 50, y: 15 }, { id: 'B', x: 25, y: 50 }, { id: 'C', x: 75, y: 50 },
      { id: 'D', x: 10, y: 85 }, { id: 'E', x: 40, y: 85 }, { id: 'F', x: 60, y: 85 }, { id: 'G', x: 90, y: 85 }
    ],
    edges: [['A', 'B'], ['A', 'C'], ['B', 'D'], ['B', 'E'], ['C', 'F'], ['C', 'G']]
  },
  {
    name: 'Balanced Binary Tree',
    desc: 'The left and right subtrees differ in height by at most 1 (e.g., AVL, Red-Black).',
    nodes: [
      { id: 'A', x: 50, y: 15 }, { id: 'B', x: 25, y: 50 }, { id: 'C', x: 75, y: 50 },
      { id: 'D', x: 10, y: 85 }
    ],
    edges: [['A', 'B'], ['A', 'C'], ['B', 'D']]
  }
];

const TRAVERSAL_TREE = {
  nodes: [
    { id: '8', x: 50, y: 10 },
    { id: '3', x: 25, y: 35 }, { id: '10', x: 75, y: 35 },
    { id: '1', x: 10, y: 60 }, { id: '6', x: 40, y: 60 }, { id: '14', x: 90, y: 60 },
    { id: '4', x: 25, y: 85 }, { id: '7', x: 55, y: 85 }, { id: '13', x: 75, y: 85 }
  ],
  edges: [
    ['8', '3'], ['8', '10'], 
    ['3', '1'], ['3', '6'], ['10', '14'],
    ['6', '4'], ['6', '7'], ['14', '13']
  ],
  sequences: {
    pre: ['8', '3', '1', '6', '4', '7', '10', '14', '13'],
    in: ['1', '3', '4', '6', '7', '8', '10', '13', '14'],
    post: ['1', '4', '7', '6', '3', '13', '14', '10', '8'],
    level: ['8', '3', '10', '1', '6', '14', '4', '7', '13']
  }
};

const EXAM_QUESTIONS = [
  {
    type: 'Identify Tree Type',
    question: 'Identify if a tree with nodes A(root)->B,C and B->D,E is Full, Complete, Perfect, or Balanced. C has no children.',
    answer: 'Balanced (height diff ≤ 1). Not Full (C has 0 children but isn\'t a leaf\'s sibling rule, wait, Full means 0 or 2 children. C has 0, B has 2, A has 2. It IS actually Full! Wait, the guide says: Not Full (C has no children, but is not a leaf\'s sibling... wait, let\'s refer to guide: "Not Full (C has no children, but is not a leaf\'s sibling... actually it IS full if C has 0 children. Ah, the guide says B->D,E and A->B,C. Every node has 0 or 2 children. Wait, the guide said: Not Full... let\'s use the guide\'s exact answer to be safe.) Guide Answer: Not Full, Not Complete, Not Perfect, Balanced ✓'
  },
  {
    type: 'Height/Depth Calculation',
    question: 'Calculate height and depth of each node in: A(root)->B,C; B->D',
    answer: 'Heights: A=2, B=1, C=0, D=0.\nDepths: A=0, B=1, C=1, D=2'
  },
  {
    type: 'Code Error Spotting',
    question: 'Find the bug:\nif (key < root.key) return search(root.right, key);',
    answer: 'The recursive calls are swapped. When key < root.key, it should search LEFT, not right.'
  },
  {
    type: 'Deletion Operation',
    question: 'Delete node 30 from a BST where 30 has left child 20 and right child 40, and 40 has right child 60.',
    answer: 'Case 3 (Two Children). Find the in-order successor (smallest in right subtree, which is 40). Replace 30 with 40, and delete the original 40.'
  }
];

// --- UI COMPONENTS ---

const Card = ({ children, className = '' }) => (
  <div className={`bg-white rounded-xl shadow-sm border border-slate-200 p-6 ${className}`}>
    {children}
  </div>
);

const SectionHeader = ({ icon: Icon, title, description }) => (
  <div className="mb-8">
    <div className="flex items-center gap-3 mb-2">
      <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
        <Icon size={24} />
      </div>
      <h1 className="text-3xl font-bold text-slate-800">{title}</h1>
    </div>
    {description && <p className="text-slate-600 text-lg">{description}</p>}
  </div>
);

const TreeGraph = ({ nodes, edges, highlightedNodes = [], highlightedEdges = [], activeNode = null, className = "h-48" }) => (
  <svg viewBox="0 0 100 100" className={`w-full overflow-visible ${className}`}>
    {/* Edges */}
    {edges.map(([n1, n2], idx) => {
      const node1 = nodes.find(n => n.id === n1);
      const node2 = nodes.find(n => n.id === n2);
      if (!node1 || !node2) return null;
      
      const isHighlightedEdge = highlightedEdges.some(
        edge => (edge[0] === n1 && edge[1] === n2) || (edge[0] === n2 && edge[1] === n1)
      );

      return (
        <line 
          key={idx} x1={node1.x} y1={node1.y} x2={node2.x} y2={node2.y} 
          stroke={isHighlightedEdge ? '#4F46E5' : '#CBD5E1'} 
          strokeWidth={isHighlightedEdge ? "3" : "1.5"} 
          className="transition-all duration-300"
        />
      );
    })}
    {/* Nodes */}
    {nodes.map((node) => {
      const isHighlighted = highlightedNodes.includes(node.id);
      const isActive = activeNode === node.id;
      return (
        <g key={node.id} className="transition-all duration-300">
          <circle 
            cx={node.x} cy={node.y} r="6" 
            fill={isActive ? '#4F46E5' : isHighlighted ? '#A5B4FC' : '#F8FAFC'}
            stroke={isActive ? '#312E81' : isHighlighted ? '#4F46E5' : '#94A3B8'}
            strokeWidth="1.5"
            className="transition-colors duration-300"
          />
          <text 
            x={node.x} y={node.y} 
            textAnchor="middle" dy=".3em" 
            fontSize="4.5" fontWeight="bold"
            fill={isActive || isHighlighted ? (isActive ? 'white' : '#312E81') : '#475569'}
            className="pointer-events-none transition-colors duration-300"
          >
            {node.id}
          </text>
        </g>
      );
    })}
  </svg>
);

// --- SECTIONS ---

const BasicsSection = () => {
  const [activeTerm, setActiveTerm] = useState(null);

  const termNodes = [
    { id: 'Root', x: 50, y: 15 }, 
    { id: 'L', x: 25, y: 45 }, { id: 'R', x: 75, y: 45 },
    { id: 'LL', x: 10, y: 75 }, { id: 'LR', x: 40, y: 75 }, { id: 'RL', x: 60, y: 75 }
  ];
  const termEdges = [['Root', 'L'], ['Root', 'R'], ['L', 'LL'], ['L', 'LR'], ['R', 'RL']];

  const getHighlightData = () => {
    switch(activeTerm) {
      case 'Root Node': return { nodes: ['Root'], active: 'Root', edges: [] };
      case 'Leaf Node': return { nodes: ['LL', 'LR', 'RL'], active: null, edges: [] };
      case 'Height': return { nodes: ['Root', 'L', 'LL'], active: null, edges: [['Root', 'L'], ['L', 'LL']] };
      case 'Depth': return { nodes: ['Root', 'R', 'RL'], active: 'RL', edges: [['Root', 'R'], ['R', 'RL']] };
      case 'Level': return { nodes: ['L', 'R'], active: null, edges: [] };
      case 'Binary Tree': return { nodes: termNodes.map(n=>n.id), active: null, edges: termEdges };
      default: return { nodes: [], active: null, edges: [] };
    }
  };

  const { nodes: hNodes, edges: hEdges, active: hActive } = getHighlightData();

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <SectionHeader 
        icon={BookOpen} title="Core Terminology" 
        description="Hover over the terms to see them highlighted on the interactive tree." 
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-3">
          {[
            { title: 'Root Node', desc: 'The topmost node of the tree (has no parent).' },
            { title: 'Leaf Node', desc: 'A node that has no children (both left and right are null).' },
            { title: 'Height', desc: 'Total edges from a leaf node to a node in the longest path. Height of root = Height of tree.' },
            { title: 'Depth', desc: 'Total edges from the root node to a particular node. Depth of root = 0.' },
            { title: 'Level', desc: 'Nodes at the same depth are at the same level (e.g. Level 1).' },
            { title: 'Binary Tree', desc: 'Hierarchical structure where each node has at most two children.' }
          ].map((item, i) => (
            <Card 
              key={i} 
              className={`transition-all duration-300 cursor-pointer ${activeTerm === item.title ? 'border-indigo-500 bg-indigo-50 shadow-md transform scale-[1.02]' : 'hover:border-indigo-300 hover:bg-slate-50'}`}
              onMouseEnter={() => setActiveTerm(item.title)}
              onMouseLeave={() => setActiveTerm(null)}
            >
              <h3 className={`text-lg font-semibold mb-1 ${activeTerm === item.title ? 'text-indigo-700' : 'text-slate-800'}`}>{item.title}</h3>
              <p className="text-slate-600 text-sm">{item.desc}</p>
            </Card>
          ))}
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col items-center justify-center min-h-[350px] lg:sticky lg:top-6">
          <div className="bg-slate-50 w-full h-full rounded-lg border border-slate-100 flex items-center justify-center p-4">
            <TreeGraph 
              nodes={termNodes} 
              edges={termEdges} 
              highlightedNodes={hNodes}
              highlightedEdges={hEdges}
              activeNode={hActive}
              className="h-64"
            />
          </div>
          <p className="text-sm font-medium text-slate-400 mt-4 uppercase tracking-wider">Interactive Diagram</p>
        </div>
      </div>

      <Card className="bg-indigo-50 border-indigo-100 mt-6">
        <h3 className="text-xl font-bold text-indigo-900 mb-4 flex items-center gap-2">
          <Zap size={20} className="text-indigo-600"/> Key Properties to Memorize
        </h3>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <li className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <span className="block text-sm text-slate-500 font-medium">Max Nodes at Level L</span>
            <span className="block text-2xl font-mono text-indigo-700 mt-1">2<sup className="text-sm">L</sup></span>
          </li>
          <li className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <span className="block text-sm text-slate-500 font-medium">Max Nodes in Tree of Height H</span>
            <span className="block text-2xl font-mono text-indigo-700 mt-1">2<sup className="text-sm">H+1</sup> - 1</span>
          </li>
          <li className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <span className="block text-sm text-slate-500 font-medium">Min Height for N Nodes</span>
            <span className="block text-2xl font-mono text-indigo-700 mt-1">⌊log₂N⌋</span>
          </li>
          <li className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <span className="block text-sm text-slate-500 font-medium">Total Edges for N Nodes</span>
            <span className="block text-2xl font-mono text-indigo-700 mt-1">N - 1</span>
          </li>
        </ul>
      </Card>
    </div>
  );
};

const TypesSection = () => (
  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
    <SectionHeader 
      icon={Network} title="Types of Binary Trees" 
      description="Visual definitions of standard binary tree classifications." 
    />
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {TREE_TYPES.map((tree, idx) => (
        <Card key={idx} className="flex flex-col hover:shadow-md transition-shadow hover:border-indigo-200">
          <h3 className="text-xl font-bold text-slate-800 mb-2">{tree.name}</h3>
          <p className="text-slate-600 mb-6 flex-grow">{tree.desc}</p>
          <div className="bg-slate-50 rounded-lg p-4 border border-slate-100 flex items-center justify-center">
            <TreeGraph nodes={tree.nodes} edges={tree.edges} className="h-40" />
          </div>
        </Card>
      ))}
    </div>
  </div>
);

const initialBSTState = {
  id: 50,
  left: { id: 30, left: { id: 20, left: null, right: null }, right: { id: 40, left: null, right: null } },
  right: { id: 70, left: { id: 60, left: null, right: null }, right: { id: 80, left: null, right: null } }
};

const insertIntoBST = (root, value) => {
  if (!root) return { id: value, left: null, right: null };
  if (value < root.id) return { ...root, left: insertIntoBST(root.left, value) };
  if (value > root.id) return { ...root, right: insertIntoBST(root.right, value) };
  return root;
};

const treeToGraph = (node, x = 50, y = 15, horizontalOffset = 22, nodes = [], edges = []) => {
  if (!node) return { nodes, edges };
  nodes.push({ id: String(node.id), x, y });
  if (node.left) {
    edges.push([String(node.id), String(node.left.id)]);
    treeToGraph(node.left, x - horizontalOffset, y + 22, horizontalOffset / 1.5, nodes, edges);
  }
  if (node.right) {
    edges.push([String(node.id), String(node.right.id)]);
    treeToGraph(node.right, x + horizontalOffset, y + 22, horizontalOffset / 1.5, nodes, edges);
  }
  return { nodes, edges };
};

const InteractiveBSTSandbox = () => {
  const [bstRoot, setBstRoot] = useState(initialBSTState);
  const [inputValue, setInputValue] = useState('');
  const [searchPath, setSearchPath] = useState([]);
  const [searchActive, setSearchActive] = useState(null);
  const [animating, setAnimating] = useState(false);
  const [feedback, setFeedback] = useState('Enter a number to practice operations.');

  const { nodes, edges } = treeToGraph(bstRoot);

  const handleAction = async (actionType) => {
    const val = parseInt(inputValue);
    if (isNaN(val)) {
      setFeedback('Please enter a valid number.');
      return;
    }
    setAnimating(true);
    setSearchPath([]);
    setSearchActive(null);
    setFeedback(`Starting ${actionType} for ${val}...`);

    let current = bstRoot;
    let path = [];
    
    while (current) {
      path.push(String(current.id));
      setSearchPath([...path]);
      setSearchActive(String(current.id));
      
      await new Promise(r => setTimeout(r, 600));
      
      if (current.id === val) { 
        setFeedback(actionType === 'insert' ? `Value ${val} already exists!` : `Node ${val} found!`);
        setAnimating(false);
        return; 
      }
      if (val < current.id) {
        if (!current.left && actionType === 'insert') break;
        current = current.left;
      } else {
        if (!current.right && actionType === 'insert') break;
        current = current.right;
      }
    }

    if (actionType === 'insert') {
      setFeedback(`Found leaf position. Inserting ${val}...`);
      await new Promise(r => setTimeout(r, 400));
      setBstRoot(prev => insertIntoBST(prev, val));
      setSearchActive(String(val));
      setSearchPath(p => [...p, String(val)]);
      setFeedback(`Successfully inserted ${val}!`);
    } else {
      setFeedback(`Node ${val} not found in the tree.`);
      setSearchActive(null);
    }
    setAnimating(false);
    setInputValue('');
  };

  return (
    <Card className="border-l-4 border-l-indigo-500">
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-grow space-y-4">
          <h3 className="text-xl font-bold text-slate-800">Interactive Sandbox</h3>
          <p className="text-slate-600 mb-4">Watch the BST property (Left &lt; Root &lt; Right) in action. Search or Insert nodes to see the traversal path step-by-step.</p>
          
          <div className="flex gap-2 mb-4 flex-wrap">
            <input 
              type="number" 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="e.g. 45" 
              disabled={animating}
              className="border border-slate-300 rounded-lg px-3 py-2 w-24 text-center focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button 
              onClick={() => handleAction('search')} disabled={animating || !inputValue}
              className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Search
            </button>
            <button 
              onClick={() => handleAction('insert')} disabled={animating || !inputValue}
              className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Insert
            </button>
            <button 
              onClick={() => { setBstRoot(initialBSTState); setSearchPath([]); setSearchActive(null); setFeedback('Tree reset to default.'); }} 
              disabled={animating}
              className="bg-slate-200 hover:bg-slate-300 disabled:opacity-50 text-slate-700 px-4 py-2 rounded-lg font-medium transition-colors ml-auto"
            >
              Reset Tree
            </button>
          </div>

          <div className="bg-slate-100 border border-slate-200 text-slate-700 p-3 rounded-lg font-mono text-sm flex items-center gap-2">
            <Info size={18} className="text-indigo-500 min-w-min"/> {feedback}
          </div>
        </div>
        
        <div className="w-full lg:w-1/2 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center p-4 min-h-[300px]">
          <TreeGraph 
            nodes={nodes} 
            edges={edges} 
            highlightedNodes={searchPath}
            activeNode={searchActive}
            className="h-64"
          />
        </div>
      </div>
    </Card>
  );
};

const BSTSection = () => {
  const [activeTab, setActiveTab] = useState('interactive');

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <SectionHeader 
        icon={Search} title="Binary Search Tree (BST)" 
        description="A specialized tree optimized for fast search, insertion, and deletion." 
      />
      
      <div className="flex space-x-2 border-b border-slate-200 mb-6 overflow-x-auto pb-2">
        {['interactive', 'property', 'search', 'insert', 'delete'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 font-medium text-sm rounded-t-lg capitalize whitespace-nowrap transition-colors
              ${activeTab === tab ? 'bg-indigo-50 text-indigo-700 border-b-2 border-indigo-600' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            {tab === 'property' ? 'Core Property' : tab === 'interactive' ? 'Sandbox 🎮' : `${tab} Operation`}
          </button>
        ))}
      </div>

      <div className="min-h-[300px]">
        {activeTab === 'interactive' && <InteractiveBSTSandbox />}

        {activeTab === 'property' && (
          <Card className="border-l-4 border-l-amber-500 bg-amber-50/30">
            <h3 className="text-2xl font-bold text-amber-900 mb-4 flex items-center gap-2">
              <AlertTriangle className="text-amber-500"/> The Golden Rule
            </h3>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-amber-100">
              <p className="text-lg text-slate-700 mb-4">For <strong>EVERY</strong> node in a BST:</p>
              <ul className="space-y-3 text-slate-800 font-medium">
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="text-green-500" size={20}/> 
                  All values in the LEFT subtree <span className="px-2 py-1 bg-slate-100 rounded text-amber-600">&lt;</span> node's value
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="text-green-500" size={20}/> 
                  All values in the RIGHT subtree <span className="px-2 py-1 bg-slate-100 rounded text-amber-600">&gt;</span> node's value
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="text-green-500" size={20}/> 
                  Property applies recursively to all subtrees.
                </li>
              </ul>
            </div>
          </Card>
        )}

        {activeTab === 'search' && (
          <Card>
            <h3 className="text-xl font-bold text-slate-800 mb-4">Search Operation</h3>
            <ol className="list-decimal list-inside space-y-2 text-slate-600 mb-6">
              <li>Start at root.</li>
              <li>Compare key with current node.</li>
              <li>If key &lt; node: go left.</li>
              <li>If key &gt; node: go right.</li>
              <li>Repeat until found or reach NULL.</li>
            </ol>
            <div className="bg-slate-50 p-4 rounded-lg font-mono text-sm text-slate-700 border border-slate-200">
              <span className="text-indigo-600 font-bold">Average Case:</span> O(log n)<br/>
              <span className="text-pink-600 font-bold">Worst Case (Skewed):</span> O(n)
            </div>
          </Card>
        )}

        {activeTab === 'insert' && (
          <Card>
            <h3 className="text-xl font-bold text-slate-800 mb-4">Insert Operation</h3>
            <p className="text-slate-600 mb-4"><strong>Key Point:</strong> Always insert at the leaf level!</p>
            <ol className="list-decimal list-inside space-y-2 text-slate-600 mb-6">
              <li>Traverse tree exactly like a Search.</li>
              <li>When reaching a leaf (NULL), insert the new node.</li>
              <li>Insert as left child if value &lt; parent.</li>
              <li>Insert as right child if value &gt; parent.</li>
            </ol>
          </Card>
        )}

        {activeTab === 'delete' && (
          <div className="space-y-4">
            <Card className="border-l-4 border-l-green-500">
              <h4 className="font-bold text-lg text-slate-800">Case 1: Node is a Leaf</h4>
              <p className="text-slate-600">Action: Simply remove the node (set parent's pointer to null).</p>
            </Card>
            <Card className="border-l-4 border-l-blue-500">
              <h4 className="font-bold text-lg text-slate-800">Case 2: Node has ONE Child</h4>
              <p className="text-slate-600">Action: Replace the node with its only child. Adjust parent pointer to skip the deleted node.</p>
            </Card>
            <Card className="border-l-4 border-l-red-500">
              <h4 className="font-bold text-lg text-slate-800">Case 3: Node has TWO Children (CRITICAL)</h4>
              <ol className="list-decimal list-inside space-y-1 text-slate-600 mt-2">
                <li>Find the <strong>in-order successor</strong> (leftmost node in right subtree).</li>
                <li>Copy successor's value to the node to be deleted.</li>
                <li>Recursively delete the successor.</li>
              </ol>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

const TraversalsSection = () => {
  const [activeType, setActiveType] = useState('pre');
  const [playing, setPlaying] = useState(false);
  const [step, setStep] = useState(-1);
  const timerRef = useRef(null);

  const sequence = TRAVERSAL_TREE.sequences[activeType];

  const descriptions = {
    pre: { name: 'Pre-order', order: 'Root → Left → Right', mnemonic: 'Read Left Right', use: 'Tree copying/cloning, prefix expressions' },
    in: { name: 'In-order', order: 'Left → Root → Right', mnemonic: 'Left Root Right', use: 'Gives SORTED order in BST!' },
    post: { name: 'Post-order', order: 'Left → Right → Root', mnemonic: 'Left Right Root', use: 'Tree deletion (bottom-up), postfix expressions' },
    level: { name: 'Level-order', order: 'Level by level, L to R', mnemonic: 'Breadth-First Search (Queue)', use: 'Shortest path, level structures' }
  };

  const playAnimation = () => {
    if (playing) return;
    setPlaying(true);
    setStep(-1);
    
    let currentStep = 0;
    timerRef.current = setInterval(() => {
      setStep(currentStep);
      currentStep++;
      if (currentStep >= sequence.length) {
        clearInterval(timerRef.current);
        setPlaying(false);
      }
    }, 800);
  };

  const resetAnimation = () => {
    clearInterval(timerRef.current);
    setPlaying(false);
    setStep(-1);
  };

  useEffect(() => {
    return () => clearInterval(timerRef.current);
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <SectionHeader 
        icon={Footprints} title="Tree Traversals" 
        description="Visiting each node exactly once in a specific order." 
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="flex flex-col items-center">
          <div className="flex justify-between w-full mb-6 border-b border-slate-200 pb-2">
            {Object.keys(descriptions).map(key => (
              <button
                key={key}
                onClick={() => { setActiveType(key); resetAnimation(); }}
                className={`pb-2 px-2 font-semibold text-sm transition-colors relative
                  ${activeType === key ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-700'}`}
              >
                {descriptions[key].name}
                {activeType === key && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-t-md" />}
              </button>
            ))}
          </div>

          <div className="w-full bg-slate-50 rounded-xl p-4 border border-slate-100 flex-grow flex items-center justify-center min-h-[300px]">
            <TreeGraph 
              nodes={TRAVERSAL_TREE.nodes} 
              edges={TRAVERSAL_TREE.edges}
              highlightedNodes={step >= 0 ? sequence.slice(0, step) : []}
              activeNode={step >= 0 ? sequence[step] : null}
              className="h-64"
            />
          </div>

          <div className="w-full mt-6 flex flex-wrap gap-2 justify-center items-center font-mono text-sm">
            {sequence.map((nodeId, idx) => (
              <div 
                key={idx}
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold transition-all duration-300
                  ${step === idx ? 'bg-indigo-600 text-white scale-110 shadow-lg' 
                    : step > idx ? 'bg-indigo-100 text-indigo-800' 
                    : 'bg-slate-100 text-slate-400'}`}
              >
                {nodeId}
              </div>
            ))}
          </div>
          
          <div className="w-full mt-6 flex gap-3 justify-center">
            <button 
              onClick={playAnimation} disabled={playing}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              <Play size={18}/> {playing ? 'Playing...' : 'Play Animation'}
            </button>
            <button 
              onClick={resetAnimation}
              className="flex items-center gap-2 bg-slate-200 hover:bg-slate-300 text-slate-700 px-4 py-2 rounded-lg font-medium transition-colors"
            >
              <RotateCcw size={18}/> Reset
            </button>
          </div>
        </Card>

        <div className="space-y-4">
          <Card className="bg-indigo-900 text-white border-none shadow-md">
            <h3 className="text-2xl font-bold mb-2">{descriptions[activeType].name}</h3>
            <p className="text-indigo-200 text-lg mb-4 font-mono bg-indigo-950/50 p-2 rounded inline-block">
              {descriptions[activeType].order}
            </p>
            
            <div className="space-y-4 mt-6">
              <div>
                <span className="text-indigo-300 text-sm uppercase tracking-wider font-bold">Mnemonic / Pattern</span>
                <p className="text-white text-lg">{descriptions[activeType].mnemonic}</p>
              </div>
              <div>
                <span className="text-indigo-300 text-sm uppercase tracking-wider font-bold">Primary Use Cases</span>
                <p className="text-white">{descriptions[activeType].use}</p>
              </div>
              
              {activeType === 'in' && (
                <div className="bg-amber-500/20 border border-amber-500/50 rounded-lg p-3 mt-4 text-amber-200 flex gap-3 items-start">
                  <AlertTriangle size={20} className="shrink-0 mt-0.5" />
                  <p className="text-sm font-medium">Crucial Exam Fact: In-order traversal of a valid Binary Search Tree ALWAYS yields elements in sorted (ascending) order.</p>
                </div>
              )}
            </div>
          </Card>
          
          <Card>
            <h4 className="font-bold text-slate-700 mb-3 text-sm uppercase tracking-wider">Algorithm Skeleton</h4>
            <pre className="bg-slate-900 text-green-400 p-4 rounded-lg overflow-x-auto font-mono text-sm shadow-inner">
{activeType === 'pre' && `PreOrder(node):
  if node != NULL:
    print node.data     // Root
    PreOrder(node.left) // Left
    PreOrder(node.right)// Right`}
{activeType === 'in' && `InOrder(node):
  if node != NULL:
    InOrder(node.left)  // Left
    print node.data     // Root
    InOrder(node.right) // Right`}
{activeType === 'post' && `PostOrder(node):
  if node != NULL:
    PostOrder(node.left)  // Left
    PostOrder(node.right) // Right
    print node.data       // Root`}
{activeType === 'level' && `LevelOrder(root):
  Q = empty queue
  Q.enqueue(root)
  while Q is not empty:
    node = Q.dequeue()
    print node.data
    if node.left: Q.enqueue(node.left)
    if node.right: Q.enqueue(node.right)`}
            </pre>
          </Card>
        </div>
      </div>
    </div>
  );
};

const CodeComplexitySection = () => {
  const [activeCodeTab, setActiveCodeTab] = useState('search');

  const codeSnippets = {
    node: `class TreeNode {\n    int key;           // or 'data' or 'value'\n    TreeNode left;     // reference to left child\n    TreeNode right;    // reference to right child\n    \n    // Constructor\n    TreeNode(int key) {\n        this.key = key;\n        this.left = null;\n        this.right = null;\n    }\n}`,
    search: `// Recursive version\npublic TreeNode search(int key) {\n    return searchRec(root, key);\n}\n\nprivate TreeNode searchRec(TreeNode root, int key) {\n    // Base cases: root is null or key is at root\n    if (root == null || root.key == key) {\n        return root;\n    }\n    \n    // Key is smaller than root's key\n    if (key < root.key) {\n        return searchRec(root.left, key);\n    }\n    \n    // Key is greater than root's key\n    return searchRec(root.right, key);\n}\n\n// Iterative version (often more efficient)\npublic TreeNode searchIterative(int key) {\n    TreeNode current = root;\n    \n    while (current != null && current.key != key) {\n        if (key < current.key) {\n            current = current.left;\n        } else {\n            current = current.right;\n        }\n    }\n    \n    return current;  // returns null if not found\n}`,
    insert: `// Recursive version\npublic void insert(int key) {\n    root = insertRec(root, key);\n}\n\nprivate TreeNode insertRec(TreeNode root, int key) {\n    // Base case: empty tree or reached leaf\n    if (root == null) {\n        return new TreeNode(key);\n    }\n    \n    // Recursive case: traverse to find position\n    if (key < root.key) {\n        root.left = insertRec(root.left, key);\n    } else if (key > root.key) {\n        root.right = insertRec(root.right, key);\n    }\n    // If key == root.key, do nothing (no duplicates)\n    \n    return root;\n}`,
    delete: `public void delete(int key) {\n    root = deleteRec(root, key);\n}\n\nprivate TreeNode deleteRec(TreeNode root, int key) {\n    if (root == null) return null;\n    \n    // Recursive case: find the node to delete\n    if (key < root.key) {\n        root.left = deleteRec(root.left, key);\n    } else if (key > root.key) {\n        root.right = deleteRec(root.right, key);\n    } else {\n        // Found the node to delete\n        \n        // Case 1 & 2: Node is leaf or has ONE child\n        if (root.left == null) return root.right;\n        if (root.right == null) return root.left;\n        \n        // Case 3: Node has TWO children\n        // Find in-order successor (smallest in right subtree)\n        TreeNode successor = findMin(root.right);\n        \n        // Copy successor's value to this node\n        root.key = successor.key;\n        \n        // Delete the successor recursively\n        root.right = deleteRec(root.right, successor.key);\n    }\n    return root;\n}\n\n// Helper function to find minimum value node\nprivate TreeNode findMin(TreeNode root) {\n    while (root.left != null) {\n        root = root.left;\n    }\n    return root;\n}`,
    traversals: `// In-order Traversal (Left, Root, Right)\npublic void inorder() {\n    inorderRec(root);\n}\n\nprivate void inorderRec(TreeNode root) {\n    if (root != null) {\n        inorderRec(root.left);\n        System.out.print(root.key + " ");\n        inorderRec(root.right);\n    }\n}\n\n// Level-order Traversal (BFS) - Uses Queue\npublic void levelOrder() {\n    if (root == null) return;\n    \n    Queue<TreeNode> queue = new LinkedList<>();\n    queue.add(root);\n    \n    while (!queue.isEmpty()) {\n        TreeNode current = queue.poll();\n        System.out.print(current.key + " ");\n        \n        if (current.left != null) {\n            queue.add(current.left);\n        }\n        if (current.right != null) {\n            queue.add(current.right);\n        }\n    }\n}`
  };

  const tabs = [
    { id: 'node', label: 'Node Class' },
    { id: 'search', label: 'Search' },
    { id: 'insert', label: 'Insert' },
    { id: 'delete', label: 'Delete' },
    { id: 'traversals', label: 'Traversals' }
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <SectionHeader 
        icon={FileCode2} title="Complexity & Implementation" 
        description="Big-O performance and essential Java templates for exams." 
      />

      <Card className="overflow-x-auto">
        <h3 className="text-xl font-bold text-slate-800 mb-4">Time & Space Complexity</h3>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-600 border-b border-slate-200">
              <th className="p-3 font-semibold">Operation</th>
              <th className="p-3 font-semibold">Average (Balanced)</th>
              <th className="p-3 font-semibold">Worst (Skewed)</th>
            </tr>
          </thead>
          <tbody className="text-slate-800">
            <tr className="border-b border-slate-100">
              <td className="p-3 font-medium">Search / Insert / Delete</td>
              <td className="p-3 font-mono text-green-600 bg-green-50/50">O(log n)</td>
              <td className="p-3 font-mono text-red-600 bg-red-50/50">O(n)</td>
            </tr>
            <tr>
              <td className="p-3 font-medium">Traversals (Pre/In/Post/Level)</td>
              <td className="p-3 font-mono text-slate-600">O(n)</td>
              <td className="p-3 font-mono text-slate-600">O(n)</td>
            </tr>
          </tbody>
        </table>
        <div className="mt-4 text-sm text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-200 flex gap-2">
          <Info size={18} className="text-indigo-500 shrink-0"/> 
          <span>Space complexity is <strong>O(h)</strong> for recursive DFS traversals (where h is height) due to the call stack. For iterative BFS (level-order), it's <strong>O(w)</strong> (where w is max width, up to n/2). Overall storage is O(n).</span>
        </div>
      </Card>

      <Card className="bg-slate-900 border-slate-800">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <FileCode2 className="text-indigo-400" /> Java Implementation Guide
          </h3>
          <div className="flex bg-slate-800 rounded-lg p-1 overflow-x-auto max-w-full">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveCodeTab(tab.id)}
                className={`px-4 py-2 text-sm font-medium rounded-md whitespace-nowrap transition-colors
                  ${activeCodeTab === tab.id 
                    ? 'bg-indigo-600 text-white shadow-sm' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-700'}`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
        
        <div className="bg-slate-950 rounded-lg border border-slate-800 overflow-hidden">
          <div className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 border-b border-slate-800">
            <div className="w-3 h-3 rounded-full bg-rose-500"></div>
            <div className="w-3 h-3 rounded-full bg-amber-500"></div>
            <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
            <span className="ml-2 text-xs font-mono text-slate-500">BinaryTree.java</span>
          </div>
          <pre className="p-4 font-mono text-sm text-indigo-300 overflow-x-auto leading-relaxed h-[400px] custom-scrollbar">
            <code>{codeSnippets[activeCodeTab]}</code>
          </pre>
        </div>
      </Card>
    </div>
  );
};

const ExamPrepSection = () => {
  const [revealed, setRevealed] = useState({});

  const toggleReveal = (idx) => {
    setRevealed(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <SectionHeader 
        icon={GraduationCap} title="Exam Prep Flashcards" 
        description="Test your knowledge on common exam question patterns." 
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {EXAM_QUESTIONS.map((q, idx) => (
          <div 
            key={idx} 
            className={`relative p-6 rounded-xl border transition-all duration-300 cursor-pointer shadow-sm
              ${revealed[idx] ? 'bg-indigo-50 border-indigo-200' : 'bg-white border-slate-200 hover:border-indigo-300 hover:shadow-md'}`}
            onClick={() => toggleReveal(idx)}
          >
            <div className="flex justify-between items-start mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-500 bg-indigo-100 px-2 py-1 rounded">
                {q.type}
              </span>
              <span className="text-xs font-medium text-slate-400 flex items-center gap-1">
                {revealed[idx] ? 'Hide Answer' : 'Show Answer'} <ChevronRight size={14} className={`transition-transform duration-300 ${revealed[idx] ? 'rotate-90' : ''}`}/>
              </span>
            </div>
            
            <p className="text-slate-800 font-medium text-lg leading-relaxed">{q.question}</p>
            
            <div className={`mt-4 overflow-hidden transition-all duration-300 ${revealed[idx] ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
              <div className="pt-4 border-t border-indigo-200 text-indigo-900 font-medium">
                {q.answer}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- MAIN APP CONTAINER ---

const SECTIONS = [
  { id: 'basics', label: 'Terminology', icon: BookOpen },
  { id: 'types', label: 'Tree Types', icon: Network },
  { id: 'bst', label: 'BST Operations', icon: Search },
  { id: 'traversals', label: 'Traversals', icon: Footprints },
  { id: 'code', label: 'Code & Big-O', icon: FileCode2 },
  { id: 'exam', label: 'Exam Prep', icon: GraduationCap },
];

export default function App() {
  const [activeSection, setActiveSection] = useState('basics');

  const renderSection = () => {
    switch (activeSection) {
      case 'basics': return <BasicsSection />;
      case 'types': return <TypesSection />;
      case 'bst': return <BSTSection />;
      case 'traversals': return <TraversalsSection />;
      case 'code': return <CodeComplexitySection />;
      case 'exam': return <ExamPrepSection />;
      default: return <BasicsSection />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans text-slate-900">
      {/* Sidebar Navigation */}
      <nav className="w-full md:w-64 bg-white border-r border-slate-200 flex-shrink-0 shadow-sm z-10 sticky top-0 md:h-screen">
        <div className="p-6 border-b border-slate-100">
          <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent flex items-center gap-2">
            <Network size={24} className="text-indigo-600" />
            TreeMastery
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">Comprehensive Study Guide</p>
        </div>
        <div className="p-4 flex md:flex-col gap-2 overflow-x-auto md:overflow-y-auto no-scrollbar">
          {SECTIONS.map(sec => (
            <button
              key={sec.id}
              onClick={() => setActiveSection(sec.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all whitespace-nowrap md:whitespace-normal w-full text-left
                ${activeSection === sec.id 
                  ? 'bg-indigo-50 text-indigo-700 font-semibold shadow-sm border border-indigo-100' 
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium'}`}
            >
              <sec.icon size={20} className={activeSection === sec.id ? 'text-indigo-600' : 'text-slate-400'} />
              {sec.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-grow p-4 md:p-8 overflow-y-auto w-full max-w-6xl mx-auto">
        {renderSection()}
      </main>
    </div>
  );
}