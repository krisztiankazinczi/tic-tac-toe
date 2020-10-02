import React from 'react';
import withModal from '../HOC/withModal';
import Error from './ModalInfo/Error';
import Confirmation from './ModalInfo/Confirmation'

function ModalTest() {
  return (
    <div>
      <Confirmation question="what is the problem. please tell me moreasasdgasdgsdagasd" />
    </div>
  )
}

export default ModalTest
