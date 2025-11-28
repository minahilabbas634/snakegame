const board = document.getElementById("board");
const blockheight = 50;
const blockwidth = 50;

const btnstrt = document.querySelector(".btn-strt");
const modal = document.querySelector(".modal");
const startgamemodal = document.querySelector(".startgame");
const restartgamemodal = document.querySelector(".gameover");
const restartbutton = document.querySelector(".btn-restrt");

const highScore = document.getElementById("highscore");
const scoreelement = document.getElementById("score");
const timeelement = document.getElementById("time");

const cols = Math.floor(board.clientWidth / blockwidth);
const rows = Math.floor(board.clientHeight / blockheight);
const blocks = [];

let highscore = localStorage.getItem('highscore') || 0;
highScore.innerText = highscore;
let score = 0;
let time = 0;
let startTime = null;

let intervalid = null;
let food = {
    x: Math.floor(Math.random() * rows),
    y: Math.floor(Math.random() * cols)
};

let snake = [
    {x: 1, y: 3},
];
let direction = 'down';
let lastDirection = 'down';

for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
        const block = document.createElement('div');
        block.classList.add("block");
        board.appendChild(block);
        blocks[`${row}-${col}`] = block;
    }
}

function generateFood() {
    do {
        food.x = Math.floor(Math.random() * rows);
        food.y = Math.floor(Math.random() * cols);
    } while (snake.some(segment => segment.x === food.x && segment.y === food.y));
}

function render() {
    let head = null;

    if (direction === "left") {
        head = {x: snake[0].x, y: snake[0].y - 1};
    } else if (direction === "right") {
        head = {x: snake[0].x, y: snake[0].y + 1};
    } else if (direction === "down") {
        head = {x: snake[0].x + 1, y: snake[0].y};
    } else if (direction === "up") {
        head = {x: snake[0].x - 1, y: snake[0].y};
    }

    // Check wall collision
    if (head.x < 0 || head.x >= rows || head.y < 0 || head.y >= cols) {
        gameOver();
        return;
    }

    // Check self collision
    if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
        gameOver();
        return;
    }

    snake.unshift(head);

    // Check food consumption
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        scoreelement.innerText = score;
        if (score > highscore) {
            highscore = score;
            localStorage.setItem('highscore', highscore);
            highScore.innerText = highscore;
        }
        blocks[`${food.x}-${food.y}`].classList.remove("food");
        generateFood();
        blocks[`${food.x}-${food.y}`].classList.add("food");
    } else {
        const tail = snake.pop();
        blocks[`${tail.x}-${tail.y}`].classList.remove("fill");
    }

    // Update snake display
    snake.forEach(segment => {
        blocks[`${segment.x}-${segment.y}`].classList.add("fill");
    });

    // Update time
    time = Math.floor((Date.now() - startTime) / 1000);
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    timeelement.innerText = `${minutes.toString().padStart(2, '0')}-${seconds.toString().padStart(2, '0')}`;
}

function gameOver() {
    clearInterval(intervalid);
    if (score > highscore) {
        highscore = score;
        localStorage.setItem('highscore', highscore);
        highScore.innerText = highscore;
    }
    modal.style.display = "flex";
    startgamemodal.style.display = "none";
    restartgamemodal.style.display = "flex";
}

btnstrt.addEventListener("click", () => {
    modal.style.display = "none";
        generateFood(); // Make sure the food position is valid
    blocks[`${food.x}-${food.y}`].classList.add("food"); 
    startTime = Date.now();
    intervalid = setInterval(render, 300);
});

restartbutton.addEventListener("click", restartgame);

function restartgame() {
    clearInterval(intervalid);
    blocks[`${food.x}-${food.y}`].classList.remove("food");
    snake.forEach(segment => {
        blocks[`${segment.x}-${segment.y}`].classList.remove("fill");
    });
    score = 0;
    time = 0;
    direction = 'down';
    lastDirection = 'down';
    scoreelement.innerText = score;
    timeelement.innerText = '00-00';
    snake = [{x: 1, y: 3}];
    generateFood();
    blocks[`${food.x}-${food.y}`].classList.add("food");
    modal.style.display = "none";
    startTime = Date.now();
    intervalid = setInterval(render, 300);
}

addEventListener("keydown", (event) => {
    if (event.key === "ArrowUp" && lastDirection !== "down") {
        direction = "up";
    } else if (event.key === "ArrowRight" && lastDirection !== "left") {
        direction = "right";
    } else if (event.key === "ArrowLeft" && lastDirection !== "right") {
        direction = "left";
    } else if (event.key === "ArrowDown" && lastDirection !== "up") {
        direction = "down";
    }
    lastDirection = direction;
});
