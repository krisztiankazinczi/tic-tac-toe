import React from 'react';
import withModal from '../HOC/withModal';
import Error from './ModalInfo/Error';
import Confirmation from './ModalInfo/Confirmation'
import NewGameOptions from './ModalInfo/NewGameOptions';

function ModalTest() {
  return (
    <div>
      <NewGameOptions newGameOptions={{winLength: 3, boardSize: 10}} />
    </div>
  )
}

export default ModalTest
