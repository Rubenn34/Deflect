
let gameLoop;
let enemyLoop;
let speed = 4;
let points = 0;
let running = false;

const minigame = document.getElementById("minigame");
const field = document.getElementById("field");
const pointsEl = document.getElementById("points");
const nomeJogo = document.getElementById("nome_jogo");


const btnStart = document.getElementById("btn_start");
const btnEnd = document.getElementById("btn_end");
const btnMenu = document.getElementById("btn_menu");
const btnLeft = document.getElementById("btn_left");
const btnRight = document.getElementById("btn_right");


nomeJogo.innerText = "Corrida";
pointsEl.innerText = "0";


field.innerHTML = "";
field.style.position = "relative";
field.style.overflow = "hidden";


const player = document.createElement("div");
player.id = "player";
player.style.position = "absolute";
player.style.bottom = "10px";
player.style.left = "90px";
field.appendChild(player);


btnLeft.onclick = () => movePlayer(-30);
btnRight.onclick = () => movePlayer(30);

document.addEventListener("keydown", (e) => {
  if (!running) return;

  if (e.code === "ArrowLeft") movePlayer(-30);
  if (e.code === "ArrowRight") movePlayer(30);
  if (e.code === "Space") startGame();
  if (e.code === "Pause") endGame();
  if (e.code === "Home") location.reload();
});

function movePlayer(value) {
  let left = player.offsetLeft + value;

  if (left < 0) left = 0;
  if (left > field.offsetWidth - player.offsetWidth) {
    left = field.offsetWidth - player.offsetWidth;
  }

  player.style.left = left + "px";
}


btnStart.onclick = startGame;

function startGame() {
  if (running) return;

  running = true;
  points = 0;
  speed = 4;
  pointsEl.innerText = points;

  clearEnemies();

  gameLoop = setInterval(updateGame, 20);
  enemyLoop = setInterval(createEnemy, 1200);
}

btnEnd.onclick = endGame;

function endGame() {
  running = false;
  clearInterval(gameLoop);
  clearInterval(enemyLoop);
  alert("Game Over");
}

btnMenu.onclick = () => {
  endGame();
  location.href = "index.html";
};

function updateGame() {
  const enemies = document.querySelectorAll(".enemy");

  enemies.forEach(enemy => {
    enemy.style.top = enemy.offsetTop + speed + "px";

    
    if (enemy.offsetTop > field.offsetHeight) {
      enemy.remove();
      points++;
      pointsEl.innerText = points;

      
      if (points % 5 === 0) speed += 0.5;
    }

    
    if (checkCollision(player, enemy)) {
      endGame();
    }
  });
}

function createEnemy() {
  if (!running) return;

  const enemy = document.createElement("div");
  enemy.classList.add("enemy");
  enemy.style.position = "absolute";
  enemy.style.top = "-60px";

 
  const lanes = [40, 140];
  enemy.style.left = lanes[Math.floor(Math.random() * lanes.length)] + "px";

  field.appendChild(enemy);
}

function checkCollision(a, b) {
  const A = a.getBoundingClientRect();
  const B = b.getBoundingClientRect();

  return !(
    A.bottom < B.top ||
    A.top > B.bottom ||
    A.right < B.left ||
    A.left > B.right
  );
}

function clearEnemies() {
  document.querySelectorAll(".enemy").forEach(e => e.remove());
}
