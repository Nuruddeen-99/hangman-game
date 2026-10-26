import React, { useState } from 'react';
import './App.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Signup() {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

const handleSignup = async () => {
    try {
      // Send a POST request to your Express.js server
      const response = await axios.post('http://localhost:3001/api/signup', { username, password });

      // Check the response from the server
      if (response.status === 200) {
        // Signup successful, you can redirect to a confirmation page or login page
        navigate('/Confirm');
      } else {
        // Handle other responses, e.g., display an error message
        console.error('Signup failed:', response.data.message);
      }
    } catch (error) {
      // Handle network or other errors
      console.error('Error:', error);
    }
  };

  return (
  	<div>
    <br/>
         <center><div className="ct">
         <h1 style={{textAlign: 'center'}}>Signup</h1><br/>
           
           <div>
             <img src="icon.png" alt="icon"/>
           </div><br/><br/>
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
