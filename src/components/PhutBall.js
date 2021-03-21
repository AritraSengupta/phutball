import React from 'react';
import Board from './Board.js';

import { PLAYER, BOARDSTATE, MODES } from '../utils';

const gridSize = [19, 15];
const ballPosStart = {x: 8, y: 7};
const playerPos = [];

export default class PhutBall extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentPlayer: PLAYER.EKS,
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
      },
      wonPlayer: null,
      isManual: true,
      bot: PLAYER.OHS,
    };

    this.switchPlayer = this.switchPlayer.bind(this);
    this.changeBoardState = this.changeBoardState.bind(this);
    this.addScore = this.addScore.bind(this);
    this.updateMove = this.updateMove.bind(this);
    this.resetBoard = this.resetBoard.bind(this);
    this.setPlayerWon = this.setPlayerWon.bind(this);
    this.toggleAuto = this.toggleAuto.bind(this);
  }

  switchPlayer(player) {
    if (player) {
      this.setState({ currentPlayer: player, currentMove: null });
      return;
    }
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
      currentPlayer: PLAYER.EKS,
      wonPlayer: null,
    })
  }

  toggleAuto() {
    const { isManual } = this.state;
    this.setState({ isManual: !isManual });
  }

  setPlayerWon(player) {
    this.setState({ wonPlayer: player });
  }

  render() {
    const {
      currentPlayer,
      currentBoardState,
      score,
      currentMove,
      boardConfig,
      wonPlayer,
      isManual,
      bot,
    } = this.state;
    return (
      <div>
        <div>
          <div>
            <span style={currentPlayer.name === PLAYER.EKS.name ? {fontWeight: 700} : null}>
              {PLAYER.EKS.name}: {score.EKS}
            </span>
          </div>
          <div>
            <span style={currentPlayer.name === PLAYER.OHS.name ? {fontWeight: 700} : null}>
              {PLAYER.OHS.name}: {score.OHS}
            </span>
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
            setPlayerWon={this.setPlayerWon}
            config={boardConfig}
            wonPlayer={wonPlayer}
            isManual={isManual}
            bot={bot}
          />
        </div>
        <div>{currentBoardState}</div>
        <div>
          <button onClick={() => this.switchPlayer()}>
            Give chance to {currentPlayer.name === PLAYER.EKS.name ? PLAYER.OHS.name : PLAYER.EKS.name}
          </button>
          {currentBoardState === BOARDSTATE.PRESTART && <button onClick={() => this.changeBoardState(BOARDSTATE.PLAYING)}> Start </button>}
          <button onClick={this.resetBoard}>RESET</button>
          {currentBoardState === BOARDSTATE.PRESTART 
            && <button onClick={this.toggleAuto}>{isManual ? 'Auto' : 'Manual'}</button>}
        </div>
      </div>
    )
  }
}