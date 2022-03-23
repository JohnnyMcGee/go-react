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

  const [captures, setCaptures] = useState({ white: 0, black: 0 });

  useEffect(() => fetchData(), []);

  const fetchData = async () => {
    let data;
    const _fetchData = async (endpoint) => {
      try {
        const res = await fetch("http://localhost:8080" + endpoint);
        data = await res.json();
      } catch (e) {
        console.log(e);
        return;
      }
      console.log(data);
      return data;
    };

    setBoardPoints(await _fetchData("/board"));
    setCaptures(await _fetchData("/captures"));
    console.clear();
    console.log(await _fetchData("/groups"));
  };

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
      fetchData();
      setActivePlayer(activePlayer === "white" ? "black" : "white");
    }
  };

  return (
    <div className="container">
      <div>
        <div className="scoreboard">
          <h3>{`Black: ${captures["black"]}`}</h3>
          <h3>{`White: ${captures["white"]}`}</h3>
        </div>
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
                >
                  <p className="debug">
                    {`${x}, ${y}`}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default PlayGo;
