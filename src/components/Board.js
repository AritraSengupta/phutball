import React from 'react';
import GridLayout from './GridLayout';

import {
  BOARDSTATE,
  CURRENTMOVE,
  getLayout,
  findBallPos,
  findAllFutureBallPos,
  checkIfCurrentWinningPos,
  checkIfCurrentPlayerCanWin,
} from '../utils';

export default class Board extends React.Component {
  constructor(props) {
    super(props);
    const { config: { gridSize, ballPosStart, playerPos } } = props;
    const layout = getLayout(gridSize, `${ballPosStart.x}-${ballPosStart.y}`, playerPos);
    const futurePos = findAllFutureBallPos(ballPosStart, layout);

    this.state = {
      data: layout,
      futureBallPos: futurePos,
      showSuggestion: false,
    };
    this.onDragOver = this.onDragOver.bind(this);
    this.onDrop = this.onDrop.bind(this);
    this.onDragStart = this.onDragStart.bind(this);
    this.onDragEnd = this.onDragEnd.bind(this);

    this.moveBall = this.moveBall.bind(this);
    this.addPlayer = this.addPlayer.bind(this);
    this.onWin = this.onWin.bind(this);
  }

  onDragStart(e) {
    const row = e.target.getAttribute('row');
    const column = e.target.getAttribute('column');
    e.dataTransfer.setData('row', row);
    e.dataTransfer.setData('column', column);
    this.setState({ showSuggestion: true });
  }

  onDrop(e, row, column) {
    const rowOrigin = e.dataTransfer.getData('row');
    const columnOrigin = e.dataTransfer.getData('column');
    const start = {
      x: Number(rowOrigin),
      y: Number(columnOrigin),
    };
    const end = {
      x: row,
      y: column,
    };
    this.moveBall(start, end);
  }

  onDragOver(e) {
    e.preventDefault();
  }

  onDragEnd(e) {
    this.setState({ showSuggestion: false });
  }

  addPlayer(row, column) {
    const { currentBoardState, switchPlayer, currentMove } = this.props;
    if (currentMove === CURRENTMOVE.BALL) return; // already player has committed to a move
    const { data } = this.state;
    const current = data[row][column];
    const { player, ball } = current;
    if (!player && !ball) {
      current.player = true;
    }
    const futureBallPos = findAllFutureBallPos(findBallPos(data), data);
    this.setState({ data, futureBallPos });

    if (currentBoardState !== BOARDSTATE.PRESTART) {
      switchPlayer();
    }
  }

  moveBall(start, end) {
    const { currentBoardState, currentPlayer, switchPlayer, updateMove } = this.props;
    if (currentBoardState === BOARDSTATE.PRESTART) return;
    const { data } = this.state;
    const startPoint = data[start.x][start.y];
    const endPoint = data[end.x][end.y];
    if (endPoint.ball || endPoint.player || !startPoint.ball) return; // cannot move since either not a ball or since player or ball present


    // try to move the ball and remove the players in between
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
        const current = data[nextX][nextY];
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

    if (!isValidMove || !playersJumped) return;
    // move ball
    startPoint.ball = false;
    endPoint.ball = true;

    // check to see if won
    let hasWon = { state: false };
    // Check automatically
    const futureBallPos = findAllFutureBallPos(end, data);

    hasWon = checkIfCurrentWinningPos(currentPlayer, end); // Check Current
    if (!hasWon) {
      hasWon = checkIfCurrentPlayerCanWin(futureBallPos, currentPlayer); // check if won
    }
    if (hasWon.state) {
      this.onWin(hasWon.player);
    } else { // otherwise continue
      this.setState({ data, futureBallPos });
      if (!futureBallPos || Object.keys(futureBallPos).length === 0) {
        switchPlayer();
      } else {
        updateMove(CURRENTMOVE.BALL);
      }
    }
  }

  onWin(player) {
    const { changeBoardState, addScore, resetBoard } = this.props;
    changeBoardState(BOARDSTATE.WIN);
    addScore(player);
    setTimeout(() => resetBoard(), 1000);
  }

  render() {
    const { currentPlayer, currentBoardState } = this.props;
    const { data, futureBallPos, showSuggestion } = this.state;
    return (
      <div>
        <GridLayout
          data={data}
          futureBallPos={futureBallPos}
          currentPlayer={currentPlayer}
          currentBoardState={currentBoardState}
          showSuggestion={showSuggestion}
          onDragOver={this.onDragOver}
          onDragStart={this.onDragStart}
          onDragEnd={this.onDragEnd}
          onDrop={this.onDrop}
          addPlayer={this.addPlayer}
        />
      </div>
    );
  }
}