const joinRoom = require("./join-room");
const deleteRoom = require("./delete-room");
const changeCharacter = require("./change-character");
const playerReady = require("./player-ready");
const getGameData = require("./get-game-data");
const placeMark = require("./place-mark");
const drawOffer = require("./draw-offer");
const newGameOffer = require("./new-game-offer");
const draw = require("./draw-game");
const giveUp = require("./giveup");
const rematch = require("./rematch");
const playerLeaving = require("./player-leaving");

module.exports = {
  joinRoom,
  deleteRoom,
  changeCharacter,
  playerReady,
  getGameData,
  placeMark,
  drawOffer,
  newGameOffer,
  draw,
  giveUp,
  rematch,
  playerLeaving
}