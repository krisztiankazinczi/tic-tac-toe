const express = require("express");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const { v4: uuidv4 } = require("uuid");

const {
  isFieldReserved,
  correctPlayerMove,
  changeOnTurn,
} = require("./utils/placeMarkChecks");
const {
  checkVictoryLength5,
  checkVictoryLength4,
  checkVictoryLength3,
  checkDraw,
} = require("./utils/victoryChecks");

const {
  updateScoreOnGiveUp,
  updateScoreOnVictory,
  updateScoreOnDraw,
  checkIfEveryoneLeftGame,
  getOpponentName,
  isCharacterUsed
} = require("./utils/gamePropertyUpdates");
const { games } = require('./games');
const { 
  testEndpoint, 
  createRoom,
  getAvailableRooms
} = require("./controller/room-controller");

const app = express();

const server = require("http").Server(app);
const io = require("socket.io")(server);

const port = process.env.PORT || 5000;

const whitelist = process.env.DEVELOPMENT_MODE
  ? ["https://amobagame.herokuapp.com", "http://localhost:3000"]
  : ["https://amobagame.herokuapp.com"];

const corsOptions = {
  origin: whitelist,
};

app.use(cors(corsOptions));

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));

// Serve static files from the React frontend app
app.use(express.static(path.join(__dirname, "client/build")));

app.get("/api/test", testEndpoint);

app.post("/roomId", createRoom);

app.get('/availableRooms', getAvailableRooms)

io.on("connection", (socket) => {

  socket.on("join-room", (roomId, mode, username) => {

    if (mode !== "random") {
      if (mode !== "friend") {
        socket.emit("joining-errors", "The selected Game Mode is not supported. Please select an existing mode"); 
        return;
      }
    }
    
    if (!games[mode][roomId]) {
      socket.emit("joining-errors", "This room is not existing. Please create one if you want to play."); 
      return;
    }

    if (games[mode][roomId].isFull && !games[mode][roomId].players[username]) {
      socket.emit("joining-errors", "The room is full, select an other room."); 
      return;
    } else {
      socket.join(roomId);
  
      if (!games[mode][roomId].players[username]) {
        let myChar;
        Object.entries(games[mode][roomId].players).forEach(
          ([username, values]) => {
            myChar = values.character === "X" ? "O" : "X";
          }
        );
        games[mode][roomId].players[username] = {
          character: myChar,
          ready: false,
          score: 0,
          active: true,
        };
      }
  
      io.sockets.in(roomId).emit("user-connected", games[mode][roomId].players);
  
      if (Object.keys(games[mode][roomId].players).length === 2) {
        games[mode][roomId].isFull = true;
        games[mode][roomId].players.Tie = {
          score: 0,
        };
      }

    }
  });

  socket.on("delete-room", (roomId, mode, username) => {
    if (games[mode][roomId].players[username]) {
      delete games[mode][roomId]
    }
  })

  socket.on("change-character", (roomId, mode, username, character) => {
    const characterUsed = isCharacterUsed(games[mode][roomId].players, character);
    console.log(characterUsed)
    if (characterUsed) {
      io.sockets.in(roomId).emit("char-used", `Unfortunately your opponent selected this character (${character}). Please select an other one!`, username)
      return;
    }
    games[mode][roomId].players[username].character = character;
  })

  socket.on("ready", (roomId, mode, username) => {
    // validation
    games[mode][roomId].players[username].ready = true;
    io.sockets.in(roomId).emit("player-ready", games[mode][roomId].players);
  });

  socket.on("get-game-data", (roomId, mode, username) => {
    //socket.emit not working for some reason.....
    // validation
    io.sockets
      .in(roomId)
      .emit(
        "get-initial-data",
        games[mode][roomId].players,
        games[mode][roomId].board,
        games[mode][roomId].onTurn,
        games[mode][roomId].winLength
      );
  });

  socket.on("place-mark", (roomId, mode, username, rowId, colId, char) => {
    const correctPlayer = correctPlayerMove(
      games[mode][roomId].onTurn,
      username
    );
    if (!correctPlayer) {
      io.sockets
        .in(roomId)
        .emit(
          "error-to-specific-user",
          "It's not your turn, please wait!",
          username
        );
      //why is this socket.emit not working????
      return;
    }
    const reserved = isFieldReserved(games[mode][roomId].board, rowId, colId);
    if (reserved) {
      io.sockets
        .in(roomId)
        .emit(
          "error-to-specific-user",
          "This field is not empty, please select an other one!",
          username
        );
      return;
    }
    games[mode][roomId].board[rowId][colId] = char;

    const winner = games[mode][roomId].winCheck(
      games[mode][roomId].board,
      char
    );
    if (winner) {
      games[mode][roomId].players = updateScoreOnVictory(
        games[mode][roomId].players,
        username
      );
      io.sockets
        .in(roomId)
        .emit(
          "victory",
          rowId,
          colId,
          char,
          `${username} has won the game. Congrats!`,
          games[mode][roomId].players
        );
      return;
    }

    const emptyFieldsLeft = checkDraw(games[mode][roomId].board);
    if (!emptyFieldsLeft) {
      games[mode][roomId].players = updateScoreOnDraw(
        games[mode][roomId].players
      );
      io.sockets
        .in(roomId)
        .emit(
          "victory",
          rowId,
          colId,
          char,
          "The game has been draw.",
          games[mode][roomId].players
        );
      return;
    }

    games[mode][roomId].onTurn = changeOnTurn(
      games[mode][roomId].onTurn,
      games[mode][roomId].players
    );
    io.sockets
      .in(roomId)
      .emit("placed-mark", rowId, colId, char, games[mode][roomId].onTurn);
  });

  socket.on("draw-game-offer", (roomId, username) => {
    io.sockets
      .in(roomId)
      .emit(
        "draw-confirmation",
        `${username} would like a draw match. Will you accept that?`,
        username
      );
  });

  socket.on(
    "new-game-offer",
    (roomId, username, winLength, boardSize) => {

      io.sockets
        .in(roomId)
        .emit(
          "new-game-confirmation",
          `${username} would like to play a rematch. Would you like too?`,
          username, 
          winLength,
          boardSize
        );
    }
  );

  socket.on("draw-game", (roomId, mode, acceptance, username) => {
    if (acceptance === "YES") {
      games[mode][roomId].players = updateScoreOnDraw(
        games[mode][roomId].players
      );
      io.sockets
        .in(roomId)
        .emit(
          "game-ended",
          games[mode][roomId].players,
          "The game has been draw."
        );
      return;
    } else {
      io.sockets
        .in(roomId)
        .emit(
          "error-to-specific-user",
          `${username} has not accepted your draw request.`,
          getOpponentName(games[mode][roomId].players, username)
        );
    }
  });

  socket.on("give-up-game", (roomId, mode, username) => {
    games[mode][roomId].players = updateScoreOnGiveUp(
      games[mode][roomId].players,
      username
    );
    io.sockets
      .in(roomId)
      .emit(
        "game-ended",
        games[mode][roomId].players,
        `${username} has given up the game.`
      );
  });

  socket.on("rematch", (roomId, mode, username, winLength, boardSize) => {
    
      const generatedBoard = Array(boardSize)
        .fill()
        .map(() => Array(boardSize).fill(""));

      games[mode][roomId].board = generatedBoard;
      games[mode][roomId].winLength = winLength;
      games[mode][roomId].winCheck =
        parseInt(winLength) === 5
          ? checkVictoryLength5
          : parseInt(winLength) === 4
          ? checkVictoryLength4
          : checkVictoryLength3;
      
      io.sockets
        .in(roomId)
        .emit(
          "get-rematch-data",
          games[mode][roomId].board,
          games[mode][roomId].winLength,
          games[mode][roomId].onTurn,
        );
    
    // else {
    //   const oppname = getOpponentName(games[mode][roomId].players, username);
    //   console.log(oppname);
    //   io.sockets
    //     .in(roomId)
    //     .emit(
    //       "error-to-specific-user",
    //       `${username} has not accepted your rematch request.`,
    //       getOpponentName(games[mode][roomId].players, username)
    //     );
    
  });

  socket.on("player-left-game", (roomId, mode, username, gameEnd) => {
    games[mode][roomId].players[username].active = false;
    const isEveryOneLeft = checkIfEveryoneLeftGame(games[mode][roomId].players);

    if (isEveryOneLeft) {
      games[mode][roomId].active = false;
      delete games[mode][roomId];
      return;
    }

    if (!gameEnd) {
      games[mode][roomId].players = updateScoreOnGiveUp(
        games[mode][roomId].players,
        username
      );
    }

    const message = !gameEnd ? `${username} left the game. You won!` : `${username} left the game.`

    io.sockets
      .in(roomId)
      .emit(
        "opponent-left",
        games[mode][roomId].players,
        username,
        message
      );
  });

  socket.on("disconnect", () => {
    // console.log(`user ${socket.id} disconnected`);
  });
});

// Anything that doesn't match the above, send back index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "/client/build/index.html"));
});

server.listen(port, () => console.log(`App is running on port: ${port}`));
