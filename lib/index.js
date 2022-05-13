const Grid = require('./grid');
const AStar = require('./aStar');

const maxWidth = 10;
const maxHeight = 20;
const nObstacles = 100;

const grid = new Grid(maxWidth, maxHeight, { allowDiagonalNeighbors: true });

// make some cells obstacles
for (let i = 0; i < nObstacles; i++) {
	grid.getRandomCell(cell => cell.isAPath()).setIsObstacle(true).data = '  •  ';
}

const start = grid.getRandomCell(cell => cell.isAPath());
const end = grid.getRandomCell(cell => cell.isAPath() && !cell.isSameXY(start));

// grid.display(c => c.data);

const aStar = new AStar(grid, {
	tracePathProgressCb: path => {
		console.log(path.map(cell => cell.getXYString()).join(' '));
	},
});

aStar.findPathAndDisplay(start, end);
