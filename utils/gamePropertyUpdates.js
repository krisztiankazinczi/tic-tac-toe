const updateScoreOnGiveUp = (players, usernameGaveUp) => {
  const playerNames = Object.keys(players);
  playerNames.forEach((name) => {
    if (name !== usernameGaveUp && name !== "Tie") {
      players[name].score += 1;
    }
  });
  return players;
}


module.exports = {
  updateScoreOnGiveUp
}