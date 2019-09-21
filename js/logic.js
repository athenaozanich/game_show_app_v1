document.addEventListener("DOMContentLoaded", () =>  {

  //Global variables
  const startGame = document.querySelector(".btn__reset");
  const overlay = document.getElementById("overlay");
  const phrase = document.getElementById("phrase");
  const qwerty = document.getElementById("qwerty");
  const buttons = document.querySelectorAll("#qwerty button");

  //Tracking variables
  let displayScore = document.querySelectorAll("#banner #score") ;
  let letterFound = false;
  let letters;
  let win = false;
  let losses = 0;
  let wins = 0;
  let missed = 0;

  //Create phrases array
  const phrases = ["as you wish", "whats knitten kitten", "danger will robinson",
         "single serving friends", "si vis pacem para bellum"];

  //Reset board
  function resetBoard(score){
    //Select "tries" imgs
    let tries = document.querySelectorAll("#scoreboard li img");
    //Select phrase display letters
    let li = document.querySelectorAll("#phrase li");
    let ul = document.querySelectorAll("#phrase ul");
    //Reset misssed variable
    missed = 0;
    //On win true
    if (score == true) {
      //Add a point to score
      wins++;
      //Display score
      displayScore[0].innerHTML = "Wins: "+wins;
      //On win false
    }else if (score == false){
      //Add a loss to score
      losses++;
      displayScore[1].innerHTML = "Losses: "+losses;
    }
    //Loop through tries
    for (let i = 0; i < tries.length; i++) {
      //Reset tries
      tries[i].src = "images/liveHeart.png";
    }
    //Loop through phrase letters
    for (var i = 0; i <  li.length; i++) {
      //Reset phrase letters
      li[i].remove();
    }
    for (var i = 1; i <  ul.length; i++) {
      //Reset phrase letters
      ul[i].remove();
    }
  }

  //Get phrase function
  function getRandomPhrase(phrases){
    //Dynamic random based on the number of phrases in the array
    let random = Math.floor(Math.random() * phrases.length);
    //Use random to select a phrase
    let randomPhrase = phrases[random];
    //Split that phrase into an array of letters
    let splitPhrase = randomPhrase.split("");
    //Return result
    return splitPhrase;
  }



  //Add to display
  function addPhraseToDisplay(splitPhrase){
    //Loop through letters in phrase
    let word = 0;
    for (let i = 0; i < splitPhrase.length; i++) {
      //Ensure letter isn't a space
      if (splitPhrase[i] != " ") {
        //Create li
        let li = document.createElement("LI");
        //Create text containing current letter
        let phraseLetter = document.createTextNode(splitPhrase[i]);
        //Add html to the dom
        phrase.children[word].appendChild(li);
        //Style the li
        li.classList.add("letter");
        li.style.opacity = "0";
        //Add letter to the li
        li.appendChild(phraseLetter);
        //Check for space

      }else if(splitPhrase[i] == " "){
        //Create visual spacing
        let li = document.createElement("LI");
        phrase.children[word].appendChild(li);
        li.classList.add("space");

        let ul = document.createElement("UL");
        phrase.appendChild(ul);
        //Count words
        word++;

      }

    }
    letters = document.querySelectorAll(".letter");
    rollOut(letters.length,"animate-in");
  }
  //Check player letter against phrase letter
  function checkLetter(playerLetter){
    //Select phrase li.letter
    letter = document.querySelectorAll(".letter");
    //Initialize letter found boolean
    let letterFound = false;
    //Loop through phrase li.letters
    for (let _i = 0; _i < letter.length; _i++) {
      //Get li.letter text
      let phraseLetter = letter[_i].innerHTML;
      //Test if player letter is in phrase
      if (phraseLetter === playerLetter) {
        //If equal set boolean to true
        letterFound = true;
        //Add class show
        letter[_i].classList.add("show");
      }
    }
    //Test if player letter is in phrase
    if (letterFound == false) {
      //If not equal select tries
      let tries = document.querySelectorAll("#scoreboard li img");
      //Temove try
      tries[missed].src = "images/lostHeart.png";
      //Increase missed count
      missed++;
    }
    //return boolean for use in button call
    return letterFound;
  }

  function rollOut (i,direction) {
    setTimeout(function () {

      if (i >= 0) {
        i--;
        letter = document.querySelectorAll(".letter");
        if (document.querySelectorAll(`.animate-in`)) {
          if (direction === "animate-out") {
            letter[i].className = letter[i].className.replace( /(?:^|\s)animate-in(?!\S)/g , ' animate-out' );
          }
        }
        document.querySelectorAll(".letter")[i].classList.add(direction);
      }
      if (i > 0) {
        rollOut(i,direction);
      }
    }, 100);


  }

  //Check for win or loss
  function checkWinState(){
    //Select headline element
    let message = document.querySelector("#overlay h2");
    //Select phrase letter
    letter = document.querySelectorAll(".letter");

    //Select shown letters
    let found = document.querySelectorAll(".letter.show");
    //Test for 5 incorrect guesses
    if(missed === 5){

      setTimeout(function() {
        //Change button text
        let Btn = startGame.innerHTML = "Retry";
        //Change headline
        let Mess = message.innerHTML = "Oh no! You ran out of tries!";
        //Add overlay
        overlay.style.display = "flex";
        //Remove win class if present
        overlay.classList.remove("win");
        //Add lose class
        overlay.classList.add("lose");
        //Set win boolean
        win = false;
        //Send win state to reset
        resetBoard(win);
      }, 2000);
      rollOut(letter.length,"animate-out");
    //Test for all letters found
  }else if (found.length === letter.length) {

      setTimeout(function() {
        //Change button text
        let Btn = startGame.innerHTML = "Replay";
        //Change headline
        let Mess = message.innerHTML = "Great Job!";
        //Add overlay
        overlay.style.display = "flex";
        //Remove win class if present
        overlay.classList.remove("lose");
        //Add win class
        overlay.classList.add("win");
        //Set win boolean
        win = true;
         //Send win state to reset
        resetBoard(win);
      }, 2000);
      rollOut(letter.length,"animate-out");
    }
  }

  //Listen for button, then compare with phrase letters
  for (let i = 0; i < buttons.length; i += 1) {
    //Button Listener
    buttons[i].addEventListener("click", function (event) {
      //Selects the button pressed by player
      let playerLetter = this.innerHTML;
      //Call checkLetter function and save the return value to checkResult
      let checkResult = checkLetter(playerLetter);
      //Disable the button
      this.disabled = true;
        //Test checkResult for true
        if (checkResult == true) {
          //If true change button background to green
          this.style.backgroundColor = "#78CF82";
          //Test checkResult for false
        }else if(checkResult == false){
          //If true change button background to red
          this.style.backgroundColor = "#D94545";
        }
      //Call checkWinState function
      checkWinState();
    });
  }
  //Start game with addEventListener() on start game button
  startGame.addEventListener("click", () => {
    //Loop through buttons
    for (let i = 0; i < buttons.length; i++) {
      //Reset their background
      buttons[i].style.backgroundColor = "#D2D2D2";
      //Enable buttons
      buttons[i].disabled = false;
    }
    //Remove overlay
    overlay.style.display    = "none";
    //Call getRandomPhrase function and save it's return value to splitPhrase
    let splitPhrase = getRandomPhrase(phrases);
    //Call AddPhraseToDisplay function
      addPhraseToDisplay(splitPhrase);


  });
});
