import React, { useState, useEffect } from "react";

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

  const fetchBoard = async () => {
    let data;
    try {
      const res = await fetch("http://localhost:8080/nodes");
      data = await res.json();
    } catch (e) {
      console.log(e);
      return;
    }
    setBoardNodes(data);
  };
  useEffect(() => fetchBoard(), []);

  const postMove = async (move) => {
    try {
      await fetch("http://localhost:8080/moves", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(move),
      });
    } catch (e) {
      console.log(e);
    }
  };

  const move = async (x, y) => {
    const isOpenPoint = boardNodes[y][x] === "";
    if (isOpenPoint) {
      await postMove({ x: x, y: y, color: activePlayer });
      fetchBoard();
      setActivePlayer(activePlayer === "white" ? "black" : "white");
    }
  };

  return (
    <div className="container">
      <div
        className="board"
        style={{
          gridTemplateRows: `repeat(${boardSize - 1}, 6em) 0`,
          gridTemplateColumns: `repeat(${boardSize - 1}, 6em) 0`,
        }}
      >
        {boardNodes.map((col, y) =>
          col.map((node, x) => (
            <div className="node" key={`${Math.random()}`}>
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
