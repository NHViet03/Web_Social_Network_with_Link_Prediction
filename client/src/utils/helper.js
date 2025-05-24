export const arraysEqualIgnoreOrder = (arr1, arr2) => {
     if (arr1.length !== arr2.length) return false;

  const aSorted = [...arr1].sort();
  const bSorted = [...arr2].sort();

  return aSorted.every((val, index) => val === bSorted[index]);
}