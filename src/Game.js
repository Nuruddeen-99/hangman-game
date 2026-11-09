import React, { useState, useEffect } from 'react';
import './Game.css';
import { wordBank } from './bank';
import { useNavigate } from 'react-router-dom';

function Game() {
  const navigate = useNavigate();
	
  const [userSelection, setUserSelection] = useState('');
  const [chosenWord, setChosenWord] = useState('');
  const [hiddenWord, setHiddenWord] = useState([]);
  const [chances, setChances] = useState(5);
  const [guessedLetters, setGuessedLetters] = useState(new Set());

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
      setTimeout(() => {
        alert("YOU HAVE WON");
        alert("Click OK to Play Again");
        window.location.reload();
      }, 800);
    }
  }, [hiddenWord, chosenWord]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      const letter = event.key.toUpperCase();
      if (/^[A-Z]$/.test(letter)) {
        if (!guessedLetters.has(letter) && chances > 0) {
          setGuessedLetters(prev => new Set(prev).add(letter));
          setUserSelection(letter);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [guessedLetters, chances]);

  function handleGuess(letter) {
    if (guessedLetters.has(letter) || chances <= 0) return;
    setGuessedLetters(prev => new Set(prev).add(letter));
    setUserSelection(letter);
  }

  function death() {
    setTimeout(() => {
      alert(`GAME OVER!!!\nAnswer was: ${chosenWord}`);
      window.location.reload();
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

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 20px', position: 'relative' }}>
        <h1 style={{ width: '100%', textAlign: 'center', margin: 0 }}>Guess the Word</h1>
        <button 
          style={{ backgroundColor: '#ff4d4d', color: 'white', width: '90px', position: 'absolute', right: '20px' }} 
          onClick={() => navigate('/')}
        >
          Log Out
        </button>
      </div>
      <center><div id="a"></div></center>
	  <div style={{fontSize:20, fontFamily:'Calibri', marginLeft:75}}>You have {chances} Chances left</div>
      <div id="b">
        {hiddenWord.join(' ')}
      </div>
      <br />
      <center><div id="c">
        <div>
          {Array.from("QWERTYUIOP").map((letter) => (
            <button 
              key={letter} 
              disabled={guessedLetters.has(letter)}
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
              disabled={guessedLetters.has(letter)}
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
              disabled={guessedLetters.has(letter)}
              onClick={() => handleGuess(letter)}
            >
              {letter}
            </button>
          ))}
        </div>
      </div></center>
      <button style={{ marginLeft: 20,backgroundColor:'yellow' }} onClick={() => window.location.reload()}>Restart</button>
    </>
  );
}

export default Game;
