const board = document.querySelector(".board");
const startBtn = document.querySelector(".btn-start");
const modal = document.querySelector(".modal");
const startGameModal = document.querySelector(".start-game");
const gameOverModal = document.querySelector(".game-over");
const restartBtn = document.querySelector(".btn-restart");

const highhScoreElement = document.querySelector("#high-score");
const scoreElement = document.querySelector("#score");
const timeElement = document.querySelector("#time"); 

const blockHeight = 30;
const blockWidth = 30;

let score = 0;
let highScore = localStorage.getItem('highScore') || 0;
let time = `00:00`;

highhScoreElement.innerText = highScore;

const cols = Math.floor(board.clientWidth / blockWidth);
const rows = Math.floor(board.clientHeight / blockHeight);

let intervalId = null;

let timerIntervalId = null;

let food = {x:Math.floor(Math.random() * rows), y: Math.floor(Math.random() * cols)};

let blocks = [];
let snake = [
  { x: 1, y: 3 },
];

let direction = 'right';

for (let row = 0; row < rows; row++) {
  for (let col = 0; col < cols; col++) {
    const block = document.createElement("div");
    block.classList.add("block");
    board.appendChild(block);
    blocks[`${row}-${col}`] = block;
  }
}

function render(){
  let head = null;
  
  blocks[`${food.x}-${food.y}`].classList.add("food");

    //Update head position based on direction  
    if(direction === 'left'){
      head = {x: snake[0].x, y:snake[0].y -1};
    } else if(direction === 'right'){
      head = {x: snake[0].x, y:snake[0].y +1};
    } else if(direction === 'up'){
      head = {x: snake[0].x -1, y:snake[0].y};
    } else if(direction === 'down'){
      head = {x: snake[0].x +1, y:snake[0].y};
    }

    //Collision with walls
    if(head.x < 0 || head.x >= rows || head.y < 0 || head.y >= cols){
      clearInterval(intervalId);
      modal.style.display = 'flex';
      startGameModal.style.display = 'none';
      gameOverModal.style.display = 'flex';
      return;
    }

    //Food consumption
    if(head.x === food.x && head.y === food.y){
      blocks[`${food.x}-${food.y}`].classList.remove("food");
      food = {x:Math.floor(Math.random() * rows), y: Math.floor(Math.random() * cols)};
      blocks[`${food.x}-${food.y}`].classList.add("food");
      snake.unshift(head);
      score += 10;
      scoreElement.innerText = score;
      if(score > highScore){
        highScore = score;
        localStorage.setItem('highScore', highScore.toString());
      }
    }

    //Move snake
    snake.forEach(segment => {
      blocks[`${segment.x}-${segment.y}`].classList.remove("fill");
    })
    snake.unshift(head);
    snake.pop();

    snake.forEach(segment => {
      blocks[`${segment.x}-${segment.y}`].classList.add("fill");

    });
}

  startBtn.addEventListener('click', () => {
    modal.style.display = 'none';
    intervalId = setInterval(() => {
      render();
    }, 100);
    timerIntervalId = setInterval(() => {
      let [mins, secs] = time.split(':').map(Number);
      secs += 1;
      if (secs === 60) {
        mins += 1;
        secs = 0;
      }
      time = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
      timeElement.innerText = time;
    }, 1000);
  })

  restartBtn.addEventListener('click', restartGame);

  function restartGame(){

    blocks[`${food.x}-${food.y}`].classList.remove("food");

    snake.forEach(segment => {
      blocks[`${segment.x}-${segment.y}`].classList.remove("fill");
    })

    score = 0;
    time = `00:00`;

    scoreElement.innerText = score;
    timeElement.innerText = time;
    highhScoreElement.innerText = highScore;

    modal.style.display = 'none';
    snake = [
      { x: 1, y: 3 },
    ];
    direction = 'down';
    food = {x:Math.floor(Math.random() * rows), y: Math.floor(Math.random() * cols)};
    intervalId = setInterval(() => {
      render();
    }, 100);
  }



  addEventListener('keydown', (event) => {
    if(event.key === 'ArrowLeft'){
      direction = 'left';
    } else if(event.key === 'ArrowRight'){
      direction = 'right';
    } else if(event.key === 'ArrowUp'){
      direction = 'up';
    } else if(event.key === 'ArrowDown'){
      direction = 'down';
    }
  })