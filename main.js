// https://www.youtube.com/watch?v=HmxNrlPx8iY

import resources from './assets/js/Resources.js';
import Sprite from './assets/js/Sprite.js';
import Vector2 from './assets/js/Vector2.js';
import GameLoop from './assets/js/GameLoop.js';
import Input, { UP, DOWN, LEFT, RIGHT } from './assets/js/Input.js';
import { gridCells, isSpaceFree } from './assets/js/helpers/grid.js';
import { moveTowards } from './assets/js/helpers/moveTowards.js';
import { walls } from './assets/js/levels/level1.js';
import Animations from './assets/js/Animations.js';
import FrameIndexPattern from './assets/js/FrameIndexPattern.js';
import {
	WALK_DOWN,
	WALK_LEFT,
	WALK_RIGHT,
	WALK_UP,
	STAND_DOWN,
	STAND_LEFT,
	STAND_RIGHT,
	STAND_UP
} from './assets/js/objects/Hero/heroAnimations.js';

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
const input = new Input();
const hero = new Sprite({
	resource: resources.images.hero,
	frameSize: new Vector2(32, 32),
	hFrames: 3,
	vFrames: 8,
	frame: 1,
	position: new Vector2(gridCells(6), gridCells(5)),
	animations: new Animations({
		walkDown: new FrameIndexPattern(WALK_DOWN),
		walkUp: new FrameIndexPattern(WALK_UP),
		walkLeft: new FrameIndexPattern(WALK_LEFT),
		walkRight: new FrameIndexPattern(WALK_RIGHT),
		standDown: new FrameIndexPattern(STAND_DOWN),
		standUp: new FrameIndexPattern(STAND_UP),
		standLeft: new FrameIndexPattern(STAND_LEFT),
		standRight: new FrameIndexPattern(STAND_RIGHT)
	})
});
const heroDestinationPosition = hero.position.duplicate();
let heroFacing = DOWN;
const shadow = new Sprite({
	resource: resources.images.shadow,
	frameSize: new Vector2(32, 32)
});

// Updating entities in the game
const update = (delta) => {
	const distance = moveTowards(hero, heroDestinationPosition, 1);

	// Attempt to move again if the hero is at his position
	const hasArrived = distance <= 1;
	if (hasArrived) {
		tryMove();
	}

	// Work on hero animations
	hero.step(delta);
};

const tryMove = () => {
	if (!input.direction) {
		switch (heroFacing) {
			case LEFT:
				hero.animations.play('standLeft');
				break;
			case RIGHT:
				hero.animations.play('standRight');
				break;
			case UP:
				hero.animations.play('standUp');
				break;
			case DOWN:
				hero.animations.play('standDown');
				break;
			default:
				break;
		}

		return;
	}

	let nextX = heroDestinationPosition.x;
	let nextY = heroDestinationPosition.y;
	const gridSize = 16;

	if (input.direction === DOWN) {
		nextY += gridSize;
		hero.animations.play('walkDown');
	}
	if (input.direction === UP) {
		nextY -= gridSize;
		hero.animations.play('walkUp');
	}
	if (input.direction === LEFT) {
		nextX -= gridSize;
		hero.animations.play('walkLeft');
	}
	if (input.direction === RIGHT) {
		nextX += gridSize;
		hero.animations.play('walkRight');
	}

	heroFacing = input.direction ?? heroFacing;

	if (isSpaceFree(walls, nextX, nextY)) {
		heroDestinationPosition.x = nextX;
		heroDestinationPosition.y = nextY;
	}
};

// Canvas Draw
const draw = () => {
	sky.drawSprite(ctx, 0, 0);
	ground.drawSprite(ctx, 0, 0);

	// Center the Hero in the cell
	const heroOffset = new Vector2(-8, -21);
	const heroPositionX = hero.position.x + heroOffset.x;
	const heroPositionY = hero.position.y + 1 + heroOffset.y;

	shadow.drawSprite(ctx, heroPositionX, heroPositionY);
	hero.drawSprite(ctx, heroPositionX, heroPositionY);
};

// Game Loop
const gameLoop = new GameLoop(update, draw);
gameLoop.start();
