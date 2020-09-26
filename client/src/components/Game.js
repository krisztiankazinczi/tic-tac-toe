import React, { useEffect } from 'react';
import { useParams } from "react-router-dom";
import withStyles from "@material-ui/core/styles/withStyles";

import Board from './Game/Board';

const styles = (theme) => ({
  ...theme.styles,
  centerToMiddle: {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
    height: "140%",
    width: "100%",
    alignItems: "center",
    paddingTop: '40px',
    backgroundColor: theme.styles.colors.mainBackgroundColor,
  },
});


const Game = ({ classes }) => {
  const { roomId } = useParams();



  return (
    <div className={classes.centerToMiddle}>
      <Board />
    </div>
  )
}


export default withStyles(styles)(Game);

