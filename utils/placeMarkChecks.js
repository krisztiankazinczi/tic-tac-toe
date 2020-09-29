const isFieldReserved = (board, rowId, colId) => {
  return board[rowId][colId] !== "" ? true : false;
};

const correctPlayerMove = (onTurnPlayer, actualPlayerName) => {
  return onTurnPlayer === actualPlayerName ? true : false;
};

const changeOnTurn = (previousState, players) => {
  const playerNames = Object.keys(players);
  let newState;
  playerNames.forEach((name) => {
    if (name !== previousState && name !== "Tie") {
      newState = name;
    }
  });
  return newState;
};

module.exports = {
  isFieldReserved,
  correctPlayerMove,
  changeOnTurn,
};
