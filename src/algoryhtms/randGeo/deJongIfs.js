
let a, b, c, d;
let targetA, targetB, targetC, targetD;
let morphSpeed = 0.01;
let aspectRatioX, aspectRatioY;
let beatFactor = 0;
let range;
let rangeUpdated;
let width, height;
let red, green, blue;
let rounds_it  = 10000;

export function setupTheme2(p, song) {
	p.frameRate(60);
	width = p.windowWidth; //WIDTH OF CANVAS
	height = p.windowHeight; //HEIGHT OF CANVAS
	p.createCanvas(width, height); //p.P2D for anti alias
	setUpCanvas(p);
	p.noStroke();
	a = p.random(-p.PI, p.PI);
	b = p.random(-p.PI, p.PI);
	c = p.random(-p.PI, p.PI);
	d = p.random(-p.PI, p.PI);
	setNewTargets(p);
	red = song.color[0];
	green = song.color[1];
	blue = song.color[2];
	rangeUpdated = false;
	p.pixelDensity(2);
}

function setUpCanvas(p){
	//canvas.position(p.windowWidth / 2 - 200, p.windowHeight / 2 - 200); //POSITION THE CANVAS
	p.pixelDensity(p.displayDensity());
	aspectRatioX = [0, width];
	aspectRatioY = [0, height];
	let min = p.abs(height - width) / 2;
	if (height > width)
		aspectRatioY = [min, height - min];
	else
		aspectRatioX = [min, width - min];
	p.background(0);
}

export function windowResizeTheme2(p) {
	width = p.windowWidth; //UPDATE WIDTH
	height = p.windowHeight; //UPDATE HEIGTH
    p.resizeCanvas(width, height, p.P2D);
    setUpCanvas(p);
}


function fadeTrace(p, song){
	let threshold = 30;
	let val = song.spectralCentroid;
	if (val && val < threshold)
	{
		let f = p.map(val, 10, threshold, 1, 20);
		console.log("update ", f);
		p.background(0, f);
	}
	else
		p.background(0);
}

export function drawTheme2(p, song) {
	range = 2.01;
	morphSpeed = 0.01;
	p.stroke(song.color[0], song.color[1], song.color[2]);
	p.strokeWeight(1.2);
	let pointsX = [], pointsY = [];
	scaleCanvas(p, song);
	fadeTrace(p,song);
	if (!isBoring(pointsX, pointsY, p))
	{
		for (let i = 0; i < rounds_it; i++) {
			let mapX = p.map(pointsX[i], -range, range, aspectRatioX[0], aspectRatioX[1]);
			let mapY = p.map(pointsY[i], -range, range, aspectRatioY[0], aspectRatioY[1]);
			scalePoints(i, p, mapX, mapY);
			p.point(mapX, mapY);
		}
		song.adjustFrameRate(p);
	}
	else
		morphSpeed *= 7;
	a = p.lerp(a, targetA, morphSpeed);
	b = p.lerp(b, targetB, morphSpeed);
	c = p.lerp(c, targetC, morphSpeed);
	d = p.lerp(d, targetD, morphSpeed);
	if (p.abs(a - targetA) < 0.1 && p.abs(b - targetB) < 0.1 && p.abs(c - targetC) < 0.1 & p.abs(d - targetD) < 0.1)
		setNewTargets(p);
}
function scaleCanvas(p, song){
	if (rangeUpdated)
	{
		rangeUpdated = false;
		return ;
	}
	let min = 33;
	let val = song.loudness.total;
	if (val && val > min)
	{
		beatFactor = p.map(val, min, 90, 0, 1.8);
		if (val > min + 10)
		{
			range = p.map(val, min + 10, 100, 2.1, 1.9);
			rangeUpdated = true;
		}
	}
}
function scalePoints(i, p, mapX, mapY){
	if ( beatFactor == 0 || i < (rounds_it * .99))
		return ; 
	let f = beatFactor;
	p.strokeWeight(f * 3);
	p.point(mapX, mapY);
	p.strokeWeight(f);
}
 
function setNewTargets(p) {
	targetA = p.random(-p.PI, p.PI);
	targetB = p.random(-p.PI, p.PI);
	targetC = p.random(-p.PI, p.PI);
	targetD = p.random(-p.PI, p.PI);
}

function isBoring(pointsX, pointsY, p)
{
    if (!Array.isArray(pointsX) || !Array.isArray(pointsY)) {
		console.log(`ERRROR`);
        return true;
    }
	const threshold = 1.5;
	let x = 0, y = 0;
	for (let i = 0; i < rounds_it + 1; i++) {
		let new_x = Math.sin(a * y) - Math.cos(b * x);
		let new_y = Math.sin(c * x) - Math.cos(d * y);
		if (i != 0)
		{
			pointsX.push(new_x);
			pointsY.push(new_y);
		}
		x = new_x;
		y = new_y;
	}
	let minX = Math.min(...pointsX);
	let maxX = Math.max(...pointsX);
	let minY = Math.min(...pointsY);
	let maxY = Math.max(...pointsY);
	if ((maxX - minX) < threshold && (maxY - minY) < threshold) {
		return true;
	}
	const tolerance = 1.5;
	let isSingleDot = true;

	for (let i = 0; i < rounds_it; i++) {
		if (Math.abs(pointsX[i] - pointsX[0]) >= tolerance || Math.abs(pointsY[i] - pointsY[0]) >= tolerance) {
			isSingleDot = false;
			break;
		}
	}
	if (isSingleDot) {
		console.log('single dot...');
		return true;
	}
	return false;
}
