import Meyda from "meyda"; // Import Meyda

class Song {
	constructor(name) {
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
	}

	start() {
		if (!this.isPlaying) {
			if (this.startTime >= this.audioElement.duration)
				this.startTime = 0;
		this.audioElement.play(); // Play the audio
		this.audioElement.currentTime = this.startTime;
		this.isPlaying = true;
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
		if (this.analysisInterval) {
			clearInterval(this.analysisInterval); // Stop the analysis interval
			this.analysisInterval = null; // Reset the reference
			console.log('Analyzer stopped.');
		}
		console.log(`Song has stopped`);
		} else {
		console.log(`Song was already stopped`);
		}
	}

	analyze() {
		const bufferLength = this.analyser.frequencyBinCount;
		const waveform = new Float32Array(bufferLength);

		this.analysisInterval = setInterval(() => {
			this.analyser.getFloatTimeDomainData(waveform);
			const windowedWaveform = Meyda.windowing(waveform, "blackman");
			this.rms = Meyda.extract('rms', windowedWaveform);
			this.zcr = Meyda.extract('zcr', windowedWaveform);
			this.energy = Meyda.extract('energy', windowedWaveform);
			this.spectralFlatness = Meyda.extract('spectralFlatness', windowedWaveform);
			this.spectralRollOff = Meyda.extract('spectralRolloff', waveform);

		}, 1000); // Adjust the interval as needed
	}

	adjustFrameRate(p) {
		if (this.spectralRollOff){
			let newFrameRate = p.map(this.spectralRollOff, 0, 22050, 0, 90);
			//90 is good consider down to 60;
			p.frameRate(newFrameRate);
		}
		// console.log('energy, ', this.energy);
	}
}

export default Song;

// SLOW :
// let newFrameRate = p.map(this.spectralRollOff, 0, 22050, 0, 90);
// p.frameRate(newFrameRate);