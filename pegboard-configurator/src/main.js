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
    var numberOfColumns = Math.ceil((endpoint.y - this.y) / 20);
    var holes = [];
    for (var i = 0; i < numberOfColumns; i++) {
      for (var j = 0; j < numberOfRows; j++) {
        const shift = i % 2 == 0 ? 0 : 20;
        holes.push(new paper.Rectangle(this.x + shift + 40 * j, this.y + 20 * i, this.holeWidth, this.holeHeight));
      }
    }
    return holes;
  }
}

function listToPaths(objects) {
  const paths = [];
  const holeRadius = 5/2;
  objects.forEach(element => {
    const tempPath = new paper.Path.Rectangle(element, holeRadius);
    paths.push(tempPath);
  });
  return new paper.CompoundPath({ children: paths });
}

function generateBoard(width, height) {
  // Clear the entire canvas
  paper.project.activeLayer.removeChildren();

  const offset = -20;
  const cornerRadius = 20;

  const middlePoint = new paper.Point(380, 380);
  
  const board = new paper.Path.Rectangle(
    new paper.Point(middlePoint.x - width / 2, middlePoint.y - height / 2),
    new paper.Size(width, height)
  );

  const roundedBoard = new paper.Path.Rectangle(
    new paper.Rectangle(middlePoint.x - width / 2, middlePoint.y - height / 2, width, height),
    cornerRadius
  )
  
  
  const holeArea = PaperOffset.offset(board, offset);
  
  holeArea.segments.forEach(segment => {
    segment.point.x = Math.round(segment.point.x);
    segment.point.y = Math.round(segment.point.y);
  });

  //const cutLine = PaperOffset.offset(holeArea, 0.001);
  //cutLine.strokeColor = 'red';

  var path = new skadisHole(holeArea.segments[1].point);
  var grid = path.createGrid(holeArea.segments[3].point);

  const holesTemplate = listToPaths(grid);
  const finalHolesTemplate = new paper.CompoundPath({ children: holesTemplate.children });

  const actualHoles = holeArea.clone().intersect(finalHolesTemplate);
  const boardWithHoles = roundedBoard.subtract(actualHoles);
  
  boardWithHoles.fillColor = '#F0EBD8';
  
  paper.project.activeLayer.addChild(boardWithHoles);
  paper.view.draw();
}

// Setup Paper.js on the canvas
const canvas = document.getElementById('myCanvas');
paper.setup(canvas);
console.log(canvas.width);

let currentWidth = 425;
let currentHeight = 415;
// Initial board generation
generateBoard(currentWidth, currentHeight);

// Setup sliders
const boardWidthSlider = document.getElementById('boardWidthSlider');
const boardHeightSlider = document.getElementById('boardHeightSlider');
const widthValue = document.querySelector("#widthValue");
const heightValue = document.querySelector("#heightValue");

boardWidthSlider.addEventListener('input', function() {
  currentWidth = parseFloat(this.value);
  widthValue.textContent = currentWidth;
  generateBoard(currentWidth, currentHeight);
});

boardHeightSlider.addEventListener('input', function() {
  currentHeight = parseFloat(this.value);
  heightValue.textContent = currentHeight;
  generateBoard(currentWidth, currentHeight);
});