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
  fontSize: '25px'
}

const ConfirmationWithTwoOption = ({ confirmation, setConfirmation, setOpen }) => {

  useEffect(() => {
    console.log(confirmation)
    return () => {
      if (!confirmation.confirm) {
        setConfirmation({...confirmation, state: false, confirm: 'NO'})
        setOpen(false)
      }
    }
  })

  const refuse = () => {
    console.log('refuse')
    setConfirmation({...confirmation, state: false, confirm: 'NO'})
    setOpen(false)
  }

  const accept = () => {
    console.log('accept')
    setConfirmation({...confirmation, state: false, confirm: 'YES'})
    setOpen(false)
  }

  return (
    <div style={questionStyle}>
      <div>{confirmation.question}</div>
      <div style={buttonContainer}>
        <Button
          onClick={refuse}
          style={button}
          color="secondary"
        >
          NO
        </Button>
        <Button
          onClick={accept}
          style={button}
          color="primary"
        >
          YES
        </Button>
      </div>
    </div>
  );
};

export default withModal(ConfirmationWithTwoOption);
