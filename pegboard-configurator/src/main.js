import paper from 'paper';

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
  createGrid(numberOfRows, numberOfColumns) {
    for (var i = 0; i < numberOfRows; i++) {
      for (var j = 0; j < numberOfColumns; j++) {
        const tempPath = new paper.Path.Rectangle(
          new paper.Rectangle(this.x + 40 * j, this.y + 40 * i, this.holeWidth, this.holeHeight),
          this.holeRadius
        );
        tempPath.strokeColor = 'black';
        paper.project.activeLayer.addChild(tempPath);
      }
    }
  }
};


// Setup Paper.js on the canvas
const canvas = document.getElementById('myCanvas');
paper.setup(canvas);


var path = new skadisHole(100, 100);
path.createGrid(10, 10);

//path.smooth();
// Draw the view now
paper.view.draw();
