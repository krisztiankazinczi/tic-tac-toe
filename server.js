const express = require("express");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

const {
  checkVictoryLength5,
  checkVictoryLength4,
  checkVictoryLength3,
} = require("./utils/victoryChecks");

const {
  updateScoreOnGiveUp,
  updateScoreOnDraw,
  checkIfEveryoneLeftGame,
  getOpponentName,
} = require("./utils/gamePropertyUpdates");
const { games } = require('./games');
const { 
  testEndpoint, 
  createRoom,
  getAvailableRooms
} = require("./controller/room-controller");
const joinRoom = require("./controller/socket-controller/join-room");
const deleteRoom = require("./controller/socket-controller/delete-room");
const changeCharacter = require("./controller/socket-controller/change-character");
const playerReady = require("./controller/socket-controller/player-ready");
const getGameData = require("./controller/socket-controller/get-game-data");
const placeMark = require("./controller/socket-controller/place-mark");

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

  socket.on("join-room", joinRoom.bind(null, socket, io));

  socket.on("delete-room", deleteRoom)
  
  socket.on("change-character", changeCharacter.bind(null, io))
  
  socket.on("ready", playerReady.bind(null, io));
  
  socket.on("get-game-data", getGameData.bind(null, io));

  socket.on("place-mark", placeMark.bind(null, io));

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
