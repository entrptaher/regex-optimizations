function getArrayRepeatations(arr, { duplicateInRow } = {}) {
  const counts = {};  

  function createNonExist(x, n = 0) {
    if (!counts[x]) counts[x] = [n];
  }

  function increaseCount(x) {
    ++counts[x][counts[x].length - 1];
  }
  function lastLength(x) {
    return counts[x][counts[x].length - 1];
  }

  function duplicateCheck(arr, x, i) {
    if (duplicateInRow) {
      const prevSame = arr[i - 1] && arr[i - 1] == arr[i];
      if (!prevSame) {
        const last = lastLength(x);
        if (last === 0) increaseCount(x);
        if (last > 1) {
          counts[x].push(1);
        }
      }
      return prevSame;
    }
    return true;
  }

  arr.forEach((x, i) => {
    createNonExist(x);
    if (duplicateCheck(arr, x, i)) {
      increaseCount(x);
    }
  });

  return counts;
}
module.exports = getArrayRepeatations;
