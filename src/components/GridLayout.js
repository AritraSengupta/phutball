import React from 'react';
import { BOARDSTATE } from '../utils';
import GridPoint from './GridPoint';

const styles = {
  wrapper: (rows, columns) => {
    return ({
      display: 'grid',
      height: `${rows*20}px`,
      width: `${columns*20}px`,
      gridTemplateColumns: `repeat(${columns}, 1fr)`,
    });
  },
  modal: (rows, columns) => {
    return ({
      position: 'absolute',
      height: `${rows*20}px`,
      width: `${columns*20}px`,
      background: 'rgb(255, 255, 244, 0.6)',
    })
  }
};
const GridLayout = (props) => {
  const { data, futureBallPos, currentPlayer, currentBoardState, showSuggestion, wonPlayer } = props;
  const showModal = {
    state: currentBoardState === BOARDSTATE.WIN,
    message: `${wonPlayer && wonPlayer.name} Won`
  }
  const rowNumber = data.length;
  const columnNumber = data[0].length;
  return (
    <div style={styles.wrapper(rowNumber, columnNumber)}>
      {showModal.state && <div style={styles.modal(rowNumber, columnNumber)}>
        {showModal.message}
      </div>}
      {data.map((row, idx) => {
        return row.map((column, cdx) => {
          const ballPosType = currentBoardState !== BOARDSTATE.PRESTART 
            && showSuggestion 
            && futureBallPos[idx] 
            && futureBallPos[idx][cdx];
          return (
            <GridPoint
              key={`${idx}-${cdx}`}
              currentPlayer={currentPlayer}
              currentBoardState={currentBoardState}
              player={column.player}
              ball={column.ball}
              ballPosType={ballPosType}
              row={idx}
              column={cdx}
              onDragOver={props.onDragOver}
              onDragStart={props.onDragStart}
              onDragEnd={props.onDragEnd}
              onDrop={props.onDrop}
              addPlayer={props.addPlayer}
              rowMax={data.length}
              colMax={data[0].length}
            />
          )
        });
      })}
    </div>
  );
}

export default GridLayout;