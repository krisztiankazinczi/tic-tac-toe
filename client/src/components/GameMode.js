import React, { useState, useEffect } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import './GameMode.css'
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Spinner from './Spinner';

import { Redirect } from "react-router-dom";
import { useAuth } from "../store/authProvider";
import socketIOClient from 'socket.io-client';


// import useSocket from '../customHooks/useSocket';

const styles = (theme) => ({
  ...theme.styles,
  buttonText: {
    textTransform: "capitalized",
  },
  button: {
    marginTop: "30px",
    textTransform: 'none'
  },
  options: {
    display: "flex",
    width: "50%",
    alignItems: "center",
    "& > h2": {
      fontSize: "25px",
      color: theme.styles.colors.orangeColor,
      fontWeight: 700,
      flex: 0.5,
    },
  },
  dropDown: {
    fontSize: '26px',
    flex: 0.5,
    color: theme.styles.colors.orangeColor,
    "&:before": {
      borderColor: theme.styles.colors.orangeColor,
    },
    "&:after": {
      borderColor: theme.styles.colors.orangeColor,
    },
    "&:hover:not(.Mui-disabled):before": {
      borderColor: theme.styles.colors.orangeColor,
    },
  },
  '.MuiList-padding':{
    paddingTop: 0,
    paddingBottom: 0
  },
  icon: {
    fill: theme.styles.colors.orangeColor,
  },
  halfWidth: {
    width: "50%",
  },
  menuItem: {
    color: theme.styles.colors.orangeColor,
    backgroundColor: theme.styles.colors.secondaryBackgroundColor,
    '&:hover': {
      background: theme.styles.colors.secondaryBackgroundColorHovered,
    },
    '&.Mui-selected': {
      background: theme.styles.colors.secondaryBackgroundColorHovered,
    },
    '&.Mui-selected:hover': {
      background: theme.styles.colors.secondaryBackgroundColorHovered,
    }
  },
});

const boardSizes = [3,4,5,6,7,8,9,10,11,12];
const winLengths = [3,4,5];
const characters = ['X', 'O'];

const GameMode = ({ classes }) => {
  const [{ username }] = useAuth();
  const [mode, setMode] = useState("");
  const [boardSize, setBoardSize] = useState(10);
  const [winLength, setWinLength] = useState(5);
  const [myChar, setMyChar] = useState('X');
  const [roomId, setRoomId] = useState("");
  // const { getRoomId, roomId, loadingData} = useSocket();

  if (!username) {
    return <Redirect to="/" />;
  }

  if (mode && roomId) {
    return <Redirect to={`/waitingRoom/${mode}/${roomId}`} />;
  }


  const selectGameMode = (event) => {
    //get RoomId from server

    // on MaterialUI elements I had to use event.currentTarget.value to get the value of the field
    if (
      event.currentTarget.value === "random" ||
      event.currentTarget.value === "friend"
    ) {
      setMode(event.currentTarget.value);
    }
  };

  const startGame = async () => {
    if (mode && boardSize && winLength && myChar && username) {
      // getRoomId(mode, boardSize, winLength, myChar)
      const res = await fetch("http://localhost:5000/roomId", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mode, boardSize, winLength, myChar, username
        })
      });
      const id = await res.json();
      setRoomId(id);
    }
  }



  if (!mode) {
    return (
      <div className={classes.centerToMiddle}>
        <Button
          value="random"
          variant="outlined"
          color="primary"
          className={classes.button}
          onClick={(e) => selectGameMode(e)}
        >
          <Typography className={classes.buttonText} variant="h5">
            Play with random players
          </Typography>
        </Button>
        <Button
          value="friend"
          variant="outlined"
          color="primary"
          className={classes.button}
          onClick={(e) => selectGameMode(e)}
        >
          <Typography className={classes.buttonText} variant="h5">
            Play with friends
          </Typography>
        </Button>
      </div>
    );
  }



  if (mode) {
    return (
      <div className={classes.centerToMiddle}>
      <div className={classes.options}>
        <h2>BoardSize (X * X)</h2>
        <Select
          name="boardSize"
          value={boardSize}
          onChange={(e) => setBoardSize(e.target.value)}
          className={classes.dropDown}
          inputProps={{classes: {
            icon: classes.icon
          }}}
        >
          {boardSizes.map((size) => (
            <MenuItem key={size} className={classes.menuItem} value={size}>
              {size}
            </MenuItem>
          ))}
        </Select>
      </div>
      <div className={classes.options}>
        <h2>Win Length</h2>
        <Select
          name="winLength"
          value={winLength}
          onChange={(e) => setWinLength(e.target.value)}
          className={classes.dropDown}
          inputProps={{classes: {
            icon: classes.icon
          }}}
        >
          {winLengths.map((length) => (
            <MenuItem key={length} className={classes.menuItem} value={length}>
              {length}
            </MenuItem>
          ))}
        </Select>
      </div>
        <div className={classes.options}>
          <h2>Your character</h2>
          <Select
            name="myChar"
            value={myChar}
            onChange={(e) => setMyChar(e.target.value)}
            className={classes.dropDown}
            inputProps={{classes: {
              icon: classes.icon
            }}}
          >
            {characters.map((char) => (
              <MenuItem key={char} className={classes.menuItem} value={char}>
                {char}
              </MenuItem>
            ))}
          </Select>
        </div>

      <Button
        size="large"
        variant="outlined"
        color="primary"
        onClick={startGame}
        // disabled={loadingData ? true : false}
      >
        <Typography variant="h5">Start</Typography>
      </Button>
    </div>
    )
  }
};

export default withStyles(styles)(GameMode);
