const checkVictoryLength5 = (board, char) => {
  let winner;
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {
      if (j + 4 < board.length) {
        if (
          board[i][j] === char &&
          board[i][j + 1] === char &&
          board[i][j + 2] === char &&
          board[i][j + 3] === char &&
          board[i][j + 4] === char
        ) {
          winner = true;
        }
      }
      if (i + 4 < board.length) {
        if (
          board[i][j] === char &&
          board[i + 1][j] === char &&
          board[i + 2][j] === char &&
          board[i + 3][j] === char &&
          board[i + 4][j] === char
        ) {
          winner = true;
        }
      }
      if (j - 4 >= 0 && i + 4 < board.length) {
        if (
          board[i][j] === char &&
          board[i + 1][j - 1] === char &&
          board[i + 2][j - 2] === char &&
          board[i + 3][j - 3] === char &&
          board[i + 4][j - 4] === char
        ) {
          winner = true;
        }
      }
      if (j - 4 >= 0 && i - 4 >= 0) {
        if (
          board[i][j] === char &&
          board[i - 1][j - 1] === char &&
          board[i - 2][j - 2] === char &&
          board[i - 3][j - 3] === char &&
          board[i - 4][j - 4] === char
        ) {
          winner = true;
        }
      }
    }
  }

  return winner;

};

const checkVictoryLength4 = (board, char) => {
  let winner;
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {
      if (j + 3 < board.length) {
        if (
          board[i][j] === char &&
          board[i][j + 1] === char &&
          board[i][j + 2] === char &&
          board[i][j + 3] === char 
        ) {
          winner = true;
        }
      }
      if (i + 3 < board.length) {
        if (
          board[i][j] === char &&
          board[i + 1][j] === char &&
          board[i + 2][j] === char &&
          board[i + 3][j] === char 
        ) {
          winner = true;
        }
      }
      if (j - 3 >= 0 && i + 3 < board.length) {
        if (
          board[i][j] === char &&
          board[i + 1][j - 1] === char &&
          board[i + 2][j - 2] === char &&
          board[i + 3][j - 3] === char 
        ) {
          winner = true;
        }
      }
      if (j - 3 >= 0 && i - 3 >= 0) {
        if (
          board[i][j] === char &&
          board[i - 1][j - 1] === char &&
          board[i - 2][j - 2] === char &&
          board[i - 3][j - 3] === char 
        ) {
          winner = true;
        }
      }
    }
  }

  return winner;

};

const checkVictoryLength3 = (board, char) => {
  let winner;
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {
      if (j + 2 < board.length) {
        if (
          board[i][j] === char &&
          board[i][j + 1] === char &&
          board[i][j + 2] === char 
        ) {
          winner = true;
        }
      }
      if (i + 2 < board.length) {
        if (
          board[i][j] === char &&
          board[i + 1][j] === char &&
          board[i + 2][j] === char 
        ) {
          winner = true;
        }
      }
      if (j - 2 >= 0 && i + 2 < board.length) {
        if (
          board[i][j] === char &&
          board[i + 1][j - 1] === char &&
          board[i + 2][j - 2] === char 
        ) {
          winner = true;
        }
      }
      if (j - 2 >= 0 && i - 2 >= 0) {
        if (
          board[i][j] === char &&
          board[i - 1][j - 1] === char &&
          board[i - 2][j - 2] === char 
        ) {
          winner = true;
        }
      }
    }
  }

  return winner;

};

module.exports = {
  checkVictoryLength5,
  checkVictoryLength4,
  checkVictoryLength3
}