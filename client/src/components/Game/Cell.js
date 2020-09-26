import React from 'react'
import withStyles from "@material-ui/core/styles/withStyles";
import clsx from 'clsx';

const styles = (theme) => ({
  ...theme.styles,
  cell: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: theme.styles.colors.orangeColor
  },
  allBorders: {
    border: `2px solid ${theme.styles.colors.mainTextColor}`,
  },
  bordersWithoutTop: {
    borderLeft: `2px solid ${theme.styles.colors.mainTextColor}`,
    borderRight: `2px solid ${theme.styles.colors.mainTextColor}`,
    borderBottom: `2px solid ${theme.styles.colors.mainTextColor}`,
  },
  bordersWithoutLeft: {
    borderTop: `2px solid ${theme.styles.colors.mainTextColor}`,
    borderRight: `2px solid ${theme.styles.colors.mainTextColor}`,
    borderBottom: `2px solid ${theme.styles.colors.mainTextColor}`,
  },
  bordersWithoutRight: {
    borderTop: `2px solid ${theme.styles.colors.mainTextColor}`,
    borderLeft: `2px solid ${theme.styles.colors.mainTextColor}`,
    borderBottom: `2px solid ${theme.styles.colors.mainTextColor}`,
  },
  bordersWithoutBottom: {
    borderTop: `2px solid ${theme.styles.colors.mainTextColor}`,
    borderLeft: `2px solid ${theme.styles.colors.mainTextColor}`,
    borderRight: `2px solid ${theme.styles.colors.mainTextColor}`,
  },
  topLeftCorner: {
    borderRight: `2px solid ${theme.styles.colors.mainTextColor}`,
    borderBottom: `2px solid ${theme.styles.colors.mainTextColor}`,
  },
  topRightCorner: {
    borderLeft: `2px solid ${theme.styles.colors.mainTextColor}`,
    borderBottom: `2px solid ${theme.styles.colors.mainTextColor}`,
  },
  bottomRightCorner: {
    borderLeft: `2px solid ${theme.styles.colors.mainTextColor}`,
    borderTop: `2px solid ${theme.styles.colors.mainTextColor}`,
  },
  bottomLeftCorner: {
    borderRight: `2px solid ${theme.styles.colors.mainTextColor}`,
    borderTop: `2px solid ${theme.styles.colors.mainTextColor}`,
  },
});

function Cell({ classes, value, rowId, lastRow, colId, lastCol, width, height, fontSize, placeMark }) {

  const handleClick = () => {
    placeMark(rowId, colId, value)
  }

  const size = {
    width: width,
    height: height,
    fontSize: fontSize,
  }

  return (
    <div>
      {
        rowId === 0 && colId === 0 ? (
          <div className={clsx(classes.cell, classes.topLeftCorner)} style={size} onClick={() => handleClick()}>
            {value}
          </div>
        ) : rowId === 0 && colId === lastCol ? (
          <div className={clsx(classes.cell, classes.topRightCorner)} style={size} onClick={() => handleClick()}>
            {value}
          </div>
        ) : rowId === lastRow && colId === 0 ? (
          <div className={clsx(classes.cell, classes.bottomLeftCorner)} style={size} onClick={() => handleClick()}>
            {value}
          </div>
        ) : rowId === lastRow && colId === lastCol ? (
          <div className={clsx(classes.cell, classes.bottomRightCorner)} style={size} onClick={() => handleClick()}>
            {value}
          </div>
        ) : rowId === 0 ? (
          <div className={clsx(classes.cell, classes.bordersWithoutTop)} style={size} onClick={() => handleClick()}>
            {value}
          </div>
        ) : colId === 0 ? (
          <div className={clsx(classes.cell, classes.bordersWithoutLeft)} style={size} onClick={() => handleClick()}>
            {value}
          </div>
        ) : rowId === lastRow ? (
          <div className={clsx(classes.cell, classes.bordersWithoutBottom)} style={size} onClick={() => handleClick()}>
            {value}
          </div>
        ) : colId === lastCol ? (
          <div className={clsx(classes.cell, classes.bordersWithoutRight)} style={size} onClick={() => handleClick()}>
            {value}
          </div>
        ) : (
          <div className={clsx(classes.cell, classes.allBorders)} style={size} onClick={() => handleClick()}>
            {value}
          </div>
        )
      }
    </div>
  )
}

export default withStyles(styles)(Cell);
