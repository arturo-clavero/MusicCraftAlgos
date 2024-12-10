import * as THREE from "three";
import p5 from 'p5';
import { setupTheme1, drawTheme1 } from "../prototypes/randGeo/lissajousCurves.js";
import { setupTheme2, drawTheme2 } from "../prototypes/randGeo/deJongIfs.js";
import { setupTheme3, drawTheme3 } from "../prototypes/flow/perlinNoise.js";

class p5jsEngine {
	constructor(song, theme)
	{
		this.isPlaying = false;
		this.analyser = new Tone.Analyser("waveform", 256);
		this.player = new Tone.Player(`../../${song}.mp3`).toDestination();
		this.player.connect(this.analyser);
		switch (theme){
			case 1:
				this.setUp = setupTheme1;
				this.draw = drawTheme1;
				break;
			// case 2:
			// 	this.setUp = setupTheme2;
			// 	this.draw = drawTheme2;
			// 	break;
		}
	}
	listen (){
		document.getElementById('startButton').addEventListener('click', () => {
			Tone.start().then(() => {
			  if (!this.isPlaying) {
				if (this.player.buffer && this.player.buffer.loaded) {
				  this.player.start();
				  this.isPlaying = true;
			    } else {
			      console.error('Player is not loaded yet!');
			    }
			  }
			}).catch((err) => console.error('Error starting Tone.js:', err));
		  });
		  document.getElementById('stopButton').addEventListener('click', () => {
			if (player && isPlaying) {
			  this.player.stop();
			 this.isPlaying = false;
			}
		  });
		  window.addEventListener('beforeunload', () => {
			if (this.player && this.isPlaying) {
			  this.player.stop();
			  this.isPlaying = false;
			}
		  });
	}
}

export default p5jsEngine;
