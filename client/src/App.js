import React, { useEffect, useState } from 'react';
import './App.css';

const App = () => {
  const [text, setText] = useState('');

  useEffect( () => {
    (async() => {
      const info = await textToDisplay();
      setText(info)   
    })()
  });

  const textToDisplay = async () => {
    const response = await fetch(`https://amobagame.herokuapp.com/api/test`)
    const info = await response.json()
    return info   
  }

  return (
    <div className="App">
      <h2>Can I see this</h2>
      {text && (
        <h2>{text}</h2>
      )}
    </div>
  );
}

export default App;
