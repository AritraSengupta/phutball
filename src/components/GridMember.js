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
    width: '11px',
    height: '11px',
    background: '#F1C40F',
    cursor: 'not-allowed',
  },
  winning: {
    ...baseStyle,
    borderStyle: 'dotted',
    borderColor: 'rgb(0, 200, 0)',
    background: 'rgb(0, 200, 0, 0.6)',
  },
  losing: {
    ...baseStyle,
    borderStyle: 'dotted',
    borderColor: 'rgb(203, 67, 53)',
    background: 'rgb(203, 67, 53, 0.6)',

  },
  validMove: {
    ...baseStyle,
    borderStyle: 'dotted',
    borderColor: '#3498DB',
    background: 'rgb(52, 152, 219, 0.6)',
  },
}

const GridMember = (props) => {
  const { row, column, type, onDragStart, onDragEnd, currentBoardState } = props;
  if (!type) return null;
  const draggable = currentBoardState !== BOARDSTATE.PRESTART;
  const dragProps = type === 'ball' ? {
    draggable,
    onDragStart,
    onDragEnd,
  } : {};
  const style = {...styles[type], ...(draggable && type === 'ball' && { cursor: 'grabbing' })}
  return <div
    style={style}
    {...dragProps}
    row={row}
    column={column}
  ></div>
}

export default GridMember;