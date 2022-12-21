#include <iostream>
#include <vector>
#include <array>

using string = std::string;
// THIS FILE IS NOT USED AS IT CAUSED SOME CLASS ERROR WITH THE MOVE CLASS AND I DONT KNOW WHY, BUT IT WORKED WHEN i SWITCHED TO JUST USING FUNC.CPP INSTEAD OF THIS HEADDER FILE

namespace func
{
  class move;
  int GetRow(int index);
  char SwapColor(char color);
  bool Valid(int square);
  int GetPieceValue(char piece);
  int GetBoardScore(std::array<string, 64> board, char color);
  std::vector<int> GenerateMoves(int i, std::array<string, 64> board, char color);
  move Search(int depth, char color, std::array<string, 64>);
}