
let waveHeight;
let gridSize, rowsN, colsN;
let pnf = 0.005;
let moveY = 0;
let yoff, xoff, zoff = 0;

export function setupTheme4(p, song) {
	p.createCanvas(p.windowWidth, p.windowHeight, p.WEBGL); //p.P2D for anti alias
	p.pixelDensity(p.displayDensity());
	pnf = 0.02;
	gridSize = 10;
	rowsN = p.floor(p.height / gridSize);
	colsN = p.floor((p.width / gridSize) * 1.5);
	waveHeight = 50;
}

export function drawTheme4(p, song){
	p.background(0);
	p.strokeWeight(0.1);
	p.stroke(255);
	p.fill(0);
	p.translate(-p.width * 0.5, -p.height / 4);
	p.rotateX(p.PI / 3);
	moveY += 0.1;
	pnf = 0.1;
	yoff = moveY;
	for (let j = 0; j < rowsN - 1; j++)
	{
		xoff = 0;
		p.beginShape(p.TRIANGLE_STRIP);
		for (let i = 0; i < colsN; i++){
			let z1 = p.map(p.noise(xoff, yoff, zoff), 0, 1, -waveHeight, waveHeight);
			p.vertex(i * gridSize, j * gridSize, z1);
			p.vertex(i * gridSize, (j + 1 )* gridSize,  p.map(p.noise(xoff, yoff + pnf, zoff), 0, 1, -waveHeight, waveHeight));//, waveHeight);
			xoff += pnf;
		}
		p.endShape();
		yoff += pnf;
		zoff += 0.001;
	}
	
}

export function windowResizeTheme4(p) {
    p.resizeCanvas(p.windowWidth, p.windowHeight, p.WEBGL);
	rowsN = p.floor(p.height / gridSize);
	colsN = p.floor((p.width / gridSize) * 1.5);
	p.pixelDensity(p.displayDensity());

}