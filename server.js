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
} = require("./utils/victoryChecks");

const { updateScoreOnGiveUp } = require("./utils/gamePropertyUpdates");

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

app.get("/api/test", (req, res) => {
  res.status(200).json("The API is working");
});

app.post("/roomId", (req, res) => {
  const { mode, boardSize, winLength, myChar, username } = req.body;
  const roomId = uuidv4();
  games[mode][roomId] = {};
  games[mode][roomId].boardSize = boardSize;
  games[mode][roomId].winLength = winLength;
  // games[mode][roomId].characters = {[username]: myChar};
  games[mode][roomId].players = {
    [username]: {
      character: myChar,
      ready: false,
      score: 0,
    },
  };
  games[mode][roomId].onTurn = username;

  const generatedBoard = Array(boardSize)
    .fill()
    .map(() => Array(boardSize).fill(""));

  games[mode][roomId].board = generatedBoard;

  res.json(roomId);
});

let games = {
  friend: {},
  random: {},
};

io.on("connection", (socket) => {
  // console.log("User connected " + socket.id);
  // socket.on("get-roomId", (mode, boardSize, winLength, myChar, username) => {
  //   const roomId = uuidv4();
  //     games[mode][roomId] = {};
  //     games[mode][roomId].boardSize = boardSize;
  //     games[mode][roomId].winLength = winLength;
  //     games[mode][roomId].characters = {username: myChar};
  //     games[mode][roomId].players = {};

  //     const generatedBoard = Array(boardSize)
  //     .fill()
  //     .map(() => Array(boardSize).fill(""));

  //     games[mode][roomId].board = generatedBoard;

  //     // for some reason socket.emit not worked but if I used both emit and broadcast.emit it worked...
  //     socket.emit("room-id", roomId);
  //     socket.broadcast.emit("room-id", roomId)
  // });

  socket.on("join-room", (roomId, mode, username) => {
    if (mode !== "random") {
      if (mode !== "friend") {
        return; // custom error event + error message
      }
    }

    if (
      games[mode][roomId].players &&
      Object.keys(games[mode][roomId].players).length === 2
    ) {
      socket.emit("room-is-full"); // custom error event + error message
      return;
    }
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
      };
    }

    io.sockets.in(roomId).emit("user-connected", games[mode][roomId].players);

    if (Object.keys(games[mode][roomId].players).length === 2) {
      games[mode][roomId].players.Tie = {
        score: 0,
      };
    }
  });

  socket.on("ready", (roomId, mode, username) => {
    // validation
    games[mode][roomId].players[username].ready = true;
    io.sockets.in(roomId).emit("player-ready", games[mode][roomId].players);
  });

  socket.on("get-game-data", (roomId, mode, username) => {
    // validation
    io.sockets
      .in(roomId)
      .emit(
        "get-initial-data",
        games[mode][roomId].players,
        games[mode][roomId].board,
        games[mode][roomId].onTurn
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
        .emit("error-to-specific-user", "It's not your turn", username);
      // socket.emit("other-player-turn", "It's not your turn", username);
      //why is this socket.emit not working????
      return;
    }
    const reserved = isFieldReserved(games[mode][roomId].board, rowId, colId);
    if (reserved) {
      io.sockets
        .in(roomId)
        .emit(
          "error-to-specific-user",
          "This field is not free. Select an other one.",
          username
        );
      return;
    }
    games[mode][roomId].board[rowId][colId] = char;

    const winner = checkVictoryLength3(games[mode][roomId].board, char);
    if (winner) {
      io.sockets.in(roomId).emit("victory", rowId, colId, char, "gyozelem");
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

  socket.on("draw-game", (roomId, mode) => {
    games[mode][roomId].players["Tie"].score += 1;
    io.sockets.in(roomId).emit("game-ended", games[mode][roomId].players);
  });

  socket.on("give-up-game", (roomId, mode, username) => {
    games[mode][roomId].players = updateScoreOnGiveUp(
      games[mode][roomId].players,
      username
    );
    io.sockets.in(roomId).emit("game-ended", games[mode][roomId].players);
  });

  socket.on("rematch", (roomId, mode) => {
    const generatedBoard = Array(10)
      .fill()
      .map(() => Array(10).fill(""));

    games[mode][roomId].board = generatedBoard;

    io.sockets
      .in(roomId)
      .emit(
        "get-initial-data",
        games[mode][roomId].players,
        games[mode][roomId].board,
        games[mode][roomId].onTurn
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
