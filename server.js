const express = require("express");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const { v4: uuidv4 } = require("uuid");

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
  console.log("User connected " + socket.id);
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
    console.log(roomId, mode, username);
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
      games[mode][roomId].players.tie = {
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
        games[mode][roomId].board
      );
  });

  socket.on("disconnect", () => {
    console.log(`user ${socket.id} disconnected`);
  });
});

// Anything that doesn't match the above, send back index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "/client/build/index.html"));
});

server.listen(port, () => console.log(`App is running on port: ${port}`));
