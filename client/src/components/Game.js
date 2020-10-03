import React, { useEffect, useState, useRef, useLayoutEffect } from "react";
import { useParams, Redirect } from "react-router-dom";
import withStyles from "@material-ui/core/styles/withStyles";
import clsx from "clsx";
import { useAuth } from "../store/authProvider";
import Button from "@material-ui/core/Button";

import Board from "./Game/Board";
import PlayerName from "./Game/PlayerName";
import Error from "./ModalInfo/Error";
import Confirmation from "./ModalInfo/Confirmation";
import ConfirmationWithTwoOption from "./ModalInfo/ConfirmationWithTwoOption";
import NewGameOptions from "./ModalInfo/NewGameOptions";

import socketIOClient from "socket.io-client";

import { convertPlayersObjToArray } from "../utils/helperFunctions";

const styles = (theme) => ({
  ...theme.styles,
  centerToMiddle: {
    marginRight: "auto",
    marginLeft: "auto",
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
    height: "100%",
    width: "50%",
    alignItems: "center",
    backgroundColor: theme.styles.colors.mainBackgroundColor,
  },
  playerInfo: {
    display: "flex",
    flexDirection: "row",
    marginTop: "50px",
    alignItems: "center",
    justifyContent: "space-around",
    paddingTop: "10px",
    borderTop: `2px solid ${theme.styles.colors.mainTextColor}`,
  },
  buttons: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    marginTop: "10px",
    marginBottom: "10px",
  },
  container: {
    width: "100%",
    backgroundColor: theme.styles.colors.mainBackgroundColor,
  },
});

const FONT_SIZE_CORRECTION = 0.025;

const serverUrl =
  process.env.REACT_APP_DEVELOPMENT_MODE === "true"
    ? "http://localhost:5000"
    : process.env.REACT_APP_BACK_END_URL;

const Game = ({ classes }) => {
  const { mode, roomId } = useParams();
  const [{ username }] = useAuth();
  const boardRef = useRef();
  const [width, setWidth] = useState(0);
  const [loading, setLoading] = useState(true);
  const [board, setBoard] = useState(null);
  const [playersInfo, setPlayersInfo] = useState(null);
  const [onTurn, setOnTurn] = useState("");
  const [char, setChar] = useState("");
  const [gameEnd, setGameEnd] = useState(false);
  const [info, setInfo] = useState("");
  const [exit, setExit] = useState({
    state: false,
    question: "Are you sure you want to leave this page?",
    confirm: false,
  });
  const [opponentLeft, setOpponentLeft] = useState(false);
  const [giveUp, setGiveUp] = useState({
    state: false,
    question: "Are you sure you want to give up this game?",
    confirm: false,
  });
  const [draw, setDraw] = useState({
    state: false,
    question: "Are you sure you want draw match?",
    confirm: false,
  });
  const [drawConfirmation, setDrawConfirmation] = useState({
    state: false,
    question: "",
    confirm: false,
  });
  const [newGameOptions, setNewGameOptions] = useState({
    winLength: 5,
    boardSize: 10,
    confirm: false,
    state: false,
  });
  const [newConf, setNewConf] = useState({
    state: false,
    question: "",
    confirm: false,
  });

  useEffect(() => {
    if (exit.confirm) {
      const socket = socketIOClient(serverUrl);
      socket.emit("player-left-game", roomId, mode, username, gameEnd);
    }

    if (giveUp.confirm) {
      const socket = socketIOClient(serverUrl);
      socket.emit("give-up-game", roomId, mode, username);
      setGiveUp({ ...giveUp, confirm: false });
    }

    if (draw.confirm) {
      const socket = socketIOClient(serverUrl);
      socket.emit("draw-game-offer", roomId, username);
      setDraw({ ...draw, confirm: false });
    }

    if (drawConfirmation.confirm) {
      const socket = socketIOClient(serverUrl);
      socket.emit(
        "draw-game",
        roomId,
        mode,
        drawConfirmation.confirm,
        username
      );
      setDrawConfirmation({
        ...drawConfirmation,
        confirm: false,
        question: "",
      });
    }

    if (newGameOptions.confirm) {
      const socket = socketIOClient(serverUrl);
      socket.emit(
        "new-game-offer",
        roomId,
        username,
        newGameOptions.winLength,
        newGameOptions.boardSize
      );
      setNewGameOptions({ ...newGameOptions, confirm: false });
    }

    if (newConf.confirm) {
      console.log(newConf)
      const socket = socketIOClient(serverUrl);
      socket.emit(
        "rematch",
        roomId,
        mode,
        newConf.confirm,
        username,
        newGameOptions.winLength,
        newGameOptions.boardSize
      );
      setNewConf({
        ...newConf,
        confirm: false,
        question: "",
      });
    }

  }, [exit, giveUp, draw, drawConfirmation, newGameOptions.confirm, newConf.confirm]);

  useEffect(() => {
    if (!username) return;

    const socket = socketIOClient(serverUrl);
    socket.emit("join-room", roomId, mode, username);

    socket.on("get-initial-data", (playerInfo, board, onTurn, winLength) => {
      setLoading(true);
      setGameEnd(false);
      setChar(playerInfo[username].character);
      setNewGameOptions({ ...newGameOptions, winLength, boardSize: board.length });
      const convertedPlayersInfo = convertPlayersObjToArray(
        playerInfo,
        username
      );
      setPlayersInfo(convertedPlayersInfo);
      setBoard(board);
      setOnTurn(onTurn);
      setTimeout(() => {
        // I had to do this, because offsetWidth value was undefined in 1 player, because the first get the values earlier
        setLoading(false);
        if (boardRef.current) {
          setWidth(boardRef.current.offsetWidth);
        }
      }, 1000);
    });

    socket.on("placed-mark", (rowId, colId, char, onTurn) => {
      const updatedBoard = [...board];
      updatedBoard[rowId][colId] = char;
      setBoard(updatedBoard);
      setOnTurn(onTurn);
    });

    socket.on("error-to-specific-user", (errorMessage, user) => {
      if (user === username) {
        setInfo(errorMessage);
      }
    });

    socket.on("victory", (rowId, colId, char, msg, players) => {
      const updatedBoard = [...board];
      updatedBoard[rowId][colId] = char;
      setBoard(updatedBoard);
      setGameEnd(true);
      setInfo(msg);
      const convertedPlayersInfo = convertPlayersObjToArray(players, username);
      setPlayersInfo(convertedPlayersInfo);
    });

    socket.on("game-ended", (players, message) => {
      const convertedPlayersInfo = convertPlayersObjToArray(players, username);
      setPlayersInfo(convertedPlayersInfo);
      setGameEnd(true);
      setInfo(message);
    });

    socket.on("opponent-left", (players, user, messageToOther) => {
      const convertedPlayersInfo = convertPlayersObjToArray(players, username);
      setPlayersInfo(convertedPlayersInfo);
      setGameEnd(true);
      setInfo(messageToOther);
      setOpponentLeft(true);
    });

    socket.on("draw-confirmation", (message, requestUser) => {
      if (requestUser !== username) {
        setDrawConfirmation({
          ...drawConfirmation,
          state: true,
          question: message,
        });
      }
    });

    socket.on(
      "new-game-confirmation",
      (message, requestUser, winLength, boardSize) => {
        if (requestUser !== username) {
          // this 2 function are not working, but why?????
          console.log(newConf)
          setNewConf({
            ...newConf,
            state: true,
            question: message,
          })
          setNewGameOptions({ ...newGameOptions, winLength, boardSize });
          console.log(newConf)
        }
      }
    );

    socket.on("get-rematch-data", (board, winLength, onTurn) => {
      setBoard(board);
      setNewGameOptions({ ...newGameOptions, winLength, boardSize: board.length });
      setOnTurn(onTurn)
    })

    if (!board) {
      socket.emit("get-game-data", roomId, mode, username);
    }

    return () => {
      socket.disconnect();
    };
  }, [board, username]);
  // can I do this without the board in the dependancy array?

  const placeMark = (rowId, colId, char) => {
    if (onTurn !== username) {
      setInfo("It's not your turn, please wait!");
      return;
    }
    if (board[rowId][colId] !== "") {
      setInfo("This field is not empty, please select an other one!");
      return;
    }
    if (gameEnd) {
      setInfo("The game has been finished.");
      return;
    }

    const socket = socketIOClient(serverUrl);
    socket.emit("place-mark", roomId, mode, username, rowId, colId, char);
  };

  const newGame = () => {
    setNewGameOptions({ ...newGameOptions, state: true });
  };

  const leaveGame = () => {
    setExit({ question: exit.question, state: true, confirm: false });
    // event trigger happens in a useEffect, when the player confirmed the leave
  };

  const drawGame = () => {
    setDraw({ ...draw, state: true });
  };

  const givingUp = () => {
    setGiveUp({ ...giveUp, state: true });
  };

  const containerWidth = {
    width: `${width}px`,
  };

  const fontSize = {
    fontSize: `${width * FONT_SIZE_CORRECTION}px`,
  };

  if (loading) {
    return <div>Loading</div>;
  }

  if (exit.state) {
    return <Confirmation confirmation={exit} setConfirmation={setExit} />;
  }

  if (giveUp.state) {
    return <Confirmation confirmation={giveUp} setConfirmation={setGiveUp} />;
  }

  if (draw.state) {
    return <Confirmation confirmation={draw} setConfirmation={setDraw} />;
  }

  if (drawConfirmation.state === true) {
    return (
      <ConfirmationWithTwoOption
        confirmation={drawConfirmation}
        setConfirmation={setDrawConfirmation}
      />
    );
  }

  if (newGameOptions.state === true) {
    return (
      <NewGameOptions
        newGameOptions={newGameOptions}
        setNewGameOptions={setNewGameOptions}
      />
    );
  }

  if (newConf.state === true) {
    return (
      <ConfirmationWithTwoOption
        confirmation={newConf}
        setConfirmation={setNewConf}
      />
    );
  }

  if (exit.confirm) {
    return <Redirect to="/" />;
  }

  if (info) {
    return (
      <Error message={info} setError={setInfo} buttonNeeded timeLimit={2} />
    );
  }

  return (
    <div className={classes.container}>
      <div ref={boardRef} className={classes.centerToMiddle}>
        <div className={classes.buttons} style={containerWidth}>
          {!gameEnd ? (
            <div className={classes.buttons} style={containerWidth}>
              <Button
                onClick={() => givingUp()}
                style={fontSize}
                variant="outlined"
                color="primary"
              >
                Give up
              </Button>
              <Button
                onClick={() => drawGame()}
                style={fontSize}
                variant="outlined"
                color="primary"
              >
                Draw?
              </Button>
              <Button
                onClick={() => leaveGame()}
                style={fontSize}
                variant="outlined"
                color="primary"
              >
                Leave Game
              </Button>
            </div>
          ) : (
            <div className={classes.buttons} style={containerWidth}>
              {!opponentLeft && (
                <Button
                  onClick={() => newGame()}
                  style={fontSize}
                  variant="outlined"
                  color="primary"
                >
                  Rematch
                </Button>
              )}
              <Button
                onClick={() => leaveGame()}
                style={fontSize}
                variant="outlined"
                color="primary"
              >
                Leave Game
              </Button>
            </div>
          )}
        </div>
        <Board width={width} board={board} placeMark={placeMark} char={char} />
        <div className={classes.playerInfo} style={containerWidth}>
          {playersInfo.map((player, id) => (
            <PlayerName
              key={id}
              fontSize={width * FONT_SIZE_CORRECTION}
              char={player[Object.keys(player)[0]].character}
              username={Object.keys(player)[0]}
              score={player[Object.keys(player)[0]].score}
              active={onTurn === Object.keys(player)[0] ? true : false}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default withStyles(styles)(Game);
