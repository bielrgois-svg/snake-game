let score = 0;
let immunity = false;
let immunityTimer = null;
let immunityTimeLeft = 0;
let specialActive = false;
let specialTimer = null;
let specialFoods = [];


let gameState = "start";
let game;

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const box = 20;

let snake = [{ x: 200, y: 200 }];
let direction = "RIGHT";

let food = {
  x: Math.floor(Math.random() * 20) * box,
  y: Math.floor(Math.random() * 20) * box
};


document.addEventListener("keydown", (event) => {

  
  if (event.code === "Space" && gameState === "start") {
    startGame();
  }

  
  if (event.code === "Enter" && gameState === "gameover") {
    restartGame();
  }

  // movimentação
  if (gameState === "playing") {
    if (event.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
    if (event.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
    if (event.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
    if (event.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
  }
});

function startGame() {
  clearInterval(game);
  gameState = "playing";
  document.getElementById("startScreen").style.display = "none";
  game = setInterval(draw, 100);
}

function draw() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, 400, 400);

  if (specialActive) {
  specialFoods.forEach(f => {
    ctx.fillStyle = "yellow";
    ctx.fillRect(f.x, f.y, box, box);
  });
}

if (specialActive) {
  ctx.fillStyle = "yellow";
  ctx.font = "20px Arial";
  ctx.fillText("EVENTO!", 150, 200);
  }

  if (immunity) {
  ctx.fillStyle = "cyan";
  ctx.font = "16px Arial";
  ctx.fillText("Imunidade: " + immunityTimeLeft + "s", 10, 40);
}

ctx.fillStyle = "white";
ctx.font = "16px Arial";
ctx.fillText("Score: " + score, 10, 20);

if (immunity) {
  ctx.fillStyle = "cyan";
  ctx.fillText("Imunidade: " + immunityTimeLeft + "s", 10, 40);
}

  
  snake.forEach((part, i) => {
    ctx.fillStyle = i === 0 ? "lime" : "green";
    ctx.fillRect(part.x, part.y, box, box);
  });

 
  ctx.fillStyle = "red";
  ctx.fillRect(food.x, food.y, box, box);

  let head = { ...snake[0] };

if (specialActive) {
  specialFoods = specialFoods.filter(f => {
    if (head.x === f.x && head.y === f.y) {
      score += 2; 
    }
    return true;
  });
}

  if (direction === "LEFT") head.x -= box;
  if (direction === "RIGHT") head.x += box;
  if (direction === "UP") head.y -= box;
  if (direction === "DOWN") head.y += box;

  
if (head.x === food.x && head.y === food.y) {
  score++;

  if (score % 10 === 0) {
    activateImmunity();
  }

  if (score === 50) {
    activateSpecialEvent();
  }

  food.x = Math.floor(Math.random() * 20) * box;
  food.y = Math.floor(Math.random() * 20) * box;

} else {
  snake.pop(); 
}

  if (
    !immunity && (
    head.x < 0 || head.y < 0 ||
    head.x >= 400 || head.y >= 400 ||
    snake.some(p => p.x === head.x && p.y === head.y)
  )
  ) {

    clearInterval(game);
    gameState = "gameover";
    document.getElementById("gameOver").style.display = "block";
    return;
  }

  snake.unshift(head);
}

// REINICIAR JOGO
function restartGame() {
  clearInterval(game);

  score = 0;

  immunity = false;
  immunityTimeLeft = 0;
  specialActive = false;
  specialFoods = [];

  snake = [{ x: 200, y: 200 }];
  direction = "RIGHT";

  food = {
    x: Math.floor(Math.random() * 20) * box,
    y: Math.floor(Math.random() * 20) * box
  };

  document.getElementById("gameOver").style.display = "none";

  gameState = "playing";
  game = setInterval(draw, 100);
}

function activateSpecialEvent() {
  specialActive = true;

  specialFoods = [];

  // cria vários quadrados
  for (let i = 0; i < 10; i++) {
    specialFoods.push({
      x: Math.floor(Math.random() * 20) * box,
      y: Math.floor(Math.random() * 20) * box
    });
  }

  clearTimeout(specialTimer);
  specialTimer = setTimeout(() => {
    specialActive = false;
    specialFoods = [];
  }, 10000);
}

function activateImmunity() {
  immunity = true;
  immunityTimeLeft = 10;

  clearInterval(immunityTimer);

  immunityTimer = setInterval(() => {
    immunityTimeLeft--;

    if (immunityTimeLeft <= 0) {
      immunity = false;
      clearInterval(immunityTimer);
    }
  }, 1000);
}