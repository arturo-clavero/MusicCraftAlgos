//import WEBGL
import { scene5pjs } from './algoryhtms/setUp/setUp5pjs.js';
import { sceneWebGl } from './algoryhtms/setUp/setUpWebGL.js';

// Button-to-function mapping
const buttonToFunctionMap = {
	//all these buttons have to have diff names...
	'theme2Button': { theme: 2, sceneType: '5pjs' },
	'theme3Button': { theme: 3, sceneType: '5pjs' },
	'theme4Button': { theme: 4, sceneType: '5pjs' },
};

// Iterate over the button-to-function map and add event listeners dynamically
Object.keys(buttonToFunctionMap).forEach(buttonId => {
    const { theme, sceneType } = buttonToFunctionMap[buttonId];
    document.getElementById(buttonId).addEventListener('click', () => {
		// Hide theme selection buttons after a theme is picked
        document.querySelectorAll('button[id^="theme"]').forEach(button => {
            button.style.display = 'none';
        });
        // Show the start and stop buttons
        document.getElementById('startButton').style.display = 'block';
        document.getElementById('stopButton').style.display = 'block';

		if (sceneType == '5pjs')
			scene5pjs(theme);
		if (sceneType == 'WebGL')
			sceneWebGl(theme);
    });
});
