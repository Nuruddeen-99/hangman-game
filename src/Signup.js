import React, { useState } from 'react';
import './App.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Signup() {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSignup = async () => {
    setErrorMessage('');
    try {
      await axios.post('/api/signup', { username, password });
      navigate('/Confirm');
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Unable to sign up');
    }
  };

  return (
  	<div>
    <br/>
         <center><div className="ct">
         <h1 style={{textAlign: 'center'}}>Signup</h1><br/>

           <div>
             <img src="icon.png" alt="icon"/>
           </div>
		   <p style={{fontFamily: 'Cursive', color: 'red'}}>{errorMessage}</p><br/>
           <div className="ipt"><label>
		     <b>Username:</b></label>
		     <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Create Username" name="uname" required/>
		   </div><br/>
           <div className="ipt">
		     <label><b>Password:</b></label>
             <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Create Password" name="psw" required/>
		   </div><br/><br/>
		   <button type="button" onClick={handleSignup}>Signup</button><br/><br/>
         </div></center>

		</div>
  );
}

export default Signup;
