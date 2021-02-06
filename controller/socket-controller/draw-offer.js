const drawOffer = (io, roomId, username) => {
  io.sockets
    .in(roomId)
    .emit(
      "draw-confirmation",
      `${username} would like a draw match. Will you accept that?`,
      username
    );
}

module.exports = drawOffer;