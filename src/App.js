import React from 'react';
import Home from './Home';
import Game from './Game';
import Signup from './Signup';
import Confirm from './Confirm';
import { Routes, Route } from 'react-router-dom';

function App() {

  return (
  <>
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/Game" element={<Game />}/>
        <Route path="/Signup" element={<Signup />}/>
        <Route path="/Confirm" element={<Confirm />}/>
      </Routes>

		</>
  );
}
export default App;