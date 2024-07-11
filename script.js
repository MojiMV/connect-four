function Gameboard() {
    const rows = 6;
    const columns = 7;
    const board = [];
  
    for (let i = 0; i < rows; i++) {
      board[i] = [];
      for (let j = 0; j < columns; j++) {
        board[i].push(Cell());
      }
    }
  
    const getBoard = () => board;
  
    const dropToken = (column, player) => {
      const availableCells = board.filter((row) => row[column].getValue() === 0).map(row => row[column]);
  
      if (!availableCells.length) return;
  
      const lowestRow = availableCells.length - 1;
      board[lowestRow][column].addToken(player);
    };
  
    const printBoard = () => {
      const boardWithCellValues = board.map((row) => row.map((cell) => cell.getValue()))
      console.log(boardWithCellValues);
    };
  
    return { getBoard, dropToken, printBoard };
  }
  
  function Cell() {
    let value = 0;
  
    const addToken = (player) => {
      value = player;
    };
  
    const getValue = () => value;
  
    return {
      addToken,
      getValue
    };
  }
  
  function GameController(
    playerOneName = "Player One",
    playerTwoName = "Player Two"
  ) {
    const board1 = Gameboard();
  
    const players = [
      {
        name: playerOneName,
        token: 1
      },
      {
        name: playerTwoName,
        token: 2
      }
    ];
  
    let activePlayer = players[0];
  
    const switchPlayerTurn = () => {
      activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };
    const getActivePlayer = () => activePlayer;
  
    const printNewRound = () => {
      board1.printBoard();
      console.log(`${getActivePlayer().name}'s turn.`);
    };
  
    const playRound = (column) => {
      console.log(
        `Dropping ${getActivePlayer().name}'s token into column ${column}...`
      );
      board1.dropToken(column, getActivePlayer().token);
  
      function checkWin(board, player) {
        const rows = board.length;
        const cols = board[0].length;
        
        // horizontalCheck 
        for (let j = 0; j< cols -3 ; j++ ){
          for (let i = 0; i< rows ; i++){
              if (board[i][j].getValue() == player && board[i][j+1].getValue() == player && board[i][j+2].getValue() == player && board[i][j+3].getValue() == player){
                  return true;
                }           
            }
        }
        // verticalCheck
        for (let i = 0; i < rows-3 ; i++ ){
            for (let j = 0; j < cols; j++){
                if (board[i][j].getValue() == player && board[i+1][j].getValue() == player && board[i+2][j].getValue() == player && board[i+3][j].getValue() == player){
                    return true;
                }           
            }
        }
        // ascendingDiagonalCheck 
        for (let i=3; i<rows; i++){
            for (let j=0; j<cols-3; j++){
                if (board[i][j].getValue() == player && board[i-1][j+1].getValue() == player && board[i-2][j+2].getValue() == player && board[i-3][j+3].getValue() == player)
                    return true;
            }
        }
        // descendingDiagonalCheck
        for (let i=3; i<rows; i++){
            for (let j=3; j<cols; j++){
                if (board[i][j].getValue() == player && board[i-1][j-1].getValue() == player && board[i-2][j-2].getValue() == player && board[i-3][j-3].getValue() == player)
                    return true;
            }
        }
        return false;
      }

      if (checkWin(board1.getBoard(), getActivePlayer().token)){
        alert(`${getActivePlayer().name} won this round!`);
      } else{
        console.log("no winner yet.");
      }
      
      switchPlayerTurn();
      printNewRound();
    };
  
    printNewRound();
  
    return {
      playRound,
      getActivePlayer,
      getBoard: board1.getBoard
    };
  }
  
  function ScreenController() {
    const game = GameController();
    const playerTurnDiv = document.querySelector('.turn');
    const boardDiv = document.querySelector('.board');
  
    const updateScreen = () => {
      // clear the board
      boardDiv.textContent = "";
  
      // get the newest version of the board and player turn
      const board = game.getBoard();
      const activePlayer = game.getActivePlayer();
  
      // Display player's turn
      playerTurnDiv.textContent = `${activePlayer.name}'s turn...`
  
      // Render board squares
      board.forEach(row => {
        row.forEach((cell, index) => {
          // Anything clickable should be a button!!
          const cellButton = document.createElement("button");
          cellButton.classList.add("cell");
          // Create a data attribute to identify the column
          // This makes it easier to pass into our `playRound` function 
          cellButton.dataset.column = index
          cellButton.textContent = cell.getValue();
          boardDiv.appendChild(cellButton);
        })
      })
    }
  
    // Add event listener for the board
    function clickHandlerBoard(e) {
      const selectedColumn = e.target.dataset.column;
      // Make sure I've clicked a column and not the gaps in between
      if (!selectedColumn) return;
      
      game.playRound(selectedColumn);
      updateScreen();
    }
    boardDiv.addEventListener("click", clickHandlerBoard);
  
    // Initial render
    updateScreen();
  
    // We don't need to return anything from this module because everything is encapsulated inside this screen controller.
  }
  
  ScreenController();