// DOM Events Elements
let startBtn = document.getElementById("start-btn");
let restartBtn = document.getElementById("restart-btn");
let endGameBtn = document.getElementById("end-btn");
let nextBtn = document.getElementById("next-btn");

let finalDataArray = [];
let currentQuestionIndex = 0;
let categoriesChoiced = [];

// Player data
let player1Name = "";
let player2Name = "";

let player1Score = 0;
let player2Score = 0;

// Declare DOM Elements
let categoryOptions = document.querySelectorAll(".category-option");
const quizContainer = document.querySelector(".quiz-container");
let allAnswerBox = document.querySelectorAll(".opt");
const questionBox = document.querySelector(".question-data");
const playerContainer = document.querySelector(".player-setup");
let dropdownContainer = document.querySelector(".category");
let scoreBoardContainer = document.querySelector(".scoreboard");
const answerTypeBox = document.getElementById("answer-type")
const playerTurnContainer = document.getElementById("player-turn")

// Event Listeners
startBtn.addEventListener("click", getApiData);
nextBtn.addEventListener("click", handleNext);
nextBtn.addEventListener("click", submitQuiz);
restartBtn.addEventListener("click", restartGame);
endGameBtn.addEventListener("click", endGame);

async function getApiData() {
  finalDataArray = [];

  player1Name = document.getElementById("player1").value;
  player2Name = document.getElementById("player2").value;
  let category = document.getElementById("category").value;

  // Input validation
  if (!player1Name || !player2Name || !category) {
    alert("Please enter player names and select a category");
    return;
  }

  let url = `https://the-trivia-api.com/v2/questions/?limit=50&difficulties=easy,medium,hard&categories=${category}`;

  try {
    let response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    let data = await response.json();



    // Separate questions by difficulty
    let easyData = data.filter((questionObject) => questionObject.difficulty == "easy");

    let mediumData = data.filter((questionObject) => questionObject.difficulty == "medium");

    let hardData = data.filter((questionObject) => questionObject.difficulty == "hard");

    finalDataArray.push(easyData[0], easyData[1], mediumData[0], mediumData[1], hardData[0], hardData[1]);


    console.log("Successfully fetched data");

    // Add category to categories choiced
    categoriesChoiced.push(category);
    categoriesChoiced = [...new Set(categoriesChoiced)];

    // Setup UI for the game
    initializeGameUI();

  } catch (error) {
    console.error(error.message);
  }
}

function initializeGameUI() {
  playerContainer.classList.add("hide-data");
  dropdownContainer.classList.add("hide-data");
  quizContainer.classList.remove("hide-data");
  scoreBoardContainer.classList.remove("hide-data");
  restartBtn.classList.add("hide-data");
  endGameBtn.classList.add("hide-data");

  // Display initial player info
  playerTurnContainer.textContent = "Player 1's Turn";
  document.getElementById("player1Name").textContent = `${player1Name} = ${player1Score}`;
  document.getElementById("player2Name").textContent = `${player2Name} = ${player2Score}`;

  if (currentQuestionIndex == 0) {
    nextBtn.innerText = "Next";
    nextBtn.style.backgroundColor = "green";
  }

  // Remove used categories from the dropdown
  removeUsedCategories();
  displayData();
}

function removeUsedCategories() {
  categoryOptions.forEach((option) => {
    if (categoriesChoiced.includes(option.value)) {
      option.remove();
    }
  });
}

function displayData() {
  let difficulty = finalDataArray[currentQuestionIndex].difficulty;
  let question = finalDataArray[currentQuestionIndex].question.text;
  let correctOption = finalDataArray[currentQuestionIndex].correctAnswer;
  let incorrectOptions = finalDataArray[currentQuestionIndex].incorrectAnswers;

  let allOptions = [...incorrectOptions, correctOption];

  // Shuffle options
  allOptions.sort(() => Math.random() - 0.5);

  questionBox.innerHTML = `Level = ${difficulty} <br> Q. ${question} `;

  allAnswerBox.forEach((option, index) => {
    option.innerText = allOptions[index];
  });

  allAnswerBox.forEach((option) => {
    option.addEventListener("click", (e) => {
      for (let index = 0; index < allAnswerBox.length; index++) {
        allAnswerBox[index].classList.remove("selected", "slected-option");
      }
      option.classList.add("selected", "slected-option");
    });
    option.classList.remove("selected");
  });
}



function handleNext() {
  if (currentQuestionIndex < finalDataArray.length) {
    cheackAnswer();
    playerTurn()
    currentQuestionIndex++;
    if (currentQuestionIndex == finalDataArray.length) {
      setTimeout(() => {
        nextBtn.innerText = "Submit";
        nextBtn.style.backgroundColor = "red";
        return;
      }, 100);
    }
    displayData();
  } else {
    console.log("Game Over");
    quizContainer.classList.add("hide-data");
    displayResult();
  }
}



function cheackAnswer() {
  const selectedOption = document.querySelector(".slected-option");
  if (!selectedOption) {
    alert("Please select an option");
    return;
  }


  if (currentQuestionIndex < finalDataArray.length) {
    if (
      selectedOption.innerText ==
      finalDataArray[currentQuestionIndex].correctAnswer
    ) {

      answerTypeBox.innerHTML = "Correct Answer";
      answerTypeBox.style.color = "green";

      if (currentQuestionIndex == 0) {
        player1Score += 10;
      } else if (currentQuestionIndex == 2) {
        player1Score += 15;
      } else if (currentQuestionIndex == 4) {
        player1Score += 20;
      } else if (currentQuestionIndex == 1) {
        player2Score += 10;
      } else if (currentQuestionIndex == 3) {
        player2Score += 15;
      } else if (currentQuestionIndex == 5) {
        player2Score += 20;
      }

      document.getElementById(
        "player1Name"
      ).innerHTML = `${player1Name} = ${player1Score}`;
      document.getElementById(
        "player2Name"
      ).innerHTML = `${player2Name} = ${player2Score}`;

    } else {

      answerTypeBox.innerHTML = "Wrong Answer";
      answerTypeBox.style.color = "red";
    }
  }
}

function playerTurn() {
  if (currentQuestionIndex == 0) {
    playerTurnContainer.textContent = "Player 2's Turn"

  } else if (currentQuestionIndex == 1) {
    playerTurnContainer.textContent = "Player 1's Turn"

  } else if (currentQuestionIndex == 2) {
    playerTurnContainer.textContent = "Player 2's Turn"

  } else if (currentQuestionIndex == 3) {
    playerTurnContainer.textContent = "Player 1's Turn"

  } else if (currentQuestionIndex == 4) {
    playerTurnContainer.textContent = "Player 2's Turn"

  }
}

function submitQuiz() {
  if (
    nextBtn.innerText == "Submit" &&
    currentQuestionIndex == finalDataArray.length
  ) {
    quizContainer.classList.add("hide-data");
    restartBtn.classList.remove("hide-data");
    endGameBtn.classList.remove("hide-data");
    answerTypeBox.innerHTML = "";
    playerTurnContainer.textContent = ""
    document.getElementById("result").classList.add("hide-data");
  }

}

function restartGame() {
  currentQuestionIndex = 0;
  finalDataArray = [];

  playerContainer.classList.add("hide-data");
  dropdownContainer.classList.remove("hide-data");
  quizContainer.classList.add("hide-data");
  scoreBoardContainer.classList.remove("hide-data");
  document.getElementById("result").classList.add("hide-data");
  restartBtn.classList.add("hide-data");
  endGameBtn.classList.add("hide-data");
}

function endGame() {
  scoreBoardContainer.classList.remove("hide-data");
  displayResult();
  document.getElementById("result").classList.remove("hide-data");
  setTimeout(() => {
    location.reload();
  }, 5000);
}

function displayResult() {
  if (player1Score > player2Score) {
    document.getElementById("result").innerHTML = `PLAYER 1 ${player1Name} WINS`;
  } else if (player2Score > player1Score) {
    document.getElementById("result").innerHTML = `PLAYER 2 ${player2Name} WINS`;
  } else {
    document.getElementById("result").innerHTML = "MATCH DRAW";
  }
}







