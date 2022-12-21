#include <iostream>
#include <array>
#include <cmath>
#include <vector>

using string = std::string;

namespace prog
{
  int maxDepth = 4;
  /*std::array<string, 64> defaultSetup = {"Br", "Bn", "Bb", "Bq", "Bk", "Bb", "Bn", "Br", "Bp", "Bp", "Bp", "Bp", "Bp", "Bp", "Bp", "Bp", "xx", "xx", "xx", "xx", "xx", "xx", "xx", "xx", "xx", "xx", "xx", "xx", "xx", "xx", "xx", "xx", "xx", "xx", "xx", "xx", "xx", "xx", "xx", "xx", "xx", "xx", "xx", "xx", "xx", "xx", "xx", "xx", "Wp", "Wp", "Wp", "Wp", "Wp", "Wp", "Wp", "Wp", "Wr", "Wn", "Wb", "Wq", "Wk", "Wb", "Wn", "Wr"};
  std::array<string, 64> board = defaultSetup;*/
  char turn = 'W';
}

namespace func
{
  class move
  {
  public:
    std::array<int, 3> Move = {};
    int score;
    bool hasScore = false;
  };

  std::array<string, 64> makeMove(std::array<int, 3> moveToMake, std::array<string, 64> board)
  {
    std::array<string, 64> newBoard = board;
    int from = moveToMake[0];
    int to = moveToMake[1];
    char color = newBoard[from][0];

    if (moveToMake[2] == 1)
    {
      // 1 means normal move, no castling or anything
      newBoard[to] = newBoard[from];
      newBoard[from] = "xx";
    }
    else if (moveToMake[2] == 4)
    {
      // pawn promotion to queen
      newBoard[to][0] = color;
      newBoard[to][1] = 'q';
      newBoard[from] = "xx";
    }

    return newBoard;
  }

  int GetRow(int index)
  {
    return ceil((index + 1) / 8.0);
  }

  char SwapColor(char color)
  {
    if (color == 'W')
    {
      return 'B';
    }
    else if (color == 'B')
    {
      return 'W';
    }
    else
    {
      // swap color
      prog::turn = SwapColor(prog::turn);
      return 'x';
    }
  }

  bool Valid(int square)
  {
    if (square < 64 && square >= 0)
    {
      return true;
    }
    else
    {
      return false;
    }
  }

  int GetPieceValue(char piece)
  {
    switch (piece)
    {
    case 'p':
      return 100;
    case 'b':
      return 300;
    case 'n':
      return 300;
    case 'r':
      return 500;
    case 'q':
      return 900;
    case 'k':
      return 9999999;
    default:
      return 0;
    }
  }

  int EvaluatePiecePosition(char piece, int square, char color)
  {
    int position;
    color == 'W' ? position = square : position = 63 - square;
    std::array<int, 64> pieceTable = {};
    switch (piece)
    {
    case 'p':
      pieceTable = {0, 0, 0, 0, 0, 0, 0, 0,
                    50, 50, 50, 50, 50, 50, 50, 50,
                    10, 10, 20, 30, 30, 20, 10, 10,
                    5, 5, 10, 25, 25, 10, 5, 5,
                    0, 0, 0, 20, 20, 0, 0, 0,
                    5, -5, -10, 0, 0, -10, -5, 5,
                    5, 10, 10, -20, -20, 10, 10, 5,
                    0, 0, 0, 0, 0, 0, 0, 0};
      break;
    case 'b':
      pieceTable = {-20, -10, -10, -10, -10, -10, -10, -20,
                    -10, 0, 0, 0, 0, 0, 0, -10,
                    -10, 0, 5, 10, 10, 5, 0, -10,
                    -10, 5, 5, 10, 10, 5, 5, -10,
                    -10, 0, 10, 10, 10, 10, 0, -10,
                    -10, 10, 10, 10, 10, 10, 10, -10,
                    -10, 5, 0, 0, 0, 0, 5, -10,
                    -20, -10, -10, -10, -10, -10, -10, -20};
      break;
    case 'n':
      pieceTable = {-50, -40, -30, -30, -30, -30, -40, -50,
                    -40, -20, 0, 0, 0, 0, -20, -40,
                    -30, 0, 10, 15, 15, 10, 0, -30,
                    -30, 5, 15, 20, 20, 15, 5, -30,
                    -30, 0, 15, 20, 20, 15, 0, -30,
                    -30, 5, 10, 15, 15, 10, 5, -30,
                    -40, -20, 0, 5, 5, 0, -20, -40,
                    -50, -40, -30, -30, -30, -30, -40, -50};
      break;
    case 'r':
      pieceTable = {0, 0, 0, 0, 0, 0, 0, 0,
                    5, 10, 10, 10, 10, 10, 10, 5,
                    -5, 0, 0, 0, 0, 0, 0, -5,
                    -5, 0, 0, 0, 0, 0, 0, -5,
                    -5, 0, 0, 0, 0, 0, 0, -5,
                    -5, 0, 0, 0, 0, 0, 0, -5,
                    -5, 0, 0, 0, 0, 0, 0, -5,
                    0, 0, 0, 5, 5, 0, 0, 0};
      break;
    case 'q':
      pieceTable = {-20, -10, -10, -5, -5, -10, -10, -20,
                    -10, 0, 0, 0, 0, 0, 0, -10,
                    -10, 0, 5, 5, 5, 5, 0, -10,
                    -5, 0, 5, 5, 5, 5, 0, -5,
                    0, 0, 5, 5, 5, 5, 0, -5,
                    -10, 5, 5, 5, 5, 5, 0, -10,
                    -10, 0, 5, 0, 0, 0, 0, -10,
                    -20, -10, -10, -5, -5, -10, -10, -20};
      break;
    case 'k':
      // only for middlegame, seperate template for endgame online
      pieceTable = {-30, -40, -40, -50, -50, -40, -40, -30,
                    -30, -40, -40, -50, -50, -40, -40, -30,
                    -30, -40, -40, -50, -50, -40, -40, -30,
                    -30, -40, -40, -50, -50, -40, -40, -30,
                    -20, -30, -30, -40, -40, -30, -30, -20,
                    -10, -20, -20, -20, -20, -20, -20, -10,
                    20, 20, 0, 0, 0, 0, 20, 20,
                    20, 30, 10, 0, 0, 10, 30, 20};
      break;
    default:
      return 0;
    }
    return pieceTable[position];
  }

  int GetBoardScore(std::array<string, 64> board, char color)
  {
    int score = 0;
    for (int i = 0; i < 64; i++)
    {
      if (board[i][0] == color)
      {
        score += GetPieceValue(board[i][1]);
        score += EvaluatePiecePosition(board[i][1], i, color);
      }
    }
    return score;
  }

  bool IsEdgePiece(int square, int side)
  {
    if ((square % 8 == 0 && side == 4) || (square % 8 == 7 && side == 2) || (square < 8 && side == 1) || (square > 55 && side == 3))
    {
      // the square is on the edge of the board, return true
      return true;
    }
    else
    {
      return false;
    }
  }

  std::vector<std::array<int, 3>> GenerateMoves(int square, std::array<string, 64> board, char color)
  {
    std::vector<std::array<int, 3>> moves;

    int opponenCol = SwapColor(color);
    int squareRow = GetRow(square);

    if (board[square][0] == color)
    {
      if (board[square][1] == 'p')
      {
        int dir;
        int startRow;
        color == 'W' ? dir = -1 : dir = 1;
        color == 'W' ? startRow = 7 : startRow = 2; // startrow + 6* dir is the promotion row
        // PAWN--------------------------
        if (Valid(square + 8 * dir) && board[square + 8 * dir] == "xx")
        {
          // one step forward
          if (squareRow == startRow + 5 * dir)
          {
            moves.push_back({square, square + 8 * dir, 4});
          }
          else
          {
            moves.push_back({square, square + 8 * dir, 1});
          }
          if (squareRow == startRow && Valid(square + 16 * dir) && board[square + 16 * dir] == "xx")
          {
            // 2nd step
            moves.push_back({square, square + 16 * dir, 1});
          }
        }
        // attacking sideways
        int sideOne = square + 7 * dir;
        int sideTwo = square + 9 * dir;
        if (Valid(sideOne) && squareRow + dir == GetRow(sideOne) && board[sideOne][0] == opponenCol)
        {
          moves.push_back({square, sideOne, 1});
        }
        if (Valid(sideTwo) && squareRow + dir == GetRow(sideTwo) && board[sideTwo][0] == opponenCol)
        {
          moves.push_back({square, sideTwo, 1});
        }
      }
      else if (board[square][1] == 'n')
      {
        std::array<int, 8> knightSquares = {6, 10, 15, 17, -6, -10, -15, -17};
        std::array<int, 8> rowDiff = {1, 1, 2, 2, -1, -1, -2, -2};

        for (int i = 0; i < 8; i++)
        {
          if (Valid(square + knightSquares[i]) && GetRow(square + knightSquares[i]) == squareRow + rowDiff[i])
          {
            // position is valid
            if (board[square + knightSquares[i]][0] != color)
            {
              moves.push_back({square, square + knightSquares[i], 1});
            }
          }
        }
      }
      else if (board[square][1] == 'r')
      {
        std::array<int, 4> directions = {-8, 1, 8, -1};
        std::array<int, 4> sides = {1, 2, 3, 4}; // which side of the board we cant collide with for the different directions
        for (int i = 0; i < 4; i++)
        {
          bool breakDirection = false;
          if (!IsEdgePiece(square, sides[i]))
          {
            for (int j = 1; !breakDirection; j++)
            {
              int newSquare = square + j * directions[i];
              if (board[newSquare][0] == color)
              {
                // encountered one of your pieces, break.
                breakDirection = true;
              }
              else
              {
                moves.push_back({square, newSquare, 1});
                if (board[newSquare][0] != 'x' || IsEdgePiece(newSquare, sides[i]))
                {
                  // enemy piece, stop after it
                  breakDirection = true;
                }
              }
            }
          }
        }
      }
      else if (board[square][1] == 'b')
      {
        std::array<int, 4> directions = {-7, 9, 7, -9};
        std::array<int, 4> sides = {1, 2, 3, 4}; // which side of the board we cant collide with for the different directions
        std::array<int, 4> otherSides = {2, 3, 4, 1};
        for (int i = 0; i < 4; i++)
        {
          bool breakDirection = false;
          if (!IsEdgePiece(square, sides[i]) && !IsEdgePiece(square, otherSides[i]))
          {
            for (int j = 1; !breakDirection; j++)
            {
              int newSquare = square + j * directions[i];
              if (board[newSquare][0] == color)
              {
                // encountered one of your pieces, break.
                breakDirection = true;
              }
              else
              {
                moves.push_back({square, newSquare, 1});
                if (board[newSquare][0] != 'x' || IsEdgePiece(newSquare, sides[i]) || IsEdgePiece(newSquare, otherSides[i]))
                {
                  // enemy piece, stop after it
                  breakDirection = true;
                }
              }
            }
          }
        }
      }
      else if (board[square][1] == 'q')
      {
        // moves += GENERATEMOVES(BISHOP) + GENERATEMOVES(ROOK); ACTUALLY DO THAT IT MIGHT WORK WELL.
        std::array<char, 2> pieces = {'r', 'b'};
        std::array<string, 64> tempBoard = board;
        for (int i = 0; i < 2; i++)
        {
          tempBoard[square] = {color, pieces[i]}; // replace the q with a r or a b(to get rook and bishop moves)
          std::vector<std::array<int, 3>> piecesMoves = GenerateMoves(square, tempBoard, color);
          moves.reserve(moves.size() + piecesMoves.size()); // improves performance(stackoverflow said) by reserving size in the vector before concat
          moves.insert(moves.end(), piecesMoves.begin(), piecesMoves.end());
        }
      }
      else if (board[square][1] == 'k')
      {
        std::array<int, 8> kingSquares = {-8, -7, 1, 9, 8, 7, -1, -9};
        std::array<int, 8> kingRowDiff = {-1, -1, 0, 1, 1, 1, 0, -1};

        for (int i = 0; i < 8; i++)
        {
          int moveSquare = square + kingSquares[i];
          if (Valid(moveSquare) && board[moveSquare][0] != color && squareRow + kingRowDiff[i] == GetRow(moveSquare))
          {
            moves.push_back({square, moveSquare, 1});
          }
        }
      }
    }
    return moves;
  }

  move Search(int depth, char color, std::array<string, 64> board)
  {
    std::vector<move> allMoves;
    for (int i = 0; i < 64; i++)
    {
      if (board[i][0] == color)
      {
        std::vector<std::array<int, 3>> piecesMoves = GenerateMoves(i, board, color);
        for (int j = 0; j < piecesMoves.size(); j++)
        {
          move m;
          m.Move = piecesMoves[j];
          allMoves.push_back(m);
        }
      }
    }
    // allMoves now includes all Moves

    move bestMove;
    // bestMove.hasScore = false; // THIS FIXED THE PROBLEM BECAUSE IT WASNT DEFAULTING TO FALSE
    // bestMove.score = 0;
    if (allMoves.size() == 0)
    {
      bestMove.score = -99999999;
      bestMove.hasScore = true;
    }

    for (int i = 0; i < allMoves.size(); i++)
    {
      std::array<string, 64> postBoard = board;
      // std::cout << postBoard[63]; // for testing if copying works

      // make the move on the new board
      postBoard = makeMove(allMoves[i].Move, postBoard);

      move boardScore;
      if (depth == prog::maxDepth)
      {
        // if its the last layer, set the score
        boardScore.score = GetBoardScore(postBoard, color) - GetBoardScore(postBoard, SwapColor(color));
        // std::cout << "\nmove score: " << boardScore.score;
      }
      else
      {
        boardScore = Search(depth + 1, SwapColor(color), postBoard);
      }

      // we have a boardscore now
      if (!bestMove.hasScore || boardScore.score > bestMove.score)
      {
        bestMove = boardScore;
        if (!bestMove.hasScore)
        {
          bestMove.hasScore = true;
        }
        if (depth == 0)
        {
          bestMove.Move = allMoves[i].Move;
        }
      }
    }
    bestMove.score *= -1;
    return bestMove;
  }
}