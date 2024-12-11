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
    if (currentPlayer === "O" && running) {
        setTimeout(makeMoveByAI, 500); // Delay để mô phỏng suy nghĩ của AI
    } else if (turn > 1) {
        startTurnTimer();
    }
}

function makeMoveByAI() {
    // 1. Check nếu AI có thể thắng trong nước đi này
    let move = findBestMove("O");
    if (move !== -1) {
        updateCell(cells[move], move);
        checkWinner();
        return;
    }

    move = findBestMove("X");
    if (move !== -1) {
        updateCell(cells[move], move);
        checkWinner();
        return;
    }

    if (options[4] === "") {
        updateCell(cells[4], 4);
        checkWinner();
        return;
    }

    const corners = [0, 2, 6, 8];
    for (let i of corners) {
        if (options[i] === "") {
            updateCell(cells[i], i);
            checkWinner();
            return;
        }
    }

    const sides = [1, 3, 5, 7];
    for (let i of sides) {
        if (options[i] === "") {
            updateCell(cells[i], i);
            checkWinner();
            return;
        }
    }
}

function findBestMove(player) {
    for (let i = 0; i < options.length; i++) {
        if (options[i] === "") {
            options[i] = player;
            if (isWinner(player)) {
                options[i] = ""; 
                return i; 
            }
            options[i] = ""; 
        }
    }

    return -1; 
}

function isWinner(player) {
    for (let r = 0; r < 3; r++) {
        const rowStart = r * 3;
        if (options[rowStart] === player &&
            options[rowStart] === options[rowStart + 1] &&
            options[rowStart] === options[rowStart + 2]) {
            return true;
        }
    }

    for (let c = 0; c < 3; c++) {
        if (options[c] === player &&
            options[c] === options[c + 3] &&
            options[c] === options[c + 6]) {
            return true;
        }
    }

    if (options[0] === player &&
        options[0] === options[4] &&
        options[0] === options[8]) {
        return true;
    }

    if (options[2] === player &&
        options[2] === options[4] &&
        options[2] === options[6]) {
        return true;
    }

    return false;
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
