document.addEventListener("DOMContentLoaded", () =>  {

  //Global variables
  const startGame = document.querySelector(".btn__reset");
  const overlay = document.getElementById("overlay");
  const phrase = document.getElementById("phrase");
  const qwerty = document.getElementById("qwerty");
  const buttons = document.querySelectorAll("#qwerty button");
  //Create phrases array
  const phrases = ["as you wish"//, "whats knitten kitten", "danger will robinson",
         //"single serving friends", "si vis pacem para bellum"
       ];

  //Tracking variables
  let displayScore = document.querySelectorAll("#banner #score") ;
  let tries = document.querySelectorAll("#scoreboard li img");
  let letterFound = false;
  let letters;
  let losses = 0;
  let wins = 0;
  let missed = 0;



  //Main Game loop
  mainGameLoop = () => {
    clearBoard();
    addPhraseToDisplay();
    rollOut(letters.length, "animate-in");//Call for animation
  }

  clearBoard = () =>{
    let li = document.querySelectorAll("#phrase li");//Select phrase display letters
    let ul = document.querySelectorAll("#phrase ul");
    missed = 0;//Reset misssed variable
    loopCap = (li.length >= buttons.length) ? (loopCap =  li.length) : (loopCap =  buttons.length);//Set max loop

    for (let i = 0; i < loopCap; i++) {//Reset board
      (i >= 0 && tries[i]) ? tries[i].src = "images/liveHeart.png" : null;
      (i >= 0 && buttons[i]) ? (buttons[i].style.backgroundColor = "#D2D2D2",buttons[i].disabled = false) : null;
      (i >= 0 && li[i]) ? li[i].remove() : null;
      (i > 0 && ul[i]) ? ul[i].remove() : null;
    }
    overlay.style.display = "none";
  }

  addPhraseToDisplay = () => {//Pass in the splitPhrase
    let random = Math.floor(Math.random() * phrases.length);//Dynamic random based on the number of phrases in the array
    let splitPhrase = phrases[random].split("");//Split and return phrase array
    let word = 0;

    for (let i = 0; i < splitPhrase.length; i++) {//Loop through letters in phrase
      if (splitPhrase[i] != " ") {//Ensure letter isn't a space
        let li = phrase.children[word].appendChild(document.createElement("LI"));//Add html to the most recent "word" container
        li.appendChild(document.createTextNode(splitPhrase[i]));//Add letter to the li
        li.classList.add("letter");//Style the li

      }else if(splitPhrase[i] == " "){//Check for space
        let li = phrase.children[word].appendChild(document.createElement("LI"));//Create visual spacing
        li.classList.add("space");
        phrase.appendChild(document.createElement("UL"));
        word++;//Count words
      }
    }
    letters = document.querySelectorAll(".letter");//Update global variable for new letters
  }

  rollOut = (i,direction,elmnt) => {
    setTimeout(function () {//set .10s timeout between each execution of a loop
      (i < 0) ? null //if thruthy do nothing
        :(i--, document.querySelectorAll(`.animate-in`) && direction === "animate-out") ?//if falsey decrement and run conditional
          letters[i].className = letters[i].className.replace( /(?:^|\s)animate-in(?!\S)/g , ' animate-out' )//if truthy swap classes
          : letters[i].classList.add(direction);//if falsey simply add the class
      (i > 0) ? rollOut(i,direction) : null;//If `i` is greater than `0` call rollOut() again passing in current values
    }, 100);
  }

  checkLetter = (playerLetter) => {//Check player letter against phrase letter
    letterFound = false;
    for (let i = 0; i < letters.length; i++) {//Loop through phrase li.letters
      (letters[i].innerHTML === playerLetter) ? (letterFound = true, letters[i].classList.add("show")) : false;//Is letter in phrase
    }
    (letterFound == false) ? (tries[missed].src = "images/lostHeart.png", missed++) : null;//Test if player letter is in phrase
    return letterFound;//return boolean for use in button call
  }

  checkWinState = () => {//Check for win or loss
    let found = document.querySelectorAll(".letter.show");//Select shown letters
    win = (found.length === letters.length) ? "won"//check for win/loss state
    : (missed === 5) ? "lost"
    : win = null;//if niether do nothing
    (win == "won") ? (setMessage(win), wins++, displayScore[0].innerHTML = `${win}: `+wins)//update message for win/loss screen
    : (win == "lost") ? (setMessage(win), losses++, displayScore[1].innerHTML = `${win}: `+losses)
    : win = null;
  }

  setMessage = (wonLost) => { //Pass in wonLost value
    let message = document.querySelector("#overlay h2"); //Select headline element
    setTimeout(function() {
      message.innerHTML = `You ${wonLost}, give it another go?`;//Change headline
      overlay.style.display = "flex";//Add overlay
      overlay.className = `${wonLost}`;//Add lose class
      clearBoard();//Send win state to reset
    }, 2000);

    rollOut(letters.length,"animate-out");
  }

  qwerty.addEventListener("click", function (e) {//Listen for button, then compare with phrase letters using event delegation
    if (e.target.type === "submit") {
      let clickedBtn = e.target;
      clickedBtn.disabled = true;//Disable the button
      checkLetter(clickedBtn.innerHTML) ?//Test checkLetter and add repective bg color
        clickedBtn.style.backgroundColor = "#78CF82"
      : clickedBtn.style.backgroundColor = "#D94545";
      checkWinState();//Call checkWinState function
    }
  });

  startGame.addEventListener("click", () => {//Start game with addEventListener() on start game button

    mainGameLoop();//Call AddPhraseToDisplay() function pass value of splitPhrase from getRandomPhrase()
  });
});
