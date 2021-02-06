const newGameOffer = (io, roomId, username, winLength, boardSize) => {

  io.sockets
    .in(roomId)
    .emit(
      "new-game-confirmation",
      `${username} would like to play a rematch. Would you like too?`,
      username, 
      winLength,
      boardSize
    );
}

module.exports = newGameOffer;