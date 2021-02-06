const { games } = require("../../games");
const { checkDraw } = require("../../utils/victoryChecks");
const { correctPlayerMove, isFieldReserved, changeOnTurn } = require("../../utils/placeMarkChecks");
const { updateScoreOnVictory, updateScoreOnDraw } = require("../../utils/gamePropertyUpdates");

const placeMark = (io, roomId, mode, username, rowId, colId, char) => {
  const correctPlayer = correctPlayerMove(
    games[mode][roomId].onTurn,
    username
  );
  if (!correctPlayer) {
    io.sockets
      .in(roomId)
      .emit(
        "error-to-specific-user",
        "It's not your turn, please wait!",
        username
      );
    //why is this socket.emit not working????
    return;
  }
  const reserved = isFieldReserved(games[mode][roomId].board, rowId, colId);
  if (reserved) {
    io.sockets
      .in(roomId)
      .emit(
        "error-to-specific-user",
        "This field is not empty, please select an other one!",
        username
      );
    return;
  }
  games[mode][roomId].board[rowId][colId] = char;

  const winner = games[mode][roomId].winCheck(
    games[mode][roomId].board,
    char
  );
  if (winner) {
    games[mode][roomId].players = updateScoreOnVictory(
      games[mode][roomId].players,
      username
    );
    io.sockets
      .in(roomId)
      .emit(
        "victory",
        rowId,
        colId,
        char,
        `${username} has won the game. Congrats!`,
        games[mode][roomId].players
      );
    return;
  }

  const emptyFieldsLeft = checkDraw(games[mode][roomId].board);
  if (!emptyFieldsLeft) {
    games[mode][roomId].players = updateScoreOnDraw(
      games[mode][roomId].players
    );
    io.sockets
      .in(roomId)
      .emit(
        "victory",
        rowId,
        colId,
        char,
        "The game has been draw.",
        games[mode][roomId].players
      );
    return;
  }

  games[mode][roomId].onTurn = changeOnTurn(
    games[mode][roomId].onTurn,
    games[mode][roomId].players
  );
  io.sockets
    .in(roomId)
    .emit("placed-mark", rowId, colId, char, games[mode][roomId].onTurn);
}

module.exports = placeMark;