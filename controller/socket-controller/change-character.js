const { games } = require("../../games");
const { isCharacterUsed } = require("../../utils/gamePropertyUpdates");

const changeCharacter = (io, roomId, mode, username, character) => {
  const characterUsed = isCharacterUsed(games[mode][roomId].players, character);

  if (characterUsed) {
    io.sockets.in(roomId).emit("char-used", `Unfortunately your opponent selected this character (${character}). Please select an other one!`, username)
    return;
  }
  games[mode][roomId].players[username].character = character;
}

module.exports = changeCharacter;