import React, { useState, useEffect, useRef } from 'react'
import withStyles from "@material-ui/core/styles/withStyles";

import Row from './Row';

const styles = (theme) => ({
  ...theme.styles,
  board: {
    width: '400px',
    height: '400px',
  }
});

function Board({ classes }) {
  const [board, setBoard] = useState(null);
  const boardRef = useRef()

 

  useEffect(() => {
    //socketrol jonnek a meretek
    const generatedBoard = Array(7).fill().map(() => Array(7).fill('X'))
    setBoard(generatedBoard)
  }, [])

  const placeMark = (rowId, colId, value) => {
    console.log(rowId, colId, value);
  }

  return (
    <div ref={boardRef} className={classes.board}>
      {board && (
        board.map((row, id) => (
          <Row key={id} fontSize={(boardRef.current.offsetWidth / board.length) * 0.6 } row={row} rowId={id} lastRow={board.length - 1} width={boardRef.current.offsetWidth} height={boardRef.current.offsetHeight / (board.length)} placeMark={placeMark} />
        ))
      )}
    </div>
  )
}

export default withStyles(styles)(Board);
