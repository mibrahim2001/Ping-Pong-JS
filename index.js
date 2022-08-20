
//creating the components
const gameBoard = document.querySelector("#gameBoard");
const ctx = gameBoard.getContext("2d");
const scoreText = document.querySelector("#scoreText");
const resetBtn = document.querySelector("#resetBtn");
const gameWidth = gameBoard.width;
const gameHeight = gameBoard.height;
const boardBackground = "rgb(81, 88, 178)";
const paddle1Color = "rgb(19, 19, 19)";
const paddle2Color = "rgb(231, 4, 10)";
const paddleBorder = "black";
const ballColor = "orange";
const ballBorderColor = "black";
const ballRadius = 10;
const paddleSpeed = 70;
let intervalID;
let ballSpeed;
let ballX = gameWidth / 2;
let ballY = gameHeight / 2;
let ballXDirection = 0;
let ballYDirection = 0;
let player1Score = 0;
let player2Score = 0;
let running = false;
let paddle1 = {
  width: 25,
  height: 100,
  x: 0,
  y: 0,
};
let paddle2 = {
  width: 25,
  height: 100,
  x: gameWidth - 25,
  y: gameHeight - 100,
};

//adding the event listeners
window.addEventListener("keydown", changeDirection);
window.addEventListener("keydown", checkForStartGame);
resetBtn.addEventListener("click", resetGame);

//to prevent the scroll function of window by arrow key 
window.addEventListener("keydown", function(e) {
    if(["Space","ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].indexOf(e.code) > -1) {
        e.preventDefault();
    }
}, false);




//game
showStartInstructions();

//a function to show instructions on the screen
function showStartInstructions() {
  ctx.font = "30px Permanent Marker";
  ctx.fillStyle = "white";
  ctx.textAlign = "center";
  ctx.fillText("Press Enter to Start The Game", gameWidth / 2, gameHeight / 2);
}

//function to check if to start the game
function checkForStartGame(event) {
  console.log(event.keyCode);
  if (event.keyCode == 13) {
    resetGame();
  }
}

//a function to start the game
function gameStart() {
  running = true;
  resetBtn.style.visibility = "hidden";
  createBall();
  nextTick();
}

//this function calls the arrow function to call all mentioned functions
//in it every 1ms
function nextTick() {
  if (running) {
    intervalID = setTimeout(() => {
      clearBoard();
      drawPaddles();
      moveBall();
      drawBall();
      checkForWinner();
      checkCollision();
      nextTick();
    },1);
  }
}

function clearBoard() {
  ctx.fillStyle = boardBackground;
  ctx.fillRect(0, 0, gameWidth, gameHeight);
  ctx.strokeStyle = "white";
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(gameWidth / 2, 0);
  ctx.lineTo(gameWidth / 2, gameHeight);
  ctx.stroke();
  ctx.lineWidth = 4;
  ctx.moveTo(gameWidth / 2, gameHeight / 2);
  ctx.lineTo(gameWidth, gameHeight / 2);
  ctx.lineTo(0, gameHeight / 2);

  ctx.stroke();
}

function drawPaddles() {
  ctx.strokeStyle = paddleBorder;
  ctx.lineWidth = 2;

  ctx.fillStyle = paddle1Color;
  ctx.fillRect(paddle1.x, paddle1.y, paddle1.width, paddle1.height);
  ctx.strokeRect(paddle1.x, paddle1.y, paddle1.width, paddle1.height);

  ctx.fillStyle = paddle2Color;
  ctx.fillRect(paddle2.x, paddle2.y, paddle2.width, paddle2.height);
  ctx.strokeRect(paddle2.x, paddle2.y, paddle2.width, paddle2.height);
}

function createBall() {
  ballSpeed = 1;
  if (Math.round(Math.random()) == 1) {
    ballXDirection = 1;
  } else {
    ballXDirection = -1;
  }

  if (Math.round(Math.random()) == 1) {
    ballYDirection = 1;
  } else {
    ballYDirection = -1;
  }

  ballX = gameWidth / 2;
  ballY = gameHeight / 2;
  drawBall(ballX, ballY);
}

function moveBall() {
  ballX += ballSpeed * ballXDirection;
  ballY += ballSpeed * ballYDirection;
}

function drawBall() {
  ctx.fillStyle = ballColor;
  ctx.strokeStyle = ballBorderColor;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(ballX, ballY, ballRadius, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.fill();
}

function checkCollision() {
  if (ballY <= 0 + ballRadius) {
    ballYDirection *= -1;
  } else if (ballY >= gameHeight - ballRadius) {
    ballYDirection *= -1;
  }

  if (ballX <= 0) {
    player2Score++;
    updateScore();
    createBall();
    return;
  }

  if (ballX >= gameWidth) {
    player1Score += 1;
    updateScore();
    createBall();
    return;
  }

  if (ballX <= paddle1.x + paddle1.width + ballRadius) {
    if (ballY >= paddle1.y && ballY <= paddle1.y + paddle1.height) {
      ballX = paddle1.x + paddle1.width + ballRadius; //if ball gets stuck
      ballXDirection *= -1;
      ballSpeed += 0.2;
    }
  }

  if (ballX >= paddle2.x - ballRadius) {
    if (ballY >= paddle2.y && ballY <= paddle2.y + paddle2.height) {
      ballX = paddle2.x - ballRadius; // if ball gets stuck
      ballXDirection *= -1;
      ballSpeed += 0.2;
    }
  }
}

function changeDirection(event) {
  const KeyPressed = event.keyCode;
  const paddle1Up = 87;
  const paddle1Down = 83;
  const paddle2Up = 38;
  const paddle2Down = 40;

  switch (KeyPressed) {
    case paddle1Up:
      if (paddle1.y > 0) {
        paddle1.y -= paddleSpeed;
      }
      break;
    case paddle1Down:
      if (paddle1.y < gameHeight - paddle1.height) {
        paddle1.y += paddleSpeed;
      }
      break;
    case paddle2Up:
      if (paddle2.y > 0) {
        paddle2.y -= paddleSpeed;
      }
      break;
    case paddle2Down:
      if (paddle2.y < gameHeight - paddle2.height) {
        paddle2.y += paddleSpeed;
      }
      break;
  }
}

function updateScore() {
  scoreText.textContent = `${player1Score} : ${player2Score}`;
}

function checkForWinner() {
  if (player1Score > 10 && player1Score >= player2Score + 2) {
    showWinner("Player 1");
  } else if (player2Score > 10 && player2Score >= player1Score + 2) {
    showWinner("Player 2");
  }
}

function showWinner(winner) {
  ctx.font = "70px Georgia";
  ctx.textAlign = "center";
  ctx.lineWidth = 6;

  if(winner == "Player 1"){
    ctx.fillStyle = paddle1Color;
    ctx.strokeStyle = "red";
  }else{
    ctx.fillStyle = paddle2Color;
    ctx.strokeStyle = "black";
  }

  ctx.strokeText(`${winner} Won!`, gameWidth / 2 + 12, gameHeight / 2 - 30);
  ctx.fillText(`${winner} Won!`, gameWidth / 2 + 12, gameHeight / 2 - 30);

  running = false;
  resetBtn.style.visibility = "visible";
}

function resetGame() {
  player1Score = 0;
  player2Score = 0;
  paddle1 = {
    width: 25,
    height: 100,
    x: 0,
    y: 0,
  };
  paddle2 = {
    width: 25,
    height: 100,
    x: gameWidth - 25,
    y: gameHeight - 100,
  };
  ballSpeed = 1;
  ballX = 0;
  ballY = 0;
  ballXDirection = 0;
  ballYDirection = 0;
  updateScore();
  clearInterval(intervalID);
  gameStart();
}
