import { cloneDeep } from 'lodash';

export const MODES = {
  MANUAL: 'MANUAL',
  AUTO: 'AUTO',
};
export const PLAYER = {
  EKS: {
    name: 'Player 1',
    winningRow: 0,
    abbv: 'EKS',
  },
  OHS: {
    name: 'Player 2',
    winningRow: 18,
    abbv: 'OHS',
  }
};

export const BOARDSTATE = {
  PRESTART: 'PRESTART',
  PLAYING: 'PLAYING',
  WIN: 'WON',
  DRAW: 'DRAW',
};

export const CURRENTMOVE = {
  BALL: 'BALL',
  ADDPLAYER: 'ADDPLAYER',
};

export const tryToMoveBall = (start, end, data) => {
  const newData = cloneDeep(data);
  let isValidMove = true;
  const xPaces = end.x - start.x;
  const yPaces = end.y - start.y;
  const paces = Math.max(Math.abs(xPaces), Math.abs(yPaces));
  if (paces === 0) return; // no movement
  let i = 1;
  let nextX = start.x;
  let nextY = start.y;
  let playersJumped = 0;

  if (Math.abs(xPaces) === Math.abs(yPaces) || xPaces === 0 || yPaces === 0) {
    while (i < paces) {
      nextX += (xPaces/paces);
      nextY += (yPaces/paces);
      const current = newData[nextX][nextY];
      if (!current.player) { // no player present so cannot jump over
        isValidMove = false;
        break;
      } else {
        current.player = false; // remove player
        playersJumped += 1;
      }
      i += 1;
    }
  } else { // some random movement which is not valid
    isValidMove = false;
  }

  return {
    data: newData,
    isValidMove,
    playersJumped,
  };
}

export const findAllFutureBallPos = (currentPos, data) => {
  const allDirections = [
    { j: -1, i: 1 }, //0
    { j: 0, i: 1 }, //1
    { j: 1, i: 1 }, //2
    { j: 1, i: 0 }, // 3
    { j: 1, i: -1 },//4
    { j: 0, i: -1 }, //5
    { j: -1, i: -1 },//6
    { j: -1, i: 0 }, //7
  ];
  const positions = {};
  for (let k = 0; k < allDirections.length; k += 1) {
    let nextRow = currentPos.x;
    let nextCol = currentPos.y;
    let jumps = 0;
    while (1) {
      nextRow += allDirections[k].i;
      nextCol += allDirections[k].j;
      const currentData = data[nextRow] && data[nextRow][nextCol];
      if (currentData && currentData.player) {
        jumps++;
        continue; // If its a player move on to the next
      } else {
        const winningRowEKS = nextRow <= 0;
        const winningRowOHS = nextRow >= data.length - 1;
        if (winningRowEKS || winningRowOHS || (currentData && !currentData.player)) { //If at the edge or out of bounds on top or bottom
          const o = {};
          if (winningRowEKS) { // someone is winning
            o.winning = PLAYER.EKS;
            o.losing = PLAYER.OHS;
          } else if (winningRowOHS) {
            o.winning = PLAYER.OHS;
            o.losing = PLAYER.EKS;
          }
          if(jumps > 0) {
            positions[nextRow] = positions[nextRow] || {};
            positions[nextRow][nextCol] = { jumps, ...o }
          }
        } 
        break; // found solution or not
      }
    }
  }
  return positions;
}

export const getLayout = (gridSize, ball, players) => {
  const data = [];
  for (let i = 0; i < gridSize[0]; i += 1) {
    const row = [];
    for (let j = 0; j < gridSize[1]; j += 1) {
      row.push({
        border: [true, true, true, true],
        playerAllowed: true,
        ballAllowed: true,
        player: players.includes(`${i}-${j}`),
        ball: ball === `${i}-${j}`,
      })
    }
    data.push(row);
  }
  return data;
}

export const findBallPos = (data) => {
  const ballPos = {};
  for (let i = 0; i < data.length; i += 1) {
    for (let j = 0; j < data[0].length; j += 1 ) {
      if (data[i][j].ball) {
        ballPos.x = i;
        ballPos.y = j;
        break;
      }
    }
  }
  
  return ballPos;
}

export const findPlayerPos = (data) => {
  const playerPos = [];
  for (let i = 0; i < data.length; i += 1) {
    for (let j = 0; j < data[0].length; j += 1 ) {
      if (data[i][j].player) {
        playerPos.push({x: i, y: j});
      }
    }
  }
  
  return playerPos;
}

// To check if future position can lead to auto winning
export const checkIfCurrentPlayerCanWin = (futurePos, currentPlayer) => {
  const ifWon = {state: false};
  Object.keys(futurePos).forEach(x => {
    Object.values(futurePos[x]).forEach(v => {
      if (v.winning && v.winning.name === currentPlayer.name) {
        ifWon.state = true;
        ifWon.player = currentPlayer;
      }
    })
  })
  return ifWon;
}

// TO check if current position is end
export const checkIfCurrentWinningPos = (end) => {
  let hasWon = {state: false};
  if (end.x <= 0) {// check manual movement for own goal
    hasWon = {state: true, player: PLAYER.EKS};
  } else if (end.x >= 18) {
    hasWon = {state: true, player: PLAYER.OHS};
  }
  return hasWon;
}


