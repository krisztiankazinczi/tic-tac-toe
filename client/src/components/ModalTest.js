import React from 'react';
import withModal from '../HOC/withModal';
import Error from './ModalInfo/Error';

function ModalTest() {
  const ErrorMessage = withModal(Error)
  return (
    <div>
      <Error message="what is the problem. please tell me moreasasdgasdgsdagasd" />
    </div>
  )
}

export default ModalTest
