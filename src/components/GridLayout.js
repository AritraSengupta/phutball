import React from 'react';
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
export default (props) => {
  const { data, showModal, futureBallPos, currentPlayer } = props;
  const rowNumber = data.length;
  const columnNumber = data[0].length;
  return (
    <div style={styles.wrapper(rowNumber, columnNumber)}>
      {showModal && <div style={styles.modal(rowNumber, columnNumber)}></div>}
      {data.map((row, idx) => {
        return row.map((column, cdx) => {
          const ballPosType = futureBallPos[idx] &&  futureBallPos[idx][cdx];
          return (
            <GridPoint
              key={`${idx}-${cdx}`}
              currentPlayer={currentPlayer}
              player={column.player}
              ball={column.ball}
              ballPosType={ballPosType}
              row={idx}
              column={cdx}
              onDragOver={props.onDragOver}
              onDragStart={props.onDragStart}
              onDrop={props.onDrop}
              addPlayer={props.addPlayer}
            />
          )
        });
      })}
    </div>
  );
}