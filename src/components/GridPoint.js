import React from 'react';
import GridMember from './GridMember';

// Component handling the grid element where a ball or a player can be placed
const styles = {
  wrapper: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    width: '20px',
  },
  entity: {
    width: '10px',
    height: '10px',
    background: 'green',
    boxSizing: 'border-box',
  },
  tl: {
    borderBottom: '1px solid black',
    borderRight: '1px solid black',
  },
  tr: {
    borderBottom: '1px solid black',
    borderLeft: '1px solid black',
  },
  bl: {
    borderTop: '1px solid black',
    borderRight: '1px solid black',
  },
  br: {
    borderTop: '1px solid black',
    borderLeft: '1px solid black',
  },
  gridMember: {
    marginTop: '-15px',
  }
};

function getType(ball, player, ballPosType, currentPlayer) {
  let type = undefined;
  if (ball) {
    type = 'ball';
  } else if (player) {
    type = 'player';
  } else if (ballPosType) {
    if(ballPosType.winning === currentPlayer) {
      type = 'winning';
    } else if (ballPosType.losing === currentPlayer) {
      type = 'losing';
    } else {
      type = 'validMove';
    }
  }
  return type;
}
const GridPoint = (props) => {
  const { row, column, ballPosType, player, ball, currentPlayer, currentBoardState } = props;
  const type = getType(ball, player, ballPosType, currentPlayer);

  return (
    <div
      style={styles.wrapper}
      row={row}
      column={column}
      onDragOver={props.onDragOver}
      onDrop={(e) => props.onDrop(e, row, column)}
      onClick={() => props.addPlayer(row, column)}
    >
      <div style={{...styles.entity, ...styles.tl}}></div>
      <div style={{...styles.entity, ...styles.tr}}></div>
      <div style={{...styles.entity, ...styles.bl}}></div>
      <div style={{...styles.entity, ...styles.br}}></div>
      {type && <GridMember
        type={type}
        onDragStart={props.onDragStart}
        onDragEnd={props.onDragEnd}
        row={row}
        column={column}
        currentBoardState={currentBoardState}
      />}
    </div>
  );
}

export default GridPoint;