import React, { useState, useEffect } from 'react';
import './Game.css';
import { wordBank } from './bank';

function Game() {
	
  const [userSelection, setUserSelection] = useState('');
  const [chosenWord, setChosenWord] = useState('');
  const [hiddenWord, setHiddenWord] = useState([]);
  const [chances, setChances] = useState(5);

  function wordSelected(wordBank) {
    const wordBankIndex = Math.floor(Math.random() * wordBank.length);
    const word = wordBank[wordBankIndex];
	return word;
  }

  useEffect(() => {
    const newWord = wordSelected(wordBank);
    setChosenWord(newWord);
    setHiddenWord(newWord.split('').map(() => '_ '));
  }, []);
  useEffect(() => {
    initiateGuess(); //eslint-disable-next-line
  }, [userSelection]);

  useEffect(() => {
  if (userSelection !== "" && hiddenWord.join('') === chosenWord) {
     setTimeout(() => {
      alert("YOU HAVE WON");
      alert("Click OK to Play Again");
	  window.location.reload();
    }, 800);
	
  }
  }, [userSelection, hiddenWord, chosenWord]);


  function death() {
	  setTimeout(() => {
 alert(`GAME OVER!!!\nAnswer was: ${chosenWord}`);
	window.location.reload();
	  }, 800);	
  }


  function initiateGuess() {
      if (!chosenWord.includes(userSelection)) {
		  drawHangman(chances);
      setChances(chances - 1);
      if (chances - 1 === 0) {
        death();
      }
    } else if (userSelection === "") {
      if (chances === 0) {
        death();
      }
    } else {
      const newHiddenWord = [...hiddenWord];
      for (let i = 0; i < chosenWord.length; i++) {
        if (chosenWord[i] === userSelection) {
          newHiddenWord[i] = userSelection;
        }
      }
      setHiddenWord(newHiddenWord);
    }
  }

function drawHangman(chances) {
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
    switch (chances) {
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
      <h1 style={{ textAlign: 'center' }}>Guess the Word</h1>
      <center><div id="a"></div></center>
	  <div style={{fontSize:20, fontFamily:'Calibri', marginLeft:75}}>You have {chances} Chances left</div>
      <div id="b">
        {hiddenWord}
      </div>
      <br />
      <center><div id="c">
        <div>
          {Array.from("QWERTYUIOP").map((letter) => (
            <button key={letter} onClick={(event) => { event.target.disabled = true; setUserSelection(letter);}}>{letter}</button>
          ))}
        </div>
        <div>
          {Array.from("ASDFGHJKL").map((letter) => (
            <button key={letter} onClick={(event) => { event.target.disabled = true; setUserSelection(letter);}}>{letter}</button>
          ))}
        </div>
        <div>
          {Array.from("ZXCVBNM").map((letter) => (
            <button key={letter} onClick={(event) => { event.target.disabled = true; setUserSelection(letter);}}>{letter}</button>
          ))}
        </div>
      </div></center>
      <button style={{ marginLeft: 20,backgroundColor:'yellow' }} onClick={() => window.location.reload()}>Restart</button>
    </>
  );
}

export default Game;
