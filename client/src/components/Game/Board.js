import React, { useState, useEffect } from "react";
import withStyles from "@material-ui/core/styles/withStyles";

import Row from "./Row";

const SIZE_CORRECTION = 0.6;

const styles = (theme) => ({
  ...theme.styles,
  board: {
    width: "400px",
    height: "400px",
  },
});

function Board({ classes, width, board, placeMark, char }) {
  // const [board, setBoard] = useState(null);

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

export default withStyles(styles)(Board);
