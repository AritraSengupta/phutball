import React from 'react';
import Board from './Board.js';

import { PLAYER, BOARDSTATE } from '../utils';

const gridSize = [19, 15];
const ballPosStart = {x: 8, y: 7};
const playerPos = [];

const styles = {
  goal: {
    flex: 1,
    width: '350px',
    height: '30px',
    background: '#28B463',
    textAlign: 'center',
  },
};

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
        ballPosStart: { ...ballPosStart },
        playerPos,
      },
      wonPlayer: null,
      isManual: true,
      bot: PLAYER.OHS,
      buttonDisabled: false,
      handicap: {
        name: PLAYER.EKS.name,
        value: 0,
      }
    };

    this.switchPlayer = this.switchPlayer.bind(this);
    this.changeBoardState = this.changeBoardState.bind(this);
    this.addScore = this.addScore.bind(this);
    this.updateMove = this.updateMove.bind(this);
    this.resetBoard = this.resetBoard.bind(this);
    this.setPlayerWon = this.setPlayerWon.bind(this);
    this.toggleAuto = this.toggleAuto.bind(this);
    this.disableButtonsToggle = this.disableButtonsToggle.bind(this);
    this.handleHandicapNameChange = this.handleHandicapNameChange.bind(this);
    this.handleandicapValueChange = this.handleandicapValueChange.bind(this);
  }
  handleHandicapNameChange(e) {
    const value = e.target.value;
    const { handicap, boardConfig } = this.state;
    if (value === PLAYER.EKS.name) {
      boardConfig.ballPosStart = {
        ...boardConfig.ballPosStart,
        x: ballPosStart.x - Number(handicap.value)
      };
    } else {
      boardConfig.ballPosStart = {
        ...boardConfig.ballPosStart,
        x: ballPosStart.x + Number(handicap.value)
      };
    }
    handicap.name = value;
    this.setState({ handicap, boardConfig });
  }

  handleandicapValueChange(e) {
    const value = e.target.value;
    const { handicap, boardConfig } = this.state;
    if (handicap.name === PLAYER.EKS.name) {
      boardConfig.ballPosStart = {
        ...boardConfig.ballPosStart,
        x: ballPosStart.x - Number(value)
      };
    } else {
      boardConfig.ballPosStart = {
        ...boardConfig.ballPosStart,
        x: ballPosStart.x + Number(value)
      };
    }
    handicap.value = Number(value);
    this.setState({ handicap, boardConfig });
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

  disableButtonsToggle(bool) {
    this.setState({ buttonDisabled: bool });
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
      buttonDisabled,
      handicap,
    } = this.state;

    return (
      <div style={ {display: 'flex', alignContent: 'center', alignItems: 'center', flexFlow: 'column'}  }>
        <div style={{flex: 1, width: '90%', borderBottom: '2px solid black', marginBottom: '10px'}}>
          <h1 style={{ margin: '10px' }}>PhutBall</h1>
        </div>
        <div style={styles.goal}>{PLAYER.OHS.name} Goal</div>
        <div style={{flex: 1}}>
          <Board
            currentPlayer={currentPlayer}
            currentBoardState={currentBoardState}
            disableButtons={this.disableButtonsToggle}
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
        <div style={styles.goal}>{PLAYER.EKS.name} Goal</div>
        <div style={{flex: 1, padding: '8px', display: 'flex', flexFlow: 'row'}}>
          <div style={{flex: 1 }}>
            <h3 style={{ padding: '4px', margin: 0, textDecoration: 'underline' }}>Scores: </h3>
            <div>
              <span style={currentPlayer.name === PLAYER.EKS.name ? {fontWeight: 700} : null}>
                {PLAYER.EKS.name}: {score.EKS}
              </span>
            </div>
            <div>
              <span style={currentPlayer.name === PLAYER.OHS.name ? {fontWeight: 700} : null}>
                {PLAYER.OHS.name}: {score.OHS} {!isManual && `(auto)`}
              </span>
            </div>
          </div>
          <div style={{flex: 1, padding: '5px 8px 8px 8px', borderLeft: '1px solid black'}}>
            <strong style={{textDecoration: 'underline'}}>Currently Playing:</strong> {currentPlayer.name}
          </div>
        </div>
        <div style={{flex: 1, width: '400px', textAlign: 'center', borderTop: '2px solid black', borderBottom: '2px solid black', padding: '4px'}}>
          BOARD STATE: {currentBoardState}
          {currentBoardState === BOARDSTATE.PRESTART
          && <div>
            During this time players may choose the handicap required and also select whether to play a 2 person or against the computer
          </div>}
        </div>
        <div style={{flex: 1}}>
          {currentBoardState !== BOARDSTATE.PRESTART
            && <button onClick={() => this.switchPlayer()} disabled={buttonDisabled || !currentMove}>
            <span>
              Give chance to {currentPlayer.name === PLAYER.EKS.name ? PLAYER.OHS.name : PLAYER.EKS.name}
            </span>
          </button>}
          {currentBoardState === BOARDSTATE.PRESTART
            && <button onClick={() => this.changeBoardState(BOARDSTATE.PLAYING)} disabled={buttonDisabled}>
              <span>Start</span>
          </button>}
          {currentBoardState !== BOARDSTATE.PRESTART
            && <button onClick={this.resetBoard} disabled={buttonDisabled}>
              <span>RESET</span>
          </button>}
          {currentBoardState === BOARDSTATE.PRESTART 
            && <button onClick={this.toggleAuto} disabled={buttonDisabled}>
              <span>Switch To {isManual ? 'Auto' : 'Manual'}</span>
          </button>}
        </div>
        {currentBoardState === BOARDSTATE.PRESTART && <div style={{flex: 1, paddingTop: '4px', marginTop: '4px', width: '400px', borderTop: '1px solid black', fontSize: '16px', fontWeight: '500'}}>
          Handicap
        </div>}
        {currentBoardState === BOARDSTATE.PRESTART && <div style={{flex: 1, display: 'flex', flexFlow: 'row'}}>
          <div style={{flex: 1}}>
            <select value={handicap.name} onChange={this.handleHandicapNameChange}>
              <option value={PLAYER.OHS.name}>{PLAYER.OHS.name}</option>
              <option value={PLAYER.EKS.name}>{PLAYER.EKS.name}</option>
            </select>
          </div>
          <div style={{flex: 1}}>
            <select value={handicap.value} onChange={this.handleandicapValueChange}>
              <option value={0}>None</option>
              <option value={1}>1</option>
              <option value={2}>2</option>
              <option value={3}>3</option>
              <option value={4}>4</option>
              <option value={5}>5</option>
              <option value={6}>6</option>
            </select>
          </div>
        </div>}
      </div>
    )
  }
}