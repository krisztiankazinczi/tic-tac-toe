import React from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";


const styles = (theme) => ({
  ...theme.styles,
  button: {
    textTransform: "none",
  },
  container: {
    marginRight: 'auto',
    marginLeft: 'auto',
    width: '70%',
    minHeight: '100vh',
    backgroundColor: theme.styles.colors.secondaryBackgroundColor    
  },
  table: {
    
  },
  headerCell: {
    color: theme.palette.primary.main,
    fontSize: '25px',
    fontWeight: 600
  },
  bodyCell: {
    color: theme.styles.colors.orangeColor,
    fontSize: '20px',
  }
})

function AvailableRoomsTable({ classes, rooms, setMode, setRoomId }) {

  const joinToRoom = (roomId) => {
    setMode('random');
    setRoomId(roomId);  
  }


  return (
    <TableContainer className={classes.container} component={Paper}>
      <Table className={classes.table} size="small">
        <TableHead className={classes.header}>
          <TableRow>
            <TableCell className={classes.headerCell} align="center">Opponent name</TableCell>
            <TableCell className={classes.headerCell} align="center">Board Size</TableCell>
            <TableCell className={classes.headerCell} align="center">Win Length</TableCell>
            <TableCell className={classes.headerCell} align="center">Join to Room</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rooms.map((game, id) => (
            <TableRow key={id}>
              <TableCell className={classes.bodyCell} align="center">{game.opponent}</TableCell>
              <TableCell className={classes.bodyCell} align="center">{game.boardSize}</TableCell>
              <TableCell className={classes.bodyCell} align="center">{game.winLength}</TableCell>
              <TableCell className={classes.bodyCell} align="center">
                <Button
                  variant="outlined"
                  color="primary"
                  className={classes.button}
                  onClick={() => joinToRoom(game.roomId)}
                >
                  <Typography variant="h5">
                    Join
                  </Typography>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default withStyles(styles)(AvailableRoomsTable);
