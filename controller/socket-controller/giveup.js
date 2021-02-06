const { games } = require("../../games");
const { updateScoreOnGiveUp } = require("../../utils/gamePropertyUpdates");

const giveUp = (io, roomId, mode, username) => {
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
};

module.exports = giveUp;