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
    background: '#196F3D',
    boxSizing: 'border-box',
  },
  tl: (row, column) => ({
    ...column !== 0 && { borderBottom: '1px solid black' },
    ...row !== 0 && { borderRight: '1px solid black' },
  }),
  tr: (row, column, colMax) => ({
    ...column !== colMax - 1 && {borderBottom: '1px solid black'},
    ...row !==0 && {borderLeft: '1px solid black'},
  }),
  bl: (row, column, rowMax) => ({
    ...column !== 0 && {borderTop: '1px solid black'},
    ...row !== rowMax - 1 && {borderRight: '1px solid black'},
  }),
  br: (row, column, rowMax, colMax) => ({
    ...column !== colMax - 1 && {borderTop: '1px solid black'},
    ...row !== rowMax - 1 && {borderLeft: '1px solid black'},
  }),
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
  const { row, column, ballPosType, player, ball, currentPlayer, currentBoardState, rowMax, colMax } = props;
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
      <div style={{...styles.entity, ...styles.tl(row, column)}}></div>
      <div style={{...styles.entity, ...styles.tr(row, column, colMax)}}></div>
      <div style={{...styles.entity, ...styles.bl(row, column, rowMax)}}></div>
      <div style={{...styles.entity, ...styles.br(row, column, rowMax, colMax)}}></div>
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