const cells = document.querySelectorAll(".cell");
const statusText = document.querySelector("#statusText");
const restartBtn = document.querySelector("#restartBtn");
const timeCounter = document.querySelector("#timecounter");

let options = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let running = false;
let turnTimer;
let remainingTime = 3;
let turn = 1;

initializeGame()

function initializeGame() {
    cells.forEach(cell => cell.addEventListener("click", cellClicked));
    restartBtn.addEventListener("click", restartGame);
    statusText.textContent = `${currentPlayer}'s turn`;
    running = true;
    if (turn > 1) {
        startTurnTimer();
    }
}

function cellClicked() {
    const cellIndex = this.getAttribute("cellIndex");

    if (options[cellIndex] != "" || !running) {
        return;
    }

    updateCell(this, cellIndex);
    clearInterval(turnTimer); 
    timeCounter.textContent = ""; 
    checkWinner();
}

function updateCell(cell, index) {
    options[index] = currentPlayer;
    cell.textContent = currentPlayer;
}

function changePlayer() {
    currentPlayer = (currentPlayer == "X") ? "O" : "X";
    statusText.textContent = `${currentPlayer}'s turn`;

    turn++;
    if (turn > 1) {
        startTurnTimer();
    }
}

function checkWinner() {
    for (let r = 0; r < 3; r++) {
        const rowStart = r * 3;
        if (options[rowStart] !== "" &&
            options[rowStart] === options[rowStart + 1] &&
            options[rowStart + 1] === options[rowStart + 2]) {
            highlightWinner([rowStart, rowStart + 1, rowStart + 2]);
            statusText.textContent = `${currentPlayer} wins!`;
            running = false;
            clearTimeout(turnTimer);
            return;
        }
    }

    for (let c = 0; c < 3; c++) {
        if (options[c] !== "" &&
            options[c] === options[c + 3] &&
            options[c + 3] === options[c + 6]) {
            highlightWinner([c, c + 3, c + 6]);
            statusText.textContent = `${currentPlayer} wins!`;
            running = false;
            clearTimeout(turnTimer);
            return;
        }
    }

    if (options[0] !== "" &&
        options[0] === options[4] &&
        options[4] === options[8]) {
        highlightWinner([0, 4, 8]);
        statusText.textContent = `${currentPlayer} wins!`;
        running = false;
        clearTimeout(turnTimer);
        return;
    }

    if (options[2] !== "" &&
        options[2] === options[4] &&
        options[4] === options[6]) {
        highlightWinner([2, 4, 6]);
        statusText.textContent = `${currentPlayer} wins!`;
        running = false;
        return;
    }

    if (!options.includes("")) {
        statusText.textContent = "Draw!";
        running = false;
        clearTimeout(turnTimer);
        return;
    } else {
        changePlayer();
    }
}

function highlightWinner(indices) {
    indices.forEach(index => {
        cells[index].style.color = "green";
        cells[index].style.backgroundColor = "lightgray";
    });
}

function startTurnTimer() {
    clearInterval(turnTimer);
    remainingTime = 3;
    timeCounter.textContent = `Time Left: ${remainingTime}s`;

    turnTimer = setInterval(() => {
        remainingTime -= 1;
        timeCounter.textContent = `Time Left: ${remainingTime}s`;

        if (remainingTime <= 0) {
            clearInterval(turnTimer);
            timeCounter.textContent = `${currentPlayer} missed their turn!`;
            setTimeout(() => {
                changePlayer();
                timeCounter.textContent = "Time Left: 3s"; 
            }, 1000);
        }
    }, 1000); 
}

function restartGame() {
    currentPlayer = "X";
    options = ["", "", "", "", "", "", "", "", ""];
    statusText.textContent = `${currentPlayer}'s turn`;
    cells.forEach(cell => {
        cell.textContent = "";
        cell.style.color = "";
        cell.style.backgroundColor = "";
    });
    running = true;
    clearInterval(turnTimer);
    timeCounter.textContent = "......";
    turn = 1;
}
