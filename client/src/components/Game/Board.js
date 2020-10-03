import React from "react";

import Row from "./Row";

const SIZE_CORRECTION = 0.6;

function Board({ width, board, placeMark, char }) {
  console.log(width)
  const boardSize = {
    width: `${width}px`,
    height: `${width * SIZE_CORRECTION}px`,
  }

  return (
    // <div ref={boardRef} className={classes.board}>
    <div style={boardSize}>
      {board &&
        board.map((row, id) => (
          <Row
            key={id}
            char={char}
            fontSize={((parseInt(width) * SIZE_CORRECTION) / board.length) * SIZE_CORRECTION}
            row={row}
            rowId={id}
            lastRow={board.length - 1}
            width={parseInt(width) * SIZE_CORRECTION}
            height={(parseInt(width) * SIZE_CORRECTION) / board.length}
            placeMark={placeMark}
          />
        ))}
    </div>
  );
}

export default Board;
