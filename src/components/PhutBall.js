import React from 'react';
import Board from './Board.js';

import { PLAYER, BOARDSTATE } from '../utils';

const gridSize = [19, 15];
const ballPosStart = {x: 8, y: 7};
const playerPos = [];

export default class PhutBall extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentPlayer: PLAYER.OHS,
      currentBoardState: BOARDSTATE.PRESTART,
      score: {
        EKS: 0,
        OHS: 0,
      },
      currentMove: null,
      boardConfig: {
        gridSize,
        ballPosStart,
        playerPos,
      }
    };

    this.switchPlayer = this.switchPlayer.bind(this);
    this.changeBoardState = this.changeBoardState.bind(this);
    this.addScore = this.addScore.bind(this);
    this.updateMove = this.updateMove.bind(this);
    this.resetBoard = this.resetBoard.bind(this);
  }

  switchPlayer() {
    let { currentPlayer } = this.state;
    if (currentPlayer === PLAYER.EKS) {
      currentPlayer = PLAYER.OHS;
    } else {
      currentPlayer = PLAYER.EKS;
    }
    this.setState({ currentPlayer, currentMove: null });
  }

  updateMove(move) {
    this.setState({ currentMove: move });
  }

  changeBoardState(boardstate) {
    this.setState({currentBoardState: boardstate});
  }

  addScore(player) {
    const { score } = this.state;
    score[player.abbv] += 1;
    this.setState({score});
  }

  resetBoard() {
    this.setState({
      currentBoardState: BOARDSTATE.PRESTART,
      currentPlayer: PLAYER.OHS,
      boardConfig: {
        gridSize,
        ballPosStart,
        playerPos,
      },
    })
  }

  render() {
    const { currentPlayer, currentBoardState, score, currentMove, boardConfig } = this.state;
    return (
      <div>
        <div>
          <div>
            <span style={currentPlayer === PLAYER.EKS.name ? {fontWeight: 700} : null}>{PLAYER.EKS.name}</span>
            <span>: {score.EKS} </span>
          </div>
          <div>
            <span style={currentPlayer === PLAYER.OHS.name ? {fontWeight: 700} : null}>{PLAYER.OHS.name}</span>
            <span>: {score.OHS} </span>
          </div>
        </div>
        <div>
          <Board
            currentPlayer={currentPlayer}
            currentBoardState={currentBoardState}
            currentMove={currentMove}
            changeBoardState={this.changeBoardState}
            resetBoard={this.resetBoard}
            switchPlayer={this.switchPlayer}
            addScore={this.addScore}
            updateMove={this.updateMove}
            config={boardConfig}
          />
        </div>
        <div>{currentBoardState}</div>
        <div>
          <button onClick={this.switchPlayer}>Give chance to {currentPlayer.name}</button>
          {currentBoardState === BOARDSTATE.PRESTART && <button onClick={() => this.changeBoardState(BOARDSTATE.PLAYING)}> Start </button>}
          <button onClick={this.resetBoard}>RESET</button>
        </div>
      </div>
    )
  }
}