const field = document.getElementById("field");
const player = document.getElementById("player");
const pointsDisplay = document.getElementById("points");

let playerX = 95;
let speed = 3;
let points = 0;
let gameOver = false;

// posição inicial
player.style.left = playerX + "px";

// CONTROLES
document.addEventListener("keydown", (e) => {
  if (gameOver) return;

  if (e.key === "ArrowLeft" && playerX > 10) {
    playerX -= 40;
  }

  if (e.key === "ArrowRight" && playerX < 170) {
    playerX += 40;
  }

  player.style.left = playerX + "px";
});

// CRIA INIMIGO
function createEnemy() {
  if (gameOver) return;

  const enemy = document.createElement("div");
  enemy.classList.add("enemy");

  const lane = [10, 80, 150];
  enemy.style.left = lane[Math.floor(Math.random() * lane.length)] + "px";
  enemy.style.top = "-60px";

  field.appendChild(enemy);

  let enemyY = -60;

  const move = setInterval(() => {
    if (gameOver) {
      clearInterval(move);
      enemy.remove();
      return;
    }

    enemyY += speed;
    enemy.style.top = enemyY + "px";

    // colisão
    if (checkCollision(player, enemy)) {
      gameOver = true;
      showGameOver();

    }

    // passou do campo
    if (enemyY > 420) {
      clearInterval(move);
      enemy.remove();
      points++;
      pointsDisplay.textContent = points;
    }
  }, 20);
}

// COLISÃO
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

// LOOP PRINCIPAL
setInterval(createEnemy, 1200);

function showGameOver() {
  gameOver = true;

  document.getElementById("final-score").textContent = points;
  document.getElementById("game-over").classList.remove("hidden");
}

// botão reiniciar
document.getElementById("restart").addEventListener("click", () => {
  location.reload();
});

document.getElementById("btn-left").onclick = () => moveLeft();
document.getElementById("btn-right").onclick = () => moveRight();

function moveLeft() {
  if (playerLane > 0) {
    playerLane--;
    player.style.left = lanes[playerLane] + "px";
  }
}

function moveRight() {
  if (playerLane < 2) {
    playerLane++;
    player.style.left = lanes[playerLane] + "px";
  }
}
