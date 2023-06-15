const word = document.getElementById("word");
const text = document.getElementById("text");
const scoreEl = document.getElementById("score");
const timeEl = document.getElementById("time");
const endGame = document.getElementById("end-game-container");
const settingsBtn = document.getElementById("settings-btn");
const settings = document.getElementById("settings");
const settingsForm = document.getElementById("settings-form");
const difficultySelect = document.getElementById("difficulty");

async function fetchWords() {
  try {
    const res = await fetch("https://random-word-api.herokuapp.com/word");
    const data = await res.json();
    return data;
  } catch (error) {
    console.log("Error fetching word:", error);
    return null;
  }
}

let randomWord;

let score = 0;
let time = 10;

let difficulty =
  localStorage.getItem("difficulty") !== null
    ? localStorage.getItem("difficulty")
    : "medium";
//set difficulty
difficultySelect.value =
  localStorage.getItem("difficulty") !== null
    ? localStorage.getItem("difficulty")
    : "medium";

//focus on text on start
text.focus();

//start counting
const timeInterval = setInterval(updateTime, 1000);

//add word to DOM
async function addWordToDOM() {
  let randomWord = await fetchWords();
  word.innerHTML = randomWord;
}

//update score
function updateScore() {
  score++;
  scoreEl.innerHTML = score;
}

//update time
function updateTime() {
  time--;
  timeEl.innerHTML = time + "s";

  if (time === 0) {
    clearInterval(timeInterval);
    gameOver();
  }
}

//game over, show end
function gameOver() {
  endGame.innerHTML = `
  <h1>You ran out of time</h1>
  <p>Your's score is: ${score}</p>
  <button onclick="location.reload()">Play again</button>
  `;

  endGame.style.display = "flex";
}

addWordToDOM();

//event listeners
text.addEventListener("input", (e) => {
  const insertedText = e.target.value;

  if (insertedText === randomWord) {
    addWordToDOM();
    updateScore();
    e.target.value = "";

    if (difficulty === "hard") {
      time += 2;
    } else if (difficulty === "medium") {
      time += 3;
    } else {
      time += 4;
    }

    updateTime();
  }
});

//settings
settingsBtn.addEventListener("click", () => settings.classList.toggle("hide"));
//settings select
settingsForm.addEventListener("change", (e) => {
  difficulty = e.target.value;
  localStorage.setItem("difficulty", difficulty);
});
