import paper from 'paper';
import { PaperOffset } from 'paperjs-offset'
import { applyTranslations, getCurrentLang } from './translations.js';

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
  createGrid(width, height) {
    var holes = [];
    for (var i = 0; i < height; i++) {
      var dynamicWidth = i % 2 == 0 ? width-1 : width;
      for (var j = 0; j < dynamicWidth; j++) {
        const shift = i % 2 == 0 ? 20 : 0;
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

function generateBoard(numberOfColumns, numberOfRows) {
  // Clear the entire canvas
  paper.project.activeLayer.removeChildren();

  let width = numberOfColumns * 40;
  let height = numberOfRows * 20;

  const offset = -20;
  const cornerRadius = 10;

  const middlePoint = paper.view.center;
  
  const board = new paper.Path.Rectangle(
    new paper.Point(middlePoint.x - width / 2, middlePoint.y - height / 2),
    new paper.Size(width, height)
  );

  const roundedBoard = new paper.Path.Rectangle(
    new paper.Rectangle(middlePoint.x - (width + 35) / 2, middlePoint.y - (height + 25) / 2, width, height + 25),
    cornerRadius
  )
  
  //const holeArea = PaperOffset.offset(board, offset);
  const holeArea = new paper.Path.Rectangle(middlePoint.x - width / 2, middlePoint.y - height / 2, width, height);

  var path = new skadisHole(holeArea.segments[1].point);
  var grid = path.createGrid(numberOfColumns, numberOfRows);

  const holesTemplate = listToPaths(grid);
  const finalHolesTemplate = new paper.CompoundPath({ children: holesTemplate.children });

  const actualHoles = holeArea.clone().intersect(finalHolesTemplate);
  const boardWithHoles = roundedBoard.subtract(actualHoles);
  
  // IMPORTANT: Remove all intermediate paths before adding final result
  board.remove();
  holeArea.remove();
  holesTemplate.remove();
  finalHolesTemplate.remove();
  actualHoles.remove();
  // Don't remove roundedBoard as it was consumed by subtract()
  
  boardWithHoles.fillColor = '#F0EBD8';
  
  paper.project.activeLayer.addChild(boardWithHoles);
  paper.view.draw();
}

function generatePreview(width, height) {
  previewLayer.activate();
  previewLayer.children.pop();

  const middlePoint = paper.view.center;
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

function downloadSVG() {
  // 1. Find the layer containing the final, correct board geometry.
  const boardLayer = paper.project.layers.find(layer => layer.name === 'boardLayer');
  if (!boardLayer || !boardLayer.firstChild) {
    console.error("Board path not found. Ensure layers are named and the board is generated.");
    return;
  }
  
  boardLayer.removeChildren(0, boardLayer.children.length - 1);

  // Get the content bounds to set the viewBox
  const bounds = boardLayer.bounds;
  const viewBoxValue = `${bounds.x} ${bounds.y} ${bounds.width} ${bounds.height}`;

  // 2. Export the entire board layer's content. This returns the <g> element as a string.
  let contentString = boardLayer.exportSVG({ 
    asString: true, 
    bounds: 'content',
    // We remove redundant attributes from the <g> that will be placed on the <svg> tag
    matchShapes: true // Important for path data integrity
  });
  
  // 3. *** Apply Laser-Cut Styling to the Content ***
  // Ensure all paths are set for cutting (no fill, red stroke, thin width)
  contentString = contentString.replace(/fill="[^"]*"/g, 'fill="none"');
  contentString = contentString.replace(/stroke="[^"]*"/g, 'stroke="#000000"'); 
  contentString = contentString.replace(/stroke-width="[^"]*"/g, 'stroke-width="0.25"');

  // 4. *** WRAP THE CONTENT IN A VALID <SVG> ROOT TAG ***
  const svgWrapper = 
  `<svg 
    xmlns="http://www.w3.org/2000/svg"
    viewBox="${viewBoxValue}"
    width="${bounds.width}"
    height="${bounds.height}">
    ${contentString}
  </svg>`;

  // 5. *** ADD XML HEADER ***
  const xmlHeader = '<?xml version="1.0" encoding="UTF-8" standalone="no"?>\n';
  const finalSvgString = xmlHeader + svgWrapper;
  
  // 6. Create a Blob and initiate the download
  const blob = new Blob([finalSvgString], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = 'skadis_board_cut_file.svg'; 
  
  document.body.appendChild(a);
  a.click();
  
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  console.log("SVG download initiated with valid structure.");
}



// Add event listener for download button (add this near your other event listeners)
const downloadButton = document.getElementById('downloadButton');
downloadButton.addEventListener('click', downloadSVG);

applyTranslations(getCurrentLang());
var enButton = document.getElementById("ukFlag");
var deButton = document.getElementById("germanFlag");
enButton.addEventListener('click', () => {
  applyTranslations("en");
  enButton.style.outline = "2px solid white";
  deButton.style.outline = "";
});
deButton.addEventListener('click', () => {
  applyTranslations("de");
  deButton.style.outline = "2px solid white";
  enButton.style.outline = "";
});

// Setup Paper.js on the canvas
const canvas = document.getElementById('myCanvas');
paper.setup(canvas);

var boardLayer = new paper.Layer({ name: 'boardLayer' });
var previewLayer = new paper.Layer({ name: 'previewLayer' });
boardLayer.activate();

let currentWidth = 6;
let currentHeight = 5;
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