const express = require("express");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

const { 
  testEndpoint, 
  createRoom,
  getAvailableRooms
} = require("./controller/room-controller");
const {
  joinRoom,
  deleteRoom,
  changeCharacter,
  playerReady,
  getGameData,
  placeMark,
  drawOffer,
  newGameOffer,
  draw,
  giveUp,
  rematch,
  playerLeaving
} = require('./controller/socket-controller');

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
  socket.on("draw-game-offer", drawOffer.bind(null, io));
  socket.on("new-game-offer", newGameOffer.bind(null, io));
  socket.on("draw-game", draw.bind(null, io));
  socket.on("give-up-game", giveUp.bind(null, io));
  socket.on("rematch", rematch.bind(null, io));
  socket.on("player-left-game", playerLeaving.bind(null, io));
  socket.on("disconnect", () => {
    // console.log(`user ${socket.id} disconnected`);
  });
});

// Anything that doesn't match the above, send back index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "/client/build/index.html"));
});

server.listen(port, () => console.log(`App is running on port: ${port}`));
