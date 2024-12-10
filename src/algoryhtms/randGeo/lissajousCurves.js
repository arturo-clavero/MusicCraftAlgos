let analyser;
let smoothedSpeed = 1.0; 

export function drawWorm1(p, player) {
	// p.background(0, 70);
	p.translate(p.width/2, p.height/2);
	const audioData = analyser.getValue();
	const energy = audioData.reduce((sum, val) => sum + Math.abs(val), 0) / audioData.length;
	const targetSpeed = p.map(energy, 0, 1, 0.6, 0.7);
	smoothedSpeed = p.lerp(smoothedSpeed, targetSpeed, 0.05);
	let rate = p.radians(p.frameCount * smoothedSpeed) *0.7;//or 0.6 or 0.5 ...
	//rates should be further multiplied either in sin cos or both by any random number to create the curves ....
	//if both are multiplied, these nums should not be equal otherwise its just a boring circle
	//better said num is under 1 as we dont wanna make it too jarry
	let wave1 = p.map(p.sin(rate * 0.8), -1, 1, -170, 170); 
	let wave2 = p.map(p.cos(rate), -1, 1, -170, 170);
	p.ellipse(wave1, wave2, 50, 50);
}

export function drawCourtains1(p, player) {
	p.translate(p.width/2, p.height/2);
	const audioData = analyser.getValue();
	const energy = audioData.reduce((sum, val) => sum + Math.abs(val), 0) / audioData.length;
	const targetSpeed = p.map(energy, 0, 1, 0.5, 1.3);
	smoothedSpeed = p.lerp(smoothedSpeed, targetSpeed, 0.07);
	let rate = p.radians(p.frameCount * smoothedSpeed) * 1.5;//or 0.6 or 0.5 ...
	p.noStroke();
	for (let i = 0; i < 200; i++){//this 200 could be higher or as low as 50
	let wave1 = p.map(p.sin(rate * 0.8 + p.radians(i)), -1, 1, -170, 170); 
	let wave2 = p.map(p.cos(rate + p.radians(i)), -1, 1, -170, 170);
	p.ellipse(wave1, wave2, 0.51, 0.51);
	}
}

export function drawLines(p, player) {
	p.background(0, 20);
	p.translate(p.width/2, p.height/2);
	const audioData = analyser.getValue();
	const energy = audioData.reduce((sum, val) => sum + Math.abs(val), 0) / audioData.length;
	const targetSpeed = p.map(energy, 0, 1, 0.9, 1.0);
	smoothedSpeed = p.lerp(smoothedSpeed, targetSpeed, 0.05);
	p.noStroke();
	for (let i = 0; i < 200; i++){//this 200 could be higher or as low as 50
		let random = p.map(p.sin(p.radians(p.frameCount)), -1, 1, -100, 100);//or 0.6 or 0.5 ...
		let wave1 = p.map(p.tan(p.radians(p.frameCount * smoothedSpeed * 0.8 + i + random)), -1, 1, -10, 10); 
		let wave2 = p.map(p.cos(p.radians(p.frameCount * smoothedSpeed + i) ), -1, 1, -100, 100);
		let color = p.map(p.sin(p.radians(p.frameCount * smoothedSpeed * 3.0 + i)), -1, 1, 0, 255);
		p.fill(color);
		p.rect(wave1, wave2, 10, 10 );
	}
}

export function drawTan(p, player) {
	p.translate(p.width/2, p.height/2);
	const audioData = analyser.getValue();
	const energy = audioData.reduce((sum, val) => sum + Math.abs(val), 0) / audioData.length;
	const targetSpeed = p.map(energy, 0, 1, 0.9, 1.0);
	smoothedSpeed = p.lerp(smoothedSpeed, targetSpeed, 0.05);
	p.noStroke();
	for (let i = 0; i < 200; i++){//this 200 could be higher or as low as 50
		let random = p.map(p.sin(p.radians(p.frameCount)), -1, 1, -100, 100);//or 0.6 or 0.5 ...
		let wave1 = p.map(p.tan(p.radians(p.frameCount * smoothedSpeed * 0.8 + i + random)), -1, 1, -10, 10); 
		let wave2 = p.map(p.cos(p.radians(p.frameCount * smoothedSpeed + i) ), -1, 1, -100, 100);
		let color = p.map(p.sin(p.radians(p.frameCount * smoothedSpeed * 3.0 + i)), -1, 1, 0, 255);
		p.fill(color);
		p.rect(wave1, wave2, 10, 10);
	}
}
//''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''NEXT''''''''''''''''/

export function setupTheme1(p, player) {
	p.createCanvas(400, 400, p.P2D); //p.P2D for anti alias
	analyser = new Tone.Analyser('waveform', 256);
	player.connect(analyser);
}

export function drawTheme1(p, player) {
	//remix here
}