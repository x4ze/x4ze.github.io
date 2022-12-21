const defaultPositionArray = [
  "Br",
  "Bn",
  "Bb",
  "Bq",
  "Bk",
  "Bb",
  "Bn",
  "Br",
  "Bp",
  "Bp",
  "Bp",
  "Bp",
  "Bp",
  "Bp",
  "Bp",
  "Bp",
  "xx",
  "xx",
  "xx",
  "xx",
  "xx",
  "xx",
  "xx",
  "xx",
  "xx",
  "xx",
  "xx",
  "xx",
  "xx",
  "xx",
  "xx",
  "xx",
  "xx",
  "xx",
  "xx",
  "xx",
  "xx",
  "xx",
  "xx",
  "xx",
  "xx",
  "xx",
  "xx",
  "xx",
  "xx",
  "xx",
  "xx",
  "xx",
  "Wp",
  "Wp",
  "Wp",
  "Wp",
  "Wp",
  "Wp",
  "Wp",
  "Wp",
  "Wr",
  "Wn",
  "Wb",
  "Wq",
  "Wk",
  "Wb",
  "Wn",
  "Wr",
];
let botColor = "B";
let maxDepth = 3;
let testBoards = []; //temporary, remove later, includes all testboards from check ssytem whatever just remove it if ur done
let selectedPiece = false; //flag used to know wether a piece should be moved or lifted up
const startPieces = ["p", "p", "p", "p", "p", "p", "p", "p", "r", "r", "b", "b", "n", "n", "q", "k"];
let whitePieces = []; //keeps track of the white sides pieces, in the format of "startPieces"
let blackPieces = [];
let turn = "W";
let board = defaultPositionArray.slice();
let availibleMoves = [];
const gameHistory = [];
let currentViewedBoardPosition = 0;
gameHistory.push(board.slice());

let movePiece = new Audio("https://cdn.glitch.global/80282ad1-7516-4e9f-99a9-adff29bc37a9/pieceMoved.mp3?v=1668435781145");
let checkmateSound = new Audio("https://cdn.glitch.global/80282ad1-7516-4e9f-99a9-adff29bc37a9/checkmateSound.mp3?v=1668435786056");

startGame(); //starts chess game

function move(move, newBoard) {
  //MOVE LAYOUT COULD BE SOMETHING LIKE "FROM-TO-PROMOTION-QUEEN" OR "FROM-TO-CASTLE-long"(king from - king to)
  let moveList;
  if (typeof move === "string") {
    moveList = move.split("-");
    moveList.forEach((val, index) => {
      moveList[index] = Number(moveList[index]);
    });
  } else {
    moveList = move.slice();
  }
  let from = moveList[0];
  let to = moveList[1];
  let color = newBoard[from][0];

  if (newBoard == undefined) newBoard = board;
  newBoard.forEach((val, index) => {
    document.getElementById("square-" + (index + 1)).classList.remove("marked-square");
    document.getElementById("square-" + (index + 1)).classList.remove("recentMoveHighlight");
  });
  document.getElementById("square-" + (Number(from) + 1)).classList.add("recentMoveHighlight");
  document.getElementById("square-" + (Number(to) + 1)).classList.add("recentMoveHighlight");

  //play sound effect
  movePiece.play();

  //actually moving
  if (moveList[2] == 1) {
    newBoard[to] = newBoard[from];
    newBoard[from] = "xx";
  } else if (moveList[2] == 4) {
    // pawn promotion to queen
    newBoard[to] = replaceStringAtIndex(newBoard[to], 0, color);
    newBoard[to] = replaceStringAtIndex(newBoard[to], 1, "q");
    newBoard[from] = "xx";
  }

  //before moving, backup the current board into the gameHistory list so taht we can go back and see the last moves
  gameHistory.push(newBoard.slice());
  currentViewedBoardPosition++;
  return newBoard;
}

function travelGameHistory(direction) {
  let tempBoard = [];
  if (currentViewedBoardPosition + direction >= 0 && currentViewedBoardPosition + direction < gameHistory.length) {
    currentViewedBoardPosition += direction;
    tempBoard = gameHistory[currentViewedBoardPosition];
    placePiecesFromArray(tempBoard);
  }
}

function drawChessBoard() {
  //draws the chessboard on the screen, inside the chess-board div, since its easier to do in javascript.
  const chessboard = document.getElementById("chess-board");
  chessboard.innerHTML = null;
  for (let i = 1; i <= 64; i++) {
    let rowCount = chessboard.childNodes.length + 1;

    if (i % 8 === 1 || i === 1) {
      //we need a new row, add a row.
      const row = document.createElement("div");
      row.classList.add("board-row");
      row.setAttribute("id", "board-row" + rowCount);
      chessboard.appendChild(row);
      rowCount += 1;
    }
    const square = document.createElement("div");
    square.setAttribute("id", "square-" + i);
    square.classList.add("square");
    square.setAttribute("onclick", "togglePiece(" + (i - 1) + ")");
    if ((rowCount - 1 + i) % 2 === 0) {
      //the number is even, it should be a white square
      square.classList.add("white-square");
    } else {
      square.classList.add("black-square");
    }
    document.getElementById("board-row" + (rowCount - 1)).appendChild(square);
  }
}

function startGame() {
  document.getElementById("chess-board").style = null;
  document.getElementById("gameStatusBar").style = null;
  document.getElementById("gameOverScreen").style.bottom = "-100vh";
  board = defaultPositionArray.slice();
  drawChessBoard();
  placePiecesFromArray(board);
  whitePieces = [...startPieces];
  blackPieces = [...startPieces];
  turn = "W";
}

function placePiecesFromArray(array) {
  array.forEach((square, index) => {
    if (square != "xx") {
      const pieceImg = document.createElement("img");
      pieceImg.classList.add("pieceIMG");
      //chess.com
      //pieceImg.src = `https://www.chess.com/chess-themes/pieces/neo_wood/150/${square[0].replace("W", "w").replace("B", "b")}${square[1]}.png`;
      //lichess pieces
      pieceImg.src = `https://lichess1.org/assets/_d8la8i/piece/staunty/${square[0].toLowerCase() + square[1].toUpperCase()}.svg`;
      document.getElementById("square-" + (index + 1)).innerHTML = null;
      document.getElementById("square-" + (index + 1)).appendChild(pieceImg);
    } else {
      document.getElementById("square-" + (index + 1)).innerHTML = null;
    }
  });
}

async function GetAvailibleMovesFromCPP(square, fenString, turn) {
  const response = await fetch("/getAvailibleMoves", POST({ square: square, fenString: fenString, turn: turn }));
  const result = await response.json();
  return result.availibleMoves;
}

async function togglePiece(clickedPiece) {
  if (selectedPiece === false || board[clickedPiece][0] === board[selectedPiece][0]) {
    if (board[clickedPiece][0] === turn) {
      //there is no selected piece i.e. a piece should be lifted
      //or player selected another piece
      //remove the legal-move piece highlighting
      board.forEach((val, index) => {
        document.getElementById("square-" + (index + 1)).classList.remove("marked-square");
      });

      //clear the availible moves
      availibleMoves = [];
      //availibleMoves = calculateMoves(clickedPiece);
      //replaced the above (quicker) solution with getting availibleMoves from c++ to test the move calulation in cpp
      availibleMoves = await GetAvailibleMovesFromCPP(clickedPiece, convertBoardToFen(board), turn);

      //-----

      //give the availible moves the red highlight
      availibleMoves.forEach((val, index) => {
        document.getElementById(`square-${val[1] + 1}`).classList.add("marked-square");
      });
      selectedPiece = clickedPiece;
    }
  } else {
    if (availibleMoves.find((move) => move[1] == clickedPiece)) {
      //there is a selected piece and the piece is a legal move, which means that piece should be placed on the clickedPiece square
      if (board[clickedPiece][0] === swapTurn(board[selectedPiece][0])) {
        //if you "killed" an enemy piece, update the piecelist
        if (board[clickedPiece][0] === "W") {
          //a white piece is killed, remove a piece from the whitepieces array
          const pieceIndex = whitePieces.indexOf(board[clickedPiece][1]);
          whitePieces.splice(pieceIndex, 1);
        } else if (board[clickedPiece][0] === "B") {
          //a black piece is killed, remove a piece from the whitepieces array
          const pieceIndex = blackPieces.indexOf(board[clickedPiece][1]);
          blackPieces.splice(pieceIndex, 1);
        }
      }

      //move to the new square
      //console.log(selectedPiece + ", " + clickedPiece);
      let madeMove = "";
      madeMove = availibleMoves.find((move) => move[0] == selectedPiece && move[1] == clickedPiece);
      board = move(madeMove, board);
      //gameStatusBar
      const whiteScore = GetPieceScoreFromBoardArray(board, "W") - 9999999;
      const blackScore = GetPieceScoreFromBoardArray(board, "B") - 9999999;
      const totalScore = whiteScore + blackScore;
      const blackPercentage = (blackScore / totalScore) * 100;
      document.getElementById("gameStatusBar").style.height = `${blackPercentage}%`;
      swapTurn();
      const check = checkForCheck(board);
      if (check.check) {
        //highlight the border around with red to mark check
        document.getElementById("chess-board").style.border = "4px solid #ff2424";
      } else {
        //remove the highlight if there is any
        document.getElementById("chess-board").style.border = null;
      }
      if (check.mate && check.check) {
        let winner = "White Wins";
        let score = `${whiteScore / 10} - ${blackScore / 10}`;
        if (turn === "W") {
          winner = "Black Wins";
          score = `${blackScore / 10} - ${whiteScore / 10}`;
        }
        let gameStats = {
          reason: "By Checkmate",
          winner: winner,
          moves: 0 + " moves",
          score: score,
        };
        checkmate(gameStats);
      } else if (check.mate && !check.check) {
        //stalemate
        let winner = "Draw";
        let score = `${whiteScore / 10} - ${blackScore / 10}`;
        if (turn === "W") {
          score = `${blackScore / 10} - ${whiteScore / 10}`;
        }
        let gameStats = {
          reason: "By Stalemate",
          winner: winner,
          moves: 0 + " moves",
          score: score,
        };
        checkmate(gameStats);
      } else {
        //redraw pieces on the board
        placePiecesFromArray(board);
        const fenString = convertBoardToFen(board);
        if (turn == botColor) {
          // send fen string to server
          MakeBestMove(fenString);
        }
      }
    }
    selectedPiece = false;
    //remove the legal-move piece highlighting
    //clear the availible moves
    availibleMoves = [];
  }
}

async function MakeBestMove(fenString) {
  let oldTurn = turn;
  turn = "x"; //to prevent user from making a move while the bot is thinking
  const bestMove = await GetBestMove(fenString);
  board = move(bestMove, board);
  placePiecesFromArray(board);
  turn = swapTurn(oldTurn);

  const check = checkForCheck(board, swapTurn(oldTurn));
  if (check.check) {
    //highlight the border around with red to mark check
    document.getElementById("chess-board").style.border = "4px solid #ff2424";
  } else {
    //remove the highlight if there is any
    document.getElementById("chess-board").style.border = null;
  }
  if (check.mate && check.check) {
    let whiteScore = GetPieceScoreFromBoardArray(board, "W");
    let blackScore = GetPieceScoreFromBoardArray(board, "B");
    let winner = "White Wins";
    let score = `${whiteScore / 10} - ${blackScore / 10}`;
    if (turn === "W") {
      winner = "Black Wins";
      score = `${blackScore / 10} - ${whiteScore / 10}`;
    }
    let gameStats = {
      reason: "By Checkmate",
      winner: winner,
      moves: gameHistory.length + " moves",
      score: score,
    };
    checkmate(gameStats);
  } else if (check.mate && !check.check) {
    //stalemate
    let winner = "Draw";
    let score = `${whiteScore / 10} - ${blackScore / 10}`;
    if (turn === "W") {
      score = `${blackScore / 10} - ${whiteScore / 10}`;
    }
    let gameStats = {
      reason: "By Stalemate",
      winner: winner,
      moves: gameHistory.length + " moves",
      score: score,
    };
    checkmate(gameStats);
  }
}

async function GetBestMove(fenString) {
  const response = await fetch("/bestMove", POST({ fenString: fenString, maxDepth: maxDepth }));
  const result = await response.json();
  return result.move;
}

function POST(data) {
  //takes the passed data and packages it into a json object that contains fetching options needed for sending data to the server
  const fetchOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  };
  return fetchOptions;
}

function checkForCheck(theBoard, color) {
  if (color === undefined) color = turn;
  let allYourPieces = []; //array of all the pieces of the player whose turn it is to move
  let allOpponentsPieces = [];

  let yourKingSquare;
  for (let index = 0; index < theBoard.length; index++) {
    //theBoard.foreach
    const square = theBoard[index];
    if (square[0] === color) {
      allYourPieces.push(index);
      if (square[1] === "k") {
        yourKingSquare = index;
      }
    } else if (square[0] === swapTurn(color)) {
      allOpponentsPieces.push(index);
    }
  }
  let check = false;
  for (let index = 0; index < allOpponentsPieces.length; index++) {
    //foreach opponentspieces
    const theAvailibleMoves = calculateMoves(allOpponentsPieces[index], theBoard, false);
    if (availibleMoves.find((move) => move[1] == yourKingSquare)) {
      //one of the enemy pieces threatens our king, so we are in check
      check = true;
      break;
    }
  }

  //mate is used to sense stalemate too
  let checkmate = true;
  //we're in check, now check if we're also in checkmate
  for (let index = 0; index < allYourPieces.length; index++) {
    const theAvailibleMoves = calculateMoves(allYourPieces[index], theBoard, false);
    if (theAvailibleMoves.length > 0) {
      //if there are moves checkmate is false
      checkmate = false;
      break;
    }
  }
  return { check: check, mate: checkmate };
}

function checkmate(gameStats) {
  turn = false;
  checkmateSound.play();

  //display all the stats
  document.getElementById("gameOverScreenWhoWon").innerText = gameStats.winner;
  document.getElementById("wayOfWinning").innerText = gameStats.reason;
  document.getElementById("moveCount").innerText = gameStats.moves;
  document.getElementById("score").innerText = gameStats.score;

  document.getElementById("gameOverScreen").style.bottom =
    "calc(50% - (" + getComputedStyle(document.getElementById("gameOverScreen")).height + " / 2))";
  document.getElementById("gameOverScreenWhoWon").style.opacity = "1";
}
let bottomLayerAmount = 0;

function GetPieceScoreFromBoardArray(array, color) {
  let score = 0;
  for (let square of array) {
    if (square != "xx" && square[0] === color) {
      score += getPieceValue(square[1]);
    }
  }
  const checkResults = checkForCheck(array, swapTurn(color));
  if (checkResults.check) {
    //give more score if the position has checked the opponent
    score += 9;
    if (checkResults.mate) {
      //if checkmate
      score += 999999999999999;
    }
  }
  return score;
}

function getPieceValue(piece) {
  if (piece === "p") return 10;
  if (piece === "r") return 50;
  if (piece === "n" || piece === "b") return 30;
  if (piece === "q") return 90;
  if (piece === "k") return 9999999;
}

function calculateMoves(square, whatBoard, shouldNotCheckForCheck) {
  if (whatBoard === undefined) {
    whatBoard = [...board];
  }
  //clear availibleMoves list
  let hereAvailibleMoves = [];
  //for each of the pieces, decide which squares should be marked
  if (whatBoard[square] == "xx") {
    //there is no piece, thus the array should be clear, no moves can be made
    return;
  } else if (whatBoard[square][1] === "r") {
    //the selected piece is a rook
    //loop through the directions and add each tile where there are no friendly pieces
    hereAvailibleMoves = highlightHorizontal(square, "R", whatBoard, hereAvailibleMoves);
    hereAvailibleMoves = highlightHorizontal(square, "L", whatBoard, hereAvailibleMoves);
    hereAvailibleMoves = highlightVertical(square, "U", whatBoard, hereAvailibleMoves);
    hereAvailibleMoves = highlightVertical(square, "D", whatBoard, hereAvailibleMoves);
  } else if (whatBoard[square][1] === "b") {
    //bishop
    hereAvailibleMoves = diagonalHighlight(square, "TL", whatBoard, hereAvailibleMoves);
    hereAvailibleMoves = diagonalHighlight(square, "TR", whatBoard, hereAvailibleMoves);
    hereAvailibleMoves = diagonalHighlight(square, "BL", whatBoard, hereAvailibleMoves);
    hereAvailibleMoves = diagonalHighlight(square, "BR", whatBoard, hereAvailibleMoves);
  } else if (whatBoard[square][1] === "q") {
    //queen
    hereAvailibleMoves = highlightHorizontal(square, "R", whatBoard, hereAvailibleMoves);
    hereAvailibleMoves = highlightHorizontal(square, "L", whatBoard, hereAvailibleMoves);
    hereAvailibleMoves = highlightVertical(square, "U", whatBoard, hereAvailibleMoves);
    hereAvailibleMoves = highlightVertical(square, "D", whatBoard, hereAvailibleMoves);
    hereAvailibleMoves = diagonalHighlight(square, "TL", whatBoard, hereAvailibleMoves);
    hereAvailibleMoves = diagonalHighlight(square, "TR", whatBoard, hereAvailibleMoves);
    hereAvailibleMoves = diagonalHighlight(square, "BL", whatBoard, hereAvailibleMoves);
    hereAvailibleMoves = diagonalHighlight(square, "BR", whatBoard, hereAvailibleMoves);
  } else if (whatBoard[square][1] === "p") {
    //pawn
    hereAvailibleMoves = pawnHighlight(square, whatBoard, hereAvailibleMoves);
  } else if (whatBoard[square][1] === "n") {
    //knight
    hereAvailibleMoves = knightHighlight(square, whatBoard, hereAvailibleMoves);
  } else if (whatBoard[square][1] === "k") {
    hereAvailibleMoves = kingHighlight(square, whatBoard, hereAvailibleMoves);
  }

  //clean out illegal moves from hereavailiblemoves
  if (shouldNotCheckForCheck != true) {
    //le.log("hereAvailibleMoves", hereAvailibleMoves)
    hereAvailibleMoves.forEach((hereAvailibleMove, indexOfHereAvailibleMove) => {
      let testBoard = board.slice();
      testBoard[hereAvailibleMove] = testBoard[square];
      testBoard[square] = undefined;
      //moved on teastboard
      testBoards.push(testBoard);

      let enemyPieces = [];
      let kingSquare;
      testBoard.forEach((val2, boardIndex) => {
        if (val2 && val2[0] === swapTurn(turn)) {
          enemyPieces.push(boardIndex);
        } else if (val2 && val2[1] === "k" && val2[0] === turn) {
          kingSquare = boardIndex;
        }
      });

      enemyPieces.forEach((enemyPiece, index) => {
        let availibleMovesForThisPiece = calculateMoves(enemyPiece, testBoard, true);
        if (availibleMovesForThisPiece.includes(kingSquare)) {
          //if this piece can kill the king
          hereAvailibleMoves[indexOfHereAvailibleMove] = false;
        }
      });
    });
    //filter out moves marked as false
    hereAvailibleMoves = hereAvailibleMoves.filter((move) => {
      return move != false;
    });
  }
  return hereAvailibleMoves;
}

function kingHighlight(square, whatBoard, hereAvailibleMoves) {
  if (whatBoard === undefined) whatBoard = board;
  let squares = [];
  let wantedSquares = []; //all squares that should have been marked, if the piece wasnt on the edge
  const piece = whatBoard[square];
  let direction = 1;
  if (piece[0] === "W") {
    direction = -1;
  }
  const kingSquares = [
    {
      number: -8,
      rowDiff: -1,
    },
    {
      number: -1,
      rowDiff: 0,
    },
    {
      number: 1,
      rowDiff: 0,
    },
    {
      number: 8,
      rowDiff: 1,
    },
    {
      number: 9,
      rowDiff: 1,
    },
    {
      number: 7,
      rowDiff: 1,
    },
    {
      number: -7,
      rowDiff: -1,
    },
    {
      number: -9,
      rowDiff: -1,
    },
  ];
  kingSquares.forEach((value) => {
    if (whatBoard[square + value.number] && getRow(square) + value.rowDiff === getRow(square + value.number)) {
      squares.push(square + value.number);
    }
  });
  squares.forEach((squareNr, index) => {
    if (whatBoard[squareNr] && (whatBoard[squareNr] == "xx" || whatBoard[squareNr][0] === swapTurn(piece[0]))) {
      //if its an enemy piece, or an empty square, we can move
      hereAvailibleMoves.push(squareNr);
    }
  });
  return hereAvailibleMoves;
}

function getRow(index) {
  return Math.ceil((index + 1) / 8);
}

function knightHighlight(square, whatBoard, hereAvailibleMoves) {
  if (whatBoard === undefined) whatBoard = board;
  let squares = [];
  let wantedSquares = []; //all squares that should have been marked, if the piece wasnt on the edge
  const piece = whatBoard[square];
  let direction = 1;
  if (piece[0] === "W") {
    direction = -1;
  }
  const knightSquares = [
    {
      number: -17,
      rowDiff: -2,
    },
    {
      number: -15,
      rowDiff: -2,
    },
    {
      number: -10,
      rowDiff: -1,
    },
    {
      number: 6,
      rowDiff: 1,
    },
    {
      number: 17,
      rowDiff: 2,
    },
    {
      number: 15,
      rowDiff: 2,
    },
    {
      number: -6,
      rowDiff: -1,
    },
    {
      number: 10,
      rowDiff: 1,
    },
  ];
  knightSquares.forEach((value) => {
    if (whatBoard[square + value.number] && getRow(square) + value.rowDiff === getRow(square + value.number)) {
      squares.push(square + value.number);
    }
  });
  squares.forEach((squareNr, index) => {
    if (whatBoard[squareNr] && (whatBoard[squareNr] == "xx" || whatBoard[squareNr][0] === swapTurn(piece[0]))) {
      //if its an enemy piece, or an empty square, we can move
      hereAvailibleMoves.push(squareNr);
    }
  });
  return hereAvailibleMoves;
}

function pawnHighlight(square, whatBoard, hereAvailibleMoves) {
  if (whatBoard === undefined) whatBoard = board;
  //list of squares to mark
  const squares = [];
  const pawn = whatBoard[square];
  let startRow = 2;
  let direction = 1;
  if (pawn[0] === "W") {
    //white pawn
    direction = -1;
    startRow = 7;
  }
  if (square + 8 * direction <= 63 && square + 8 * direction >= 0 && whatBoard[square + 8 * direction] == "xx") {
    //empty square in front, mark it
    squares.push(square + 8 * direction);

    if (getRow(square) === startRow) {
      if (whatBoard[square + 16 * direction] == "xx") {
        //if the pawn is on the start-row and there is an empty square two squares ahead, mark it
        squares.push(square + 16 * direction);
      }
    }
  }
  if (
    whatBoard[square + 7 * direction] &&
    whatBoard[square + 7 * direction][0] === swapTurn(pawn[0]) &&
    getRow(square + 7 * direction) === getRow(square) + direction
  ) {
    //if diagnoal square has enemy, mark it
    squares.push(square + 7 * direction);
  }
  if (
    whatBoard[square + 9 * direction] &&
    whatBoard[square + 9 * direction][0] === swapTurn(pawn[0]) &&
    getRow(square + 9 * direction) === getRow(square) + direction
  ) {
    //if diagonal square on the other side has enemy, mark it
    squares.push(square + 9 * direction);
  }
  //add all the availible move-squares
  squares.forEach((val, index) => {
    hereAvailibleMoves.push(val);
  });
  return hereAvailibleMoves;
}

function diagonalHighlight(square, direction, whatBoard, hereAvailibleMoves) {
  if (whatBoard === undefined) whatBoard = board;
  let increment = -9;
  let edgePieces = [0, 1, 2, 3, 4, 5, 6, 7, 8, 16, 24, 32, 40, 48, 56];
  if (direction === "TR") {
    increment = -7;
    edgePieces = [0, 1, 2, 3, 4, 5, 6, 7, 15, 23, 31, 39, 47, 55, 63];
  } else if (direction === "BL") {
    increment = 7;
    edgePieces = [56, 57, 58, 59, 60, 61, 62, 63, 0, 8, 16, 24, 32, 40, 48, 56];
  } else if (direction === "BR") {
    edgePieces = [56, 57, 58, 59, 60, 61, 62, 63, 7, 15, 23, 31, 39, 47, 55, 63];
    increment = 9;
  }
  for (let i = square + increment; i != 999999; i += increment) {
    if (whatBoard[i] != undefined) {
      //we havent exceeded the edges of the board
      if (whatBoard[i][0] === whatBoard[square][0] || edgePieces.includes(square)) {
        //encountered a friendly piece or standing at the edge of the screen
        break;
      } else {
        //mark this piece
        hereAvailibleMoves.push(i);
        if (whatBoard[i] != "xx" || edgePieces.includes(i)) {
          //the piece must be an enemy piece, as its not friendly, and not undefined, therefore break
          //or, just marked the end of the board, so dont draw anymore.
          break;
        }
      }
    } else {
      break;
    }
  }
  return hereAvailibleMoves;
}

function highlightVertical(square, upOrDown, whatBoard, hereAvailibleMoves) {
  if (whatBoard === undefined) whatBoard = board;
  let increment = 8;
  if (upOrDown === "U") {
    increment = -8;
  }
  for (let i = square + increment; i != 999999; i += increment) {
    if (whatBoard[i] != undefined && getRow(i) != getRow(square)) {
      //we havent exceeded the edges of the board
      if (whatBoard[i][0] === whatBoard[square][0]) {
        //encountered a friendly piece
        break;
      } else {
        //mark this piece
        hereAvailibleMoves.push(i);

        if (whatBoard[i] != "xx") {
          //the piece must be an enemy piece, as its not friendly, and not undefined, therefore break
          break;
        }
      }
    } else {
      break;
    }
  }
  return hereAvailibleMoves;
}

function highlightHorizontal(square, rightOrLeft, whatBoard, hereAvailibleMoves) {
  if (whatBoard === undefined) whatBoard = board;
  let increment = 1;
  let stopi = square + 8;
  if (rightOrLeft === "L") {
    increment = -1;
    stopi = square - 8;
  }
  for (let i = square + increment; i != stopi; i += increment) {
    //loop to the right
    if (whatBoard[i] != undefined && getRow(i) === getRow(square)) {
      //if we're on the same row as before
      if (whatBoard[i][0] === whatBoard[square][0]) {
        // it's a friendly piece, break, don't mark any more square in this direction
        break;
      } else {
        //there is no friendly piece, mark this square
        hereAvailibleMoves.push(i);

        //if the square has an enemy, dont mark any more squares after
        if (whatBoard[i] != "xx") {
          //the piece color is neither undefined, nor the same color as the piece, so it must be an enemy piece
          //we have already marked the square, so just make sure not to mark any more by increasing i above the limit
          break;
        }
      }
    } else {
      break;
    }
  }
  return hereAvailibleMoves;
}

function swapTurn(color) {
  if (color === undefined) {
    //we want to switch sides, not give a return
    if (turn === "W") {
      turn = "B";
    } else {
      turn = "W";
    }
  } else {
    //user wants to know the opposite color of a color
    if (color === "W") {
      return "B";
    } else if (color === "B") {
      return "W";
    }
  }
}

function convertBoardToFen(board) {
  let fenString = "";
  for (let i = 0; i < board.length; i++) {
    let square = board[i];
    if (square == "xx") {
      //empty square
      if (!isNaN(fenString[fenString.length - 1])) {
        //if the last item in the fen string is a number
        let number = Number(fenString[fenString.length - 1]) + 1;
        fenString = fenString.slice(0, fenString.length - 1) + String(number); // add one to the number at the end of the string
      } else {
        fenString += "1";
      }
    } else {
      let piece = square[1];
      if (square[0] == "W") piece = piece.toUpperCase();
      fenString += piece;
    }
    if ((i + 1) % 8 == 0) {
      fenString += "/";
    }
  }
  return fenString.slice(0, fenString.length - 1);
}

function setup() {
  for (let i = 0; i < 64; i++) {
    board[i] = "xx";
  }
  board[32] = "Bp";
  board[15] = "Wp";
  board[22] = "Wb";
  turn = "W";
  placePiecesFromArray(board);
}

function replaceStringAtIndex(string, index, replaceWith) {
  string = string.split("");
  string[index] = replaceWith;
  string = string.join("");
  return string;
}
