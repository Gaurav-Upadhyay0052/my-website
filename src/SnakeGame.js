import React, { useState, useEffect, useRef } from "react";

const GRID_SIZE = 15;
const INITIAL_SNAKE = [{ x: 7, y: 7 }];
const INITIAL_DIRECTION = { x: 0, y: -1 }; // starts moving up

function SnakeGame() {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [food, setFood] = useState(getRandomFood(INITIAL_SNAKE));
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);

  const moveRef = useRef(direction);
  moveRef.current = direction;

  // Game loop
  useEffect(() => {
    if (gameOver) return;

    const interval = setInterval(() => {
      setSnake((prevSnake) => {
        const newHead = {
          x: prevSnake[0].x + moveRef.current.x,
          y: prevSnake[0].y + moveRef.current.y,
        };

        // Wall collision
        if (
          newHead.x < 0 ||
          newHead.x >= GRID_SIZE ||
          newHead.y < 0 ||
          newHead.y >= GRID_SIZE
        ) {
          setGameOver(true);
          return prevSnake;
        }

        // Self collision
        for (let seg of prevSnake) {
          if (seg.x === newHead.x && seg.y === newHead.y) {
            setGameOver(true);
            return prevSnake;
          }
        }

        const newSnake = [newHead, ...prevSnake];

        // Eat food
        if (newHead.x === food.x && newHead.y === food.y) {
          setFood(getRandomFood(newSnake));
          setScore((s) => s + 1);
          return newSnake; // grow snake
        }

        newSnake.pop(); // move forward
        return newSnake;
      });
    }, 200);

    return () => clearInterval(interval);
  }, [food, gameOver]);

  // Arrow key controls
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "ArrowUp" && moveRef.current.y !== 1)
        setDirection({ x: 0, y: -1 });
      if (e.key === "ArrowDown" && moveRef.current.y !== -1)
        setDirection({ x: 0, y: 1 });
      if (e.key === "ArrowLeft" && moveRef.current.x !== 1)
        setDirection({ x: -1, y: 0 });
      if (e.key === "ArrowRight" && moveRef.current.x !== -1)
        setDirection({ x: 1, y: 0 });
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  const restartGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setFood(getRandomFood(INITIAL_SNAKE));
    setGameOver(false);
    setScore(0);
  };

  return (
    <div className="snake-container">
      <h1>🐍 Snake Game</h1>
      <p>Score: {score}</p>

      <div
        className="grid"
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${GRID_SIZE}, 20px)`,
          gridTemplateRows: `repeat(${GRID_SIZE}, 20px)`,
          gap: "1px",
          backgroundColor: "#ccc",
        }}
      >
        {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
          const x = i % GRID_SIZE;
          const y = Math.floor(i / GRID_SIZE);

          const isSnake = snake.some((seg) => seg.x === x && seg.y === y);
          const isFood = food.x === x && food.y === y;

          return (
            <div
              key={i}
              style={{
                width: 20,
                height: 20,
                backgroundColor: isSnake ? "green" : isFood ? "red" : "white",
              }}
            ></div>
          );
        })}
      </div>

      {gameOver && (
        <div className="game-over">
          <h2>Game Over!</h2>
          <button onClick={restartGame}>Restart</button>
        </div>
      )}
    </div>
  );
}

function getRandomFood(snake) {
  let newFood;
  while (true) {
    newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
    if (!snake.some((seg) => seg.x === newFood.x && seg.y === newFood.y)) {
      return newFood;
    }
  }
}

export default SnakeGame;
