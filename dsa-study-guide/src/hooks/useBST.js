import { useState, useCallback } from 'react';
import { BST_INITIAL } from '../data/treeData';

export function insertIntoBST(root, value) {
  if (!root) return { id: value, left: null, right: null };
  if (value < root.id) return { ...root, left: insertIntoBST(root.left, value) };
  if (value > root.id) return { ...root, right: insertIntoBST(root.right, value) };
  return root;
}

export function deleteFromBST(root, value) {
  if (!root) return null;
  if (value < root.id) return { ...root, left: deleteFromBST(root.left, value) };
  if (value > root.id) return { ...root, right: deleteFromBST(root.right, value) };

  // Found node
  if (!root.left) return root.right;
  if (!root.right) return root.left;

  // Two children — find in-order successor (min of right subtree)
  let successor = root.right;
  while (successor.left) successor = successor.left;

  return {
    ...root,
    id: successor.id,
    right: deleteFromBST(root.right, successor.id),
  };
}

export function treeToGraph(node, x = 50, y = 12, hOffset = 22, nodes = [], edges = []) {
  if (!node) return { nodes, edges };
  nodes.push({ id: String(node.id), x, y });
  if (node.left) {
    edges.push([String(node.id), String(node.left.id)]);
    treeToGraph(node.left, x - hOffset, y + 20, hOffset / 1.6, nodes, edges);
  }
  if (node.right) {
    edges.push([String(node.id), String(node.right.id)]);
    treeToGraph(node.right, x + hOffset, y + 20, hOffset / 1.6, nodes, edges);
  }
  return { nodes, edges };
}

export function useBST() {
  const [bstRoot, setBstRoot] = useState(BST_INITIAL);
  const [highlightPath, setHighlightPath] = useState([]);
  const [activeNode, setActiveNode] = useState(null);
  const [animating, setAnimating] = useState(false);
  const [feedback, setFeedback] = useState('Enter a number to search, insert, or delete.');
  const [deleteCase, setDeleteCase] = useState(null);

  const delay = ms => new Promise(r => setTimeout(r, ms));

  const animatePath = useCallback(async (root, value, action) => {
    setAnimating(true);
    setHighlightPath([]);
    setActiveNode(null);
    setDeleteCase(null);

    let current = root;
    const path = [];

    while (current) {
      path.push(String(current.id));
      setHighlightPath([...path]);
      setActiveNode(String(current.id));
      setFeedback(`Visiting node ${current.id}... ${value < current.id ? 'Go LEFT (value is smaller)' : value > current.id ? 'Go RIGHT (value is larger)' : 'FOUND!'}`);

      await delay(600);

      if (current.id === value) {
        if (action === 'search') {
          setFeedback(`✓ Found ${value}!`);
        } else if (action === 'insert') {
          setFeedback(`Value ${value} already exists in the tree.`);
        } else if (action === 'delete') {
          // Determine case
          const hasLeft = !!current.left;
          const hasRight = !!current.right;
          let caseNum = 1;
          let caseDesc = '';
          if (!hasLeft && !hasRight) {
            caseNum = 1; caseDesc = 'Leaf node — simply remove it.';
          } else if (!hasLeft || !hasRight) {
            caseNum = 2; caseDesc = 'One child — replace with its child.';
          } else {
            caseNum = 3;
            let succ = current.right;
            while (succ.left) succ = succ.left;
            caseDesc = `Two children — replace with in-order successor (${succ.id}), then delete ${succ.id}.`;
          }
          setDeleteCase(caseNum);
          setFeedback(`Found ${value}! Case ${caseNum}: ${caseDesc}`);
          await delay(800);
          setBstRoot(prev => deleteFromBST(prev, value));
          setFeedback(`✓ Deleted ${value}.`);
        }
        setAnimating(false);
        return;
      }

      if (value < current.id) {
        if (!current.left) {
          if (action === 'insert') break;
          setFeedback(`${value} not found in tree.`);
          setActiveNode(null);
          setAnimating(false);
          return;
        }
        current = current.left;
      } else {
        if (!current.right) {
          if (action === 'insert') break;
          setFeedback(`${value} not found in tree.`);
          setActiveNode(null);
          setAnimating(false);
          return;
        }
        current = current.right;
      }
    }

    if (action === 'insert') {
      setFeedback(`Found position! Inserting ${value}...`);
      await delay(400);
      setBstRoot(prev => insertIntoBST(prev, value));
      setHighlightPath(p => [...p, String(value)]);
      setActiveNode(String(value));
      setFeedback(`✓ Inserted ${value} successfully!`);
    }

    setAnimating(false);
  }, []);

  const search = useCallback((val) => {
    setFeedback(`Searching for ${val}...`);
    animatePath(bstRoot, val, 'search');
  }, [bstRoot, animatePath]);

  const insert = useCallback((val) => {
    setFeedback(`Inserting ${val}...`);
    animatePath(bstRoot, val, 'insert');
  }, [bstRoot, animatePath]);

  const deleteFn = useCallback((val) => {
    setFeedback(`Deleting ${val}...`);
    animatePath(bstRoot, val, 'delete');
  }, [bstRoot, animatePath]);

  const reset = useCallback(() => {
    setBstRoot(BST_INITIAL);
    setHighlightPath([]);
    setActiveNode(null);
    setFeedback('Tree reset to default.');
    setDeleteCase(null);
  }, []);

  return { bstRoot, highlightPath, activeNode, animating, feedback, deleteCase, search, insert, delete: deleteFn, reset };
}
