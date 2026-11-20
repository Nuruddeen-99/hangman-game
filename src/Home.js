import './App.css';
import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import axios from 'axios';

function Home(){

  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const log = async () => {
    setErrorMessage('');
    try {
      await axios.post('/api/home', { username, password });
      // The session cookie is set by the server; go to the game.
      navigate('/Game');
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Unable to log in');
    }
  };

  const sign = () => {
    navigate('/Signup');
  };

return(
    <><br/><br/>
         <center><div className="ct"><br/><br/>
           <div>
             <img src="icon.png" alt="icon"/>
           </div>
		   <p style={{fontFamily: 'Cursive', color: 'red'}}>{errorMessage}</p><br/>
           <div className="ipt">
		   <label><b>Username:</b></label>
		     <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Enter Username" name="uname" required/>
		   </div><br/>
           <div className="ipt">
		     <label><b>Password:</b></label>
             <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter Password" name="psw" required/>
		   </div><br/><br/>
		   <button type="button" onClick={log}>Login</button><br/><br/>
		   <button type="button" onClick={sign}>Signup</button><br/>
         </div></center>
	</>
);
}

export default Home;
