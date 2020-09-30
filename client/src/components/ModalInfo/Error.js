import React, {useEffect} from 'react'

import withModal from '../../HOC/withModal';

const msgStyle = {
  fontSize: '25px',
  width: '70%',
  display: 'flex',
  alignItems: 'center',
}

const Error = ({ message, setError }) => {

  useEffect(() => {
    
    return () => setError("");
  }, [])

  return (
    <div style={msgStyle}>
      {message}
    </div>
  )
}

// export default Error;
export default withModal(Error);
