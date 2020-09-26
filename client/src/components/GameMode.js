import React, { useState, useEffect } from 'react'
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
  const [roomId, setRoomId] = useState('askldjhg;laksh;jlskdhg')

  if (!username) {
    return <Redirect to='/' />
  }

  if (mode && roomId) {
    console.log(`/waitingRoom/${mode}/${roomId}`)
    return <Redirect to={`/waitingRoom/${mode}/${roomId}`} />
  }

  const selectGameMode = (event) => {
    //get RoomId from server

    // on MaterialUI elements I had to use event.currentTarget.value to get the value of the field
    if (event.currentTarget.value === 'random' || event.currentTarget.value === 'friend') {
      setMode(event.currentTarget.value)
    }
  }

  return (
    <div
        className={classes.centerToMiddle}
      >
        <Button
          value="random"
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
            Play with friends
          </Typography>
        </Button>
      </div>
  )
}

export default withStyles(styles)(GameMode);
