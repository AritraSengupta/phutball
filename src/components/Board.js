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
  tryToMoveBall,
  PLAYER,
} from '../utils';

import { findAllAIPaths, findGlobalOptimalPath, findPlayerPos } from '../AI';

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
      loading: false,
      ballPosStart: props.config.ballPosStart,
    };
    this.updateInProgress = false;
    this.onDragOver = this.onDragOver.bind(this);
    this.onDrop = this.onDrop.bind(this);
    this.onDragStart = this.onDragStart.bind(this);
    this.onDragEnd = this.onDragEnd.bind(this);
    this.resetBoardState = this.resetBoardState.bind(this);
    this.moveBall = this.moveBall.bind(this);
    this.addPlayer = this.addPlayer.bind(this);
    this.onWin = this.onWin.bind(this);
    this.makeBotMove = this.makeBotMove.bind(this);
    this.animateMovement = this.animateMovement.bind(this);
  }

  static getDerivedStateFromProps(props) {
    const { config: { ballPosStart } } = props;
    return {
      ballPosStart,
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { currentPlayer: prevPlayer, currentBoardState: prevBoardState } = prevProps;
    const { currentPlayer, currentBoardState, isManual, bot } = this.props;
    const { loading, ballPosStart } = this.state;
    const { ballPosStart: prevballPosStart } = prevState;

    if (prevballPosStart.x !== ballPosStart.x
      || (prevBoardState !== currentBoardState && currentBoardState === BOARDSTATE.PRESTART)) { // config changed just update board and reset
      this.resetBoardState();
      return;
    }
    // onWin this is called again especially if player changes
    // therefore to compensate we make sure that if board is prestart don't update score
    if (currentBoardState === BOARDSTATE.PRESTART) {
      return;
    }

    if (prevPlayer.name !== currentPlayer.name
      && currentPlayer.name === bot.name
      && isManual === false
      && loading === false
    ) {
      this.makeBotMove();
    } else if (prevPlayer.name !== currentPlayer.name // Player name has changed
      || (prevBoardState !== currentBoardState && currentBoardState === BOARDSTATE.PLAYING)) { // Board state has gone from something to playing
      const { futureBallPos } = this.state;
      const hasWon = checkIfCurrentPlayerCanWin(futureBallPos, currentPlayer);
      if (hasWon.state) {
        this.onWin(hasWon.player);
      }
    }
  }

  async makeBotMove() {
    this.setState({ loading: true });
    const { data } = this.state;
    this.updateInProgress = true;
    const { currentPlayer, switchPlayer, disableButtons } = this.props;
    disableButtons(true); // Disable all the control buttons while the movement is occuring
    const currPos = findBallPos(data);
    const paths = findAllAIPaths(currPos, data);
    const {
      globalPath,
      globalDistance,
    } = findGlobalOptimalPath(paths, currentPlayer, currPos);
    const noMovement = globalPath.length === 1 && globalPath[0].x === currPos.x && globalPath[0].y === currPos.y;
    if (globalDistance === 0) { //sure win
      this.onWin(currentPlayer);
    } else if (globalPath.length === 0 || noMovement) {
      const result = findPlayerPos(currPos, currentPlayer, data);
      this.addPlayer(result.x, result.y);
    } else {
      let start = currPos;
      globalPath.forEach(async pos => {
        start = await this.animateMovement(start, pos);
      });
    }
    setTimeout(() => {
      this.updateInProgress = false;
      this.setState({ loading: false });
      disableButtons(false); // enable buttons
      switchPlayer(PLAYER.EKS); // switch to non bot
    }, 1000);
  }

  async animateMovement(start, pos) {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.moveBall(start, pos);
        resolve(start);
      }, 10);
    });
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
    this.onDragEnd(e);
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
    if (currentBoardState === BOARDSTATE.PRESTART) return; // game has not started
    const { data } = this.state;
    const current = data[row][column];
    const { player, ball } = current;
    if (!player && !ball) {
      current.player = true;
    }
    const futureBallPos = findAllFutureBallPos(findBallPos(data), data);
    this.setState({ data, futureBallPos });

    switchPlayer();

  }

  moveBall(start, end) {
    const { currentBoardState, currentPlayer, switchPlayer, updateMove } = this.props;
    if (currentBoardState === BOARDSTATE.PRESTART) return;
    const { data: oldData } = this.state;
    const startPoint = oldData[start.x][start.y];
    const endPoint = oldData[end.x] && oldData[end.x][end.y];
    if (!endPoint) return; // endpoint does not exist
    if (endPoint.ball || endPoint.player || !startPoint.ball) return; // cannot move since either not a ball or since player or ball present


    // try to move the ball and remove the players in between
    const { data, isValidMove, playersJumped } = tryToMoveBall(start, end, oldData);

    if (!isValidMove || !playersJumped) return;
    // move ball if valid move
    data[start.x][start.y].ball = false;
    data[end.x][end.y].ball = true;

    // check to see if won
    let hasWon = { state: false };
    const futureBallPos = findAllFutureBallPos(end, data);

    hasWon = checkIfCurrentWinningPos(end); // Check Current Position For Winning
    if (!hasWon.state) {
      hasWon = checkIfCurrentPlayerCanWin(futureBallPos, currentPlayer); // check if won for future
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
    const { changeBoardState, addScore, resetBoard, setPlayerWon } = this.props;
    changeBoardState(BOARDSTATE.WIN);
    addScore(player);
    setPlayerWon(player);
    setTimeout(() => {
      resetBoard();
      this.resetBoardState();
    }, 1000);
  }

  resetBoardState() {
    const { config: { gridSize, ballPosStart, playerPos } } = this.props;
    const layout = getLayout(gridSize, `${ballPosStart.x}-${ballPosStart.y}`, playerPos);
    this.setState({ data: layout });
  }

  render() {
    const { currentPlayer, currentBoardState, wonPlayer } = this.props;
    const { data, futureBallPos, showSuggestion, loading } = this.state;
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
          wonPlayer={wonPlayer}
          loading={loading}
        />
      </div>
    );
  }
}