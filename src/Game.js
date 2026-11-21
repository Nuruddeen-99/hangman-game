import React, { useState, useEffect } from 'react';
import './Game.css';
import { wordBank } from './bank';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Game() {
  const navigate = useNavigate();
	
  const [userSelection, setUserSelection] = useState('');
  const [chosenWord, setChosenWord] = useState('');
  const [hiddenWord, setHiddenWord] = useState([]);
  const [chances, setChances] = useState(5);
  const [guessedLetters, setGuessedLetters] = useState(new Set());
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [gameOver, setGameOver] = useState(false);
  const [popup, setPopup] = useState(null); // { won: boolean, answer?: string }
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    let active = true;
    axios.get('/api/session')
      .then(() => { if (active) setCheckingAuth(false); })
      .catch(() => { if (active) navigate('/'); });
    return () => { active = false; };
  }, [navigate]);

  const logout = async () => {
    setLoggingOut(true);
    try {
      // Minimum display time keeps the spinner from flashing on fast responses.
      await Promise.all([
        axios.post('/api/logout'),
        new Promise((resolve) => setTimeout(resolve, 700)),
      ]);
    } catch (error) {
      // Even if the request fails, still send the user back to the login page.
    }
    navigate('/');
  };

  function wordSelected(bank) {
    const wordBankIndex = Math.floor(Math.random() * bank.length);
    return bank[wordBankIndex];
  }

  useEffect(() => {
    const newWord = wordSelected(wordBank);
    setChosenWord(newWord);
    setHiddenWord(newWord.split('').map(() => '_'));
  }, []);

  useEffect(() => {
    if (userSelection !== "") {
      initiateGuess(userSelection);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userSelection]);

  useEffect(() => {
    if (chosenWord && hiddenWord.length > 0 && hiddenWord.join('') === chosenWord) {
      const timer = setTimeout(() => {
        setGameOver(true);
        setPopup({ won: true, answer: chosenWord });
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [hiddenWord, chosenWord]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && popup) {
        setPopup(null);
        return;
      }
      const letter = event.key.toUpperCase();
      if (/^[A-Z]$/.test(letter)) {
        if (!checkingAuth && !gameOver && !guessedLetters.has(letter) && chances > 0) {
          setGuessedLetters(prev => new Set(prev).add(letter));
          setUserSelection(letter);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [guessedLetters, chances, checkingAuth, gameOver, popup]);

  function handleGuess(letter) {
    if (checkingAuth || gameOver || guessedLetters.has(letter) || chances <= 0) return;
    setGuessedLetters(prev => new Set(prev).add(letter));
    setUserSelection(letter);
  }

  function death() {
    setTimeout(() => {
      setGameOver(true);
      setPopup({ won: false, answer: chosenWord });
    }, 800);
  }

  function initiateGuess(selection) {
    if (!chosenWord.includes(selection)) {
      const nextChances = chances - 1;
      drawHangman(chances);
      setChances(nextChances);
      if (nextChances === 0) {
        death();
      }
    } else {
      const newHiddenWord = [...hiddenWord];
      for (let i = 0; i < chosenWord.length; i++) {
        if (chosenWord[i] === selection) {
          newHiddenWord[i] = selection;
        }
      }
      setHiddenWord(newHiddenWord);
    }
  }

  function drawHangman(currentChances) {
    var canvas = document.getElementById('hangmanCanvas');
    if (!canvas) {
        canvas = document.createElement('canvas');
        canvas.id = 'hangmanCanvas';
        canvas.width = 180;
        canvas.height = 170;
        document.getElementById('a').appendChild(canvas);
    }
    var ctx = canvas.getContext('2d');
    ctx.lineWidth = 4;
    switch (currentChances) {
		default:
		    break;
        case 5:
            // head
            ctx.beginPath();
            ctx.arc(90, 50, 30, 0, Math.PI * 2, true);
            ctx.stroke();
            break;
        case 4:
            // body
            ctx.beginPath();
            ctx.moveTo(90, 80);
            ctx.lineTo(90, 130);
            ctx.stroke();
            break;
        case 3:
            // arms
            ctx.beginPath();
            ctx.moveTo(40, 100);
            ctx.lineTo(140, 100);
            ctx.stroke();
            break;
        case 2:
            // left leg
            ctx.beginPath();
            ctx.moveTo(90, 130);
            ctx.lineTo(60, 160);
            ctx.stroke();
            break;
        case 1:
            // right leg
            ctx.beginPath();
            ctx.moveTo(90, 130);
            ctx.lineTo(120, 160);
            ctx.stroke();
            break;
    }
  }

  if (checkingAuth) {
    return (
      <div style={{ textAlign: 'center', marginTop: 100, fontFamily: 'Calibri', fontSize: 20 }}>
        Loading...
      </div>
    );
  }

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 20px', position: 'relative' }}>
        <h1 style={{ width: '100%', textAlign: 'center', margin: 0 }}>Guess the Word</h1>
        <button 
          className="game-btn logout-btn"
          type="button"
          disabled={loggingOut}
          onClick={logout}
        >
          Log Out
        </button>
      </div>
      <center><div id="a"></div></center>
      <div className={chances <= 2 ? 'chances chances--low' : 'chances'}>
        You have {chances} Chances left
      </div>
      <div id="b">
        {hiddenWord.join(' ')}
      </div>
      <br />
      <center><div id="c">
        <div>
          {Array.from("QWERTYUIOP").map((letter) => (
            <button 
              key={letter} 
              disabled={gameOver || guessedLetters.has(letter)}
              onClick={() => handleGuess(letter)}
            >
              {letter}
            </button>
          ))}
        </div>
        <div>
          {Array.from("ASDFGHJKL").map((letter) => (
            <button 
              key={letter} 
              disabled={gameOver || guessedLetters.has(letter)}
              onClick={() => handleGuess(letter)}
            >
              {letter}
            </button>
          ))}
        </div>
        <div>
          {Array.from("ZXCVBNM").map((letter) => (
            <button 
              key={letter} 
              disabled={gameOver || guessedLetters.has(letter)}
              onClick={() => handleGuess(letter)}
            >
              {letter}
            </button>
          ))}
        </div>
      </div></center>
      <button className="game-btn restart-btn" onClick={() => window.location.reload()}>Restart</button>

      {loggingOut && (
        <div className="result-overlay" role="status" aria-live="polite">
          <div className="logout-popup">
            <span className="spinner" aria-hidden="true" />
            <p className="logout-text">Logging out...</p>
          </div>
        </div>
      )}

      {popup && (
        <div className="result-overlay">
          <div
            className={`result-popup ${popup.won ? 'result-popup--win' : 'result-popup--lose'}`}
            role="dialog"
            aria-modal="true"
            aria-label={popup.won ? 'You won' : 'Game over'}
          >
            <button
              type="button"
              className="popup-close"
              onClick={() => setPopup(null)}
              aria-label="Close"
            >
              ×
            </button>
            <h2 className="popup-title">{popup.won ? 'You Win!' : 'Game Over'}</h2>
            <p className="popup-message">
              {popup.won ? (
                'You guessed the word.'
              ) : (
                <>
                  The word was:{' '}
                  <span className="popup-word">{popup.answer}</span>
                </>
              )}
            </p>
            <div className="popup-actions">
              <button
                type="button"
                className="popup-btn"
                onClick={() => window.location.reload()}
              >
                Play Again
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Game;
