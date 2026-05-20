export const TREE_TYPES = [
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

export const TRAVERSAL_TREE = {
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

export const TERM_TREE = {
  nodes: [
    { id: 'Root', x: 50, y: 15 },
    { id: 'L', x: 25, y: 45 }, { id: 'R', x: 75, y: 45 },
    { id: 'LL', x: 10, y: 75 }, { id: 'LR', x: 40, y: 75 }, { id: 'RL', x: 60, y: 75 }
  ],
  edges: [['Root', 'L'], ['Root', 'R'], ['L', 'LL'], ['L', 'LR'], ['R', 'RL']]
};

export const BST_INITIAL = {
  id: 50,
  left: { id: 30, left: { id: 20, left: null, right: null }, right: { id: 40, left: null, right: null } },
  right: { id: 70, left: { id: 60, left: null, right: null }, right: { id: 80, left: null, right: null } }
};
