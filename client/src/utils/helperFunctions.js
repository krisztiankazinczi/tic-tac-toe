export const convertPlayersObjToArray = (players, username) => {
  // the order of players will be for everyone: 1. the player itself, 2. Tie, 3. the opponent
  const modifiedPlayers = [];

  const playerNames = Object.keys(players);
  
  // it's always the Tie key and value
  modifiedPlayers[1] = {
    [playerNames[2]]: players['Tie'],
  };

  if (playerNames[0] === username) {
    modifiedPlayers[0] = {
      [playerNames[0]]: players[playerNames[0]],
    };
    modifiedPlayers[2] = {
      [playerNames[1]]: players[playerNames[1]],
    };
  } else if (playerNames[0] !== username) {
    modifiedPlayers[0] = {
      [playerNames[1]]: players[playerNames[1]],
    };
    modifiedPlayers[2] = {
      [playerNames[0]]: players[playerNames[0]],
    };
  }
  console.log(modifiedPlayers)
  return modifiedPlayers;
};