import React, { useState } from 'react'
import withStyles from "@material-ui/core/styles/withStyles";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

import { Redirect } from "react-router-dom";
import { useAuth } from "../store/authProvider";


const styles = (theme) => ({
  ...theme.styles,
  buttonText: {
    textTransform: "capitalized"
  },
  button: {
    ...theme.styles.button,
    marginTop: '30px'
  }
});

const GameMode = ({ classes }) => {
  const [{ username }] = useAuth();
  const [mode, setMode] = useState('');

  if (!username) {
    return <Redirect to='/' />
  }

  if (mode) {
    return <Redirect to={`/waitingRoom/${mode}`} />
  }

  const selectGameMode = (event) => {
    // on MaterialUI elements I had to use event.currentTarget.value to get the value of the field
    if (event.currentTarget.value === 'other' || event.currentTarget.value === 'friend') {
      setMode(event.currentTarget.value)
    }
  }

  return (
    <div
        className={classes.centerToMiddle}
      >
        <Button
          value="other"
          className={classes.button}
          onClick={(e) => selectGameMode(e)}
        >
          <Typography
            className={classes.buttonText}
            variant="h5"
          >
            Play with random players
          </Typography>
        </Button>
        <Button
          value="friend"
          className={classes.button}
          onClick={(e) => selectGameMode(e)}
        >
          <Typography
            className={classes.buttonText}
            variant="h5"
          >
            Play with random friends
          </Typography>
        </Button>
      </div>
  )
}

export default withStyles(styles)(GameMode);
