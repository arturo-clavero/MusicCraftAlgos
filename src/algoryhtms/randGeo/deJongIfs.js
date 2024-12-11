
let a, b, c, d;
let targetA, targetB, targetC, targetD;
let morphSpeed = 0.01;
let aspectRatioX, aspectRatioY;

function setUpCanvas(p){
	p.pixelDensity(p.displayDensity());
	aspectRatioX = [0, p.width];
	aspectRatioY = [0, p.height];
	let min = p.abs(p.height - p.width) / 2;
	if (p.height > p.width)
		aspectRatioY = [min, p.height - min];
	else
		aspectRatioX = [min, p.width - min];
	p.background(0);
	//p.smooth(); 
    //canvas.position(p.windowWidth / 2 - 200, p.windowHeight / 2 - 200);
}

export function setupTheme2(p, song) {
	p.frameRate(30);
	p.createCanvas(p.windowWidth, p.windowHeight, p.P2D); //p.P2D for anti alias
	setUpCanvas(p);
	p.noStroke(); //COULD CHANGE
	a = p.random(-p.PI, p.PI);
	b = p.random(-p.PI, p.PI);
	c = p.random(-p.PI, p.PI);
	d = p.random(-p.PI, p.PI);
	setNewTargets(p);
	red = 255;
	green = 255;
	blue = 255;
}

function update_color(p, song)
{
	console.log("update color");
	song.pitchToColor(red, green, blue);
	p.stroke(red, green, blue);
}

let red, green, blue;
let rounds_it  = 5000;
export function drawTheme2(p, song) {
	p.background(0);
	p.stroke(red, green, blue);
	let pointsX = [], pointsY = [];
	let x = 0, y = 0;
	isBoring(pointsX, pointsY, p);
	for (let i = 0; i < rounds_it; i++) {
		let mapX = p.map(pointsX[i], -2.1, 2.1, aspectRatioX[0], aspectRatioX[1]);
		let mapY = p.map(pointsY[i], -2.1, 2.1, aspectRatioY[0], aspectRatioY[1]);
		p.point(mapX, mapY);
	}
	song.adjustFrameRate(p);
	a = p.lerp(a, targetA, morphSpeed);
	b = p.lerp(b, targetB, morphSpeed);
	c = p.lerp(c, targetC, morphSpeed);
	d = p.lerp(d, targetD, morphSpeed);
	if (p.abs(a - targetA) < 0.1 && p.abs(b - targetB) < 0.1 && p.abs(c - targetC) < 0.1 & p.abs(d - targetD) < 0.1)
		setNewTargets(p);
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
        return ;
    }
	const threshold = 0.05;
	//0.06 ok could be lower
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
		console.log('min max...');
		p.stroke(255, 0, 0);
		return true;
	}
	const tolerance = 0.09;
	let isSingleDot = true;

	for (let i = 0; i < rounds_it; i++) {
		if (Math.abs(pointsX[i] - pointsX[0]) >= tolerance || Math.abs(pointsY[i] - pointsY[0]) >= tolerance) {
			isSingleDot = false;
			break;
		}
	}
	if (isSingleDot) {
		console.log('single dot...');
		p.stroke(0, 0, 255);
		return true;
	}
	return false;
}

export function windowResizeTheme2(p) {
    p.resizeCanvas(p.windowWidth, p.windowHeight, p.P2D);
    setUpCanvas(p);
}