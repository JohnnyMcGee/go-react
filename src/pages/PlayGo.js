import React, { useState } from "react";

import "./board.css";

const boardSize = 3;

const boardState = [
  ["black", "white", ""],
  ["", "", "white"],
  ["white", "", "black"],
];

const PlayGo = () => {
  const [boardNodes, setBoardNodes] = useState(boardState);

  const [activePlayer, setActivePlayer] = useState("white");

  const move = (x, y) => {
    const isOpenPoint = boardNodes[y][x] === "";
    if (isOpenPoint) {
      const newNodes = [...boardNodes];
      newNodes[y][x] = activePlayer;
      setBoardNodes(newNodes);
      setActivePlayer(activePlayer === "white" ? "black" : "white");
    }
  };

  return (
    <div
      className = "container"
    >
      <div
        className="board"
        style={{
          gridTemplateRows: `repeat(${boardSize - 1}, 6em) 0`,
          gridTemplateColumns: `repeat(${boardSize - 1}, 6em) 0`,

        }}
      >
        {boardNodes.map((col, y) =>
          col.map((node, x) => (
            <div className="node" key={`Math.random()`}>
              <div
                onClick={() => move(x, y)}
                className={`stone ${node === "" ? "hidden" : null}`}
                style={{
                  backgroundColor: `${node === "" ? activePlayer : node}`,
                }}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PlayGo;
