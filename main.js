// https://www.youtube.com/watch?v=HmxNrlPx8iY

import resources from './assets/js/Resources.js';

const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

const draw = () => {
	const sky = resources.images.sky;
	if (sky.isLoaded) {
		ctx.drawImage(sky.image, 0, 0);
	}
};

setInterval(() => {
	console.log('draw');
	draw();
}, 300);
