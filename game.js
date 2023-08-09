//acceder al elemento canvas
const canvas = document.querySelector("#game");
const game = canvas.getContext("2d");
const btnUp = document.querySelector("#up");
const btnLeft = document.querySelector("#left");
const btnRight = document.querySelector("#right");
const btnDown = document.querySelector("#down");
const spanLives = document.querySelector("#lives");
const spanTime = document.querySelector("#time");
const spanRecord = document.querySelector("#record");
const pResult = document.querySelector("#result");
//variables globales
let canvasSize;
let elementSize;
let level = 0;
let lives = 3;
let timeStart;
let timePlayer;
let timeInterval;
const playerPosition = {
  x: undefined,
  y: undefined,
};
const regaloPosition = {
  x: undefined,
  y: undefined,
};
let enemigosPosition = [];

window.addEventListener("load", setCanvasSize);

window.addEventListener("resize", setCanvasSize);
function fixNumber(n) {
  return Number(n.toFixed(0));
}
function setCanvasSize() {
  if (window.innerHeight > window.innerWidth) {
    canvasSize = window.innerWidth * 0.8;
  } else {
    canvasSize = window.innerHeight * 0.8;
  }
  canvasSize = Number(canvasSize.toFixed(0));

  canvas.setAttribute("width", canvasSize);
  canvas.setAttribute("height", canvasSize);
  elementSize = canvasSize / 10;
  startGame();
}
function startGame() {
  console.log({ canvasSize, elementSize });

  game.font = elementSize + "px Verdana";
  game.textAlign = "end";

  const map = maps[level];
  if (!map) {
    gameWin();
    return;
  }
  if (!timeStart) {
    timeStart = Date.now();
    timeInterval = setInterval(showTime, 100);
    showRecord();
  }

  const mapRows = map.trim().split("\n");

  const mapRowsCols = mapRows.map((row) => row.trim().split(""));
  //console.log({ map, mapRows, mapRowsCols });
  showLives();

  enemigosPosition = [];
  game.clearRect(0, 0, canvasSize, canvasSize);
  mapRowsCols.forEach((row, rowIndice) => {
    row.forEach((col, colIndice) => {
      const emoji = emojis[col];
      const posX = elementSize * (colIndice + 1);
      const posY = elementSize * (rowIndice + 1);
      if (col == "O") {
        if (!playerPosition.x & !playerPosition.y) {
          playerPosition.x = posX;
          playerPosition.y = posY;
          console.log({ playerPosition });
        }
      } else if (col == "I") {
        regaloPosition.x = posX;
        regaloPosition.y = posY;
      } else if (col == "X") {
        enemigosPosition.push({
          x: posX,
          y: posY,
        });
      }
      game.fillText(emoji, posX, posY);
    });
  });
  movePlayer();
}
//recorrido de elementos de los arrays
//let row = 1; row <= 10; row++) {
// for (let col = 1; col <= 10; col++) {
//  emojis[mapRowsCols[row - 1][col - 1]],
//elementSize * col,
//elementSize * row
//);
// }
// }

function movePlayer() {
  const regaloColisionX =
    playerPosition.x.toFixed(1) == regaloPosition.x.toFixed(1);
  const regaloColisionY =
    playerPosition.y.toFixed(1) == regaloPosition.y.toFixed(1);
  const regaloColisionXY = regaloColisionX && regaloColisionY;

  if (regaloColisionXY) {
    levelWin();
  }
  const enemigoColision = enemigosPosition.find((enemigo) => {
    const enemigoColisionX =
      enemigo.x.toFixed(1) == playerPosition.x.toFixed(1);
    const enemigoColisionY =
      enemigo.y.toFixed(1) == playerPosition.y.toFixed(1);
    return enemigoColisionX && enemigoColisionY;
  });
  if (enemigoColision) {
    levelFail();
  }

  game.fillText(emojis["PLAYER"], playerPosition.x, playerPosition.y);
}

function levelWin() {
  console.log("Subiste de nivel");
  level++;
  startGame();
}
function levelFail() {
  console.log("Atrapado raton");

  lives--;
  console.log(lives);
  if (lives <= 0) {
    level = 0;
    lives = 3;
    timeStart = undefined;
  }

  playerPosition.x = undefined;
  playerPosition.y = undefined;
  startGame();
}
function gameWin() {
  console.log("fin de juego");
  clearInterval(timeInterval);

  const recordTime = localStorage.getItem("recordTime");

  const playerTime = Date.now() - timeStart;

  if (recordTime) {
    if (recordTime >= playerTime) {
      localStorage.setItem("recordTime", playerTime);
      pResult.innerHTML = "Nuevo record!!";
    } else {
      pResult.innerHTML = "Intentalo de nuevo vos podes";
    }
  } else {
    localStorage.setItem("recordTime", playerTime);
  }
  console.log({ recordTime, playerTime });
}
function showLives() {
  const heartArray = Array(lives).fill(emojis["HEART"]);
  console.log(heartArray);
  spanLives.innerHTML = "";
  heartArray.forEach((heart) => spanLives.append(heart));
}
function showTime() {
  spanTime.innerHTML = Date.now() - timeStart;
}
function showRecord() {
  spanRecord.innerHTML = localStorage.getItem("recordTime");
}

window.addEventListener("keydown", moveByKeys);

btnUp.addEventListener("click", moveUp);
btnLeft.addEventListener("click", moveLeft);
btnRight.addEventListener("click", moveRight);
btnDown.addEventListener("click", moveDown);

function moveByKeys(tecla) {
  if (tecla.key == "ArrowUp") moveUp();
  else if (tecla.key == "ArrowLeft") moveLeft();
  else if (tecla.key == "ArrowRight") moveRight();
  else if (tecla.key == "ArrowDown") moveDown();
}
//otra manera para escuchar las teclas
/*switch (tecla.key) {
    case "ArrowUp":
      moveUp();
      break;
    case "ArrowLeft":
      moveLeft();
      break;
    case "ArrowRight":
      moveRight();
      break;
    case "ArrowDown":
      moveDown();
    default:
      break;
  }*/

function moveUp() {
  console.log("Estoy moviendome hacia arriba");
  if (playerPosition.y - elementSize < elementSize) {
    console.log("saliste del mapa");
  } else {
    playerPosition.y -= elementSize;

    startGame();
    fixNumber();
  }
}
function moveLeft() {
  console.log("Estoy moviendome hacia izquierda");
  if (playerPosition.x - elementSize < elementSize) {
    console.log("saliste del mapa");
  } else {
    playerPosition.x -= elementSize;
    startGame();
  }
}
function moveRight() {
  console.log("Estoy moviendome hacia derecha");
  if (playerPosition.x + elementSize > canvasSize) {
    console.log("saliste del mapa");
  } else {
    playerPosition.x += elementSize;
    startGame();
  }
}
function moveDown() {
  console.log("Estoy moviendome hacia abajo");
  if (playerPosition.y + elementSize > canvasSize) {
    console.log("saliste del mapa");
  } else {
    playerPosition.y += elementSize;
    startGame();
  }
}
