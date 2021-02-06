const { games } = require("../../games");

const getGameData = (io, roomId, mode, username) => {
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
}

module.exports = getGameData;