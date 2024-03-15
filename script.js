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
        if (board[i][j].getValue() == '*') {
            board[i][j].addToken(activePlayerToken) ;
        }
    }
    const printBoard = () => {
        console.log (board);
    }
    const resetBoard = () => {
        for (let i=0; i<rows; i++){
            for (j=0; j<columns; j++){
                board[i][j].addToken('*');
            }   
        }    
    }
    return {getBoard, playerMove, printBoard, resetBoard}
})();

function Cell(){
    let value = '*';
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

    let activePlayer = players[0];
    const getActivePlayer = () => activePlayer;

    const switchPlayer = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    }
    const playRound = (row, column) => {
        console.log (`${getActivePlayer().name} is making their move`)
        gameboard.playerMove(row, column, getActivePlayer().token);
        winChecker(); // Temporary placement
        switchPlayer();
        printNewBoard();
    }

    const printNewBoard = () => {
        gameboard.printBoard();
        console.log (`It is now ${getActivePlayer}'s turn`);
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
                    console.log (`${player.token} wins the game!`)
                    gameboard.resetBoard();
                }
            }
        }
    }

    return {playRound, getActivePlayer}
})();

const ScreenController = (function(){
    const turn = document.querySelector('.turn');
    const board = document.querySelector('.board');

    const updateScreen = () => {
        board.textContent = "";
        for (let i=0; i<3; i++){
            for (j=0; j<3; j++){
                const cellButton = document.createElement('button');
                cellButton.classList.add('.cell');
                cellButton.dataset.row = i;
                cellButton.dataset.column = j;
                cellButton.textContent = gameboard.getBoard()[i][j].getValue();
                board.appendChild(cellButton);
            }   
        }    
    }
    function clickHandler(e) {
        console.log ('test');
        if (e.target.classList.contains('.cell')){
            gameController.playRound(e.target.dataset.row, e.target.dataset.column);
            updateScreen();
        }

    }
    updateScreen();
    board.addEventListener('click', clickHandler);
    
})();