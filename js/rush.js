const field = document.getElementById("field");
const player = document.getElementById("player");
const pointsDisplay = document.getElementById("points");

const btnLeft = document.getElementById("btn-left");
const btnRight = document.getElementById("btn-right");
const btnEnd = document.getElementById("btn-end");

let playerX = 95;
let speed = 3;
let points = 0;

let gameRunning = false;
let gameOver = false;
let enemyLoop = null;

// posição inicial
player.style.left = playerX + "px";

// movimento
function movePlayer(newX) {
  const fieldWidth = field.clientWidth;
  const playerWidth = player.offsetWidth;

  const minX = 0;
  const maxX = fieldWidth - playerWidth;

  playerX = Math.max(minX, Math.min(newX, maxX));

  player.style.left = playerX + "px";
}

// controles
document.addEventListener("keydown", (e) => {
  if (!gameRunning || gameOver) return;

  if (e.key === "ArrowLeft") {
    movePlayer(playerX - 40);
    player.classList.add("turn-left");
    player.classList.remove("turn-right");
  }

  if (e.key === "ArrowRight") {
    movePlayer(playerX + 40);
    player.classList.add("turn-right");
    player.classList.remove("turn-left");
  }
});

document.addEventListener("keyup", () => {
  player.classList.remove("turn-left", "turn-right");
});

if (btnLeft && btnRight) {
  btnLeft.addEventListener("mousedown", () => {
    if (!gameRunning || gameOver) return;
    movePlayer(playerX - 40);

    player.classList.remove("turn-right");
    player.classList.add("turn-left");
  });

  btnRight.addEventListener("mousedown", () => {
    if (!gameRunning || gameOver) return;
    movePlayer(playerX + 40);

    player.classList.remove("turn-left");
    player.classList.add("turn-right");
  });

  ["mouseup", "mouseleave"].forEach(evt => {
    btnLeft.addEventListener(evt, () => {
      player.classList.remove("turn-left");
    });

    btnRight.addEventListener(evt, () => {
      player.classList.remove("turn-right");
    });
  });
}

function startGame() {
  if (gameRunning) return;

  gameRunning = true;
  gameOver = false;
  points = 0;
  speed = 3;
  playerX = 95;

  pointsDisplay.textContent = points;

  document.querySelectorAll(".enemy").forEach(e => e.remove());

  enemyLoop = setInterval(createEnemy, 1200);
}

function endGame() {
  gameRunning = false;
  gameOver = true;
  clearInterval(enemyLoop);
}

// inimigos
function createEnemy() {
  if (!gameRunning || gameOver) return;

  const enemy = document.createElement("div");
  enemy.classList.add("enemy");

  const types = ["basic", "fast", "tank"];
  const type = types[Math.floor(Math.random() * types.length)];
  enemy.classList.add(type);

  const lanes = [10, 80, 150];
  enemy.style.left = lanes[Math.floor(Math.random() * lanes.length)] + "px";
  enemy.style.top = "-60px";

  field.appendChild(enemy);

  let enemyY = -60;

  // velocidade por tipo
  let enemySpeed = speed;
  if (type === "fast") enemySpeed += 2;
  if (type === "tank") enemySpeed -= 1;

  const move = setInterval(() => {
    if (!gameRunning || gameOver) {
      clearInterval(move);
      enemy.remove();
      return;
    }

    enemyY += enemySpeed;
    enemy.style.top = enemyY + "px";

    // colisão
    if (checkCollision(player, enemy)) {
      showGameOver();
      clearInterval(move);
      enemy.remove();
      return;
    }

    if (enemyY > 420) {
      clearInterval(move);
      enemy.remove();

      points++;
      pointsDisplay.textContent = points;

      // dificuldade
      if (points % 5 === 0 && speed < 10) {
        speed += 0.5;
      }
    }
  }, 20);
}

//colisão
function checkCollision(a, b) {
  const r1 = a.getBoundingClientRect();
  const r2 = b.getBoundingClientRect();

  return !(
    r1.bottom < r2.top ||
    r1.top > r2.bottom ||
    r1.right < r2.left ||
    r1.left > r2.right
  );
}

function showGameOver() {
  gameOver = true;
  gameRunning = false;
  clearInterval(enemyLoop);

  document.getElementById("final-score").textContent = points;
  document.getElementById("game-over").classList.remove("hidden");
}

document.getElementById("restart").addEventListener("click", () => {
  document.getElementById("game-over").classList.add("hidden");
  startGame();
});

if (btnEnd) {
  btnEnd.addEventListener("click", () => {
    endGame();
    showGameOver();
  });
}

startGame();
