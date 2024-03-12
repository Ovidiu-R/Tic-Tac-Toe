const gameboard = (function(){
    const rows = 3;
    const columns = 3;
    const board = [];

    for (let i=0; i<rows; i++){
        board[i] = [];
        for (j=0; j<columns; j++){
            board[i].push (Cell(i,j));
        }
    }
    const getBoard = () => board;
    const playerMove = (row, column, player) => {
        if (board[i][j] !== undefined) {
            board[i][j] = player.token;
        }
    }
    const printBoard = () => {
        console.log (board);
    }

})();

const Cell(i, j) {
    let value = 0;
}