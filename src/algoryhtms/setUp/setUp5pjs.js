import p5 from 'p5';
import Song from "../utils/meyda.js"
import { setupTheme1, drawTheme1 } from "../randGeo/lissajousCurves.js";
import { setupTheme2, drawTheme2, windowResizeTheme2 } from "../randGeo/deJongIfs.js";
import { setupTheme3, drawTheme3 } from "../flow/perlinNoise.js";
import { setupTheme4, drawTheme4 } from "../flow/mountains.js";


export function scene5pjs(theme) {
	let sliderTrack = document.getElementById('sliderTrack');
	let sliderThumb = document.getElementById('sliderThumb');
	let isDragging = false;
	let animationStarted = false;
	const song = new Song(`swan`);
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
			console.log(song.audioElement.currentTime, song.audioElement.duration);
			if (song.audioElement.currentTime >= song.audioElement.duration)
			{
				console.log('hello');
				fadeToBlack(p);
			}
			else if (song.isPlaying && (animationStarted || (song.energy && song.energy > 0.0001)))
			{
				animationStarted = true;
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
			song.start();
			fade = 0;
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
		const updateSliderFromMouse = (event) => {
			const rect = sliderTrack.getBoundingClientRect();
			const mouseX = Math.max(0, Math.min(event.clientX - rect.left, rect.width));
			const percentage = mouseX / rect.width;
			sliderThumb.style.left = `${percentage * 100}%`;
			console.log(percentage * song.audioElement.duration);
			song.startTime = percentage * song.audioElement.duration;
			song.isPlaying = false;
			song.start();
		};
		sliderThumb.addEventListener('mousedown', () => {
			isDragging = true;
		});
		document.addEventListener('mousemove', (event) => {
			if (isDragging) {
				updateSliderFromMouse(event);
			}
		});
		document.addEventListener('mouseup', () => {
			isDragging = false;
		});
		sliderTrack.addEventListener('click', updateSliderFromMouse);
	});
};

let fade = 0;

function fadeToBlack(p){
	fade += 0.05;
	if (fade > 255)
		return;
	p.fill(0, fade);
	p.noStroke();
	p.rect(0, 0, p.width, p.height);
}