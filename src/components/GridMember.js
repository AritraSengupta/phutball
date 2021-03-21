import React from 'react';
import { BOARDSTATE } from '../utils';

const baseStyle = {
  position: 'absolute',
  borderRadius: '50%',
  width: '10px',
  height: '10px',
  background: '#000000',
  transform: 'translate(5px, 5px)',
};
const styles = {
  player: {
    ...baseStyle,
  },
  ball: {
    ...baseStyle,
    width: '9px',
    height: '9px',
    background: '#fff000',
    cursor: 'pointer',
  },
  winning: {
    ...baseStyle,
    borderStyle: 'dotted',
    borderColor: '#808000	',
    background: 'none',
  },
  losing: {
    ...baseStyle,
    borderStyle: 'dotted',
    borderColor: 'red',
    background: 'none',

  },
  validMove: {
    ...baseStyle,
    borderStyle: 'dotted',
    borderColor: 'blue',
    background: 'none',
  },
}

const GridMember = (props) => {
  const { row, column, type, onDragStart, onDragEnd, currentBoardState } = props;
  if (!type) return null;
  const dragProps = type === 'ball' ? {
    draggable: currentBoardState !== BOARDSTATE.PRESTART,
    onDragStart,
    onDragEnd,
  } : {};
  return <div
    style={styles[type]}
    {...dragProps}
    row={row}
    column={column}
  ></div>
}

export default GridMember;