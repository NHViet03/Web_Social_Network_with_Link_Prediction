export const arraysEqualIgnoreOrder = (arr1, arr2) => {
     if (arr1.length !== arr2.length) return false;

  const aSorted = [...arr1].sort();
  const bSorted = [...arr2].sort();

  return aSorted.every((val, index) => val === bSorted[index]);
}
export const generateObjectId = () => {
  const timestamp = Math.floor(new Date().getTime() / 1000).toString(16);
  const random = 'xxxxxxxxxxxxxxxx'.replace(/x/g, () =>
    Math.floor(Math.random() * 16).toString(16)
  );
  return (timestamp + random).substring(0, 24);
}

export const checkMapTrue = (id, map) => {
 if (!map) return false;

  // Nếu là Map
  if (typeof map.get === 'function') {
    return map.get(id) === true;
  }

  // Nếu là plain object
  if (typeof map === 'object') {
    return map[id] === true;
  }

  return false;
}
