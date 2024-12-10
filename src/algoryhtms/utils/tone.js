
import * as Tone from 'tone';

class Song {
	constructor(name){
		this.location = `../../songs/${name}.mp3`;
		this.player = new Tone.Player(this.location , () => {
			console.log('Player loaded successfully!');
		  }).toDestination();
		this.isPlaying = false;
		this.analyser = new Tone.Analyser("waveform", 256);
		this.player.connect(this.analyser);
	}
	start()
	{
		if (!this.isPlaying)
		{
			if (this.player.buffer && this.player.buffer.loaded)
			{
				this.player.start();
				this.isPlaying = true;
				console.log(`song started`);
			}
			else
				console.error('Player is not loaded yet!');
		}
		else
			console.log(`song is already playing`);
	}
	stop()
	{
		if (this.player && this.isPlaying)
		{
			this.player.stop();
			this.isPlaying = false;
			console.log(`has stopped`);
		}
		else
			console.log(`song was already stopped`);
	}
	// getEnergy(){
	// 	let waveform = this.analyser.getValue();
	// 	return(waveform.reduce((sum, val) => sum + Math.abs(val), 0) / waveform.length);
	// }
	// getPitch(){
	// 	const fftData = this.analyser.getValue();
    // 	let sum = 0;
    // 	let totalAmplitude = 0;
	// 	for (let i = 0; i < fftData.length; i++) {
	// 		const amplitude = Math.abs(fftData[i]);
	// 		const frequency = (i / fftData.length) * Tone.context.sampleRate / 2;
	// 		sum += frequency * amplitude;
	// 		totalAmplitude += amplitude;
	// 	}
	// 	const pitch = sum / totalAmplitude;
	// }
	// pitchToColor(r, g, b){
	// 	console.log(`pitcht to color`);
	// 	const hue = (Tone.Frequency(this.getPitch()).toFrequency() % 360);
	// 	hueToRGB(hue, r, g, b);
	// }
}

export default Song;

//COLORS
function hueToRGB(hue, r, g, b) {
	let h = hue;
	let  s = 1.0;
	let v = 1.0;
	h = h % 360;
	let c = v * s;
	let x = c * (1 - Math.abs((h / 60) % 2 - 1));
	let m = v - c;
	if (0 <= h && h < 60) {
		r = c; g = x; b = 0;
	} else if (60 <= h && h < 120) {
		r = x; g = c; b = 0;
	} else if (120 <= h && h < 180) {
		r = 0; g = c; b = x;
	} else if (180 <= h && h < 240) {
		r = 0; g = x; b = c;
	} else if (240 <= h && h < 300) {
		r = x; g = 0; b = c;
	} else if (300 <= h && h < 360) {
		r = c; g = 0; b = x;
	}
	r = Math.round((r + m) * 255);
	g = Math.round((g + m) * 255);
	b = Math.round((b + m) * 255);
 }
