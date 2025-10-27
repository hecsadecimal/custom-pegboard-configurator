import paper from 'paper';
import { PaperOffset } from 'paperjs-offset'
import { applyTranslations, getCurrentLang, toggleLang } from './translations.js';

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

function generatePreview(width, height) {
  previewLayer.activate();
  previewLayer.children.pop();

  const middlePoint = new paper.Point(380, 380);
  const roundedBoard = new paper.Path.Rectangle(
    new paper.Rectangle(middlePoint.x - width / 2, middlePoint.y - height / 2, width, height),
    20
  );
  roundedBoard.style = {
    strokeColor: '#E4572E',
    dashArray: [4, 10],
    strokeWidth: 4,
    strokeCap: 'round'
};

  previewLayer.addChild(roundedBoard);
}


applyTranslations(getCurrentLang());
var langButton = document.getElementById("languageToggleButton");
langButton.addEventListener('click', () => {
    const newLang = toggleLang();
    applyTranslations(newLang); // Apply the new translations

    // Update the button text
    langButton.textContent = newLang === 'en' ? 'Deutsch' : 'English';
});

// Setup Paper.js on the canvas
const canvas = document.getElementById('myCanvas');
paper.setup(canvas);

var boardLayer = new paper.Layer();
var previewLayer = new paper.Layer();
boardLayer.activate();

let currentWidth = 425;
let currentHeight = 415;
// Initial board generation
generateBoard(currentWidth, currentHeight);

// Setup sliders
const boardWidthSlider = document.getElementById('boardWidthSlider');
const boardHeightSlider = document.getElementById('boardHeightSlider');
const widthValue = document.querySelector("#widthValue");
const heightValue = document.querySelector("#heightValue");

boardWidthSlider.addEventListener('change', function() {
  boardLayer.activate();
  currentWidth = parseFloat(this.value);
  if (currentWidth < 45) {
    currentWidth = 45;
    boardWidthSlider.value = 45;
  }
  widthValue.textContent = currentWidth;
  generateBoard(currentWidth, currentHeight);
});

boardWidthSlider.addEventListener('input', function() {
  currentWidth = parseFloat(this.value);
  widthValue.textContent = currentWidth;
  generatePreview(currentWidth, currentHeight);
});

boardWidthSlider.addEventListener('mouseup', function() {
  previewLayer.removeChildren();
});

boardHeightSlider.addEventListener('change', function() {
  boardLayer.activate();
  currentHeight = parseFloat(this.value);
  if (currentHeight < 55) {
    currentHeight = 55;
    boardHeightSlider.value = 55;
  }
  heightValue.textContent = currentHeight;
  generateBoard(currentWidth, currentHeight);
  previewLayer.removeChildren();
});

boardHeightSlider.addEventListener('input', function() {
  currentHeight = parseFloat(this.value);
  heightValue.textContent = currentHeight;
  generatePreview(currentWidth, currentHeight);
});

boardHeightSlider.addEventListener('mouseup', function() {
  previewLayer.removeChildren();
});