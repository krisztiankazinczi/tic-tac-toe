import React, { useState, useEffect } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import withModal from "../../HOC/withModal";
import { compose } from "recompose";

import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";

const styles = (theme) => ({
  ...theme.styles,
  buttonText: {
    textTransform: "capitalized",
  },
  button: {
    marginTop: "30px",
    textTransform: "none",
  },
  options: {
    display: "flex",
    width: "100%",
    alignItems: "center",
    "& > h2": {
      fontSize: "25px",
      color: theme.styles.colors.orangeColor,
      fontWeight: 700,
      flex: 0.5,
    },
  },
  dropDown: {
    fontSize: "26px",
    flex: 0.5,
    color: theme.styles.colors.orangeColor,
    "&:before": {
      borderColor: theme.styles.colors.orangeColor,
    },
    "&:after": {
      borderColor: theme.styles.colors.orangeColor,
    },
    "&:hover:not(.Mui-disabled):before": {
      borderColor: theme.styles.colors.orangeColor,
    },
  },
  ".MuiList-padding": {
    paddingTop: 0,
    paddingBottom: 0,
  },
  icon: {
    fill: theme.styles.colors.orangeColor,
  },
  menuItem: {
    color: theme.styles.colors.orangeColor,
    backgroundColor: theme.styles.colors.secondaryBackgroundColor,
    "&:hover": {
      background: theme.styles.colors.secondaryBackgroundColorHovered,
    },
    "&.Mui-selected": {
      background: theme.styles.colors.secondaryBackgroundColorHovered,
    },
    "&.Mui-selected:hover": {
      background: theme.styles.colors.secondaryBackgroundColorHovered,
    },
  },
  centerToMiddle: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.styles.colors.secondaryBackgroundColor,
    padding: "10px",
  },
  button: {
    marginTop: "10px",
    marginBottom: "10px",
  },
  buttonContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around'
  }
});

const boardSizes = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
const winLengths = [3, 4, 5];
const characters = ["X", "O"];

const NewGameOptions = ({
  classes,
  newGameOptions,
  setNewGameOptions,
  setOpen,
}) => {
  const [boardSize, setBoardSize] = useState(newGameOptions.boardSize);
  const [winLength, setWinLength] = useState(newGameOptions.winLength);
  const [character, setCharacter] = useState(newGameOptions.character);

  useEffect(() => {
    if (boardSize < winLength) {
      setBoardSize(winLength);
    }
  }, [boardSize, winLength]);

  useEffect(() => {
      return () => {
        if (newGameOptions.confirm) {
          setNewGameOptions({ ...newGameOptions, state: false });
          setOpen(false)
        }
      };
    
  }, []);

  const startGame = () => {
    if (character) {
      setNewGameOptions({
        winLength,
        boardSize,
        character,
        confirm: true,
        state: false,
      });
    } else {
      setNewGameOptions({ winLength, boardSize, confirm: true, state: false });
    }
    setOpen(false);
  };

  const cancel = () => {
    setNewGameOptions({ ...newGameOptions, state: false });
    setOpen(false)
  };

  return (
    <div className={classes.centerToMiddle}>
      <div className={classes.options}>
        <h2>Win Length</h2>
        <Select
          name="winLength"
          value={winLength}
          onChange={(e) => setWinLength(e.target.value)}
          className={classes.dropDown}
          inputProps={{
            classes: {
              icon: classes.icon,
            },
          }}
        >
          {winLengths.map((length) => (
            <MenuItem key={length} className={classes.menuItem} value={length}>
              {length}
            </MenuItem>
          ))}
        </Select>
      </div>
      <div className={classes.options}>
        <h2>BoardSize (X * X)</h2>
        <Select
          name="boardSize"
          value={boardSize}
          onChange={(e) => setBoardSize(e.target.value)}
          className={classes.dropDown}
          inputProps={{
            classes: {
              icon: classes.icon,
            },
          }}
        >
          {boardSizes.map((size) => {
            return (
              size >= winLength && (
                <MenuItem key={size} className={classes.menuItem} value={size}>
                  {size}
                </MenuItem>
              )
            );
          })}
        </Select>
      </div>
      {character && (
        <div>
          <div className={classes.options}>
            <h2>Your Character</h2>
            <Select
              name="character"
              value={character}
              onChange={(e) => setCharacter(e.target.value)}
              className={classes.dropDown}
              inputProps={{
                classes: {
                  icon: classes.icon,
                },
              }}
            >
              {characters.map((char) => (
                <MenuItem key={char} className={classes.menuItem} value={char}>
                  {char}
                </MenuItem>
              ))}
            </Select>
          </div>
        </div>
      )}

      <div className={classes.buttonContainer}>
        <Button
          size="large"
          variant="outlined"
          color="secondary"
          className={classes.button}
          onClick={cancel}
        >
          <Typography variant="h5">Cancel</Typography>
        </Button>
        <Button
          size="large"
          variant="outlined"
          color="primary"
          className={classes.button}
          onClick={startGame}
        >
          <Typography variant="h5">Start</Typography>
        </Button>
      </div>
    </div>
  );
};

export default compose(withStyles(styles), withModal)(NewGameOptions);
