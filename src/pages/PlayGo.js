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

  const [activePlayer, setActivePlayer] = useState("black");

  const [captures, setCaptures] = useState({ white: 0, black: 0 });

  useEffect(() => fetchData(), []);

  const getAPI = async (endpoint) => {
    let data;

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

  const fetchData = async () => {
    setBoardPoints(await getAPI("/board"));
    setCaptures(await getAPI("/captures"));
    // console.clear();
    await getAPI("/groups");
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
    const point = boardPoints[y][x];
    const isOpenPoint = point.color === "";
    const isPermitted = point.permit[activePlayer];
    if (isOpenPoint && isPermitted) {
      await postMove({ x: x, y: y, color: activePlayer });
      fetchData();
      setActivePlayer(activePlayer === "white" ? "black" : "white");
    } else {
      console.log(point);
    }
  };

  const onNewGameButtonPressed = async () => {
    getAPI("/new-game").then((_) => fetchData());
    setActivePlayer("black");
  };

  return (
    <div className="container">
      <div>
        <div className="scoreboard">
          <h3>{`Black: ${captures["black"]}`}</h3>
          <button onClick={() => onNewGameButtonPressed()}>New Game</button>
          <h3>{`White: ${captures["white"]}`}</h3>
        </div>
        <div
          className="board"
          style={{
            gridTemplateRows: `repeat(${boardSize - 1}, 6em) 0`,
            gridTemplateColumns: `repeat(${boardSize - 1}, 6em) 0`,
          }}
        >
          {boardPoints.map((row, y) =>
            row.map((point, x) => (
              <div className="point" key={`${Math.random()}`}>
                {point.color === "" && point.permit[activePlayer] === false ? (
                  <h1 className="hidden">X</h1>
                ) : (
                  <div
                    onClick={() => move(x, y)}
                    className={`stone ${point.color === "" ? "hidden" : null}`}
                    style={{
                      backgroundColor: `${
                        point.color === "" ? activePlayer : point.color
                      }`,
                    }}
                  >
                    <p className="debug">{`${x}, ${y}`}</p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default PlayGo;
