const { games } = require("../../games");

const playerReady = (io, roomId, mode, username) => {
  // validation
  games[mode][roomId].players[username].ready = true;
  io.sockets.in(roomId).emit("player-ready", games[mode][roomId].players);
}

module.exports = playerReady;