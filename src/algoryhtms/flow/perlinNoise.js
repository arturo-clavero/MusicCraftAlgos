let dots = [];
let prevDots = [];
const totalDots = 1000;
let pnf;
//the smaller pnf the more the more straight
//very large pnf creates curly stuff
let speed = 2;

// function basicPN(p, player){
// 	p.background(0, 5);
// 	speed = getMusicSpeed();
// 	if (onBeat(1))
// 		p.noiseSeed(p.random());
// 	for (let i = 0; i < totalDots; i++)
// 	{
// 		let dir = p.noise(dots[i].x * pnf, dots[i].y * pnf) * 2 * p.PI;
// 		dots[i].x += p.cos(dir) * speed;
// 		dots[i].y += p.sin(dir) * speed;
// 		if (dots[i].x < 0 || dots[i].x > p.width || dots[i].y < 0 || dots[i].y > p.height)
// 		{
// 			dots[i].x = p.random(0, p.width);
// 			dots[i].y = p.random(0, p.height);
// 		}
// 		p.ellipse(dots[i].x, dots[i].y, 4, 4);
// 	}
// }

// function setupBasicPN(p, player) {
// 	pnf = 0.005;
// 	for (let i = 0; i < totalDots; i++)
// 		dots.push(p.createVector(p.random(0, p.width), p.random(0, p.height)));
// }


let gridSize, rowsN, colsN;
let grid = [];

export function setupTheme3(p, song) {
	pnf = 0.1;
	p.createCanvas(p.windowWidth, p.windowHeight); //p.P2D for anti alias
	p.pixelDensity(p.displayDensity());
	p.background(0);
	gridSize = 20;
	rowsN = p.height / gridSize;
	colsN = p.width / gridSize;
	for (let i = 0; i < totalDots; i++)
	{
		dots.push(p.createVector(p.random(0, p.width), p.random(0, p.height)));
		prevDots.push(p.createVector(dots[i].x, dots[i].y));
	}
}

function getDotDirection(dot){
	const row = Math.max(0, Math.min(rowsN - 1, Math.floor(dot.y / gridSize)));
	const col = Math.max(0, Math.min(colsN - 1, Math.floor(dot.x / gridSize)));
	return grid[row][col];
}

let yoff, xoff, zoff = 0;
export function drawTheme3(p, player)
{
	p.background(0, 10);
	speed = getMusicSpeed();
	if (onBeat(1))
		p.noiseSeed(p.random());
	yoff = 0;
	for (let j = 0; j < rowsN; j++){
		xoff = 0;
		grid[j] = [];
		for (let i = 0; i < colsN; i++){
			grid[j][i] = p.noise(xoff,  yoff, zoff) * 4 * p.PI;
			xoff += pnf;
		}
		yoff += pnf;
		zoff += 0.0001; //controled by speed ...
	}
	for (let i = 0; i < totalDots; i++)
	{
		let dir = getDotDirection(dots[i]);
		dots[i].x += p.cos(dir) * speed + p.random(0, 2);
		dots[i].y += p.sin(dir) * speed + p.random(0, 2);
		bringBackEscapedDots(i, p);
		// bringBackEscapedDots2(i, p);
		p.stroke(255);
		p.strokeWeight(0.1);
		p.line(dots[i].x, dots[i].y, prevDots[i].x, prevDots[i].y);//drwa line instead
		if (dots[i].x == prevDots[i].x)
			console.log(`you fucked up`);
		p.point(dots[i].x, dots[i].y); //drarw dot
		prevDots[i].x = dots[i].x;
		prevDots[i].y = dots[i].y; //so everytime we draw we update prev
	}
}

function getMusicSpeed(){
	return speed;
}

function onBeat(drama){
	return false;
}

function bringBackEscapedDots2(i, p){
	if (dots[i].x < 0 || dots[i].x > p.width || dots[i].y < 0 || dots[i].y > p.height)
		{
			dots[i].x = p.random(0, p.width);
			dots[i].y = p.random(0, p.height);
			prevDots[i].x = dots[i].x;
			prevDots[i].y = dots[i].y;
		}
}

function bringBackEscapedDots(i, p){
	if (dots[i].x < 0)
		{
			dots[i].x = p.width;
			dots[i].y = p.random(0, p.height);
			prevDots[i].y = dots[i].y;
			prevDots[i].x = dots[i].x;
		}
		else if (dots[i].x > p.width)
		{
			dots[i].x = 0;
			dots[i].y = p.random(0, p.height);
			prevDots[i].y = dots[i].y;
			prevDots[i].x = dots[i].x;
		}
		if (dots[i].y < 0)
		{
			dots[i].y = p.height;
			dots[i].x = p.random(0, p.width);
			prevDots[i].y = dots[i].y;
			prevDots[i].x = dots[i].x;

		}
		else if (dots[i].y > p.height)
		{
			dots[i].y = 0;
			dots[i].x = p.random(0, p.width);
			prevDots[i].y = dots[i].y;
			prevDots[i].x = dots[i].x;
		}
}

export function windowResizeTheme4(p) {
    p.resizeCanvas(p.windowWidth, p.windowHeight, p.WEBGL);
	p.pixelDensity(p.displayDensity());
	rowsN = p.height / gridSize;
	colsN = p.width / gridSize;
	grid  = [];
	dots = [];
	prevDots = [];
	for (let i = 0; i < totalDots; i++)
	{
		dots.push(p.createVector(p.random(0, p.width), p.random(0, p.height)));
		prevDots.push(p.createVector(dots[i].x, dots[i].y));
	}
}