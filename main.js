// https://www.youtube.com/watch?v=HmxNrlPx8iY

import resources from './assets/js/Resources.js';
import Sprite from './assets/js/Sprite.js';
import Vector2 from './assets/js/Vector2.js';
import GameLoop from './assets/js/GameLoop.js';
import Input, { UP, DOWN, LEFT, RIGHT } from './assets/js/Input.js';

// Canvas & Context
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

// Sprites
const sky = new Sprite({
	resource: resources.images.sky,
	frameSize: new Vector2(320, 180)
});
const ground = new Sprite({
	resource: resources.images.ground,
	frameSize: new Vector2(320, 180)
});
const heroPosition = new Vector2(16 * 6, 16 * 5);
const input = new Input();
const hero = new Sprite({
	resource: resources.images.hero,
	frameSize: new Vector2(32, 32),
	hFrames: 3,
	vFrames: 8,
	frame: 1
});
const shadow = new Sprite({
	resource: resources.images.shadow,
	frameSize: new Vector2(32, 32)
});

// Updating entities in the game
const update = () => {
	if (input.direction === UP) {
		heroPosition.y -= 1;
		hero.frame = 6;
	}
	if (input.direction === DOWN) {
		heroPosition.y += 1;
		hero.frame = 0;
	}
	if (input.direction === LEFT) {
		heroPosition.x -= 1;
		hero.frame = 9;
	}
	if (input.direction === RIGHT) {
		heroPosition.x += 1;
		hero.frame = 3;
	}
};

// Canvas Draw
const draw = () => {
	sky.drawSprite(ctx, 0, 0);
	ground.drawSprite(ctx, 0, 0);

	// Center the Hero in the cell
	const heroOffset = new Vector2(-8, -21);
	const heroPositionX = heroPosition.x + heroOffset.x;
	const heroPositionY = heroPosition.y + 1 + heroOffset.y;

	shadow.drawSprite(ctx, heroPositionX, heroPositionY);
	hero.drawSprite(ctx, heroPositionX, heroPositionY);
};

// Game Loop
const gameLoop = new GameLoop(update, draw);
gameLoop.start();
