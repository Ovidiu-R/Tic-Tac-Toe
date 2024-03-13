const Gameboard = (function(){
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
        if (board[i][j] !== undefined) {
            board[i][j].cellContent(activePlayerToken) ;
        }
    }
    const printBoard = () => {
        console.log (board);
    }
    return {getBoard, playerMove, printBoard}
})();

function Cell() {
    let value = 0;
    const getValue = () => value;
    const cellContent = (activePlayerToken) => {
        value = activePlayerToken;
    }
    return {getValue, cellContent}
}

const GameController = (function(playerOne = "Player 1", playerTwo = "Player 2") {
    const board = Gameboard();
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
        board.playerMove(row, column, getActivePlayer().token);
        switchPlayer();
        printNewBoard();
    }

    const printNewBoard = () => {
        board.printBoard();
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
                    if (game.getBoard()[row][col] !== player.token) {
                        win = false;
                        break;
                    }
                }
                if (win) {
                    console.log (`${player.token} wins the game!`)
                    //reset board
                }
            }
        }
    }

    return {playRound, getActivePlayer}
})();

const ScreenController = (function(){
    const game = GameController();
})();