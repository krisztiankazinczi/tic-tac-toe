const { games } = require("../../games");
const { getOpponentName, updateScoreOnDraw } = require("../../utils/gamePropertyUpdates");

const draw = (io, roomId, mode, acceptance, username) => {
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
}

module.exports = draw;