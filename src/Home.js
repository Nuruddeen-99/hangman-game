import './App.css';
import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import axios from 'axios';

function Home(){

  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const log = async (event) => {
    event.preventDefault();
    if (submitting) return;
    setErrorMessage('');

    if (!username.trim() || !password) {
      setErrorMessage('Username and password are required');
      return;
    }

    setSubmitting(true);
    try {
      await axios.post('/api/home', { username, password });
      // The session cookie is set by the server; go to the game.
      navigate('/Game');
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Unable to log in');
      setSubmitting(false);
    }
  };

  const sign = () => {
    navigate('/Signup');
  };

  return (
    <div className="auth-wrap">
      <form className="ct auth-card" onSubmit={log} noValidate>
        <div>
          <img src="icon.png" alt="Hangman" />
        </div>
        <h1 className="auth-title">Hangman</h1>
        <p className="auth-subtitle">Log in to play</p>

        {errorMessage && (
          <p className="auth-error" role="alert">{errorMessage}</p>
        )}

        <div className="auth-field">
          <label className="auth-label" htmlFor="login-username">Username</label>
          <span className="auth-input">
            <input
              id="login-username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter Username"
              name="uname"
              autoComplete="username"
              required
            />
          </span>
        </div>

        <div className="auth-field">
          <label className="auth-label" htmlFor="login-password">Password</label>
          <span className="auth-input">
            <input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter Password"
              name="psw"
              autoComplete="current-password"
              required
            />
            <button
              type="button"
              className="auth-reveal"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </span>
        </div>

        <button className="auth-btn" type="submit" disabled={submitting}>
          {submitting ? (
            <>
              <span className="auth-spinner" aria-hidden="true" />
              Logging in...
            </>
          ) : (
            'Login'
          )}
        </button>

        <p className="auth-alt">
          No account yet?{' '}
          <button type="button" className="auth-link" onClick={sign}>
            Sign up
          </button>
        </p>
      </form>
    </div>
  );
}

export default Home;
