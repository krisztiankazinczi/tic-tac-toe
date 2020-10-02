import React, { useState, useEffect } from "react";

import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";

const dialogStyle = {
  // backgroundColor: "transparent",
  backgroundColor: '#2F4459',
}

const dialogActionsStyle = {
  display: "flex",
    flexDirection: "column",
    backgroundColor: "#3c5573",
    color: "#9BA8B5",
    overflow: "hidden",
}

const centerStyle = {
  width: "70%",
  marginLeft: "auto",
  marginRight: "auto",
  marginTop: "20px",
  textTransform: 'none'
}

const withModal = (Info) => props => {
  const [open, setOpen] = useState(true);
  const { buttonNeeded, timeLimit } = props

  useEffect(() => {
    if (timeLimit) {
      setTimeout(() => {
        setOpen(false)
      }, (timeLimit * 1000))
    }
  }, [])

  return (
    <Dialog
      style={dialogStyle}
      open={open}
      onClose={() => setOpen(false)}
      fullWidth
      maxWidth="sm"
    >
      <DialogActions style={dialogActionsStyle}>
        <Info style={centerStyle} setOpen={setOpen} {...props} />
        {buttonNeeded && (
          <Button onClick={() => setOpen(false)} style={centerStyle} color="secondary">
            Understand
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default withModal;
