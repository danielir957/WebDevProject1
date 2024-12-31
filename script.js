// Game state variables
let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let gameActive = false;
let timeLeft = 30;
let timerId = null;
let timerDisplay = null;
let turnIndicator = null;

// Initialize displays
function initializeDisplays() {
    // Initialize timer display
    const existingTimer = document.querySelector('.timer');
    if (existingTimer) {
        existingTimer.remove();
    }
    
    timerDisplay = document.createElement('div');
    timerDisplay.className = 'timer';
    document.querySelector('.body').insertBefore(timerDisplay, document.querySelector('.containerB'));
    timerDisplay.textContent = 'Click on \'Start Game\' to start!';
    
    // Initialize turn indicator
    turnIndicator = document.getElementById('turn-indicator');
    updateTurnIndicator();
}

// Update turn indicator
function updateTurnIndicator() {
    if (!gameActive) {
        turnIndicator.textContent = 'Click on \'Start Game\' to start!';
        turnIndicator.className = 'turn-indicator';
    } else {
        turnIndicator.textContent = `Player ${currentPlayer}'s Turn`;
        turnIndicator.className = `turn-indicator player-${currentPlayer.toLowerCase()}`;
    }
}

// Timer function
function startTimer() {
    timeLeft = 30;
    clearInterval(timerId);
    
    if (timerDisplay) {
        timerDisplay.textContent = `Time left: ${timeLeft} seconds`;
    }
    
    timerId = setInterval(() => {
        timeLeft--;
        if (timerDisplay) {
            timerDisplay.textContent = `Time left: ${timeLeft} seconds`;
        }
        
        if (timeLeft < 0) {
            clearInterval(timerId);
            alert(`Time's up! Player ${currentPlayer} loses!`);
            resetGame();
        }
    }, 1000);
}

// Handle cell click
function handleCellClick(cellIndex) {
    if (!gameActive) {
        alert("Click on 'Start Game' to start!");
        return;
    }
    
    if (board[cellIndex] !== '') return;
    
    board[cellIndex] = currentPlayer;
    const cell = document.getElementById(`cell-${cellIndex}`);
    cell.classList.add(currentPlayer.toLowerCase());
    
    if (checkWinner()) {
        clearInterval(timerId);
        if (timerDisplay) {
            timerDisplay.textContent = `Player ${currentPlayer} wins!`;
        }
        turnIndicator.textContent = `Player ${currentPlayer} wins!`;
        turnIndicator.className = `turn-indicator player-${currentPlayer.toLowerCase()}`;
        alert(`Player ${currentPlayer} wins!`);
        gameActive = false;
        return;
    }
    
    if (board.every(cell => cell !== '')) {
        clearInterval(timerId);
        if (timerDisplay) {
            timerDisplay.textContent = "It's a tie!";
        }
        turnIndicator.textContent = "It's a tie!";
        turnIndicator.className = 'turn-indicator tie';
        alert("It's a tie!");
        gameActive = false;
        return;
    }
    
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    updateTurnIndicator();
    startTimer();
}

// Check for a winner
function checkWinner() {
    const winningCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6] // Diagonals
    ];
    return winningCombinations.some(combination =>
        combination.every(index => board[index] === currentPlayer)
    );
}

// Reset game state
function resetGame() {
    board = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    gameActive = false;
    clearInterval(timerId);
    
    document.querySelectorAll('.cell').forEach(cell => {
        cell.innerText = '';
        cell.classList.remove('x', 'o');
    });
    
    if (timerDisplay) {
        timerDisplay.textContent = 'Click on \'Start Game\' to start!';
    }
    updateTurnIndicator();
}

// Start a new game
function startGame() {
    resetGame();
    gameActive = true;
    updateTurnIndicator();
    startTimer();
}

// Show game rules
function GameRules() {
    alert("Game Rules:\n\n1. The game is played on a 3x3 grid.\n2. Players take turns placing their marks (X or O).\n3. Each player has 30 seconds to make their move.\n4. If a player doesn't move within 30 seconds, they lose automatically.\n5. The first player to align three marks in a row, column, or diagonal wins.\n6. If all cells are filled and no player wins, it's a tie.");
}

// Add event listeners to cells
document.querySelectorAll('.cell').forEach((cell, index) => {
    cell.addEventListener('click', () => handleCellClick(index));
});

// Initialize the game
initializeDisplays();