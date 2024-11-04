// https://www.youtube.com/watch?v=HmxNrlPx8iY

import resources from './assets/js/Resources.js';
import Sprite from './assets/js/Sprite.js';
import Vector2 from './assets/js/Vector2.js';
import GameLoop from './assets/js/GameLoop.js';
import Input from './assets/js/Input.js';
import { gridCells } from './assets/js/helpers/grid.js';
import GameObject from './assets/js/GameObject.js';
import Hero from './assets/js/objects/Hero/Hero.js';
import Camera from './assets/js/Camera.js';

// Canvas & Context
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

// Establish the root scene
const mainScene = new GameObject({
	position: new Vector2(0, 0)
});

// Create Sprites.
const sky = new Sprite({
	resource: resources.images.sky,
	frameSize: new Vector2(320, 180)
});
const ground = new Sprite({
	resource: resources.images.ground,
	frameSize: new Vector2(320, 180)
});
const hero = new Hero(gridCells(6), gridCells(5));

// Add sprites as children to the main scene.
mainScene.addChild(ground);
mainScene.addChild(hero);

const camera = new Camera();
mainScene.addChild(camera);

// Add an Input class to the main scene.
mainScene.input = new Input();

// Establish update and draw loops.
const update = (delta) => {
	mainScene.stepEntry(delta, mainScene);
};
const draw = () => {
	// Clear anything stale
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	sky.drawImage(ctx, 0, 0);

	// Save the current state (for camera offset)
	ctx.save();

	// Offset by camera position
	ctx.translate(camera.position.x, camera.position.y);

	// Draw objects in the mounted scene
	mainScene.draw(ctx, 0, 0);

	// Restore to original state
	ctx.restore();
};

// Game Start!
const gameLoop = new GameLoop(update, draw);
gameLoop.start();
