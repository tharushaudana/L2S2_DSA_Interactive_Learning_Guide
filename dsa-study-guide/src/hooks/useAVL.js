import { useState, useCallback } from 'react';

// AVL Node structure: { id, key, left, right, height, x, y }
function height(node) {
  return node ? node.height : 0;
}

function getBalance(node) {
  if (!node) return 0;
  return height(node.left) - height(node.right);
}

function updateHeight(node) {
  if (!node) return 0;
  return Math.max(height(node.left), height(node.right)) + 1;
}

function rightRotate(y) {
  const x = y.left;
  const T2 = x.right;

  const newY = { ...y, left: T2 };
  newY.height = updateHeight(newY);

  const newX = { ...x, right: newY };
  newX.height = updateHeight(newX);

  return newX;
}

function leftRotate(x) {
  const y = x.right;
  const T2 = y.left;

  const newX = { ...x, right: T2 };
  newX.height = updateHeight(newX);

  const newY = { ...y, left: newX };
  newY.height = updateHeight(newY);

  return newY;
}

let nodeIdCounter = 1;

function insertAVL(node, key, steps) {
  // Step 1: BST insert
  if (!node) {
    const newNode = { id: `n${nodeIdCounter++}`, key, left: null, right: null, height: 1 };
    steps.push({
      type: 'insert',
      key,
      description: `Inserted ${key} as a new leaf node.`,
      rotationType: null,
    });
    return newNode;
  }

  if (key < node.key) {
    const newLeft = insertAVL(node.left, key, steps);
    node = { ...node, left: newLeft };
  } else if (key > node.key) {
    const newRight = insertAVL(node.right, key, steps);
    node = { ...node, right: newRight };
  } else {
    steps.push({ type: 'duplicate', key, description: `${key} already exists — no duplicates in AVL tree.`, rotationType: null });
    return node;
  }

  // Step 2: Update height
  node = { ...node, height: updateHeight(node) };

  // Step 3: Check balance
  const balance = getBalance(node);

  if (balance >= -1 && balance <= 1) {
    steps.push({
      type: 'balanced',
      key: node.key,
      balance,
      description: `Node ${node.key}: BF=${balance} — balanced, no rotation needed.`,
      rotationType: null,
    });
    return node;
  }

  // Step 4: Rotations
  // LL Case
  if (balance > 1 && key < node.left.key) {
    steps.push({
      type: 'rotate',
      key: node.key,
      balance,
      rotationType: 'LL',
      description: `Node ${node.key}: BF=${balance} > 1, and ${key} < ${node.left.key} (left child). LL Case → Right Rotation on ${node.key}.`,
    });
    return rightRotate(node);
  }

  // RR Case
  if (balance < -1 && key > node.right.key) {
    steps.push({
      type: 'rotate',
      key: node.key,
      balance,
      rotationType: 'RR',
      description: `Node ${node.key}: BF=${balance} < -1, and ${key} > ${node.right.key} (right child). RR Case → Left Rotation on ${node.key}.`,
    });
    return leftRotate(node);
  }

  // LR Case
  if (balance > 1 && key > node.left.key) {
    steps.push({
      type: 'rotate',
      key: node.key,
      balance,
      rotationType: 'LR',
      description: `Node ${node.key}: BF=${balance} > 1, and ${key} > ${node.left.key} (left child is right-heavy). LR Case → Left Rotation on ${node.left.key}, then Right Rotation on ${node.key}.`,
    });
    const newLeft = leftRotate(node.left);
    node = { ...node, left: newLeft };
    return rightRotate(node);
  }

  // RL Case
  if (balance < -1 && key < node.right.key) {
    steps.push({
      type: 'rotate',
      key: node.key,
      balance,
      rotationType: 'RL',
      description: `Node ${node.key}: BF=${balance} < -1, and ${key} < ${node.right.key} (right child is left-heavy). RL Case → Right Rotation on ${node.right.key}, then Left Rotation on ${node.key}.`,
    });
    const newRight = rightRotate(node.right);
    node = { ...node, right: newRight };
    return leftRotate(node);
  }

  return node;
}

// Convert AVL tree to graph representation with positions
export function avlToGraph(node, x = 50, y = 12, hOffset = 22, nodes = [], edges = []) {
  if (!node) return { nodes, edges };
  const bf = getBalance(node);
  nodes.push({ id: node.id, key: node.key, x, y, height: node.height, balance: bf });
  if (node.left) {
    edges.push([node.id, node.left.id]);
    avlToGraph(node.left, x - hOffset, y + 20, hOffset / 1.6, nodes, edges);
  }
  if (node.right) {
    edges.push([node.id, node.right.id]);
    avlToGraph(node.right, x + hOffset, y + 20, hOffset / 1.6, nodes, edges);
  }
  return { nodes, edges };
}

export function useAVL() {
  const [avlRoot, setAvlRoot] = useState(null);
  const [log, setLog] = useState([]);
  const [lastRotation, setLastRotation] = useState(null);

  const insert = useCallback((key) => {
    const val = parseInt(key);
    if (isNaN(val)) return;

    const steps = [];
    const newRoot = insertAVL(avlRoot, val, steps);
    setAvlRoot(newRoot);
    setLog(prev => [...prev, ...steps]);

    const rotation = steps.find(s => s.type === 'rotate');
    setLastRotation(rotation || null);
  }, [avlRoot]);

  const reset = useCallback(() => {
    setAvlRoot(null);
    setLog([]);
    setLastRotation(null);
    nodeIdCounter = 1;
  }, []);

  const graph = avlRoot ? avlToGraph(avlRoot) : { nodes: [], edges: [] };

  return { avlRoot, graph, log, lastRotation, insert, reset };
}
