import Meyda from "meyda"; // Import Meyda

class Song {
	constructor(name) {
		// this.alaysisCount = 0;
		this.location = `../../songs/${name}.mp3`;
		this.audioContext = new (window.AudioContext || window.webkitAudioContext)(); // Create AudioContext
		this.audioElement = new Audio(this.location); // Create audio element
		this.audioSourceNode = this.audioContext.createMediaElementSource(this.audioElement); // Create source node from audio
		this.analyser = this.audioContext.createAnalyser(); // Create analyser
		this.audioSourceNode.connect(this.analyser); // Connect source to analyser
		this.analyser.connect(this.audioContext.destination); // Connect analyser to destination
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
		this.audioElement.play(); // Play the audio
		this.audioElement.currentTime = this.startTime;
		this.isPlaying = true;
		this.strokeFade = 0;
		this.backFade = 0;
		this.fadeoutDone = false;
		console.log(`Song started`);
		this.analyze();
		} else {
		console.log(`Song is already playing`);
		}
	}

	stop() {
		if (this.audioElement && this.isPlaying) {
			this.startTime = this.audioElement.currentTime;
		this.audioElement.pause(); // Pause the audio
		this.isPlaying = false;
		
		console.log(`Song has stopped`);
		} else {
		console.log(`Song was already stopped`);
		}
		if (this.analysisInterval) {
			clearInterval(this.analysisInterval); // Stop the analysis interval
			this.analysisInterval = null; // Reset the reference
			console.log('Analyzer stopped.');
		}
	}

	analyze() {
		const bufferLength = this.analyser.frequencyBinCount;
		const waveform = new Float32Array(bufferLength);

		this.analysisInterval = setInterval(() => {
			this.analyser.getFloatTimeDomainData(waveform);
			const windowedWaveform = Meyda.windowing(waveform, "blackman");
			this.rms = Meyda.extract('rms', waveform);
			this.zcr = Meyda.extract('zcr', windowedWaveform);
			this.energy = Meyda.extract('energy', windowedWaveform);
			this.spectralFlatness = Meyda.extract('spectralFlatness', windowedWaveform);
			this.spectralRollOff = Meyda.extract('spectralRolloff', windowedWaveform);
	
			// Update the previous waveform after processing
			this.spectralCrest = Meyda.extract('spectralCrest', windowedWaveform);
			this.zcr = Meyda.extract('zcr', windowedWaveform);
			this.loudness = Meyda.extract('loudness', windowedWaveform);
			this.perceptualSpread = Meyda.extract('perceptualSpread', windowedWaveform);
			this.perceptualSharpness = Meyda.extract('perceptualSharpness', windowedWaveform);

		}, 1000); // Adjust the interval as needed
	}

	adjustFrameRate(p) {
		if (this.spectralRollOff){
			let energyThreshold = 0.005;
			let newFrameRate = p.map(this.spectralRollOff, 100, 22050, 0, 70);
			//before 0 instead of 100
			//90 is good consider down to 60;
			if (this.energy && this.energy < energyThreshold)
				newFrameRate *= p.map(this.energy, 0, energyThreshold, 0.1, 1);
			p.frameRate(newFrameRate);
		}
		// console.log('energy, ', this.energy);
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

export default Song;

// SLOW :
// let newFrameRate = p.map(this.spectralRollOff, 0, 22050, 0, 90);
// p.frameRate(newFrameRate);