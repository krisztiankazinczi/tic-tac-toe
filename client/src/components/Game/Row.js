import React from 'react'
import withStyles from "@material-ui/core/styles/withStyles";

import Cell from './Cell';

const styles = (theme) => ({
  ...theme.styles,
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  }
});

function Row({ classes, row, rowId, lastRow, width, height, fontSize, placeMark, char }) {



  return (
    <div className={classes.row}>
      {row && (
        row.map((value, id) => (
          <Cell key={id} char={char} fontSize={fontSize} value={value} rowId={rowId} lastRow={lastRow} colId={id} lastCol={row.length - 1} width={width / (lastRow + 1)} height={height} placeMark={placeMark} />
        ))
      )}
    </div>
  )
}

export default withStyles(styles)(Row);
