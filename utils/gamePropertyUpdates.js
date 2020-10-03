const updateScoreOnGiveUp = (players, usernameGaveUp) => {
  const playerNames = Object.keys(players);
  playerNames.forEach((name) => {
    if (name !== usernameGaveUp && name !== "Tie") {
      players[name].score += 1;
    }
  });
  return players;
};

const updateScoreOnVictory = (players, username) => {
  players[username].score += 1;
  return players;
};

const updateScoreOnDraw = (players) => {
  players["Tie"].score += 1;
  return players;
};

const checkIfEveryoneLeftGame = (players) => {
  let isEveryoneLeftGame = true;
  const playerNames = Object.keys(players);
  playerNames.forEach((name) => {
    if (name !== "Tie") {
      if (players[name].active === true) {
        isEveryoneLeftGame = false;
      }
    }
  });

  return isEveryoneLeftGame;
};

const getOpponentName = (players, username) => {
  let opponentName;
  const playerNames = Object.keys(players);
  playerNames.forEach((name) => {
    if (name !== username && name !== "Tie") {
      opponentName = name;
    }
  });
  return opponentName;
}

module.exports = {
  updateScoreOnGiveUp,
  updateScoreOnVictory,
  updateScoreOnDraw,
  checkIfEveryoneLeftGame,
  getOpponentName
};
