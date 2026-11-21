import './App.css';
import { useNavigate } from 'react-router-dom';


function Confirm(){
	const navigate = useNavigate();

	return(
    <div className="auth-wrap">
      <div className="ct auth-card auth-card--success">
        <div>
          <img src="icon.png" alt="Hangman" />
        </div>
        <h1 className="auth-title">Signup Successful!</h1>
        <p className="auth-subtitle">Your account is ready. Log in to start playing.</p>
        <button className="auth-btn" type="button" onClick={() => navigate('/')}>
          Go to Login
        </button>
      </div>
    </div>
	)
}
export default Confirm
