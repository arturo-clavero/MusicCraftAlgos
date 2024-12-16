import Meyda from "meyda"; // Import Meyda
const windowingFunctions = ["blackman", "sine", "hanning", "hamming", "rect"]; 
const REAL_DEFAULTS = {
	color: [255, 255, 255],
	amplitudeSensitivity: 1,
	frequencySensitivity: 1,
  };

class Song {
	constructor(name, parametersString) {
		this.location = `../../songs/${name}.mp3`; //UPDATE TO URL ....
		let parsedParameters = JSON.parse(parametersString);
		  this.color =
			parsedParameters.color === "default" || !parsedParameters.color
			  ? REAL_DEFAULTS.color
			  :  parseHexToRGB(parsedParameters.color);;
		  this.amplitudeSensitivity =
			parsedParameters.amplitudeSensitivity === "default" || !parsedParameters.amplitudeSensitivity
			  ? REAL_DEFAULTS.amplitudeSensitivity
			  : parseSensitivity(parsedParameters.amplitudeSensitivity);
		  this.frequencySensitivity =
			parsedParameters.frequencySensitivity === "default" || !parsedParameters.frequencySensitivity
			  ? REAL_DEFAULTS.frequencySensitivity
			  : parseSensitivity(parsedParameters.frequencySensitivity);
		this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
		this.audioElement = new Audio(this.location);
		this.audioSourceNode = this.audioContext.createMediaElementSource(this.audioElement);
		this.analyser = this.audioContext.createAnalyser(); 
		this.audioSourceNode.connect(this.analyser);
		this.analyser.connect(this.audioContext.destination);
		this.isPlaying = false;
		this.buffer = null;
		this.startTime = 0;
		this.strokeFade = 0;
		this.backFade = 0;
	}

	start() {
		if (!this.isPlaying) {
			if (this.startTime >= this.audioElement.duration)
				this.startTime = 0;
		this.audioElement.currentTime = this.startTime;
		this.isPlaying = true;
		this.strokeFade = 0;
		this.backFade = 0;
		this.fadeoutDone = false;
		console.log(`Song started`);
		this.analyze();
		this.audioElement.play(); // Play the audio

		} else {
		console.log(`Song is already playing`);
		}
	}

	stop() {
		if (this.audioElement && this.isPlaying) {
			this.startTime = this.audioElement.currentTime;
		this.audioElement.pause();
		this.isPlaying = false;
		
		console.log(`Song has stopped`);
		} else {
		console.log(`Song was already stopped`);
		}
		if (this.analysisInterval) {
			clearInterval(this.analysisInterval);
			this.analysisInterval = null;
			console.log('Analyzer stopped.');
		}
	}
	analyze() {
		const bufferLength = this.analyser.frequencyBinCount;
		const waveform = new Float32Array(bufferLength);
		const performAnalysis = () => {
			this.analyser.getFloatTimeDomainData(waveform);
			const amplitudeWaveform = Meyda.windowing(waveform, windowingFunctions[this.amplitudeSensitivity - 1]);
			const frequencyWaveform = Meyda.windowing(waveform,  windowingFunctions[this.frequencySensitivity - 1]);
			this.energy = Meyda.extract('energy', amplitudeWaveform);
			this.spectralRollOff = Meyda.extract('spectralRolloff', frequencyWaveform);
			this.spectralCentroid = Meyda.extract('spectralCentroid', frequencyWaveform);
			this.loudness = Meyda.extract('loudness', amplitudeWaveform);
		};
		performAnalysis();
		this.analysisInterval = setInterval(performAnalysis, 1000);
	}
	adjustFrameRate(p) {
		if (this.spectralRollOff){
			let energyThreshold = 0.005;
			let newFrameRate = p.map(this.spectralRollOff, 100, 22050, 0, 80);
			if (this.energy && this.energy < energyThreshold)
				newFrameRate *= p.map(this.energy, 0, energyThreshold, 0.1, 1);
			p.frameRate(newFrameRate);
		}
	}
	getStrokeFadeOut(){
		if (this.audioElement.currentTime < this.audioElement.duration - 5)
			return 255;
		this.strokeFade += 0.001;
		if (this.strokeFade > 1)
			return 255;
		console.log('fade', 255 - (this.strokeFade * 255));
		return (255 - (this.strokeFade * 255));
	}

	backgroundFadeout(p){
		this.backFade += 0.00003;
		if (this.backFade > 1)
		{
			console.log("fadeout is done");
			this.fadeoutDone = true;
			this.stop();
			return;
		}
		p.fill(0, (this.backFade * 255));
		p.noStroke();
		p.rect(0, 0, p.width, p.height);
	}
}

function parseSensitivity(x){
	if (x != 1 && x != 2 && x != 3 && x != 4 && x != 5)
		return 1;
	return x;
}

function parseHexToRGB(hex){
	if (hex.startsWith("#") && hex.length === 7) {
		const r = parseInt(hex.slice(1, 3), 16);
		const g = parseInt(hex.slice(3, 5), 16);
		const b = parseInt(hex.slice(5, 7), 16);
		return [r, g, b];
	  }
	  return REAL_DEFAULTS.color;
}

export default Song;
