import React, { useState, useEffect } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import "./GameMode.css";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Spinner from "./Spinner";

import { Redirect } from "react-router-dom";
import { useAuth } from "../store/authProvider";

import NewGameOptions from "./ModalInfo/NewGameOptions";

// import useSocket from '../customHooks/useSocket';

const styles = (theme) => ({
  ...theme.styles,
  buttonText: {
    textTransform: "capitalized",
  },
  button: {
    marginTop: "30px",
    textTransform: "none",
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
  halfWidth: {
    width: "50%",
  },
});

const GameMode = ({ classes }) => {
  const [{ username }] = useAuth();
  const [mode, setMode] = useState("");
  const [roomId, setRoomId] = useState("");
  // const { getRoomId, roomId, loadingData} = useSocket();
  const [newGameOptions, setNewGameOptions] = useState({
    winLength: 5,
    boardSize: 10,
    character: "X",
    confirm: false,
    state: false,
  });
  const [loadingData, setLoadingData] = useState(false)

  useEffect(() => {
    if (newGameOptions.confirm) {
      if (
        mode &&
        newGameOptions.boardSize &&
        newGameOptions.winLength &&
        newGameOptions.character &&
        username
      ) {
        setLoadingData(true);
        const data = {
          mode,
          boardSize: newGameOptions.boardSize,
          winLength: newGameOptions.winLength,
          myChar: newGameOptions.character,
          username,
        };
        fetch("http://localhost:5000/roomId", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        })
          .then((res) => res.json())
          .then((id) => {
            setRoomId(id);
            setLoadingData(false);
          });
      }
    }
  }, [newGameOptions.confirm]);

  if (!username) {
    return <Redirect to="/" />;
  }

  if (mode && roomId) {
    return <Redirect to={`/waitingRoom/${mode}/${roomId}`} />;
  }

  const selectGameMode = (event) => {
    // on MaterialUI elements I had to use event.currentTarget.value to get the value of the field
    if (
      event.currentTarget.value === "random" ||
      event.currentTarget.value === "friend"
    ) {
      setMode(event.currentTarget.value);
      setNewGameOptions({ ...newGameOptions, state: true });
    }
  };

  const showNewGameDialog = () => {
    setNewGameOptions({ ...newGameOptions, state: true });
  };

  if (newGameOptions.state === true) {
    return (
      <NewGameOptions
        newGameOptions={newGameOptions}
        setNewGameOptions={setNewGameOptions}
      />
    );
  }

  if (loadingData) {
    return (
      <div className={classes.centerToMiddle}>
        <Spinner />
      </div>
    )
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
        <Button
          variant="outlined"
          color="primary"
          className={classes.button}
          onClick={showNewGameDialog}
        >
          <Typography className={classes.buttonText} variant="h5">
            Select Game Settings
          </Typography>
        </Button>
      </div>
    );
  }
};

export default withStyles(styles)(GameMode);
