export const CODE = {
  // Sorting
  bubbleSort: `// Bubble Sort - O(n²) time, O(1) space
public static void bubbleSort(int[] arr) {
    int n = arr.length;
    for (int pass = 0; pass < n - 1; pass++) {
        boolean swapped = false; // Optimization flag
        for (int j = 0; j < n - pass - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                // Swap arr[j] and arr[j+1]
                int temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
                swapped = true;
            }
        }
        // If no swaps occurred, array is sorted
        if (!swapped) break;
    }
}`,

  selectionSort: `// Selection Sort - O(n²) time, O(1) space
public static void selectionSort(int[] arr) {
    int n = arr.length;
    for (int i = 0; i < n - 1; i++) {
        // Find minimum in arr[i..n-1]
        int minIdx = i;
        for (int j = i + 1; j < n; j++) {
            if (arr[j] < arr[minIdx]) {
                minIdx = j;
            }
        }
        // Swap minimum with first unsorted element
        int temp = arr[minIdx];
        arr[minIdx] = arr[i];
        arr[i] = temp;
    }
}`,

  insertionSort: `// Insertion Sort - O(n²) time, O(1) space
// Best case: O(n) when already sorted
public static void insertionSort(int[] arr) {
    int n = arr.length;
    for (int i = 1; i < n; i++) {
        int key = arr[i]; // Element to insert
        int j = i - 1;

        // Shift elements greater than key to the right
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = key; // Place key in correct position
    }
}`,

  mergeSort: `// Merge Sort - O(n log n) time, O(n) space
public static void mergeSort(int[] arr, int left, int right) {
    if (left < right) {
        int mid = (left + right) / 2;
        mergeSort(arr, left, mid);       // Sort left half
        mergeSort(arr, mid + 1, right);  // Sort right half
        merge(arr, left, mid, right);    // Merge sorted halves
    }
}

private static void merge(int[] arr, int left, int mid, int right) {
    int n1 = mid - left + 1;
    int n2 = right - mid;

    // Create temp arrays
    int[] L = new int[n1];
    int[] R = new int[n2];
    System.arraycopy(arr, left, L, 0, n1);
    System.arraycopy(arr, mid + 1, R, 0, n2);

    int i = 0, j = 0, k = left;
    while (i < n1 && j < n2) {
        if (L[i] <= R[j]) arr[k++] = L[i++];
        else               arr[k++] = R[j++];
    }
    while (i < n1) arr[k++] = L[i++];
    while (j < n2) arr[k++] = R[j++];
}`,

  quickSort: `// Quick Sort - O(n log n) avg, O(n²) worst, O(1) space
public static void quickSort(int[] arr, int low, int high) {
    if (low < high) {
        int pivotPos = partition(arr, low, high);
        quickSort(arr, low, pivotPos - 1);
        quickSort(arr, pivotPos + 1, high);
    }
}

private static int partition(int[] arr, int low, int high) {
    int pivot = arr[high]; // Last element as pivot
    int i = low - 1;       // Index of smaller element

    for (int j = low; j < high; j++) {
        if (arr[j] <= pivot) {
            i++;
            // Swap arr[i] and arr[j]
            int temp = arr[i];
            arr[i] = arr[j];
            arr[j] = temp;
        }
    }
    // Place pivot in correct position
    int temp = arr[i + 1];
    arr[i + 1] = arr[high];
    arr[high] = temp;
    return i + 1;
}`,

  // BST
  bstNode: `class TreeNode {
    int key;           // or 'data' or 'value'
    TreeNode left;     // reference to left child
    TreeNode right;    // reference to right child

    // Constructor
    TreeNode(int key) {
        this.key = key;
        this.left = null;
        this.right = null;
    }
}

class BinarySearchTree {
    TreeNode root;

    // Constructor
    public BinarySearchTree() {
        this.root = null;
    }
}`,

  bstSearch: `// Recursive search - O(h) time, h = height
public TreeNode search(int key) {
    return searchRec(root, key);
}

private TreeNode searchRec(TreeNode root, int key) {
    // Base cases: null or found
    if (root == null || root.key == key) {
        return root;
    }

    // Key is smaller -> go left
    if (key < root.key) {
        return searchRec(root.left, key);
    }

    // Key is larger -> go right
    return searchRec(root.right, key);
}

// Iterative search (saves stack space)
public TreeNode searchIterative(int key) {
    TreeNode current = root;
    while (current != null && current.key != key) {
        current = (key < current.key)
                  ? current.left
                  : current.right;
    }
    return current; // null if not found
}`,

  bstInsert: `// Recursive insert - always inserts at leaf
public void insert(int key) {
    root = insertRec(root, key);
}

private TreeNode insertRec(TreeNode root, int key) {
    // Base case: empty spot found, create node
    if (root == null) {
        return new TreeNode(key);
    }

    // Recursive case: traverse to find position
    if (key < root.key) {
        root.left = insertRec(root.left, key);
    } else if (key > root.key) {
        root.right = insertRec(root.right, key);
    }
    // key == root.key: no duplicates, do nothing

    return root;
}`,

  bstDelete: `public void delete(int key) {
    root = deleteRec(root, key);
}

private TreeNode deleteRec(TreeNode root, int key) {
    if (root == null) return null;

    if (key < root.key) {
        root.left = deleteRec(root.left, key);
    } else if (key > root.key) {
        root.right = deleteRec(root.right, key);
    } else {
        // Found the node to delete

        // Case 1: Leaf node (no children)
        // Case 2: One child — return the non-null child
        if (root.left == null)  return root.right;
        if (root.right == null) return root.left;

        // Case 3: Two children
        // Find in-order successor (min of right subtree)
        TreeNode successor = findMin(root.right);

        // Copy successor value to current node
        root.key = successor.key;

        // Delete the successor from right subtree
        root.right = deleteRec(root.right, successor.key);
    }
    return root;
}

private TreeNode findMin(TreeNode root) {
    while (root.left != null) root = root.left;
    return root;
}`,

  bstTraversals: `// Pre-order: Root → Left → Right
private void preOrder(TreeNode root) {
    if (root != null) {
        System.out.print(root.key + " "); // Visit Root
        preOrder(root.left);               // Traverse Left
        preOrder(root.right);              // Traverse Right
    }
}

// In-order: Left → Root → Right (gives SORTED output for BST!)
private void inOrder(TreeNode root) {
    if (root != null) {
        inOrder(root.left);                // Traverse Left
        System.out.print(root.key + " "); // Visit Root
        inOrder(root.right);               // Traverse Right
    }
}

// Post-order: Left → Right → Root
private void postOrder(TreeNode root) {
    if (root != null) {
        postOrder(root.left);              // Traverse Left
        postOrder(root.right);             // Traverse Right
        System.out.print(root.key + " "); // Visit Root
    }
}

// Level-order: BFS using Queue
public void levelOrder() {
    if (root == null) return;
    Queue<TreeNode> queue = new LinkedList<>();
    queue.add(root);
    while (!queue.isEmpty()) {
        TreeNode node = queue.poll();
        System.out.print(node.key + " ");
        if (node.left  != null) queue.add(node.left);
        if (node.right != null) queue.add(node.right);
    }
}`,

  // AVL
  avlNode: `class AVLNode {
    int key;
    int height;        // Height of this node's subtree
    AVLNode left;
    AVLNode right;

    AVLNode(int key) {
        this.key = key;
        this.height = 1; // New node has height 1
        this.left = null;
        this.right = null;
    }
}

// Helper: get height (handles null)
int height(AVLNode node) {
    return (node == null) ? 0 : node.height;
}

// Helper: get balance factor
int getBalance(AVLNode node) {
    if (node == null) return 0;
    return height(node.left) - height(node.right);
}`,

  avlRotations: `// Right Rotation (fixes LL imbalance)
AVLNode rightRotate(AVLNode y) {
    AVLNode x = y.left;
    AVLNode T2 = x.right;

    x.right = y;  // Perform rotation
    y.left = T2;

    // Update heights (y first, then x)
    y.height = Math.max(height(y.left), height(y.right)) + 1;
    x.height = Math.max(height(x.left), height(x.right)) + 1;

    return x; // New root
}

// Left Rotation (fixes RR imbalance)
AVLNode leftRotate(AVLNode x) {
    AVLNode y = x.right;
    AVLNode T2 = y.left;

    y.left = x;   // Perform rotation
    x.right = T2;

    // Update heights (x first, then y)
    x.height = Math.max(height(x.left), height(x.right)) + 1;
    y.height = Math.max(height(y.left), height(y.right)) + 1;

    return y; // New root
}`,

  avlInsert: `AVLNode insert(AVLNode node, int key) {
    // Step 1: Standard BST insertion
    if (node == null) return new AVLNode(key);

    if (key < node.key)
        node.left = insert(node.left, key);
    else if (key > node.key)
        node.right = insert(node.right, key);
    else return node; // Duplicate — not allowed

    // Step 2: Update height
    node.height = Math.max(height(node.left),
                            height(node.right)) + 1;

    // Step 3: Get balance factor
    int balance = getBalance(node);

    // Step 4: Perform rotation if unbalanced

    // LL Case: Left-Left → Right Rotation
    if (balance > 1 && key < node.left.key)
        return rightRotate(node);

    // RR Case: Right-Right → Left Rotation
    if (balance < -1 && key > node.right.key)
        return leftRotate(node);

    // LR Case: Left-Right → Left then Right Rotation
    if (balance > 1 && key > node.left.key) {
        node.left = leftRotate(node.left);
        return rightRotate(node);
    }

    // RL Case: Right-Left → Right then Left Rotation
    if (balance < -1 && key < node.right.key) {
        node.right = rightRotate(node.right);
        return leftRotate(node);
    }

    return node; // No imbalance
}`,
};
