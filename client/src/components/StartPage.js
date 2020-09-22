import React, { useState } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

import { Redirect } from "react-router-dom";

import SetUser from "./SetUser";

import { useAuth } from "../store/authProvider";

const styles = (theme) => ({
  ...theme.styles,
});

const StartPage = ({ classes }) => {
  const [open, setOpen] = useState(false);
  const [{ username }] = useAuth();

  //This page has only one purpose, to select a username

  // user must set a username, if it's already done, then redirect happens automatically
  const startGame = () => {
    setOpen(true);
  };

  // if username is not falsy in the store, the player will be redirected to the new Game page
  if (username) {
    return <Redirect to="/selectGameMode" />;
  }

  // open a dialog to select a username
  if (open) {
    return <SetUser open={open} setOpen={setOpen} />;
  }

  return (
    <div className={classes.centerToMiddle}>
      <div>
        <Button size="large" className={classes.button} variant="outlined">
          <Typography
            // className={}
            variant="h5"
            onClick={startGame}
          >
            New Game
          </Typography>
        </Button>
      </div>
    </div>
  );
};

export default withStyles(styles)(StartPage);
