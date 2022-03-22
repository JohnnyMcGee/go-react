import React, { useState, useEffect } from "react";

import "./board.css";

const boardSize = 9;

// const boardState = [
//   ["black", "white", ""],
//   ["", "", "white"],
//   ["white", "", "black"],
// ];

const PlayGo = () => {
  const [boardPoints, setBoardPoints] = useState([[]]);

  const [activePlayer, setActivePlayer] = useState("white");

  const fetchBoard = async () => {
    let data;
    try {
      const res = await fetch("http://localhost:8080/board");
      data = await res.json();
    } catch (e) {
      console.log(e);
      return;
    }
    setBoardPoints(data);
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
    const isOpenPoint = boardPoints[y][x] === "";
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
        {boardPoints.map((col, y) =>
          col.map((point, x) => (
            <div className="point" key={`${Math.random()}`}>
              <div
                onClick={() => move(x, y)}
                className={`stone ${point === "" ? "hidden" : null}`}
                style={{
                  backgroundColor: `${point === "" ? activePlayer : point}`,
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
