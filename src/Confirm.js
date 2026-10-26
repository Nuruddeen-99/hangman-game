import './App.css';
import { useNavigate } from 'react-router-dom';

function Confirm(){
	const navigate = useNavigate();
	const log = () => {
		navigate('/');
	}
	
	return(
    <>	
<br/>
<center><div className="ct"><br/><br/>
           <div>
             <img src="icon.png" alt="icon"/>
           </div><br/><br/>
           <br/><br/>
		   <h3 style={{fontFamily: 'verdana'}}>Signup Successful!</h3><br/><br/>
<button  style={{width:120}} type="button" onClick={log}>Go to Login</button>
		   
         </div></center>

	</>
	)
}
export default Confirm