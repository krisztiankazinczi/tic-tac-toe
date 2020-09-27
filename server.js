const express = require("express");
const cors = require("cors");
const path = require('path');
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
app.use(express.static(path.join(__dirname, 'client/build')))


app.get("/api/test", (req, res) => {
  res.status(200).json("The API is working")
});

app.post("/roomId", (req, res) => {
  const { mode, boardSize, winLength, myChar } = req.body;
  const roomId = uuidv4();
  games[mode][roomId] = {};
      games[mode][roomId].boardSize = boardSize;
      games[mode][roomId].winLength = winLength;
      games[mode][roomId].firstChar = myChar;
      games[mode][roomId].players = {};

  res.json(roomId);
});

let games = {
  friend: {},
  random: {}
};


io.on('connection', socket => {
  console.log("User connected " + socket.id)
  socket.on("get-roomId", (mode, boardSize, winLength, myChar) => {
    const roomId = uuidv4();
      games[mode][roomId] = {};
      games[mode][roomId].boardSize = boardSize;
      games[mode][roomId].winLength = winLength;
      games[mode][roomId].firstChar = myChar;
      games[mode][roomId].players = {};
      // for some reason socket.emit not worked but if I used both emit and broadcast.emit it worked...
      socket.emit("room-id", roomId);
      socket.broadcast.emit("room-id", roomId)
  });

  socket.on("join-room", (roomId, mode, username) => {
    if (games[mode][roomId].players && Object.keys(games[mode][roomId].players).length === 2) {
      socket.emit("room-is-full");
      return;
    }
    socket.join(roomId);
    games[mode][roomId].players[username] = {
      ready: false,
        win: 0,
        lost: 0,
        tie: 0
    };

    io.sockets.in(roomId).emit("user-connected", games[mode][roomId].players);
    // if (Object.keys(games[mode][roomId].players).length === 2) {
    //   socket.to(roomId).broadcast.emit("everyone-connected", games[mode][roomId].players)
    // }

  });

  socket.on("ready", (roomId, mode, username) => {
    games[mode][roomId].players[username].ready = true
    io.sockets.in(roomId).emit("player-ready", games[mode][roomId].players);
  })




  socket.on('disconnect', () => {
    console.log(`user ${socket.id} disconnected`);
  });
});






// Anything that doesn't match the above, send back index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/client/build/index.html'))
})




server.listen(port, () => console.log(`App is running on port: ${port}`));