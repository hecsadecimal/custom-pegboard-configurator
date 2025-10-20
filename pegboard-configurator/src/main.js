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



var myPoint = new paper.Point(120, 120);
var mySize = new paper.Size(200, 100);
var myRectangle = new paper.Rectangle(myPoint, mySize);

path.lineTo(myPoint);
const secondPath = new paper.Path.Rectangle(myRectangle);
secondPath.strokeColor = "green";
secondPath.fillColor = "blue";
// Draw the view now
paper.view.draw();