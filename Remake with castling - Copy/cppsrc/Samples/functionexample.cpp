#include "func.cpp"
#include "functionexample.h"
#include <iostream>
#include <array>
#include <vector>
#include <ctype.h> //for function isdigit

std::array<std::string, 64> fenToArray(std::string fenString);

std::string functionexample::GetBestMove(std::string fenString, int maxDepth)
{
  // calculate the best move from the provided fenString
  char turn = 'B';
  std::array<std::string, 64> board = fenToArray(fenString);
  prog::maxDepth = maxDepth;
  func::move result = func::Search(0, turn, board);
  std::array<int, 3> bestMoveArray = result.Move;
  std::string bestMove = "";
  for (int i = 0; i < 3; i++)
  {
    bestMove += std::to_string(bestMoveArray[i]) + "-";
  }
  std::cout << "\nBest Move is: " << bestMove;
  std::cout << "\nMove-score is: " << result.score;
  return bestMove;
}

// using std::string;
std::string functionexample::hello()
{
  return "Hello World";
}

std::array<std::string, 64> fenToArray(std::string fenString)
{
  std::array<std::string, 64> board;
  int boardIndex = 0;
  for (int i = 0; i < fenString.length(); i++)
  // begin at 1 so that the item at index 0 can be either W or B to declare whose turn it is
  {
    if (isdigit(fenString[i]))
    {
      // empty squares
      int skippedSquares = fenString[i] - '0'; // - 0 converts it to int idk how
      for (int j = boardIndex; j < boardIndex + skippedSquares; j++)
      {
        board[j] = "xx";
      }
      boardIndex += skippedSquares;
    }
    else if (fenString[i] == '/')
    {
      // new line
    }
    else if (fenString[i] == ' ')
    {
      break; // breaks if theres a space, (the current part of the fenString(the one with positions) is finished)
    }
    else
    {
      std::string piece = "";
      if (isupper(fenString[i]))
      {
        // the piece is white
        piece += "W";
      }
      else
      {
        piece += "B";
      }
      piece += tolower(fenString[i]);
      board[boardIndex] = piece;
      boardIndex++;
    }
  }
  return board;
}

std::string functionexample::GetAvailibleMoves(int square, std::string fenString, std::string stringTurn)
{
  char turn = stringTurn[0];
  std::array<std::string, 64> board = fenToArray(fenString);
  std::vector<std::array<int, 3>> allMoves = func::GenerateMoves(square, board, turn);
  std::string answerString = "";
  for (int i = 0; i < allMoves.size(); i++)
  {
    for (int j = 0; j < 2; j++)
    {
      answerString += std::to_string(allMoves[i][j]) + "-";
    }
    answerString += std::to_string(allMoves[i][2]);
    answerString += "/";
  }
  return answerString; // last index of the string needs to be removed as it will include an excess "-"
}

Napi::String functionexample::WrappedGetAvailibleMoves(const Napi::CallbackInfo &info)
{
  Napi::Env env = info.Env();
  if (info.Length() != 3)
  {
    Napi::TypeError::New(env, "Square expected").ThrowAsJavaScriptException();
  }

  int square = info[0].As<Napi::Number>().Int32Value();
  std::string fenString = info[1].ToString().Utf8Value();
  std::string turn = info[2].ToString().Utf8Value();

  Napi::String returnValue = Napi::String::New(env, functionexample::GetAvailibleMoves(square, fenString, turn)); // idk about ToString()

  return returnValue;
}

Napi::String functionexample::WrappedGetBestMove(const Napi::CallbackInfo &info)
{
  Napi::Env env = info.Env(); // idk what this does
  if (info.Length() != 2)
  {
    Napi::TypeError::New(env, "Fen-string expected").ThrowAsJavaScriptException();
  } // || !typeid(info[0]).name()

  // Napi::String first = info[0].As<Napi::String>();
  std::string fenString = info[0].ToString().Utf8Value();
  int maxDepth = info[1].As<Napi::Number>().Int32Value();
  Napi::String returnValue = Napi::String::New(env, functionexample::GetBestMove(fenString, maxDepth)); // idk about ToString()

  return returnValue;
}

Napi::String functionexample::HelloWrapped(const Napi::CallbackInfo &info)
{
  Napi::Env env = info.Env();
  Napi::String returnValue = Napi::String::New(env, functionexample::hello());

  return returnValue;
}

Napi::Object functionexample::Init(Napi::Env env, Napi::Object exports)
{
  exports.Set("hello", Napi::Function::New(env, functionexample::HelloWrapped));
  exports.Set("GetBestMove", Napi::Function::New(env, functionexample::WrappedGetBestMove));
  exports.Set("GetAvailibleMoves", Napi::Function::New(env, functionexample::WrappedGetAvailibleMoves));
  return exports;
}