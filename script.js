const gameboard = (function(){
    const rows = 3;
    const columns = 3;
    const board = [];

    for (let i=0; i<rows; i++){
        board[i] = [];
        for (j=0; j<columns; j++){
            board[i].push (Cell());
        }
    }
    const getBoard = () => board;
    const playerMove = (row, column, player) => {
        //Logic to check if clicked square is empty
    }
    const printBoard = () => {
        
    }

})();