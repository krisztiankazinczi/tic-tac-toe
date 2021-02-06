const {
  updateScoreOnGiveUp,
  checkIfEveryoneLeftGame,
} = require("../../utils/gamePropertyUpdates");
const { games } = require("../../games");

const playerLeaving = (io, roomId, mode, username, gameEnd) => {
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
};

module.exports = playerLeaving;