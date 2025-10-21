import { Point } from './Point';
import { Stack } from './Stack';

export class Maze {
  constructor(startingRow, startingColumn, existingMaze) {
    this.charMaze = existingMaze.map(row => [...row]);
    this.path = new Stack();
    this.testMessage = "No exit found in maze!\n\n";
    this.exitStatus = false;
    this.hasSearched = false;

    if (this.charMaze[startingRow][startingColumn] === 'W' ||
        this.charMaze[startingRow][startingColumn] === 'E') {
      throw new Error('Starting position cannot be on a wall or exit');
    }

    if (startingColumn >= this.columnLength || startingColumn < 0) {
      throw new Error('Starting column is out of range');
    }

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

  printMaze() {
    let maze = "";
    for (let r = 0; r < this.rowLength; r++) {
      for (let c = 0; c < this.columnLength; c++) {
        maze += this.charMaze[r][c];
      }
      if (r < this.rowLength - 1) {
        maze += "\n";
      }
    }
    return maze;
  }

  depthFirstSearch() {
    this.hasSearched = true;
    this.path.push(this.startingPoint);
    this.charMaze[this.path.top().row][this.path.top().column] = 'V';

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
        this.testMessage = `Path to follow from Start ${this.startingPoint.toString()} to Exit ${this.path.top()} - ${pathSize} steps:\n`;

        const reversedPath = this.path.copy(pathSize, true);

        for (let i = 0; i < pathSize; i++) {
          const point = reversedPath.pop();
          this.testMessage += `${point.toString()}\n`;

          if (this.charMaze[point.row][point.column] !== 'E') {
            this.charMaze[point.row][point.column] = '.';
          }
        }

        this.path = this.path.copy(pathSize, true);
        break;
      }
    }

    return `${this.testMessage}${this.printMaze()}`;
  }

  getPathToFollow() {
    if (!this.hasSearched) {
      throw new Error('Search has not been performed yet');
    }

    if (this.path.isEmpty()) {
      return new Stack();
    }

    return this.path.copy(this.path.size);
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