# Maze Solver

An interactive visualization of the Depth-First Search algorithm solving mazes in real-time. Watch as the algorithm explores paths, backtracks from dead ends, and ultimately finds the exit.

![Maze Solver Demo](https://img.shields.io/badge/status-active-success.svg)
![React](https://img.shields.io/badge/react-18.0+-blue.svg)
![Tailwind CSS](https://img.shields.io/badge/tailwind-3.0+-06B6D4.svg)

## Features

- **Real-time Visualization**: Watch the algorithm explore the maze step-by-step
- **Adjustable Speed**: Control animation speed from 10ms to 500ms per step
- **Multiple Mazes**: Choose from Simple, Complex, Long Path, and Epic Challenge difficulty levels
- **Interactive Controls**: Start, pause, and reset the solving process at any time
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Educational**: Perfect for learning how depth-first search works

## Algorithm

This implementation uses **Depth-First Search (DFS)** with backtracking:

1. Start at the initial position and mark it as visited
2. Explore adjacent cells in priority order: Down → Right → Left → Up
3. If a valid path is found, move to that cell
4. If all adjacent cells are blocked or visited, backtrack to the previous cell
5. Repeat until the exit is found or all paths are exhausted

The algorithm uses a **stack data structure** to keep track of the current path, enabling efficient backtracking when dead ends are encountered.

## Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS 3** - Styling and animations
- **JavaScript ES6+** - Core logic and data structures

## Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/maze-solver.git
cd maze-solver

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

## Project Structure

```
maze-solver/
├── src/
│   ├── App.jsx          # Main component with maze logic
│   ├── main.jsx         # React entry point
│   └── index.css        # Tailwind imports
├── public/              # Static assets
├── index.html           # HTML template
├── package.json         # Dependencies
├── vite.config.js       # Vite configuration
├── tailwind.config.js   # Tailwind configuration
└── postcss.config.js    # PostCSS configuration
```

## Usage

### Running the Solver

1. Select a maze from the dropdown menu
2. Click "Start Solving" to begin the animation
3. Adjust the speed slider to control animation speed
4. Click "Reset" to clear the current solution and try again

### Color Legend

- **White**: Empty space (path available)
- **Black**: Wall (impassable)
- **Red (pulsing)**: Current position being explored
- **Blue**: Visited cells during exploration
- **Yellow**: Final solution path from start to exit
- **Green**: Exit position

### Adding Custom Mazes

Add new mazes to the `SAMPLE_MAZES` array in `App.jsx`:

```javascript
{
  name: "Your Maze Name",
  maze: [
    ['W','W','W','W','W'],
    ['W',' ',' ',' ','W'],
    ['W',' ','W',' ','W'],
    ['W',' ',' ','E','W'],
    ['W','W','W','W','W']
  ],
  start: [1, 1]  // [row, column]
}
```

**Legend**:
- `'W'` = Wall
- `' '` = Empty space (use actual space character)
- `'E'` = Exit
- `start` = Starting position as `[row, column]` (0-indexed)

## Data Structures

### Point
Represents a coordinate in the maze with row and column properties.

### Node
Generic linked list node used by the Stack implementation.

### Stack
Custom stack implementation using a singly linked list:
- `push(element)` - Add element to top
- `pop()` - Remove and return top element
- `top()` - View top element without removing
- `isEmpty()` - Check if stack is empty
- `copy(size, reversed)` - Create a copy of the stack

### Maze
Core maze solving class:
- `depthFirstSearchGenerator()` - Generator function that yields each step
- `getMaze()` - Returns current maze state
- `reset()` - Resets maze to original state

## Building for Production

```bash
# Create optimized production build
npm run build

# Preview production build locally
npm run preview
```

The build output will be in the `dist/` directory.

## Performance

The algorithm's time complexity is **O(V + E)** where:
- V = number of cells (vertices)
- E = number of possible moves (edges)

Space complexity is **O(V)** for the stack in the worst case (path from start to exit visits all cells).

## Future Enhancements

- [ ] Additional algorithms (BFS, A*, Dijkstra)
- [ ] Random maze generation
- [ ] User-drawn mazes with click-to-edit
- [ ] Multiple exits and keys/doors
- [ ] Comparison mode (run multiple algorithms side-by-side)
- [ ] Export/import maze configurations
- [ ] Pathfinding statistics (steps taken, cells visited, etc.)
- [ ] Sound effects and visual themes

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Original C# implementation converted to JavaScript
- Inspired by classic maze-solving algorithms and pathfinding visualizations
- Built as an educational tool for understanding graph traversal algorithms

## Contact

Your Name - [@yourtwitter](https://twitter.com/yourtwitter)

Project Link: [https://github.com/yourusername/maze-solver](https://github.com/yourusername/maze-solver)

---

**Made with React and passion for algorithms**