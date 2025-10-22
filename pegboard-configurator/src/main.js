import paper from 'paper';
import { PaperOffset } from 'paperjs-offset'

class skadisHole {
  constructor (point) {
    this.x = point.x;
    this.y = point.y;

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
    console.log(endpoint);
    console.log(this.x, this.y);
    var numberOfRows = Math.ceil((endpoint.x - this.x) / 40);
    var numberOfColumns = Math.ceil((endpoint.y - this.y) / 40);
    console.log(numberOfRows, numberOfColumns);
    var holes = [];
    for (var i = 0; i < numberOfColumns; i++) {
      for (var j = 0; j < numberOfRows; j++) {
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
holeArea.segments.forEach(segment => {
  segment.point.x = Math.round(segment.point.x);
  segment.point.y = Math.round(segment.point.y);
});
holeArea.strokeColor = 'red';

// cutLine is necessary because otherwise the entire top row and the entire left column intersect
// with the border (holeArea) and would therefore be removed in the following steps
const cutLine = PaperOffset.offset(holeArea, 0.001);

var path = new skadisHole(holeArea.segments[1].point);
var grid = path.createGrid(holeArea.segments[3].point);

// get rid of entries that intersect with the offset line
var grid = grid.filter(hole => !(new paper.Path.Rectangle(hole, 5/2).intersects(cutLine)));


const holesTemplate = listToPaths(grid);

const actualHoles = holeArea.clone().intersect(holesTemplate);

const boardWithHoles = board.subtract(actualHoles);
boardWithHoles.fillColor = 'black';
paper.project.activeLayer.addChild(boardWithHoles);
paper.project.activeLayer.addChild(holeArea);

// Draw the view now
paper.view.draw();
