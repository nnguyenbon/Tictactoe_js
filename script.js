const cells = document.querySelectorAll(".cell");
const statusText = document.querySelector("#statusText");
const restartBtn = document.querySelector("#restartBtn");
const timeCounter = document.querySelector("#timecounter");
const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], 
    [0, 3, 6], [1, 4, 7], [2, 5, 8], 
    [0, 4, 8], [2, 4, 6], [5, 7, 8],
    [5, 6, 8]  
];

let options = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let running = false;
let turnTimer;
let turn = 1;

initializeGame();

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
    if (currentPlayer === "O" || !running) return; //Disable user clicking

    const cellIndex = this.getAttribute("cellIndex");
    if (options[cellIndex] != "") return;

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
    currentPlayer = (currentPlayer === "X") ? "O" : "X";
    statusText.textContent = `${currentPlayer}'s turn`;

    turn++;
    if (currentPlayer === "O" && running) {
        setTimeout(makeMoveByAI, 500); //Delay for checking
    } else if (turn > 1) {
        startTurnTimer();
    }
}

function makeMoveByAI() {
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
    //Loop through each combination with some.
    //For each combination, check if all cells in the combination (index) have a value equal to player with every.
    //If at least one combination is found that meets the condition, return true, meaning that player has won.
    return winningCombinations.some(combination =>
        combination.every(index => options[index] === player)
    );
}

function checkWinner() {
    for (const combination of winningCombinations) {
        const [a, b, c] = combination;
        if (options[a] !== "" && options[a] === options[b] && options[b] === options[c]) {
            highlightWinner(combination); 
            printWinner(currentPlayer);   
            return;
        }
    }

    if (!options.includes("")) {
        statusText.textContent = "Draw!";
        running = false;
        clearTimeout(turnTimer);
        return;
    }

    changePlayer();
}

function printWinner(currentPlayer) {
    statusText.textContent = `${currentPlayer} wins!`;
    running = false;
    clearTimeout(turnTimer);
}

function highlightWinner(indices) {
    indices.forEach(index => {
        cells[index].style.color = "green";
        cells[index].style.backgroundColor = "lightgray";
    });
}

function startTurnTimer() {
    clearInterval(turnTimer);
    let remainingTime = 5;
    timeCounter.textContent = `${remainingTime}s`;

    turnTimer = setInterval(() => {
        remainingTime -= 1;
        timeCounter.textContent = `${remainingTime}s`;

        if (remainingTime <= 0) {
            clearInterval(turnTimer);
            changePlayer();
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
    timeCounter.textContent = "5s";
    turn = 1;
}
