import paper from 'paper';

class skadisHole {
  constructor (x, y) {
    this.x = x;
    this.y = y;

    // Skadis hole measurements:
    var holeWidth = 50; // 5mm
    var holeHeight = 150; // 15mm
    var holeRadius = holeWidth / 2;

    this.path = new paper.Path.Rectangle(
      new paper.Rectangle(this.x, this.y, holeWidth, holeHeight),
      holeRadius
    );
  }
};

// Setup Paper.js on the canvas
const canvas = document.getElementById('myCanvas');
paper.setup(canvas);


for (var i = 0; i < 10; i++) {
  const tempPath = new skadisHole(100 * i, 100).path;
  tempPath.strokeColor = 'black';
  paper.project.activeLayer.addChild(tempPath);
}

//path.smooth();
// Draw the view now
paper.view.draw();
