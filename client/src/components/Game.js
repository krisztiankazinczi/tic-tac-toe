import React, { useEffect, useState, useRef, useLayoutEffect } from 'react';
import { useParams } from "react-router-dom";
import withStyles from "@material-ui/core/styles/withStyles";
import clsx from 'clsx';
import { useAuth } from "../store/authProvider";
import Button from "@material-ui/core/Button";

import Board from './Game/Board';
import PlayerName from './Game/PlayerName';

import socketIOClient from 'socket.io-client';

const styles = (theme) => ({
  ...theme.styles,
  centerToMiddle: {
    marginRight: 'auto',
    marginLeft: 'auto',
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
    height: "100%",
    width: "50%",
    alignItems: "center",
    backgroundColor: theme.styles.colors.mainBackgroundColor,
  },
  playerInfo: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: '50px',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingTop: '10px',
    borderTop: `2px solid ${theme.styles.colors.mainTextColor}`
  },
  buttons: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginTop: '10px',
    marginBottom: '10px',
  },
  container: {
    width: '100%',
    backgroundColor: theme.styles.colors.mainBackgroundColor
  }
});

const FONT_SIZE_CORRECTION = 0.025;

const serverUrl = process.env.REACT_APP_DEVELOPMENT_MODE === 'true'
  ? "http://localhost:5000"
  : process.env.REACT_APP_BACK_END_URL;

const Game = ({ classes }) => {
  const { mode, roomId } = useParams();
  const [{ username }] = useAuth();
  const boardRef = useRef();
  const [width, setWidth] = useState(0);
  

  useLayoutEffect(() => {
    if (boardRef.current) {
      setWidth(boardRef.current.offsetWidth)
    }
  }, []);

  useEffect(() => {
    if (!username) return;

    const socket = socketIOClient(serverUrl);
    socket.emit("join-room", roomId, mode, username);

    socket.on("get-initial-data", (playerInfo, board) => {
      console.log(playerInfo)
      console.log(board)
    })

    socket.emit("get-game-data", roomId, mode, username);

  }, []);

  const containerWidth = {
    width: `${width}px`
  }

  const fontSize = {
    fontSize: `${width * FONT_SIZE_CORRECTION}px`
  }
  
  return (
    <div className={classes.container}>
      <div ref={boardRef} className={classes.centerToMiddle}>
        <div className={classes.buttons} style={containerWidth}>
          <Button style={fontSize} variant="outlined" color="primary">Give up</Button>
          <Button style={fontSize} variant="outlined" color="primary">Draw?</Button>
          <Button style={fontSize} variant="outlined" color="primary">Leave Game</Button>
        </div>
        <Board width={width} />
        <div className={classes.playerInfo} style={containerWidth}>
          <PlayerName fontSize={width * FONT_SIZE_CORRECTION} char="X" username="Orsolya" score={0} active />
          <PlayerName fontSize={width * FONT_SIZE_CORRECTION} username="Tie" score={0} />
          <PlayerName fontSize={width * FONT_SIZE_CORRECTION} char="O" username="Krisztian" score={0} />
        </div>
      </div>
    </div>

  )
}


export default withStyles(styles)(Game);

