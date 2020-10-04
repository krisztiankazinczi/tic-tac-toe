import React, { useEffect } from "react";
import Button from "@material-ui/core/Button";

import withModal from "../../HOC/withModal";

const questionStyle = {
  fontSize: "25px",
  width: "70%",
  textAlign: "center",
};

const buttonContainer = {
  width: "100%",
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-around',
  marginTop: '20px'
}

const button = {
  textTransform: 'none',
  fontSize: '20px'
}

const Confirmation = ({ confirmation, setConfirmation, setOpen }) => {

  useEffect(() => {
    return () => {
      setConfirmation({...confirmation, state: false})
      setOpen(false)
    }
  })

  const cancel = () => {
    setConfirmation({...confirmation, state: false})
    setOpen(false)
  }

  const accept = () => {
    setConfirmation({...confirmation, state: false, confirm: true})
    setOpen(false)
  }

  return (
    <div style={questionStyle}>
      <div>{confirmation.question}</div>
      <div style={buttonContainer}>
        <Button
          onClick={cancel}
          style={button}
          color="secondary"
          variant="outlined"
        >
          Cancel
        </Button>
        <Button
          onClick={accept}
          style={button}
          color="primary"
          variant="outlined"
        >
          OK
        </Button>
      </div>
    </div>
  );
};

export default withModal(Confirmation);
