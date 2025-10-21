import paper from 'paper';
import { PaperOffset } from 'paperjs-offset'

class skadisHole {
  constructor (x, y) {
    this.x = x;
    this.y = y;

    // Skadis hole measurements:
    this.holeWidth = 5; // 5mm
    this.holeHeight = 15; // 15mm
    this.holeRadius = this.holeWidth / 2;

    this.path = new paper.Path.Rectangle(
      new paper.Rectangle(this.x, this.y, this.holeWidth, this.holeHeight),
      this.holeRadius
    );
  }
  createGrid(endpoint) {
    var numberOfRows = Math.floor((endpoint.x - this.x) / 40);
    var numberOfColumns = Math.floor((endpoint.y - this.y) / 40);
    var holes = [];
    for (var i = 0; i < numberOfRows; i++) {
      for (var j = 0; j < numberOfColumns; j++) {
        const shift = i % 2 == 0 ? 0 : 17.5;
        holes.push(new paper.Rectangle(this.x + shift + 40 * j, this.y + 40 * i, this.holeWidth, this.holeHeight));
      }
    }
    return holes;
  }
};

function listToPaths(objects) {
  const paths = [];
  objects.forEach(element => {
    const holeRadius = 5/2;
    const tempPath = new paper.Path.Rectangle(
      element,
      holeRadius
    );
    paths.push(tempPath);
  });
  return new paper.CompoundPath({ children: paths });
};
  
  

// Setup Paper.js on the canvas
const canvas = document.getElementById('myCanvas');
paper.setup(canvas);

const board = new paper.Path.Rectangle(new paper.Point(100, 100), new paper.Size(300, 400));
const offset = -30;
const holeArea = PaperOffset.offset(board, offset);

var path = new skadisHole(100, 100);
var grid = path.createGrid(new paper.Point(530, 620));

const holesTemplate = listToPaths(grid);

const actualHoles = holeArea.intersect(holesTemplate);

const boardWithHoles = board.subtract(actualHoles);
boardWithHoles.fillColor = 'black';
paper.project.activeLayer.addChild(boardWithHoles);

// Draw the view now
paper.view.draw();
