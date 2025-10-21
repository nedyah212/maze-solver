import { useState, useEffect, useRef } from 'react';

// Inline the maze library classes for the demo
class Point {
  constructor(row, column) {
    this.row = row;
    this.column = column;
  }
  toString() {
    return `[${this.row}, ${this.column}]`;
  }
}

class Node {
  constructor(element = null, next = null) {
    this.element = element;
    this.next = next;
  }
}

class Stack {
  constructor() {
    this.size = 0;
    this.head = null;
  }
  isEmpty() {
    return this.size === 0;
  }
  clear() {
    this.size = 0;
    this.head = null;
  }
  push(element) {
    const newHead = new Node(element, this.head);
    this.head = newHead;
    this.size++;
  }
  top() {
    if (this.isEmpty()) throw new Error('Stack is empty');
    return this.head.element;
  }
  pop() {
    const element = this.top();
    this.head = this.head.next;
    this.size--;
    return element;
  }
  copy(pathSize, reversed = false) {
    const temp = new Stack();
    const copy = new Stack();
    for (let i = 0; i < pathSize; i++) {
      temp.push(this.pop());
    }
    for (let i = 0; i < pathSize; i++) {
      const point = temp.pop();
      this.push(point);
      copy.push(point);
    }
    if (reversed) {
      const reversedStack = new Stack();
      for (let i = 0; i < pathSize; i++) {
        reversedStack.push(copy.pop());
      }
      return reversedStack;
    }
    return copy;
  }
  toArray() {
    const arr = [];
    let current = this.head;
    while (current) {
      arr.push(current.element);
      current = current.next;
    }
    return arr;
  }
}

class Maze {
  constructor(startingRow, startingColumn, existingMaze) {
    this.originalMaze = existingMaze.map(row => [...row]);
    this.charMaze = existingMaze.map(row => [...row]);
    this.path = new Stack();
    this.testMessage = "No exit found in maze!\n\n";
    this.exitStatus = false;
    this.hasSearched = false;
    this.startingPoint = new Point(startingRow, startingColumn);
  }
  get rowLength() {
    return this.charMaze.length;
  }
  get columnLength() {
    return this.charMaze[0].length;
  }
  getMaze() {
    return this.charMaze.map(row => [...row]);
  }
  reset() {
    this.charMaze = this.originalMaze.map(row => [...row]);
    this.path.clear();
    this.exitStatus = false;
    this.hasSearched = false;
    this.testMessage = "No exit found in maze!\n\n";
  }
  *depthFirstSearchGenerator() {
    this.hasSearched = true;
    this.path.push(this.startingPoint);
    this.charMaze[this.path.top().row][this.path.top().column] = 'V';
    yield {
      maze: this.getMaze(),
      currentPos: this.startingPoint,
      found: false,
      path: this.path.toArray()
    };
    while (!this.path.isEmpty()) {
      if (this.isSpace(this.getChar(1, 0)) || this.isExit(this.getChar(1, 0))) {
        this.inspectLocation(1, 0);
      }
      else if (this.isSpace(this.getChar(0, 1)) || this.isExit(this.getChar(0, 1))) {
        this.inspectLocation(0, 1);
      }
      else if (this.isSpace(this.getChar(0, -1)) || this.isExit(this.getChar(0, -1))) {
        this.inspectLocation(0, -1);
      }
      else if (this.isSpace(this.getChar(-1, 0)) || this.isExit(this.getChar(-1, 0))) {
        this.inspectLocation(-1, 0);
      }
      else {
        this.path.pop();
      }
      if (this.exitStatus === true) {
        const pathSize = this.path.size;
        this.testMessage = `Path found! ${pathSize} steps from Start to Exit.`;
        const reversedPath = this.path.copy(pathSize, true);
        for (let i = 0; i < pathSize; i++) {
          const point = reversedPath.pop();
          if (this.charMaze[point.row][point.column] !== 'E') {
            this.charMaze[point.row][point.column] = '.';
          }
        }
        this.path = this.path.copy(pathSize, true);
        yield {
          maze: this.getMaze(),
          currentPos: this.path.top(),
          found: true,
          message: this.testMessage,
          path: this.path.toArray()
        };
        break;
      }
      yield {
        maze: this.getMaze(),
        currentPos: this.path.isEmpty() ? null : this.path.top(),
        found: false,
        path: this.path.toArray()
      };
    }
    if (!this.exitStatus) {
      yield {
        maze: this.getMaze(),
        currentPos: null,
        found: false,
        message: this.testMessage,
        path: []
      };
    }
  }
  isSpace(target) {
    return target === ' ';
  }
  isExit(target) {
    this.exitStatus = target === 'E';
    return this.exitStatus;
  }
  getChar(rowModifier, columnModifier) {
    let character = '_';
    if (rowModifier !== 0 && Math.abs(rowModifier) === 1) {
      character = this.charMaze[this.path.top().row + rowModifier][this.path.top().column];
    }
    else if (columnModifier !== 0 && Math.abs(columnModifier) === 1) {
      character = this.charMaze[this.path.top().row][this.path.top().column + columnModifier];
    }
    return character;
  }
  inspectLocation(rowModifier, columnModifier) {
    this.path.push(new Point(
      this.path.top().row + rowModifier,
      this.path.top().column + columnModifier
    ));
    if (this.charMaze[this.path.top().row][this.path.top().column] !== 'E') {
      this.charMaze[this.path.top().row][this.path.top().column] = 'V';
    }
  }
}

// Sample mazes
const SAMPLE_MAZES = [
  {
    name: "Simple",
    maze: [
      ['W','W','W','W','W','W','W','W','W','W'],
      ['W',' ',' ',' ',' ',' ',' ',' ',' ','W'],
      ['W',' ','W','W','W','W','W','W',' ','W'],
      ['W',' ','W',' ',' ',' ',' ',' ',' ','W'],
      ['W',' ','W',' ','W','W','W','W','E','W'],
      ['W',' ',' ',' ',' ',' ',' ',' ',' ','W'],
      ['W','W','W','W','W','W','W','W','W','W']
    ],
    start: [1, 1]
  },
  {
    name: "Complex",
    maze: [
      ['W','W','W','W','W','W','W','W','W','W','W','W','W','W','W'],
      ['W',' ',' ',' ','W',' ',' ',' ',' ',' ',' ',' ',' ',' ','W'],
      ['W',' ','W',' ','W',' ','W','W','W','W','W','W','W',' ','W'],
      ['W',' ','W',' ',' ',' ','W',' ',' ',' ',' ',' ','W',' ','W'],
      ['W',' ','W','W','W','W','W',' ','W','W','W',' ','W',' ','W'],
      ['W',' ',' ',' ',' ',' ',' ',' ','W',' ',' ',' ','W',' ','W'],
      ['W','W','W','W','W','W','W',' ','W',' ','W','W','W',' ','W'],
      ['W',' ',' ',' ',' ',' ','W',' ',' ',' ',' ',' ',' ',' ','W'],
      ['W',' ','W','W','W',' ','W','W','W','W','W','W','W','E','W'],
      ['W',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','W'],
      ['W','W','W','W','W','W','W','W','W','W','W','W','W','W','W']
    ],
    start: [1, 1]
  }
];

export default function MazeSolver() {
  const [currentMaze, setCurrentMaze] = useState(SAMPLE_MAZES[0].maze);
  const [startPos, setStartPos] = useState(SAMPLE_MAZES[0].start);
  const [mazeState, setMazeState] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(100);
  const [message, setMessage] = useState('');
  const [selectedMazeIndex, setSelectedMazeIndex] = useState(0);
  const generatorRef = useRef(null);
  const timeoutRef = useRef(null);

  const getCellColor = (cell, row, col, currentPos) => {
    if (cell === 'W') return 'bg-gray-800';
    if (cell === 'E') return 'bg-green-500';
    if (cell === 'V') return 'bg-blue-400';
    if (cell === '.') return 'bg-yellow-400';
    if (currentPos && currentPos.row === row && currentPos.column === col) {
      return 'bg-red-500';
    }
    return 'bg-white';
  };

  const startSolving = () => {
    if (isRunning) return;

    const maze = new Maze(startPos[0], startPos[1], currentMaze);
    generatorRef.current = maze.depthFirstSearchGenerator();
    setIsRunning(true);
    setMessage('Searching for exit...');
    runNextStep();
  };

  const runNextStep = () => {
    if (!generatorRef.current) return;

    const result = generatorRef.current.next();

    if (result.done) {
      setIsRunning(false);
      return;
    }

    setMazeState(result.value);

    if (result.value.found) {
      setMessage(result.value.message || 'Exit found!');
      setIsRunning(false);
      return;
    }

    if (result.value.message) {
      setMessage(result.value.message);
    }

    timeoutRef.current = setTimeout(runNextStep, speed);
  };

  const reset = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    generatorRef.current = null;
    setIsRunning(false);
    setMazeState(null);
    setMessage('');
  };

  const changeMaze = (index) => {
    reset();
    setSelectedMazeIndex(index);
    setCurrentMaze(SAMPLE_MAZES[index].maze);
    setStartPos(SAMPLE_MAZES[index].start);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const displayMaze = mazeState ? mazeState.maze : currentMaze;
  const currentPos = mazeState ? mazeState.currentPos : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-8">
      <div className="max-w-4xl w-full">
        <h1 className="text-4xl font-bold text-white text-center mb-8">
          Depth-First Search Maze Solver
        </h1>

        <div className="bg-white rounded-lg shadow-2xl p-6 mb-6">
          <div className="flex gap-4 mb-6 flex-wrap">
            <button
              onClick={startSolving}
              disabled={isRunning}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
            >
              {isRunning ? 'Solving...' : 'Start Solving'}
            </button>

            <button
              onClick={reset}
              className="px-6 py-3 bg-gray-500 text-white rounded-lg font-semibold hover:bg-gray-600 transition"
            >
              Reset
            </button>

            <div className="flex items-center gap-2">
              <label className="text-gray-700 font-medium">Speed:</label>
              <input
                type="range"
                min="10"
                max="500"
                value={speed}
                onChange={(e) => setSpeed(Number(e.target.value))}
                className="w-32"
              />
              <span className="text-gray-600">{speed}ms</span>
            </div>

            <select
              value={selectedMazeIndex}
              onChange={(e) => changeMaze(Number(e.target.value))}
              disabled={isRunning}
              className="px-4 py-2 border rounded-lg disabled:bg-gray-200"
            >
              {SAMPLE_MAZES.map((m, i) => (
                <option key={i} value={i}>{m.name} Maze</option>
              ))}
            </select>
          </div>

          {message && (
            <div className="mb-4 p-4 bg-blue-50 border-l-4 border-blue-500 text-blue-700 font-medium">
              {message}
            </div>
          )}

          <div className="flex justify-center">
            <div className="inline-block border-4 border-gray-800 rounded-lg overflow-hidden shadow-lg">
              {displayMaze.map((row, rowIndex) => (
                <div key={rowIndex} className="flex">
                  {row.map((cell, colIndex) => (
                    <div
                      key={`${rowIndex}-${colIndex}`}
                      className={`w-8 h-8 ${getCellColor(cell, rowIndex, colIndex, currentPos)} transition-colors duration-200`}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-white border-2 border-gray-300"></div>
              <span>Empty Space</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gray-800"></div>
              <span>Wall</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-red-500"></div>
              <span>Current Position</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-blue-400"></div>
              <span>Visited</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-green-500"></div>
              <span>Exit</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold mb-3">How It Works</h2>
          <ul className="space-y-2 text-gray-700">
            <li>🔴 <strong>Red</strong> shows the current search position</li>
            <li>🔵 <strong>Blue</strong> marks visited cells during the search</li>
            <li>🟡 <strong>Yellow</strong> highlights the final path to the exit</li>
            <li>📊 The algorithm explores: Down → Right → Left → Up</li>
            <li>🔄 It backtracks when hitting dead ends</li>
          </ul>
        </div>
      </div>
    </div>
  );
}