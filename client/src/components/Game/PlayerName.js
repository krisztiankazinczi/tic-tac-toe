import React from 'react';
import withStyles from "@material-ui/core/styles/withStyles";
import clsx from 'clsx';
import Typography from "@material-ui/core/Typography";


const styles = (theme) => ({
  ...theme.styles,
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingRight: '15px',
    paddingLeft: '15px',
  },
  username: {
    color: theme.styles.colors.mainTextColor
  },
  score: {
    color: theme.styles.colors.orangeColor
  },
  active: {
    border: `2px solid ${theme.styles.colors.orangeColor}`,
    borderRadius: '20px'
  },
  infoContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginLeft: '10px',
  }
});

const PlayerName = ({ classes, username, char, score, active, fontSize }) => {
  const font = {
    fontSize: `${fontSize}px`
  }
  const font_char = {
    fontSize: `${fontSize * 1.5}px`
  }


  return (
    <div className={active ? clsx(classes.container, classes.active) : classes.container}>
      <div>
      <Typography className={classes.score} style={font_char} variant="h5">{char}</Typography>
      </div>
      <div className={classes.infoContainer}>
        <Typography className={classes.username} style={font} variant="h5">{username}</Typography>
        <Typography className={classes.score} style={font} variant="h5">{score}</Typography>
      </div>
    </div>
  )
}

export default withStyles(styles)(PlayerName);
