import React, { useState } from "react";

import "./board.css";

const boardSize = 3;

// const boardNodes = [
//   ["black", "white", ""],
//   ["", "", "white"],
//   ["white", "", "black"],
// ];

const activePlayer = "white";

const PlayGo = () => {
  const [boardNodes, setBoardNodes] = useState([
    ["black", "white", ""],
    ["", "", "white"],
    ["white", "", "black"],
  ]);

  const move = (x, y) => {
    console.log("Clicked node: ", x, y)
    const newNodes = [...boardNodes];
    newNodes[y][x] = activePlayer;
    setBoardNodes(newNodes);
    console.log(boardNodes);
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#262626",
      }}
    >
      <div
        className="board"
        style={{
          gridTemplateRows: `repeat(${boardSize - 1}, 6em) 0`,
          gridTemplateColumns: `repeat(${boardSize - 1}, 6em) 0`,
        }}
      >
        {boardNodes.map((col, y) =>
          col.map((element, x) => (
            <Node node={element} x={x} y={y} onPlaceStone={move} />
          ))
        )}
      </div>
    </div>
  );
};

export const Node = ({ node, x, y, onPlaceStone }) => {
  return (
    <div className="node" key={`Math.random()`}>
      <div
        onClick={() => onPlaceStone(x, y)}
        className={`stone ${node === "" ? "hidden" : null}`}
        style={{
          backgroundColor: `${node === "" ? activePlayer : node}`,
        }}
      />
    </div>
  );
};

export default PlayGo;
