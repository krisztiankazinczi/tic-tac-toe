const { games } = require("../../games");

const joinRoom = (socket, io, roomId, mode, username) => {

  if (mode !== "random") {
    if (mode !== "friend") {
      socket.emit("joining-errors", "The selected Game Mode is not supported. Please select an existing mode"); 
      return;
    }
  }
  
  if (!games[mode][roomId]) {
    socket.emit("joining-errors", "This room is not existing. Please create one if you want to play."); 
    return;
  }

  if (games[mode][roomId].isFull && !games[mode][roomId].players[username]) {
    socket.emit("joining-errors", "The room is full, select an other room."); 
    return;
  } else {
    socket.join(roomId);

    if (!games[mode][roomId].players[username]) {
      let myChar;
      Object.entries(games[mode][roomId].players).forEach(
        ([username, values]) => {
          myChar = values.character === "X" ? "O" : "X";
        }
      );
      games[mode][roomId].players[username] = {
        character: myChar,
        ready: false,
        score: 0,
        active: true,
      };
    }

    io.sockets.in(roomId).emit("user-connected", games[mode][roomId].players);

    if (Object.keys(games[mode][roomId].players).length === 2) {
      games[mode][roomId].isFull = true;
      games[mode][roomId].players.Tie = {
        score: 0,
      };
    }

  }
}

module.exports = joinRoom;