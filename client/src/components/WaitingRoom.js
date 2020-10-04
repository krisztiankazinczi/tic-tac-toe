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

import Error from "./ModalInfo/Error";
import SetUser from "./SetUser";

import socketIOClient from "socket.io-client";

import Picker from "emoji-picker-react";

const serverUrl =
  process.env.REACT_APP_DEVELOPMENT_MODE === "true"
    ? "http://localhost:5000"
    : process.env.REACT_APP_BACK_END_URL;

const styles = (theme) => ({
  ...theme.styles,
  textColor: {
    color: theme.styles.colors.mainTextColor,
    marginTop: "20px",
    "& > span": {
      color: theme.styles.colors.orangeColor,
    },
  },
  interactiveTextColor: {
    color: theme.palette.primary.main,
    marginTop: "20px",
  },
  button: {
    fontSize: "25px",
    marginTop: "20px",
    textTransform: "none",
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
  selectedChar: {
    color: theme.palette.primary.main,
    marginTop: "5px",
    marginBottom: '20px',
    fontSize: '25px'
  },
  infoText: {
    color: theme.styles.colors.orangeColor,
    marginTop: "10px",
    marginBottom: '5px',
    fontSize: '15px'
  }
});

const WaitingRoom = ({ classes }) => {
  const { mode, roomId } = useParams();
  const [{ username }] = useAuth();
  const [signedOut, setSignedOut] = useState(false);
  const [players, setPlayers] = useState([]);
  const [playerJoined, setPlayerJoined] = useState(false); // 1 other player have to join to our game to start
  const [meReady, setMeReady] = useState(false);
  const [otherPlayerReady, setOtherPlayerReady] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [joinError, setJoinError] = useState(false);
  const [error, setError] = useState("");
  const [chosenEmoji, setChosenEmoji] = useState(null);
  // const {isConnected, everyoneConnected, loadingData, joinRoom} = useSocket();

  useEffect(() => {
    if (chosenEmoji) {
      const socket = socketIOClient(serverUrl);
      socket.emit("change-character", roomId, mode, username, chosenEmoji.emoji);
    }
  }, [chosenEmoji])

  useEffect(() => {
    // joinRoom(roomId, mode, username)
    if (!username) {
      setSignedOut(true)
      return;
    } 

    const socket = socketIOClient(serverUrl);
    socket.emit("join-room", roomId, mode, username);

    socket.on("user-connected", (players) => {
      setPlayers(players);
      if (Object.keys(players).length === 2) {
        setPlayerJoined(true);
      }
    });

    socket.on("player-ready", (players) => {
      setPlayers(players);
      Object.entries(players).forEach(([player, values]) => {
        if (values.ready === true) {
          if (player === username.toString()) {
            setMeReady(true);
          } else setOtherPlayerReady(true);
        }
      });
    });

    socket.on("joining-errors", (message) => {
      // dialog will pop up and then a click 'OK' will Link to "/"
      setError(message);
      setTimeout(() => {
        setJoinError(true);
      }, 2000);
    });

    socket.on("char-used", (message, user) => {
      if (user === username) {
        setError(message);
        setChosenEmoji(null)
      }
    })

    return () => socket.disconnect();
  }, [username]);

  const setStatusToReady = () => {
    const socket = socketIOClient(serverUrl);
    socket.emit("ready", roomId, mode, username);
  };
  const copyURL = () => {
    copy(window.location.href);
    setCopySuccess(true);
  };

  const deleteRoom = () => {
    const socket = socketIOClient(serverUrl);
    socket.emit("delete-room", roomId, mode, username);
    setJoinError(true); // just using this to redirect back
  };

  const onEmojiClick = (event, emojiObject) => {
    setChosenEmoji(emojiObject);
  };

  if (mode !== "random") {
    if (mode !== "friend") {
      return <Redirect to="/" />;
    }
  }

  if (signedOut) {
    return <SetUser open={signedOut} setOpen={setSignedOut} />;
  }

  if (joinError) {
    return <Redirect to="/selectGameMode" />;
  }

  if (meReady && otherPlayerReady) {
    return <Redirect to={`/game/${mode}/${roomId}`} />;
  }

  if (error) {
    return (
      <Error message={error} setError={setError} buttonNeeded timeLimit={2} />
    );
  }

  if (mode === "random") {
    return (
      <div className={classes.centerToMiddle}>
        <Typography className={classes.textColor} variant="h3">
          Waiting Room!
        </Typography>
        {!playerJoined ? (
          <div>
            <Typography className={classes.interactiveTextColor} variant="h5">
              Please wait until a player join...
            </Typography>
            <LinearProgress
              style={{ marginTop: "20px", height: "20px" }}
              color="primary"
            />
            <div className={classes.center}>
              <Button
                size="medium"
                variant="outlined"
                color="secondary"
                className={classes.button}
                onClick={deleteRoom}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div>
            {meReady && !otherPlayerReady ? (
              <div>
                <Typography
                  className={classes.interactiveTextColor}
                  variant="h5"
                >
                  Waiting for the other player to be ready...
                </Typography>
                <LinearProgress
                  style={{ marginTop: "20px", height: "20px" }}
                  color="primary"
                />
              </div>
            ) : (
              <div className={classes.center}>
                <div>
                  <div className={classes.infoText}>You can select an emoji as character:</div>
                  {chosenEmoji ? (
                    <div className={classes.selectedChar} >Your character {chosenEmoji.emoji}</div>
                  ) : (
                    <div className={classes.selectedChar}>No emoji Chosen</div>
                  )}
                  <Picker onEmojiClick={onEmojiClick} />
                </div>
                <Typography
                  className={classes.interactiveTextColor}
                  variant="h5"
                >
                  Your opponent joined!
                </Typography>
                <Button
                  size="medium"
                  variant="outlined"
                  color="primary"
                  className={classes.button}
                  onClick={setStatusToReady}
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
              <div className={classes.copyInfo}>
                <Button
                  variant="outlined"
                  color="primary"
                  className={classes.button}
                  onClick={copyURL}
                >
                  Send this link to someone
                </Button>
                {copySuccess && (
                  <Typography
                    variant="h5"
                    className={classes.interactiveTextColor}
                    style={{ marginLeft: "30px" }}
                  >
                    URL Copied
                  </Typography>
                )}
              </div>
              <Typography className={classes.textColor} variant="h5">
                Waiting for your friends to join...
              </Typography>
              <LinearProgress
                style={{ marginTop: "20px", height: "20px", width: "100%" }}
                color="primary"
              />
            </div>
            <div></div>
          </div>
        ) : (
          <div>
            {meReady && !otherPlayerReady ? (
              <div>
                <Typography
                  className={classes.interactiveTextColor}
                  variant="h5"
                >
                  Waiting for the other player to be ready...
                </Typography>
                <LinearProgress
                  style={{ marginTop: "20px", height: "20px" }}
                  color="primary"
                />
              </div>
            ) : (
              <div className={classes.center}>
                <div>
                  <div className={classes.infoText}>You can select an emoji as character:</div>
                  {chosenEmoji ? (
                    <div className={classes.selectedChar} >Your character {chosenEmoji.emoji}</div>
                  ) : (
                    <div className={classes.selectedChar}>No emoji Chosen</div>
                  )}
                  <Picker onEmojiClick={onEmojiClick} />
                </div>
                <Typography
                  className={classes.interactiveTextColor}
                  variant="h5"
                >
                  Your opponent joined!
                </Typography>
                <Button
                  size="medium"
                  variant="outlined"
                  color="primary"
                  className={classes.button}
                  onClick={setStatusToReady}
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

export default withStyles(styles)(WaitingRoom);
