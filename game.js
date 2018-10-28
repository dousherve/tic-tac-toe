/*
    Imports
*/

const {
  ipcRenderer
} = require('electron');

/*
    Variables / Constants
*/

// Constants
const NONE = 0;
const CROSS = 1;
const CIRCLE = 2;
const DRAW = 3;

// Dimensions
let board;
let wscl, hscl;
let elementSize = 50;

// Logic
let over = false;
let count = 0;
let current = CIRCLE;

// Display
let statusP;
let restartBtn;
let containerDiv;

/*
    Game
*/

function setupGame() {
  board = make2DArray(3, 3);
  fill2DArray(board, NONE);

  wscl = width / 3;
  hscl = height / 3;

  statusP = createP();
  statusP.addClass('status');
  restartBtn = createButton("Recommencer");
  restartBtn.addClass('button');
  restartBtn.addClass('button5');
  restartBtn.mousePressed(resetGame);

  containerDiv = createDiv();
  containerDiv.addClass('container');
  statusP.parent(containerDiv);
  restartBtn.parent(containerDiv);

  resetGame();
}

function drawGrid() {
  strokeWeight(5);
  stroke(255);
  for (let i = 1; i <= 3; i++) {
    line(i * wscl, 0, i * wscl, height);
    line(0, i * hscl, width, i * hscl);
  }
}

function drawElements() {
  stroke(255);
  strokeWeight(8);
  noFill();
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      let x = i * wscl + wscl / 2;
      let y = j * hscl + hscl / 2;

      let offset = elementSize / 2;

      if (board[i][j] === CROSS) {
        line(x - offset, y - offset, x + offset, y + offset);
        line(x - offset, y + offset, x + offset, y - offset);
      } else if (board[i][j] === CIRCLE) {
        noFill();
        ellipse(x, y, elementSize);
      }
    }
  }
}

function getSquarePos() {
  return {
    i: floor(mouseX * 3 / width),
    j: floor(mouseY * 3 / height)
  };
}

function tick() {
  if (over) {
    return;
  }

  let coords = getSquarePos();

  if (board[coords.i][coords.j] === NONE && !over) {
    board[coords.i][coords.j] = current;

    count++;

    let result = getResult();
    if (result !== NONE) {
      over = true;

      if (result === CIRCLE || result === CROSS) {
        statusP.html(getCurrentElementName() + " a gagné!");
      } else if (result === DRAW) {
        statusP.html("Égalité...");
      }

      return;
    }

    if (current === CIRCLE) {
      current = CROSS;
    } else if (current === CROSS) {
      current = CIRCLE;
    }

    statusP.html(getCurrentElementName() + " joue");
  }
}

function getResult() {
  let arrCols = new Array(3);
  let arrRows = new Array(3);
  let arrDiagonal1 = new Array(3);
  let arrDiagonal2 = new Array(3);

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      arrCols[j] = board[i][j];
      arrRows[j] = board[j][i];
      if (i == j) {
        arrDiagonal1[i] = board[i][j];
      }
      if (i + j == 2) {
        arrDiagonal2[i] = board[i][j];
      }
    }

    let check = rowCrossed() || columnCrossed() || diagonalCrossed();

    if (check) {
      return current;
    } else if (count === 9) {
      return DRAW;
    }
  }

  return NONE;
}

function rowCrossed() {
  for (let i = 0; i < 3; i++) {
    if (board[i][0] === board[i][1] &&
      board[i][1] === board[i][2] &&
      board[i][0] !== NONE) {
      return true
    }
  }

  return false;
}

function columnCrossed() {
  for (let i = 0; i < 3; i++) {
    if (board[0][i] === board[1][i] &&
      board[1][i] === board[2][i] &&
      board[0][i] !== NONE) {
      return true;
    }
  }
  return false;
}

function diagonalCrossed() {
  if (board[0][0] === board[1][1] &&
    board[1][1] === board[2][2] &&
    board[0][0] !== NONE) {
    return true;
  }

  if (board[2][0] === board[1][1] &&
    board[1][1] === board[0][2] &&
    board[0][0] !== NONE) {
    return true;
  }

  return false;
}

function getCurrentElementName() {
  switch (current) {
    case NONE:
      return 'Vide';
    case CROSS:
      return 'Croix';
    case CIRCLE:
      return "Cercle";
    default:
      return "Undefined";
  }
}

ipcRenderer.on('restart', resetGame);

function resetGame() {
  board = make2DArray(3, 3);

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      board[i][j] = NONE;
    }
  }

  current = CIRCLE;
  count = 0;
  over = false;

  statusP.html(getCurrentElementName() + " joue");
}