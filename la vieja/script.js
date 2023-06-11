const cells = document.querySelectorAll("[data-cell]");
const resetBtn = document.querySelector(".reset-btn");
let currentPlayer = "X";
let gameActive = true;

function handleCellClick() {
  if (!gameActive || this.innerHTML !== "") {
    return;
  }

  this.innerHTML = currentPlayer;
  this.classList.add(currentPlayer);
  checkWin();
  togglePlayer();
}

function togglePlayer() {
  currentPlayer = currentPlayer === "X" ? "O" : "X";
}

function checkWin() {
  const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8], // Horizontal
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8], // Vertical
    [0, 4, 8],
    [2, 4, 6], // Diagonal
  ];

  for (let combination of winningCombinations) {
    const [a, b, c] = combination;
    if (
      cells[a].innerHTML !== "" &&
      cells[a].innerHTML === cells[b].innerHTML &&
      cells[a].innerHTML === cells[c].innerHTML
    ) {
      gameActive = false;
      cells[a].classList.add("win");
      cells[b].classList.add("win");
      cells[c].classList.add("win");
      alert(`Player ${currentPlayer} wins!`);
      break;
    }
  }

  if (gameActive) {
    let isDraw = true;
    for (let cell of cells) {
      if (cell.innerHTML === "") {
        isDraw = false;
        break;
      }
    }
    if (isDraw) {
      gameActive = false;
      alert("It's a draw!");
    }
  }
}

function resetGame() {
  for (let cell of cells) {
    cell.innerHTML = "";
    cell.classList.remove("X", "O", "win");
  }
  gameActive = true;
  currentPlayer = "X";
}

for (let cell of cells) {
  cell.addEventListener("click", handleCellClick);
}

resetBtn.addEventListener("click", resetGame);
