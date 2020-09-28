import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import withStyles from "@material-ui/core/styles/withStyles";

import copy from "copy-to-clipboard";

import { Redirect } from "react-router-dom";
import { useAuth } from "../store/authProvider";
import useSocket from "../customHooks/useSocket";

import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import LinearProgress from "@material-ui/core/LinearProgress";

const styles = (theme) => ({
  ...theme.styles,
  textColor: {
    color: theme.styles.colors.mainTextColor,
    marginTop: "20px",
    "& > span": {
      color: theme.styles.colors.orangeColor,
    },
  },
  secondaryTextColor: {
    color: theme.styles.colors.orangeColor,
    marginTop: "20px",
  },
  button: {
    ...theme.styles.button,
    marginTop: "20px",
  },
  center: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  copyInfo: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});

const WaitingRoom1 = ({ classes }) => {
  const { mode, roomId } = useParams();
  const [{ username }] = useAuth();
  // const [players, setPlayers] = useState([])
  // const [playerJoined, setPlayerJoined] = useState(false); // 1 other player have to join to our game to start
  // const [meReady, setMeReady] = useState(false);
  // const [otherPlayerReady, setOtherPlayerReady] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const {
    playerJoined,
    players,
    meReady,
    otherPlayerReady,
    loadingData,
    joinRoom,
    setStatusReady
  } = useSocket();

  useEffect(() => {
    joinRoom(roomId, mode, username)
  }, []);

  // useEffect(() => {
  //   // joinRoom(roomId, mode, username)
  //   if (!username) return;

  //   const socket = socketIOClient(serverUrl);
  //   socket.emit("join-room", roomId, mode, username);

  //   socket.on("user-connected", (players) => {
  //     setPlayers(players);
  //     if (Object.keys(players).length === 2) {
  //       setPlayerJoined(true);
  //     }
  //   });

  //   socket.on("player-ready", (players) => {
  //     console.log(players);
  //     setPlayers(players);
  //     Object.entries(players).forEach(([player, values]) => {
  //       if (values.ready === true) {
  //         if (player === username.toString()) {
  //           setMeReady(true);
  //         } else setOtherPlayerReady(true);
  //       }
  //     });
  //   });

  //   socket.on("room-is-full", (roomId) => {
  //     // dialog will pop up and then a click 'OK' will Link to "/"
  //     console.log("room is full");
  //   });

  //   return () => socket.disconnect();
  // }, []);

  const changeStatus = () => {
    // const socket = socketIOClient(serverUrl);
    setStatusReady(roomId, mode, username);
    // socket.emit("ready", roomId, mode, username);
  };

  if (mode !== "random") {
    if (mode !== "friend") {
      return <Redirect to="/" />;
    }
  }

  // if (!isConnected) {
  //   return <div>Loading</div>
  // }

  const copyURL = () => {
    copy(window.location.href);
    setCopySuccess(true);
  };

  if (meReady && otherPlayerReady) {
    return <Redirect to={`/game/${roomId}`} />;
  }

  if (mode === "random") {
    return (
      <div className={classes.centerToMiddle}>
        <Typography className={classes.textColor} variant="h3">
          Waiting Room!
        </Typography>
        {!playerJoined ? (
          <div>
            <Typography className={classes.secondaryTextColor} variant="h5">
              Please wait until a player join...
            </Typography>
            <LinearProgress
              style={{ marginTop: "20px", height: "20px" }}
              color="primary"
            />
          </div>
        ) : (
          <div>
            {meReady && !otherPlayerReady ? (
              <div>
                <Typography className={classes.secondaryTextColor} variant="h5">
                  Waiting for the other player to be ready...
                </Typography>
                <LinearProgress
                  style={{ marginTop: "20px", height: "20px" }}
                  color="primary"
                />
              </div>
            ) : (
              <div className={classes.center}>
                <Typography className={classes.secondaryTextColor} variant="h5">
                  Your opponent joined!
                </Typography>
                <Button
                  size="large"
                  variant="outlined"
                  className={classes.button}
                  onClick={changeStatus}
                >
                  I am Ready
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  if (mode === "friend") {
    return (
      <div className={classes.centerToMiddle}>
        <Typography className={classes.textColor} variant="h3">
          Waiting Room!
        </Typography>
        {!playerJoined ? (
          <div>
            <div className={classes.center}>
              <Typography variant="h5" className={classes.textColor}>
                {" "}
                Send this link to invite your friend:{" "}
                <span>{window.location.href}</span>
              </Typography>
              <div className={classes.copyInfo}>
                <Button
                  variant="outlined"
                  className={classes.button}
                  onClick={copyURL}
                >
                  Copy Link
                </Button>
                {copySuccess && (
                  <Typography
                    variant="h5"
                    className={classes.secondaryTextColor}
                    style={{ marginLeft: "30px" }}
                  >
                    URL Copied
                  </Typography>
                )}
              </div>
            </div>
            <div>
              <Typography className={classes.textColor} variant="h5">
                Waiting for your friends to join...
              </Typography>
              <LinearProgress
                style={{ marginTop: "20px", height: "20px", width: "50%" }}
                color="primary"
              />
            </div>
          </div>
        ) : (
          <div>
            {meReady && !otherPlayerReady ? (
              <div>
                <Typography className={classes.secondaryTextColor} variant="h5">
                  Waiting for the other player to be ready...
                </Typography>
                <LinearProgress
                  style={{ marginTop: "20px", height: "20px" }}
                  color="primary"
                />
              </div>
            ) : (
              <div className={classes.center}>
                <Typography className={classes.secondaryTextColor} variant="h5">
                  Your opponent joined!
                </Typography>
                <Button
                  size="large"
                  variant="outlined"
                  className={classes.button}
                  onClick={changeStatus}
                >
                  I am Ready
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
};

export default withStyles(styles)(WaitingRoom1);
