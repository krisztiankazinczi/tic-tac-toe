const { v4: uuidv4 } = require("uuid");
const {
  checkVictoryLength5,
  checkVictoryLength4,
  checkVictoryLength3,
} = require("../utils/victoryChecks");
const { games } = require('../games');

const testEndpoint = (req, res) => {
  res.status(200).json("The API is working");
}

const createRoom = (req, res) => {
  const { mode, boardSize, winLength, myChar, username } = req.body;
  
  const roomId = uuidv4();
  games[mode][roomId] = {};
  games[mode][roomId].boardSize = boardSize;
  games[mode][roomId].winLength = winLength;
  games[mode][roomId].winCheck =
    parseInt(winLength) === 5
      ? checkVictoryLength5
      : parseInt(winLength) === 4
      ? checkVictoryLength4
      : checkVictoryLength3;

  games[mode][roomId].players = {
    [username]: {
      character: myChar,
      ready: false,
      score: 0,
      active: true,
    },
  };
  games[mode][roomId].onTurn = username;
  games[mode][roomId].active = true;
  games[mode][roomId].isFull = false;
  games[mode][roomId].createdAt = Date.now();

  const generatedBoard = Array(boardSize)
    .fill()
    .map(() => Array(boardSize).fill(""));

  games[mode][roomId].board = generatedBoard;
  
  res.json(roomId);
}

const getAvailableRooms = (req, res) => {
  const actualTimeStamp = Date.now();
  const roomsInfo = [];
  Object.entries(games.random).forEach(([roomId, gameInfo]) => {
    if (!gameInfo?.isFull) {
      // this is needed because I can not delete games if user just 
      // close the browser. If I will solve that, I wont need this if statement and createdAt value
      if ((actualTimeStamp - gameInfo.createdAt) / 1000 < 60) {
        const roomInfo = {
          roomId,
          boardSize: gameInfo.boardSize,
          winLength: gameInfo.winLength,
        }
        const player = Object.keys(gameInfo.players)[0]
        roomInfo.opponent = player
        roomsInfo.push(roomInfo);
      }
    }
  })

  res.status(200).json(roomsInfo);
}


module.exports = {
  testEndpoint,
  createRoom,
  getAvailableRooms
};