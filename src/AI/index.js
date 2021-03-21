// This section will try to take advantage of utils functions created and come up with strategies
import { findAllFutureBallPos, tryToMoveBall } from "../utils";

export function findAllAIPaths(start, data) {
  const visited = {};
  function findPath(currPos, curData, currPath) {
    if (visited[currPos.x] && visited[currPos.x][currPos.y]) {
      return []; // no need to take this path as it has already been accounted for;
    } else {
      visited[currPos.x] = visited[currPos.x] || {};
      visited[currPos.x][currPos.y] = true; // set as true
    }

    if (currPos.x <= 0 || currPos.x >= 18) {// We have crossed the boundary return
      return currPath;
    }
    const positions = findAllFutureBallPos(currPos, curData);
    const result = [];

    const rowArray = Object.keys(positions);
    if (rowArray.length > 0) { // there are valid positions to go to
      for (let i = 0; i < rowArray.length; i += 1) {
        const key = rowArray[i];
        const cells = positions[key];
        const cellArray = Object.keys(cells);
        for (let j = 0; j < cellArray.length; j += 1) {
          const newCursor = { x: Number(key), y: Number(cellArray[j]) };
          const { data, isValidMove } = tryToMoveBall(currPos, newCursor, curData);

          if (!isValidMove) return currPath; // Will most likely not occur since all paths are valid
          const newPath = [...currPath, newCursor]; // add new valid cursor to the path
          const path = findPath(newCursor, data, newPath);
          path.length && result.push(path); // add only if there is some movement
        }
      }
    } else { // no more places to go to
      return currPath;
    }

    return result;
  }

  const finalPaths = findPath(start, data, []);
  return finalPaths;
}

export function findGlobalOptimalPath(paths, currentPlayer, initPos) {
  // Using stacks for dfs so that breaks can be used effectively
  const stack = [paths];
  let globalDistance = Math.abs(currentPlayer.winningRow - initPos.x);
  let globalPath = [];
  let globalPos = initPos;
  while(stack.length) {
    const top = stack.pop();
    if (!Array.isArray(top[0])) { // found a sequence
      const {
        finalArray,
        finalPos,
        winning,
        finalDistance,
      } = findLocalOptima(top, initPos, currentPlayer);
      if (finalDistance < globalDistance) {
        globalPath = finalArray;
        globalPos = finalPos;
        globalDistance = finalDistance;
      }
      if (winning) { // Found winning combo, break and finish game
        break;
      }
    } else {
      for (let i = 0; i < top.length; i += 1) {
        stack.push(top[i]);
      }
    }
  }

  return {
    globalDistance,
    globalPath,
    globalPos,
  };
}

function findLocalOptima(path, pos, currentPlayer) {
  let finalArray = [];
  let finalPos = pos;
  let winning = false;
  let finalDistance = Math.abs(currentPlayer.winningRow - pos.x);
  for (let i = 0; i < path.length; i += 1) {
    if (currentPlayer.winningRow === 0 && path[i].x <= 0) {
      // Winning combo found
      finalArray = path.slice(0, i + 1);
      finalPos = path[i];
      winning = true;
      finalDistance = 0;
      break;
    } else if (currentPlayer.winningRow > 0 && path[i].x >= currentPlayer.winningRow) {
      // Winning combo found
      finalArray = path.slice(0, i + 1);
      finalPos = path[i];
      winning = true;
      finalDistance = 0;
      break;
    } else { // Keep seeing the distance from the goal, if decreases then keep a record
      const distance = Math.abs(currentPlayer.winningRow - path[i].x);
      if (distance < finalDistance) {
        finalDistance = distance;
        finalPos = path[i];
        finalArray = path;
      }
    }
  }
  return {
    finalArray,
    finalPos,
    winning,
    finalDistance,
  };
}

export function findPlayerPos(currPos, currentPlayer, data) {
  let distance = Infinity;
  let position = { x: 0, y: 0 };
  for (let i = data.length - 1; i >= 0; i -= 1) {
    for (let j = data[0].length - 1; j >= 0; j -= 1) {
      const currData = data[i][j];
      if (!currData.player && !currData.ball) {
        const curDistance = Math.abs(i - currPos.x) + Math.abs(j - currPos.y);
        if (curDistance < distance) {
          distance = curDistance;
          position.x = i;
          position.y = j;
        }
      }
    }
  }
  return position;
}