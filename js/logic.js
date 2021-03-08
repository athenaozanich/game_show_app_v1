document.addEventListener('DOMContentLoaded', () =>  {

  // Global variables
  const startGame = document.querySelector('.startBtn')
  const overlay = document.getElementById('overlay')
  const phrase = document.getElementById('phrase')
  const qwerty = document.getElementById('qwerty')
  const buttons = document.querySelectorAll('#qwerty button')

  // Create phrases array
  const phrases = ['as you wish', 'whats knitten kitten', 'danger will robinson',
    'single serving friends', 'si vis pacem para bellum']

  // Tracking variables
  const displayScore = document.querySelectorAll('#banner #score')
  const tries = document.querySelectorAll('#scoreboard li img')
  let letterFound = false
  let letters
  let losses = 0
  let wins = 0
  let missed = 0
  let win = null
  addPhraseToDisplay= () => { // Pass in the splitPhrase
    let random = Math.floor(Math.random() * phrases.length);// Dynamic random based on the number of phrases in the array
    let splitPhrase = phrases[random].split('');// Split and return phrase array
    let word = 0;

    for (let i = 0; i < splitPhrase.length; i++) {// Loop through letters in phrase
      li = phrase.children[word].appendChild(document.createElement('LI'));
      
      (splitPhrase[i] != ' ') ? (li.appendChild(document.createTextNode(splitPhrase[i])), li.classList.add('letter'))// Style the li
      :(splitPhrase[i] == ' ')? (li.classList.add('space'), phrase.appendChild(document.createElement('UL')), word++)
      :null;// Count words
    }
    letters = document.querySelectorAll('.letter');// Update global variable for new letters
    rollOut(letters.length, 'animate-in');// Call for animation
  }

  checkLetter = (playerLetter) => {// Check player letter against phrase letter
    letterFound = false;
    for (let i = 0; i < letters.length; i++) {// Loop through phrase li.letters
      if(letters[i].innerHTML === playerLetter) { letterFound = true; letters[i].classList.add('show'); }// Is letter in phrase
    }
    if (letterFound == false) { tries[missed].src = "images/lostHeart.png"; missed++; console.log(i)}// Test if player letter is in phrase
    return letterFound;// return boolean for use in button call
  }

  checkWinState = () => {// Check for win or loss
    let found = document.querySelectorAll('.show');// Select shown letters
    win = (found.length === letters.length) ? "won" : (missed === 5) ? "lost" : win = null;// if niether do nothing
    (win == 'won') ? (setMessage(win), wins++, displayScore[0].innerHTML = `${win}: `+wins, rollOut(letters.length, 'animate-out'))// update message for win/loss screen
    : (win == 'lost') ? (setMessage(win), losses++, displayScore[1].innerHTML = `${win}: `+losses, rollOut(letters.length, 'animate-out'))
    : win = null;
  }

  setMessage = (wonLost) => { // Pass in wonLost value
    let message = document.querySelector('#overlay h2'); // Select headline element
    setTimeout(function() {
      message.innerHTML = `You ${wonLost}, give it another go?`;// Change headline
      overlay.className = `${wonLost} slide-in-left`;// Add lose class
      // Send win state to reset
    }, 2000);
  }

  rollOut = (i,direction) => {// Handle animations with delay (hoping to replace this with a sass function instead)
    setTimeout(() => {// set .10s timeout between each execution of a loop
      (i < 0) ? null // if thruthy do nothing
        :(i--, document.querySelectorAll(`.animate-in`) && direction === 'animate-out') ?// if falsey decrement and run conditional
          letters[i].className = letters[i].className.replace(/(?:^|\s)animate-in(?!\S)/g , ' animate-out')// if truthy swap classes
          : letters[i].classList.add(direction);// if falsey simply add the class
      if(i > 0) rollOut(i,direction);// If `i` is greater than `0` call rollOut() again passing in current values
    }, 100);
  }

  clearBoard = () =>{// Clear phrase and reset board
    let li = document.querySelectorAll('#phrase li');// Select phrase display letters
    let ul = document.querySelectorAll('#phrase ul');
    missed = 0;// Reset misssed variable
    loopCap = (li.length >= buttons.length) ? (loopCap =  li.length) : (loopCap =  buttons.length);// Set max loop

    for (let i = 0; i < loopCap; i++) {// Reset board
      (i >= 0 && tries[i]) ? tries[i].src = "images/liveHeart.png" : null;
      (i >= 0 && buttons[i]) ? (buttons[i].className ="", buttons[i].disabled = false) : null;
      (i >= 0 && li[i]) ? li[i].remove() : null;
      (i > 0 && ul[i]) ? ul[i].remove() : null;
    }
    overlay.className = "start slide-out-right";
  }

  qwerty.addEventListener('click', (e) => {// Use event delegation listen for button, then compare with phrase letters
    
    if (e.target.type === "submit" && win === null ) {
      let clickedBtn = e.target;
      clickedBtn.disabled = true;// Disable the button
      clickedBtn.className = checkLetter(clickedBtn.innerHTML) ?  "correct" : "wrong";
      checkWinState();// Call checkWinState function
    }
  });

  startGame.addEventListener('click', () => {// Start game with addEventListener() on start game button
    clearBoard();
    addPhraseToDisplay();// Call AddPhraseToDisplay() function pass value of splitPhrase from getRandomPhrase()
  });
  document.addEventListener('keyup', (e) => {
    const buttons = document.querySelectorAll('#qwerty button');
    
    if(e.key === "Enter" && !document.querySelector('.letter')){
      clearBoard();
      addPhraseToDisplay();// Call AddPhraseToDisplay() function pass value of splitPhrase from getRandomPhrase()
    }
    buttons.forEach(button => {
      if(e.key === button.innerHTML && win === null){
        let clickedBtn = e.target;
        clickedBtn.disabled = true;// Disable the button
        clickedBtn.className = checkLetter(button.innerHTML) ?  "correct" : "wrong";
        checkWinState();// Call checkWinState function
      }
    });
  });
});
