// Each step: { array, highlights: {index: colorKey}, description, pointers: [{name, index}] }
// colorKey: 'comparing' | 'swapping' | 'sorted' | 'pivot' | 'min' | 'inserting' | 'shifted'

export function generateBubbleSortSteps(inputArray) {
  const steps = [];
  const arr = [...inputArray];
  const n = arr.length;
  let sortedFrom = n;

  for (let pass = 0; pass < n - 1; pass++) {
    let swapped = false;
    sortedFrom = n - pass;

    steps.push({
      array: [...arr],
      highlights: Object.fromEntries([...Array(n - pass)].map((_, i) => [i, 'default'])),
      description: `Pass ${pass + 1}: Comparing adjacent elements and bubbling the largest to position ${n - pass - 1}.`,
      pointers: [],
      sortedFrom,
    });

    for (let j = 0; j < n - pass - 1; j++) {
      // Highlight comparison
      steps.push({
        array: [...arr],
        highlights: { [j]: 'comparing', [j + 1]: 'comparing', ...Object.fromEntries([...Array(pass)].map((_, i) => [n - 1 - i, 'sorted'])) },
        description: `Comparing arr[${j}]=${arr[j]} and arr[${j + 1}]=${arr[j + 1]}. ${arr[j] > arr[j + 1] ? 'Swap needed!' : 'No swap needed.'}`,
        pointers: [{ name: 'j', index: j }, { name: 'j+1', index: j + 1 }],
        sortedFrom,
      });

      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swapped = true;
        steps.push({
          array: [...arr],
          highlights: { [j]: 'swapping', [j + 1]: 'swapping', ...Object.fromEntries([...Array(pass)].map((_, i) => [n - 1 - i, 'sorted'])) },
          description: `Swapped! arr[${j}]=${arr[j]} and arr[${j + 1}]=${arr[j + 1]} after swap.`,
          pointers: [{ name: 'j', index: j }, { name: 'j+1', index: j + 1 }],
          sortedFrom,
        });
      }
    }

    // Mark new sorted element
    steps.push({
      array: [...arr],
      highlights: { ...Object.fromEntries([...Array(pass + 1)].map((_, i) => [n - 1 - i, 'sorted'])), [n - pass - 1]: 'sorted' },
      description: `Pass ${pass + 1} complete! Element ${arr[n - pass - 1]} is now in its correct position.`,
      pointers: [],
      sortedFrom: n - pass - 1,
    });

    if (!swapped) {
      steps.push({
        array: [...arr],
        highlights: Object.fromEntries([...Array(n)].map((_, i) => [i, 'sorted'])),
        description: `No swaps in this pass — array is already sorted! Early termination.`,
        pointers: [],
        sortedFrom: 0,
      });
      break;
    }
  }

  steps.push({
    array: [...arr],
    highlights: Object.fromEntries([...Array(n)].map((_, i) => [i, 'sorted'])),
    description: 'Sorting complete! All elements are in ascending order.',
    pointers: [],
    sortedFrom: 0,
  });

  return steps;
}

export function generateSelectionSortSteps(inputArray) {
  const steps = [];
  const arr = [...inputArray];
  const n = arr.length;

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;

    steps.push({
      array: [...arr],
      highlights: { [i]: 'min', ...Object.fromEntries([...Array(i)].map((_, k) => [k, 'sorted'])) },
      description: `Pass ${i + 1}: Finding minimum in arr[${i}..${n - 1}]. Starting with min = arr[${i}] = ${arr[i]}.`,
      pointers: [{ name: 'i', index: i }, { name: 'min', index: minIdx }],
      sortedFrom: i,
    });

    for (let j = i + 1; j < n; j++) {
      steps.push({
        array: [...arr],
        highlights: { [minIdx]: 'min', [j]: 'comparing', ...Object.fromEntries([...Array(i)].map((_, k) => [k, 'sorted'])) },
        description: `Comparing arr[${j}]=${arr[j]} with current min arr[${minIdx}]=${arr[minIdx]}. ${arr[j] < arr[minIdx] ? `New min found! ${arr[j]} < ${arr[minIdx]}` : `${arr[j]} >= ${arr[minIdx]}, no change.`}`,
        pointers: [{ name: 'i', index: i }, { name: 'min', index: minIdx }, { name: 'j', index: j }],
        sortedFrom: i,
      });

      if (arr[j] < arr[minIdx]) {
        minIdx = j;
      }
    }

    if (minIdx !== i) {
      steps.push({
        array: [...arr],
        highlights: { [i]: 'swapping', [minIdx]: 'swapping', ...Object.fromEntries([...Array(i)].map((_, k) => [k, 'sorted'])) },
        description: `Swapping arr[${i}]=${arr[i]} with minimum arr[${minIdx}]=${arr[minIdx]}.`,
        pointers: [{ name: 'i', index: i }, { name: 'min', index: minIdx }],
        sortedFrom: i,
      });
      [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
    }

    steps.push({
      array: [...arr],
      highlights: { ...Object.fromEntries([...Array(i + 1)].map((_, k) => [k, 'sorted'])) },
      description: `${arr[i]} placed in sorted position ${i}. Sorted portion grows!`,
      pointers: [],
      sortedFrom: i + 1,
    });
  }

  steps.push({
    array: [...arr],
    highlights: Object.fromEntries([...Array(n)].map((_, i) => [i, 'sorted'])),
    description: 'Sorting complete! All elements are in ascending order.',
    pointers: [],
    sortedFrom: 0,
  });

  return steps;
}

export function generateInsertionSortSteps(inputArray) {
  const steps = [];
  const arr = [...inputArray];
  const n = arr.length;

  steps.push({
    array: [...arr],
    highlights: { 0: 'sorted' },
    description: 'Insertion Sort: First element is trivially sorted.',
    pointers: [],
    sortedFrom: 0,
  });

  for (let i = 1; i < n; i++) {
    const key = arr[i];
    let j = i - 1;

    steps.push({
      array: [...arr],
      highlights: { [i]: 'inserting', ...Object.fromEntries([...Array(i)].map((_, k) => [k, 'sorted'])) },
      description: `Picking key = arr[${i}] = ${key}. Will insert into sorted portion [0..${i - 1}].`,
      pointers: [{ name: 'key', index: i }],
      sortedFrom: 0,
    });

    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];

      steps.push({
        array: [...arr],
        highlights: { [j]: 'comparing', [j + 1]: 'shifted', ...Object.fromEntries([...Array(i)].map((_, k) => [k, 'sorted'])) },
        description: `arr[${j}]=${arr[j]} > key=${key}, shift arr[${j}] one position right.`,
        pointers: [{ name: 'j', index: j }, { name: 'key→', index: j + 1 }],
        sortedFrom: 0,
      });

      j--;
    }

    arr[j + 1] = key;

    steps.push({
      array: [...arr],
      highlights: { [j + 1]: 'inserting', ...Object.fromEntries([...Array(i + 1)].map((_, k) => [k, 'sorted'])) },
      description: `Insert key=${key} at position ${j + 1}. Sorted portion now has ${i + 1} elements.`,
      pointers: [],
      sortedFrom: 0,
    });
  }

  steps.push({
    array: [...arr],
    highlights: Object.fromEntries([...Array(n)].map((_, i) => [i, 'sorted'])),
    description: 'Sorting complete! All elements are in ascending order.',
    pointers: [],
    sortedFrom: 0,
  });

  return steps;
}

export function generateMergeSortSteps(inputArray) {
  const steps = [];
  const arr = [...inputArray];

  function mergeSort(subArr, offset) {
    if (subArr.length <= 1) {
      steps.push({
        array: [...arr],
        highlights: { [offset]: 'sorted' },
        description: `Base case: subarray [${subArr}] at index ${offset} has 1 element — already sorted.`,
        pointers: [],
        phase: 'divide',
        subArrays: [{ start: offset, end: offset, values: [...subArr] }],
      });
      return subArr;
    }

    const mid = Math.floor(subArr.length / 2);
    const left = subArr.slice(0, mid);
    const right = subArr.slice(mid);

    steps.push({
      array: [...arr],
      highlights: {
        ...Object.fromEntries(subArr.map((_, i) => [offset + i, 'comparing'])),
      },
      description: `Dividing [${subArr.join(', ')}] into [${left.join(', ')}] and [${right.join(', ')}].`,
      pointers: [],
      phase: 'divide',
      subArrays: [
        { start: offset, end: offset + mid - 1, values: [...left], label: 'left' },
        { start: offset + mid, end: offset + subArr.length - 1, values: [...right], label: 'right' },
      ],
    });

    const sortedLeft = mergeSort(left, offset);
    const sortedRight = mergeSort(right, offset + mid);

    // Merge
    const merged = [];
    let li = 0, ri = 0;

    while (li < sortedLeft.length && ri < sortedRight.length) {
      steps.push({
        array: [...arr],
        highlights: {
          [offset + li]: 'min',
          [offset + mid + ri]: 'comparing',
        },
        description: `Merging: Comparing ${sortedLeft[li]} (left[${li}]) vs ${sortedRight[ri]} (right[${ri}]).`,
        pointers: [{ name: 'L', index: offset + li }, { name: 'R', index: offset + mid + ri }],
        phase: 'merge',
      });

      if (sortedLeft[li] <= sortedRight[ri]) {
        merged.push(sortedLeft[li]);
        arr[offset + merged.length - 1] = sortedLeft[li];
        li++;
      } else {
        merged.push(sortedRight[ri]);
        arr[offset + merged.length - 1] = sortedRight[ri];
        ri++;
      }
    }

    while (li < sortedLeft.length) {
      merged.push(sortedLeft[li]);
      arr[offset + merged.length - 1] = sortedLeft[li];
      li++;
    }
    while (ri < sortedRight.length) {
      merged.push(sortedRight[ri]);
      arr[offset + merged.length - 1] = sortedRight[ri];
      ri++;
    }

    steps.push({
      array: [...arr],
      highlights: Object.fromEntries(merged.map((_, i) => [offset + i, 'sorted'])),
      description: `Merged into [${merged.join(', ')}] at positions [${offset}..${offset + merged.length - 1}].`,
      pointers: [],
      phase: 'merge',
    });

    return merged;
  }

  mergeSort(arr, 0);

  steps.push({
    array: [...arr],
    highlights: Object.fromEntries([...Array(arr.length)].map((_, i) => [i, 'sorted'])),
    description: 'Merge Sort complete! Array is fully sorted.',
    pointers: [],
    phase: 'done',
  });

  return steps;
}

export function generateQuickSortSteps(inputArray, pivotStrategy = 'last') {
  const steps = [];
  const arr = [...inputArray];

  function getPivotIndex(low, high) {
    if (pivotStrategy === 'first') return low;
    if (pivotStrategy === 'middle') return Math.floor((low + high) / 2);
    if (pivotStrategy === 'median') {
      const mid = Math.floor((low + high) / 2);
      const vals = [[arr[low], low], [arr[mid], mid], [arr[high], high]];
      vals.sort((a, b) => a[0] - b[0]);
      return vals[1][1];
    }
    return high; // last (default)
  }

  function partition(low, high) {
    const pivotIdx = getPivotIndex(low, high);
    // Move pivot to end
    [arr[pivotIdx], arr[high]] = [arr[high], arr[pivotIdx]];
    const pivot = arr[high];

    steps.push({
      array: [...arr],
      highlights: { [high]: 'pivot' },
      description: `Pivot selected: ${pivot} (moved to position ${high}).`,
      pointers: [{ name: 'pivot', index: high }],
      range: { low, high },
    });

    let i = low - 1;

    for (let j = low; j < high; j++) {
      steps.push({
        array: [...arr],
        highlights: { [high]: 'pivot', [j]: 'comparing', ...(i >= low ? { [i]: 'min' } : {}) },
        description: `Comparing arr[${j}]=${arr[j]} with pivot=${pivot}. ${arr[j] <= pivot ? `${arr[j]} ≤ pivot, swap to left partition.` : `${arr[j]} > pivot, stays right.`}`,
        pointers: [{ name: 'pivot', index: high }, { name: 'j', index: j }, ...(i >= low ? [{ name: 'i', index: i }] : [])],
        range: { low, high },
      });

      if (arr[j] <= pivot) {
        i++;
        if (i !== j) {
          [arr[i], arr[j]] = [arr[j], arr[i]];
          steps.push({
            array: [...arr],
            highlights: { [high]: 'pivot', [i]: 'swapping', [j]: 'swapping' },
            description: `Swap arr[${i}]=${arr[i]} and arr[${j}]=${arr[j]}.`,
            pointers: [{ name: 'pivot', index: high }, { name: 'i', index: i }, { name: 'j', index: j }],
            range: { low, high },
          });
        }
      }
    }

    // Place pivot in correct position
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];

    steps.push({
      array: [...arr],
      highlights: { [i + 1]: 'sorted' },
      description: `Pivot ${pivot} placed in final position ${i + 1}. Elements left: ≤ pivot. Elements right: > pivot.`,
      pointers: [{ name: 'pivot', index: i + 1 }],
      range: { low, high },
    });

    return i + 1;
  }

  function quickSort(low, high) {
    if (low < high) {
      const pivotPos = partition(low, high);
      quickSort(low, pivotPos - 1);
      quickSort(pivotPos + 1, high);
    } else if (low === high) {
      steps.push({
        array: [...arr],
        highlights: { [low]: 'sorted' },
        description: `Single element arr[${low}]=${arr[low]} is in its correct sorted position.`,
        pointers: [],
        range: { low, high },
      });
    }
  }

  quickSort(0, arr.length - 1);

  steps.push({
    array: [...arr],
    highlights: Object.fromEntries([...Array(arr.length)].map((_, i) => [i, 'sorted'])),
    description: 'Quick Sort complete! Array is fully sorted.',
    pointers: [],
    range: { low: 0, high: arr.length - 1 },
  });

  return steps;
}
