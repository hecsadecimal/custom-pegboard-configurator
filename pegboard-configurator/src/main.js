import paper from 'paper';

// Setup Paper.js on the canvas
const canvas = document.getElementById('myCanvas');
paper.setup(canvas);

// Create a Paper.js Path to draw a line
const path = new paper.Path();
path.strokeColor = 'black';
const start = new paper.Point(100, 100);
path.moveTo(start);
path.lineTo(start.add([100, -50]));

// Draw the view now
paper.view.draw();