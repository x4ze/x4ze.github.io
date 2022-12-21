//index.js
const testAddon = require("./build/Release/testaddon.node");
const express = require("express");

const app = express();
app.listen(3000, () => {
  console.log("remake with castle listening at port 3000");
});
app.use(express.json());
app.use(express.static("public"));

app.post("/bestMove", (req, res) => {
  const fenString = req.body.fenString;
  const maxDepth = req.body.maxDepth;
  let bestMove = testAddon.GetBestMove(fenString, maxDepth);
  res.json({ move: bestMove.slice(0, bestMove.length - 1) });
});

app.post("/getAvailibleMoves", (req, res) => {
  const fenString = req.body.fenString;
  const square = req.body.square;
  const turn = req.body.turn;
  let resultString = testAddon.GetAvailibleMoves(square, fenString, turn);
  resultString = resultString.slice(0, resultString.length - 1); //remove the exmpty "-" at the end of the list
  let resultList = [];
  if (resultString.length > 0) resultList = resultString.split("/");
  for (let i = 0; i < resultList.length; i++) {
    let moveArray = resultList[i].split("-");
    resultList[i] = [];
    for (let j = 0; j < 3; j++) {
      resultList[i].push(Number(moveArray[j]));
    }
  }
  res.json({ availibleMoves: resultList });
});
module.exports = testAddon;
