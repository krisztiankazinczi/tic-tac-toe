const {
  checkVictoryLength5,
  checkVictoryLength4,
  checkVictoryLength3,
} = require("../../utils/victoryChecks");
const { games } = require("../../games");

const rematch = (io, roomId, mode, username, winLength, boardSize) => {
    
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

}

module.exports = rematch;