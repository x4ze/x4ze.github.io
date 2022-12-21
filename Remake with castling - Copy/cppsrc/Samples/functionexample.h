#include <napi.h>
#include <iostream>
namespace functionexample
{
  std::string GetBestMove(std::string fenString, int maxDepth);
  std::string GetAvailibleMoves(int square, std::string fenString, std::string stringTurn);
  Napi::String WrappedGetAvailibleMoves(const Napi::CallbackInfo &info);
  Napi::String WrappedGetBestMove(const Napi::CallbackInfo &info);
  std::string hello();
  Napi::String HelloWrapped(const Napi::CallbackInfo &info);
  Napi::Object Init(Napi::Env env, Napi::Object exports);
}