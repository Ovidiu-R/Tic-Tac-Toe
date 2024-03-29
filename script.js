document.addEventListener('DOMContentLoaded', (event) => {
const gameboard = (function(){
    const rows = 3;
    const columns = 3;
    const board = [];

    for (let i=0; i<rows; i++){
            board[i] = [];
            for (j=0; j<columns; j++){
                board[i].push(Cell());
            }
    }

    const getBoard = () => board;
    const playerMove = (i, j, activePlayerToken) => {
        if (board[i][j].getValue() == '') {
            board[i][j].addToken(activePlayerToken);
            gameController.incrementMoveCounter();
        }
    }
   
    const resetBoard = () => {
        for (let i=0; i<rows; i++){
            for (j=0; j<columns; j++){
                board[i][j].addToken('');
            }   
        }    
    }
    return {getBoard, playerMove, resetBoard}
})();

function Cell(){
    let value = '';
    const addToken = (activePlayerToken) => {
        value = activePlayerToken;
    }
    const getValue = () => value;
    return {addToken, getValue};
}

const gameController = (function(playerOne = "Player 1", playerTwo = "Player 2") {
    const players = [
        {
            name: playerOne,
            token: 'X'
        },
        {
            name: playerTwo,
            token: 'O'
        }
    ]
    let moveCounter = 0;
    const incrementMoveCounter = () => {

        if (moveCounter < 8) {
            moveCounter += 1;

        } else {
            ScreenController.declareTie();
            resetMoveCounter();
        }
    }
    const resetMoveCounter = () => {
        moveCounter = 0;
    }
    const setPlayerNames = (index, newName) => {
        players[index].name = newName;
    }

    let activePlayer = players[0];
    const getActivePlayer = () => activePlayer;

    const switchPlayer = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    }
    const playRound = (row, column) => {
        gameboard.playerMove(row, column, getActivePlayer().token);
        if (winChecker() == true) {
            return;
        } else {
            switchPlayer();
        }
        ScreenController.whoseTurn();
    }

    const winChecker = () => {
        const winningCombos = [
            [[0, 0], [0, 1], [0, 2]], // Rows
            [[1, 0], [1, 1], [1, 2]],
            [[2, 0], [2, 1], [2, 2]],
            [[0, 0], [1, 0], [2, 0]], // Columns
            [[0, 1], [1, 1], [2, 1]],
            [[0, 2], [1, 2], [2, 2]],
            [[0, 0], [1, 1], [2, 2]], // Diagonals
            [[0, 2], [1, 1], [2, 0]]
        ];
        for (const player of [players[0], players[1]]) {
            for (const combo of winningCombos) {
                let win = true;
                for (const pair of combo) {
                    let [row, col] = pair;
                    if (gameboard.getBoard()[row][col].getValue() !== player.token) {
                        win = false;
                        break;
                    }
                }
                if (win) {
                    ScreenController.declareWinner(player.name);
                    resetMoveCounter();
                    ScreenController.findLineCoordinates(combo);
                    console.log (combo);
                    return true;
                }
            }
        }
    }

    return {playRound, getActivePlayer, setPlayerNames, switchPlayer, incrementMoveCounter}
})();

const ScreenController = (function(){
    const board = document.querySelector('.board');
    const winner = document.querySelector('.winner');
    const replay = document.querySelector('.replay');
    const playerNames = document.querySelectorAll('input');
    const canvas = document.querySelector('canvas');
    const ctx = canvas.getContext("2d");
    var combination = [];


    const updateScreen = () => {
        board.textContent = "";
        for (let i=0; i<3; i++){
            for (j=0; j<3; j++){
                const cellButton = document.createElement('button');
                cellButton.classList.add('cell');
                cellButton.dataset.row = i;
                cellButton.dataset.column = j;
                cellButton.textContent = gameboard.getBoard()[i][j].getValue();
                board.appendChild(cellButton);
            }   
        }    
     
    }
    function clickHandler(e) {
        if (e.target.classList.contains('cell') && winner.textContent == ''){
            gameController.playRound(e.target.dataset.row, e.target.dataset.column);
            updateScreen();
        }

    }
    function declareWinner(player){
        winner.textContent = `${player} wins the game!`;
        replay.style.display = 'block';
    }
   function declareTie() {
        winner.textContent = "It's a tie! Try again!";
        replay.style.display = 'block';
   }

    function updateNames(){
        playerNames.forEach ((player, index) => {
            player.addEventListener('blur', (e) => {
                let newName = e.target.value;
                gameController.setPlayerNames(index, newName)
            });
        });
    }
    function whoseTurn() {
        if (gameController.getActivePlayer().token == 'X') {
            playerNames[0].style.backgroundColor = 'pink'; 
            playerNames[1].style.backgroundColor = 'white'; 
        } else {
            playerNames[0].style.backgroundColor = 'white'; 
            playerNames[1].style.backgroundColor = 'pink'; 
        }
    }

    const findLineCoordinates = (combo) => {
        const cells = document.querySelectorAll('.cell');
        const boardRect = board.getBoundingClientRect();
        const boardLeft = boardRect.left;
        const boardTop = boardRect.top;
        let points = [];
        const cellWidth = cells[0].offsetWidth;
        
        eraseLine();
        for (const pair of combo) {
            let [row, col] = pair;
            cells.forEach ((cell) => {
                if (cell.dataset.row == row && cell.dataset.column == col) {
                    let x = boardLeft + cellWidth/2 + (cell.dataset.column * cellWidth);
                    let y = boardTop + cellWidth/2 + (cell.dataset.row * cellWidth);
                    points.push ({coordX: x, coordY: y});
                }
            });
        }
        combination = combo;
        drawLine(points);
    }

    const drawLine = (points) => {
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(points[0].coordX, points[0].coordY);
        ctx.lineTo(points[2].coordX, points[2].coordY);
        ctx.stroke();
        currentCoords = points;
    }
    const eraseLine = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }


    whoseTurn(); /*Styles player name input background color based on turn*/
    updateNames(); /*Listener updates player names every time input goes out of focus*/
    updateScreen(); /*First render of gameboard*/
    board.addEventListener('click', clickHandler); /*Main driver*/

    replay.addEventListener('click', () => {
        gameboard.resetBoard();
        updateScreen();
        winner.textContent = '';
        replay.style.display = 'none';
        eraseLine();
        if (gameController.getActivePlayer().token == 'O') {
            gameController.switchPlayer();
            whoseTurn();
        }
    });

    window.addEventListener('resize', () => {
        findLineCoordinates(combination);
    });
    window.addEventListener('scroll', () => {
        findLineCoordinates(combination);
    })
    return {declareWinner, whoseTurn, declareTie, findLineCoordinates};
    
})();
});