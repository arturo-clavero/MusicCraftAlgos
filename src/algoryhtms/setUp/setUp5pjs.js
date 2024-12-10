import p5 from 'p5';
import * as Tone from 'tone';
import Song from "../utils/tone.js"
import { setupTheme1, drawTheme1 } from "../randGeo/lissajousCurves.js";
import { setupTheme2, drawTheme2, windowResizeTheme2 } from "../randGeo/deJongIfs.js";
import { setupTheme3, drawTheme3 } from "../flow/perlinNoise.js";
import { setupTheme4, drawTheme4 } from "../flow/mountains.js";


export function scene5pjs(theme) {
	const song = new Song(`song1`);
	new p5((p) => {
		p.setup = () => {
		p.pixelDensity(2);
		switch (theme) {
			case 1:
			setupTheme1(p, song);
			break;
			case 2:
			setupTheme2(p, song);
			break;
			case 3:
				setupTheme3(p, song);
			break;
			case 4:
				setupTheme4(p, song);
			break;
			default:
			console.error('Error: invalid theme...');
		}
		};
		p.draw = () => {
			if (song.isPlaying)
			{
				switch (theme) {
					case 1:
						drawTheme1(p, song);
					break;
					case 2:
						drawTheme2(p, song);
					break;
					case 3:
						drawTheme3(p, song);
					break;
					case 4:
						drawTheme4(p, song);
					break;
					default:
					console.error('Error: invalid theme...');
				}
			}
		};
		document.getElementById('startButton').addEventListener('click', () => {
		Tone.start().then(() => {
			song.start();
		});
		document.getElementById('stopButton').addEventListener('click', () => {
			song.stop();
		});
		window.addEventListener('beforeunload', () => {
			song.stop();
		});
		window.addEventListener('resize', ()=>{
			switch (theme) {
				// case 1:
				// 	windowResizeTheme1(p);
				// break;
				case 2:
					windowResizeTheme2(p);
				break;
				// case 3:
				// 	windowResizeTheme3(p);
				// break;
				// default:
				console.error('Error: invalid theme...');
			}
		});

	});
})};
