import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import CircleIcon from "@mui/icons-material/Circle";
import CircleOutlinedIcon from "@mui/icons-material/CircleOutlined";
import { Paper, Box } from "@mui/material";
import Stone from "../components/Stone.jsx";
import boardJPG from "../image/board.jpg";

const Board = ({ board, turn, onPlayPoint, currentMove, showTerritory }) => {
  const boardSize = board[0].length;
  const dots = {
    2: [2, 6],
    4: [4],
    6: [2, 6],
  };

  const mapPointToComponent = (point) => {
    const isOpenPoint = point.color === "";
    const isPermitted = point.permit[turn] === true;
    const isCurrentMove =
      currentMove && point.x === currentMove[0] && point.y === currentMove[1];
    if (isOpenPoint && !isPermitted) {
      // Show nothing if the game has ended
      if (turn === "") {
        return;
      }
      return (
        <CloseRoundedIcon
          sx={{
            fontSize: "2em",
            fontWeight: "bold",
            height: "2.5em",
            width: "2.5em",
            position: "relative",
            top: "-.25em",
            left: "-.25em",
            color: "#ce0000",
            opacity: 0,
            "&:hover": {
              opacity: 0.5,
            },
            transition: (theme) =>
              theme.transitions.create(["opacity"], {
                duration: theme.transitions.duration.shortest,
              }),
          }}
        />
      );
    } else {
      const activeColor = () => {
        const pointColor = isOpenPoint ? turn : point.color;
        return pointColor === "black" ? "white" : "black";
      };
      return (
        <Stone
          color={isOpenPoint ? turn : point.color}
          isOpen={isOpenPoint}
          onClick={() => onPlayPoint(point)}
        >
          {isCurrentMove ? (
            <CircleOutlinedIcon
              sx={{
                color: activeColor(),
                position: "relative",
                top: "calc(0.8em + .5px)",
                left: "calc(0.8em + 1px)",
              }}
            />
          ) : null}
        </Stone>
      );
    }
  };

  return (
    <Paper
      elevation={5}
      sx={{
        gridTemplateRows: `repeat(${boardSize - 1}, 4.55em) 0`,
        gridTemplateColumns: `repeat(${boardSize - 1}, 4.25em) 0`,
        backgroundImage: `url(${boardJPG})`,
        backgroundPosition: "center",
        backgroundSize: "cover",
        display: "grid",
        height: "max-content",
        padding: "4.5em",
        width: "max-content",
        borderRight: "4px solid rgb(183 140 99 / 25%)",
        borderTop: "4px solid rgb(150 110 85 / 25%)",
        borderLeft: "4px solid rgb(170 114 66 / 25%)",
        borderBottom: "4px solid rgb(166 103 77 / 25%)",
        borderRadius: "2px",
      }}
    >
      {board.map((row, y) =>
        row.map((point, x) => (
          <Box
            key={`${point.x}${point.y}`}
            sx={{
              borderLeft: "3px solid rgba(15, 12, 8, 0.65)",
              borderTop: "3px solid rgba(15, 12, 8, 0.65)",
              position: "relative",
            }}
          >
            <Box
              sx={{
                position: "absolute",
                top: "calc(-2em - 1.5px)",
                left: "calc(-2em - 1.5px)",
              }}
            >
              {dots[x] && dots[x].includes(y) ? (
                <CircleIcon
                  sx={{
                    fontSize: "medium",
                    color: "rgb(48 39 26)",
                    position: "absolute",
                    top: "1.5em",
                    left: "1.5em",
                  }}
                />
              ) : null}
              {showTerritory && point.color === "" ? (
                <TerritoryMarker territory={point.territory} />
              ) : null}
              {mapPointToComponent(point)}
            </Box>
          </Box>
        ))
      )}
    </Paper>
  );
};

const TerritoryMarker = ({ territory }) => {
  return (
    <Box
      sx={{
        position: "absolute",
        height: "1.25em",
        width: "1.25em",
        backgroundColor: territory === "" ? "transparent" : territory,
        top: "1.375em",
        left: "1.375em",
      }}
    />
  );
};

export default Board;
