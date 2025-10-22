import paper from 'paper';
import { PaperOffset } from 'paperjs-offset'

class skadisHole {
  constructor (point) {
    this.x = point.x;
    this.y = point.y;
    this.holeWidth = 5;
    this.holeHeight = 15;
    this.holeRadius = this.holeWidth / 2;

    this.path = new paper.Path.Rectangle(
      new paper.Rectangle(this.x, this.y, this.holeWidth, this.holeHeight),
      this.holeRadius
    );
  }
  createGrid(endpoint) {
    var numberOfRows = Math.ceil((endpoint.x - this.x) / 40);
    var numberOfColumns = Math.ceil((endpoint.y - this.y) / 40);
    var holes = [];
    for (var i = 0; i < numberOfColumns; i++) {
      for (var j = 0; j < numberOfRows; j++) {
        const shift = i % 2 == 0 ? 0 : 17.5;
        holes.push(new paper.Rectangle(this.x + shift + 40 * j, this.y + 40 * i, this.holeWidth, this.holeHeight));
      }
    }
    return holes;
  }
}

function listToPaths(objects) {
  const paths = [];
  objects.forEach(element => {
    const holeRadius = 5/2;
    const tempPath = new paper.Path.Rectangle(element, holeRadius);
    paths.push(tempPath);
  });
  return new paper.CompoundPath({ children: paths });
}

function generateBoard(width, height, padding, cornerRadius) {
  // Clear the entire canvas
  paper.project.activeLayer.removeChildren();
  
  const board = new paper.Path.Rectangle(
    new paper.Point(100, 100), 
    new paper.Size(width, height)
  );

  const roundedBoard = new paper.Path.Rectangle(
    new paper.Rectangle(100, 100, width, height),
    cornerRadius
  )
  
  const offset = padding * -1;
  const holeArea = PaperOffset.offset(board, offset);
  
  holeArea.segments.forEach(segment => {
    segment.point.x = Math.round(segment.point.x);
    segment.point.y = Math.round(segment.point.y);
  });

  const cutLine = PaperOffset.offset(holeArea, 0.001);

  var path = new skadisHole(holeArea.segments[1].point);
  var grid = path.createGrid(holeArea.segments[3].point);

  // Filter holes that intersect with cutLine
  var grid = grid.filter(hole => !(new paper.Path.Rectangle(hole, 5/2).intersects(cutLine)));

  const holesTemplate = listToPaths(grid);

  // Center remaining holes
  const boardCenter = board.bounds.center;
  const holePatternCenter = holesTemplate.bounds.center;
  holesTemplate.translate(boardCenter.x - holePatternCenter.x, boardCenter.y - holePatternCenter.y);

  const actualHoles = holeArea.clone().intersect(holesTemplate);
  const boardWithHoles = roundedBoard.subtract(actualHoles);
  
  boardWithHoles.fillColor = 'black';
  
  paper.project.activeLayer.addChild(boardWithHoles);
  paper.view.draw();
}

// Setup Paper.js on the canvas
const canvas = document.getElementById('myCanvas');
paper.setup(canvas);

let currentWidth = 500;
let currentHeight = 500;
let currentPadding = 20;
let currentCornerRadius = 5;
// Initial board generation
generateBoard(currentWidth, currentHeight, currentPadding, currentCornerRadius);

// Setup sliders
const boardWidthSlider = document.getElementById('boardWidthSlider');
const boardHeightSlider = document.getElementById('boardHeightSlider');
const paddingSlider = document.getElementById('paddingSlider');
const cornerRadiusSlider = document.getElementById('cornerRadiusSlider');




boardWidthSlider.addEventListener('input', function() {
  currentWidth = parseFloat(this.value);
  generateBoard(currentWidth, currentHeight, currentPadding, currentCornerRadius);
});

boardHeightSlider.addEventListener('input', function() {
  currentHeight = parseFloat(this.value);
  generateBoard(currentWidth, currentHeight, currentPadding, currentCornerRadius);
});

paddingSlider.addEventListener('input', function() {
  currentPadding = parseFloat(this.value);
  generateBoard(currentWidth, currentHeight, currentPadding, currentCornerRadius);
});

cornerRadiusSlider.addEventListener('input', function() {
  currentCornerRadius = parseFloat(this.value);
  generateBoard(currentWidth, currentHeight, currentPadding, currentCornerRadius);
});