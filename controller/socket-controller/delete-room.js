const { games } = require("../../games");

const deleteRoom = (roomId, mode, username) => {
  if (mode !== 'friend' && mode !== 'random') return;

  if (games[mode]?.[roomId]?.players?.[username]) {
    delete games[mode][roomId]
  }
}

module.exports = deleteRoom;