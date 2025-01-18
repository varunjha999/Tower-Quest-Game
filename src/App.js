import React, { useState, useEffect } from 'react';
// import apple from './apple.png'
// import click from './click.png'
// import bomb from './euro.png'
import './App.css';

const floorsLevel = {
  Normal: Array(9).fill({ gems: 3, bombs: 1 }),
  Medium: Array(9).fill({ gems: 2, bombs: 1 }),
  Hard: Array(9).fill({ gems: 1, bombs: 2 }),
  Impossible: Array(9).fill({ gems: 1, bombs: 3 })
};

const createFloor = (gems, bombs) => {
  let floor = Array(gems).fill('gem').concat(Array(bombs).fill('bomb'));
  return floor.sort(() => Math.random() - 0.5);
};

function App() {
  const [difficulty, setDifficulty] = useState('Normal');
  const [currentFloor, setCurrentFloor] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [floors, setFloors] = useState([]);
  const [playerBalance, setPlayerBalance] = useState(100);
  const [autoPlay, setAutoPlay] = useState(false);
  const [autoRounds, setAutoRounds] = useState(0);
  const [revealedBoxes, setRevealedBoxes] = useState([]);

  useEffect(() => {
    initializeGame();
  }, [difficulty]);

  const initializeGame = () => {
    const initFloors = floorsLevel[difficulty].map(({ gems, bombs }) => createFloor(gems, bombs));
    setFloors(initFloors);
    setCurrentFloor(0);
    setGameOver(false);
    setRevealedBoxes(Array(9).fill(Array(4).fill(false)));
  };

  const handleBoxClick = (floorIndex, boxIndex) => {
    if (gameOver || currentFloor !== floorIndex) return;

    const selectedBox = floors[floorIndex][boxIndex];
    revealBox(floorIndex, boxIndex);

    if (selectedBox === 'gem') {
      if (floorIndex + 1 < floors.length) {
        setCurrentFloor(floorIndex + 1);
      } else {
        alert('Congratulations! You reached the top!');
        setGameOver(true);
      }
    } else {
      alert('Oops! You hit a bomb. Game Over.');
      setGameOver(true);
      revealAllBoxes();
    }
  };

  const revealBox = (floorIndex, boxIndex) => {
    setRevealedBoxes((prev) => {
      const newRevealed = [...prev];
      newRevealed[floorIndex] = [...newRevealed[floorIndex]];
      newRevealed[floorIndex][boxIndex] = true;
      return newRevealed;
    });
  };

  const revealAllBoxes = () => {
    setRevealedBoxes(floors.map(() => Array(4).fill(true)));
  };

  const startGame = () => {
    if (playerBalance >= 10) {
      setPlayerBalance(playerBalance - 10);
      initializeGame();
    } else {
      alert('Not enough points to start the game.');
    }
  };

  const startAutoPlay = () => {
    if (playerBalance >= 10) {
      setAutoPlay(true);
      setAutoRounds(autoRounds || Infinity);
    }
  };

  const stopAutoPlay = () => {
    setAutoPlay(false);
    setAutoRounds(0);
  };

  useEffect(() => {
    if (autoPlay && autoRounds > 0 && !gameOver) {
      const interval = setInterval(() => {
        const floor = floors[currentFloor];
        const randomBox = Math.floor(Math.random() * floor.length);
        handleBoxClick(currentFloor, randomBox);
        setAutoRounds(autoRounds - 1);
        if (autoRounds - 1 <= 0 || gameOver) {
          stopAutoPlay();
          clearInterval(interval);
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [autoPlay, autoRounds, currentFloor, gameOver]);

  return (
    <div className="App p-4 bg-slate-200">
      <h1 className="text-2xl font-bold mb-4">Tower Quest Game</h1>
      <div className="mb-4">
        <label className="mr-2">Choose Difficulty: </label>
        <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className="p-2 border rounded bg-slate-400">
          <option value="Normal">Normal</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
          <option value="Impossible">Impossible</option>
        </select>
      </div>

      <div className="mb-4">
        <p className="mb-2">Player Balance: {playerBalance}</p>
        <p className="mb-2">Current Floor: {currentFloor + 1}</p>
        <button onClick={startGame} className="mr-2 p-2 bg-green-500 text-white rounded">Start Game</button>
        <button onClick={startAutoPlay} disabled={autoPlay || gameOver} className="mr-2 p-2 bg-blue-500 text-white rounded">Start Auto-Play</button>
        <button onClick={stopAutoPlay} disabled={!autoPlay} className="p-2 bg-red-500 text-white rounded">Stop Auto-Play</button>
      </div>

      <div className="tower grid grid-cols-4 p-2 place-items-center bg-gray-400">
        {floors.map((floor, floorIndex) => (
          floor.map((box, boxIndex) => (
            <button
              key={`${floorIndex}-${boxIndex}`}
              className={`box w-12 h-12 flex justify-center items-center border border-gray-500 rounded ${currentFloor === floorIndex ? 'bg-yellow-300' : ''}`}
              onClick={() => handleBoxClick(floorIndex, boxIndex)}
              disabled={gameOver || currentFloor !== floorIndex}
            >
              {revealedBoxes[floorIndex][boxIndex] ? (box === 'gem' ? '💎' : '💣') : '?'}
              {/* {revealedBoxes[floorIndex][boxIndex] ? (box === 'gem' ? '<img src={<apple />} alt="apple" />' : '<img src={bomb} alt="bomb" />') : '<img src={click} alt="click" />'} */}
            </button>
          ))
        )).reverse()}
      </div>
      <footer className="mt-4 text-center">© Developed by Varun Jha</footer>
    </div>
  );
}

export default App;
