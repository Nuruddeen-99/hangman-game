import React, { useState } from 'react';
import './App.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Signup() {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (event) => {
    event.preventDefault();
    if (submitting) return;
    setErrorMessage('');

    const trimmedUser = username.trim();
    if (!trimmedUser || !password) {
      setErrorMessage('Username and password are required');
      return;
    }
    if (trimmedUser.length > 30) {
      setErrorMessage('Username is too long');
      return;
    }
    if (password.length < 8) {
      setErrorMessage('Password must be at least 8 characters');
      return;
    }

    setSubmitting(true);
    try {
      await axios.post('/api/signup', { username: trimmedUser, password });
      navigate('/Confirm');
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Unable to sign up');
      setSubmitting(false);
    }
  };

  const backToLogin = () => {
    navigate('/');
  };

  return (
    <div className="auth-wrap">
      <form className="ct auth-card" onSubmit={handleSignup} noValidate>
        <div>
          <img src="icon.png" alt="Hangman" />
        </div>
        <h1 className="auth-title">Sign Up</h1>
        <p className="auth-subtitle">Create an account to play</p>

        {errorMessage && (
          <p className="auth-error" role="alert">{errorMessage}</p>
        )}

        <div className="auth-field">
          <label className="auth-label" htmlFor="signup-username">Username</label>
          <span className="auth-input">
            <input
              id="signup-username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Create Username"
              name="uname"
              autoComplete="username"
              maxLength={30}
              required
            />
          </span>
        </div>

        <div className="auth-field">
          <label className="auth-label" htmlFor="signup-password">Password</label>
          <span className="auth-input">
            <input
              id="signup-password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create Password"
              name="psw"
              autoComplete="new-password"
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
        <p className="auth-hint">At least 8 characters.</p>

        <button className="auth-btn" type="submit" disabled={submitting}>
          {submitting ? (
            <>
              <span className="auth-spinner" aria-hidden="true" />
              Creating account...
            </>
          ) : (
            'Sign Up'
          )}
        </button>

        <p className="auth-alt">
          Already have an account?{' '}
          <button type="button" className="auth-link" onClick={backToLogin}>
            Log in
          </button>
        </p>
      </form>
    </div>
  );
}

export default Signup;
