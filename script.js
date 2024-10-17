let startBtn = document.getElementById("start-btn");
let restartBtn = document.getElementById("restart-btn");
let endGameBtn = document.getElementById("end-btn");
let finalDataArray = [];

let currentQuestionIndex = 0;

let player1Name = "";
let player2Name = "";

let player1Score = 0;
let player2Score = 0;

let categoriesChoiced = [];
let categoryOptions = document.querySelectorAll(".category-option");

const quizContainer = document.querySelector(".quiz-container");
const nextBtn = document.getElementById("next-btn");
let allOptionsBox = document.querySelectorAll(".opt");
const questionBox = document.querySelector(".question-data");
const playerContainer = document.getElementsByClassName("player-setup")[0];
const dorodownContainer = document.getElementsByClassName("category")[0];
const scoreBoardConteiner = document.getElementsByClassName("scoreboard")[0];
const answerType = document.getElementById("answer-type")
const playerTurnContainer = document.getElementById("player-turn") 

startBtn.addEventListener("click", getApiData);
restartBtn.addEventListener("click", reGetApiData);

async function getApiData() {
  finalDataArray = [];

  player1Name = document.getElementById("player1").value;
  player2Name = document.getElementById("player2").value;
  let category = document.getElementById("category").value;

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

    let easyData = data.filter(
      (questionObject) => questionObject.difficulty == "easy"
    );
    finalDataArray.push(easyData[0], easyData[1]);

    let mediumData = data.filter(
      (questionObject) => questionObject.difficulty == "medium"
    );
    finalDataArray.push(mediumData[0], mediumData[1]);

    let hardData = data.filter(
      (questionObject) => questionObject.difficulty == "hard"
    );
    finalDataArray.push(hardData[0], hardData[1]);

    console.log("Successfully fetched data");

    categoriesChoiced.push(category);
    categoriesChoiced = [...new Set(categoriesChoiced)];

    playerContainer.classList.add("hide-data");
    dorodownContainer.classList.add("hide-data");
    quizContainer.classList.remove("hide-data");
    scoreBoardConteiner.classList.remove("hide-data");
    restartBtn.classList.add("hide-data");
    endGameBtn.classList.add("hide-data");

    displayData();

    playerTurnContainer.textContent = "Player 1 Turn"

    

    document.getElementById(
      "player1Name"
    ).innerHTML = `${player1Name} = ${player1Score}`;
    document.getElementById(
      "player2Name"
    ).innerHTML = `${player2Name} = ${player2Score}`;

    if (currentQuestionIndex == 0) {
      nextBtn.innerText = "Next";
      nextBtn.style.backgroundColor = "green";
    }



    removeUsedCategories();
  } catch (error) {
    console.error(error.message);
  }
}

function reGetApiData() {
  currentQuestionIndex = 0;
  finalDataArray = [];

  playerContainer.classList.add("hide-data");
  dorodownContainer.classList.remove("hide-data");
  quizContainer.classList.add("hide-data");
  scoreBoardConteiner.classList.remove("hide-data");
  document.getElementById("result").classList.add("hide-data");
  restartBtn.classList.add("hide-data");
  endGameBtn.classList.add("hide-data");
}

function displayData() {
  let difficulty = finalDataArray[currentQuestionIndex].difficulty;
  let question = finalDataArray[currentQuestionIndex].question.text;
  let correctOption = finalDataArray[currentQuestionIndex].correctAnswer;
  let incorrectOptions = finalDataArray[currentQuestionIndex].incorrectAnswers;

  let allOptions = [...incorrectOptions, correctOption];

  allOptions.sort(() => Math.random() - 0.5);

  questionBox.innerHTML = `Level = ${difficulty} <br> Q. ${question} `;

  allOptionsBox.forEach((option, index) => {
    option.innerText = allOptions[index];
  });

  allOptionsBox.forEach((option) => {
    option.addEventListener("click", (e) => {
      for (let index = 0; index < allOptionsBox.length; index++) {
        allOptionsBox[index].classList.remove("selected", "slected-option");
      }
      option.classList.add("selected", "slected-option");
    });
    option.classList.remove("selected");
  });
}

nextBtn.addEventListener("click", () => {
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
});

nextBtn.addEventListener("click", () => {
  if (
    nextBtn.innerText == "Submit" &&
    currentQuestionIndex == finalDataArray.length
  ) {
    quizContainer.classList.add("hide-data");
    displayResult();
    restartBtn.classList.remove("hide-data");
    endGameBtn.classList.remove("hide-data");
    answerType.innerHTML = "";
    playerTurnContainer.textContent = ""
  }
});
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
      // alert("Correct Answer");
      answerType.innerHTML = "Correct Answer";
      answerType.style.color = "green";
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
      // alert("Wrong Answer");
      answerType.innerHTML = "Wrong Answer";
      answerType.style.color = "red";
    }
  }
}

function displayResult() {
  if (player1Score > player2Score) {
    document.getElementById(
      "result"
    ).innerHTML = `PLAYER 1 ${player1Name} WINS`;
  } else if (player2Score > player1Score) {
    document.getElementById(
      "result"
    ).innerHTML = `PLAYER 2 ${player2Name} WINS`;
  } else {
    document.getElementById("result").innerHTML = "MATCH DRAW";
  }
}

function endGame() {
  scoreBoardConteiner.classList.remove("hide-data");
  document.getElementById("result").classList.remove("hide-data");
  setTimeout(() => {
    location.reload();
  }, 2000);
}

endGameBtn.addEventListener("click", endGame);

function removeUsedCategories() {
  categoryOptions.forEach((option) => {
    if (categoriesChoiced.includes(option.value)) {
      option.remove();
    }
  });
}


function playerTurn() { 
  if (currentQuestionIndex == 0) {
    playerTurnContainer.textContent = "Player 2 Turn"
    
  } else if (currentQuestionIndex == 1) {
    playerTurnContainer.textContent = "Player 1 Turn"
    
  } else if (currentQuestionIndex == 2) {
    playerTurnContainer.textContent = "Player 2 Turn"
    
  } else if (currentQuestionIndex == 3) {
    playerTurnContainer.textContent = "Player 1 Turn"
    
  } else if (currentQuestionIndex == 4) {
    playerTurnContainer.textContent = "Player 2 Turn"
    
  }
}

