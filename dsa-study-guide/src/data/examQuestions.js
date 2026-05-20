export const EXAM_QUESTIONS = [
  // L1 - Sorting Basics
  {
    topic: 'L1',
    type: 'Sorting Stability',
    question: 'Which sorting algorithms are STABLE? Which are UNSTABLE?',
    answer: 'STABLE: Bubble Sort, Insertion Sort, Merge Sort.\nUNSTABLE: Selection Sort, Quick Sort.\nA stable sort preserves the relative order of equal elements.'
  },
  {
    topic: 'L1',
    type: 'Bubble Sort',
    question: 'Sort [9, 6, 7, 5, 9, 8] using Bubble Sort. How many passes are needed?',
    answer: 'After Pass 1: [6, 7, 5, 8, 9, 9] — 9 bubbles to end.\nAfter Pass 2: [6, 5, 7, 8, 9, 9].\nAfter Pass 3: [5, 6, 7, 8, 9, 9] — sorted.\n5 passes maximum (N-1), but early termination when no swaps occur.'
  },
  {
    topic: 'L1',
    type: 'Complexity',
    question: 'What is the time complexity of Bubble, Selection, and Insertion Sort?',
    answer: 'All three: O(n²) average and worst case.\nBest case: Bubble Sort O(n) (optimized, no swaps), Insertion Sort O(n) (already sorted), Selection Sort O(n²) always.\nSpace: O(1) all three — in-place.'
  },
  {
    topic: 'L1',
    type: 'Recursion',
    question: 'What are the two required parts of a recursive function?',
    answer: '1. BASE CASE: The condition that stops recursion (e.g., factorial(0) = 1).\n2. RECURSIVE CASE: The function calling itself with a smaller problem.\nWithout a base case, you get infinite recursion / stack overflow.'
  },
  {
    topic: 'L1',
    type: 'In-Place Sorting',
    question: 'What is "in-place" sorting? Give examples.',
    answer: 'In-place sorting rearranges elements within the original data structure using only constant extra memory.\nExamples: Bubble Sort, Selection Sort, Insertion Sort, Heap Sort, Quick Sort.\nNOT in-place: Merge Sort (requires O(n) extra space for temporary arrays).'
  },

  // L2 - Merge Sort
  {
    topic: 'L2',
    type: 'Merge Sort',
    question: 'What are the 3 steps of Merge Sort?',
    answer: '1. DIVIDE: Split array in half recursively until single elements.\n2. CONQUER: Single elements are trivially sorted.\n3. COMBINE: Merge sorted halves back together.\nTime: O(n log n) all cases. Space: O(n) extra.'
  },
  {
    topic: 'L2',
    type: 'Merge Sort Pros/Cons',
    question: 'Name 2 advantages and 2 disadvantages of Merge Sort.',
    answer: 'ADVANTAGES:\n• Stable sort — preserves relative order of equal elements\n• Guaranteed O(n log n) — no worst-case degradation\nDISADVANTAGES:\n• O(n) extra space — not in-place\n• Overhead for small arrays — slower than Insertion Sort on tiny inputs'
  },

  // L3 - Quick Sort
  {
    topic: 'L3',
    type: 'Quick Sort',
    question: 'When does Quick Sort hit O(n²) worst case?',
    answer: 'When the pivot is always the minimum or maximum element — creating unbalanced partitions of size 0 and n-1.\nThis happens with a sorted or reverse-sorted array if you always pick the first/last element.\nFix: Use random pivot or median-of-three pivot selection.'
  },
  {
    topic: 'L3',
    type: 'Quick Sort vs Merge Sort',
    question: 'Quick Sort vs Merge Sort: which is better and why?',
    answer: 'Quick Sort is generally faster in practice:\n• In-place (O(1) extra space vs O(n) for Merge Sort)\n• Better cache performance\n• Average O(n log n)\nMerge Sort is better when:\n• Stability is required\n• Guaranteed O(n log n) needed\n• Sorting linked lists or external files'
  },

  // L4 - Trees
  {
    topic: 'L4',
    type: 'Identify Tree Type',
    question: 'Identify: A tree with nodes A(root)->B,C and B->D,E. C has no children. Is it Full, Complete, Perfect, Balanced?',
    answer: 'FULL: Yes — every node has 0 or 2 children (A:2, B:2, C:0, D:0, E:0).\nCOMPLETE: Yes — all levels full except last, filled left to right.\nPERFECT: No — leaves D, E, C are not all at the same depth.\nBALANCED: Yes — height difference ≤ 1.'
  },
  {
    topic: 'L4',
    type: 'Height/Depth Calculation',
    question: 'Calculate height and depth of each node in: A(root)->B,C; B->D',
    answer: 'Heights (edges to furthest leaf):\n  A=2, B=1, C=0, D=0\nDepths (edges from root):\n  A=0, B=1, C=1, D=2\nNote: Height of tree = Height of root = 2'
  },
  {
    topic: 'L4',
    type: 'Key Properties',
    question: 'What is the maximum number of nodes in a binary tree of height 3?',
    answer: 'Formula: 2^(H+1) - 1\n= 2^(3+1) - 1\n= 2^4 - 1\n= 16 - 1\n= 15 nodes'
  },

  // L5/L6 - BST & Traversals
  {
    topic: 'L5',
    type: 'BST Property',
    question: 'What is the BST ordering property?',
    answer: 'For EVERY node:\n• ALL values in LEFT subtree < node\'s value\n• ALL values in RIGHT subtree > node\'s value\n• This applies RECURSIVELY to all subtrees.\nDuplicate handling varies — most BSTs do not allow duplicates.'
  },
  {
    topic: 'L6',
    type: 'Code Error Spotting',
    question: 'Find the bug:\nif (key < root.key) return search(root.right, key);',
    answer: 'The recursive calls are SWAPPED.\nWhen key < root.key, search should go LEFT (smaller values), not right.\nFix: if (key < root.key) return search(root.LEFT, key);'
  },
  {
    topic: 'L6',
    type: 'Traversal Order',
    question: 'For BST with root 8, left 3 (left 1, right 6), right 10 (right 14 with left 13):\nWrite In-order, Pre-order, Post-order outputs.',
    answer: 'In-order (L→Root→R):  1, 3, 4, 6, 7, 8, 10, 13, 14 ← SORTED!\nPre-order (Root→L→R): 8, 3, 1, 6, 4, 7, 10, 14, 13\nPost-order (L→R→Root): 1, 4, 7, 6, 3, 13, 14, 10, 8'
  },
  {
    topic: 'L6',
    type: 'Key Traversal Fact',
    question: 'CRITICAL: What special property does In-order traversal have for a BST?',
    answer: 'In-order traversal of a VALID BST ALWAYS produces elements in SORTED (ascending) order!\nThis is a fundamental property used in:\n• Verifying if a binary tree is a valid BST\n• Sorting elements using a BST\n• Finding the k-th smallest element'
  },

  // L7 - BST Deletion
  {
    topic: 'L7',
    type: 'Deletion Operation',
    question: 'Delete node 30 from: 50(root), 30(left child with left=20, right=40), 70(right, no children). 40 has right child 60.',
    answer: 'Node 30 has TWO children → Case 3.\n1. Find in-order successor: leftmost of right subtree = 40.\n2. Copy 40\'s value to node 30 (replace 30 with 40).\n3. Delete original node 40 (it has one child: 60 → Case 2, replace 40 with 60).\nResult: 50 → left:40, right:70. 40 → right:60.'
  },
  {
    topic: 'L7',
    type: 'BST Complexity',
    question: 'What is BST time complexity for search/insert/delete in average vs worst case?',
    answer: 'Average case (balanced): O(log n)\nWorst case (skewed/linear): O(n)\nThe skewed case happens when inserting sorted data — tree degrades into a linked list.\nSolution: Use self-balancing trees like AVL or Red-Black trees.'
  },

  // L8/L9 - AVL Trees
  {
    topic: 'L8',
    type: 'Balance Factor',
    question: 'What is the Balance Factor formula? What values indicate an AVL tree is balanced?',
    answer: 'Balance Factor (BF) = height(left subtree) - height(right subtree)\nAVL tree is balanced when BF ∈ {-1, 0, +1} for ALL nodes.\nBF = 0: perfectly balanced node\nBF > 0: left-heavy\nBF < 0: right-heavy\n|BF| > 1: UNBALANCED — rotation needed!'
  },
  {
    topic: 'L8',
    type: 'Rotations',
    question: 'Name the 4 AVL rotation cases and which rotation fixes each.',
    answer: 'LL (Left-Left): Node and left child both left-heavy → Single RIGHT rotation\nRR (Right-Right): Node and right child both right-heavy → Single LEFT rotation\nLR (Left-Right): Node left-heavy, left child right-heavy → Left rotation on child, then Right rotation on node\nRL (Right-Left): Node right-heavy, right child left-heavy → Right rotation on child, then Left rotation on node'
  },
  {
    topic: 'L9',
    type: 'AVL vs BST',
    question: 'Why use AVL trees instead of regular BST?',
    answer: 'Regular BST can degrade to O(n) when data is inserted in sorted order (becomes a linked list).\nAVL trees GUARANTEE O(log n) for search/insert/delete by:\n• Maintaining balance factor ∈ {-1, 0, +1} at every node\n• Automatically performing rotations after insertions/deletions\nTradeoff: Insertion/deletion is slightly slower (rotations) but search is always O(log n).'
  },
  {
    topic: 'L9',
    type: 'AVL Insertion Steps',
    question: 'What are the 5 steps of AVL insertion?',
    answer: '1. Perform normal BST insertion\n2. Update height of ancestor nodes on the path\n3. Compute balance factor for each ancestor\n4. If |BF| > 1: identify rotation case (LL/RR/LR/RL)\n5. Perform rotation(s) to restore balance'
  }
];
