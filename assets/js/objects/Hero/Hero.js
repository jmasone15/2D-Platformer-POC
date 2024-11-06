import GameObject from '../../GameObject.js';
import { DOWN, UP, LEFT, RIGHT } from '../../Input.js';
import Vector2 from '../../Vector2.js';
import Sprite from '../../Sprite.js';
import resources from '../../Resources.js';
import { walls } from '../../levels/level1.js';
import { isSpaceFree } from '../../helpers/grid.js';
import { moveTowards } from '../../helpers/moveTowards.js';
import Animations from '../../Animations.js';
import FrameIndexPattern from '../../FrameIndexPattern.js';
import {
	WALK_DOWN,
	WALK_UP,
	WALK_LEFT,
	WALK_RIGHT,
	STAND_DOWN,
	STAND_LEFT,
	STAND_RIGHT,
	STAND_UP,
	PICK_UP_DOWN
} from './heroAnimations.js';
import { events } from '../../Event.js';

export default class Hero extends GameObject {
	constructor(x, y) {
		super({
			position: new Vector2(x, y)
		});

		const shadow = new Sprite({
			resource: resources.images.shadow,
			frameSize: new Vector2(32, 32),
			position: new Vector2(-8, -19)
		});
		this.addChild(shadow);

		this.facingDirection = DOWN;
		this.destinationPosition = this.position.duplicate();
		this.itemPickupTime = 0;
		this.itemPickupShell = null;
		this.body = new Sprite({
			resource: resources.images.hero,
			frameSize: new Vector2(32, 32),
			hFrames: 3,
			vFrames: 8,
			frame: 1,
			position: new Vector2(-8, -20),
			animations: new Animations({
				walkDown: new FrameIndexPattern(WALK_DOWN),
				walkUp: new FrameIndexPattern(WALK_UP),
				walkLeft: new FrameIndexPattern(WALK_LEFT),
				walkRight: new FrameIndexPattern(WALK_RIGHT),
				standDown: new FrameIndexPattern(STAND_DOWN),
				standUp: new FrameIndexPattern(STAND_UP),
				standLeft: new FrameIndexPattern(STAND_LEFT),
				standRight: new FrameIndexPattern(STAND_RIGHT),
				pickUpDown: new FrameIndexPattern(PICK_UP_DOWN)
			})
		});
		this.addChild(this.body);

		// React to picking up an item
		events.on('HERO_PICKS_UP_ITEM', this, (data) => {
			this.onPickupItem(data);
		});
	}

	tryMove(root) {
		const { input } = root;

		if (!input.direction) {
			switch (this.facingDirection) {
				case LEFT:
					this.body.animations.play('standLeft');
					break;
				case RIGHT:
					this.body.animations.play('standRight');
					break;
				case UP:
					this.body.animations.play('standUp');
					break;
				case DOWN:
					this.body.animations.play('standDown');
					break;
				default:
					break;
			}

			return;
		}

		let nextX = this.destinationPosition.x;
		let nextY = this.destinationPosition.y;
		const gridSize = 16;

		if (input.direction === DOWN) {
			nextY += gridSize;
			this.body.animations.play('walkDown');
		}
		if (input.direction === UP) {
			nextY -= gridSize;
			this.body.animations.play('walkUp');
		}
		if (input.direction === LEFT) {
			nextX -= gridSize;
			this.body.animations.play('walkLeft');
		}
		if (input.direction === RIGHT) {
			nextX += gridSize;
			this.body.animations.play('walkRight');
		}

		this.facingDirection = input.direction ?? this.facingDirection;

		if (isSpaceFree(walls, nextX, nextY)) {
			this.destinationPosition.x = nextX;
			this.destinationPosition.y = nextY;
		}
	}

	step(delta, root) {
		// Lock movement if celebrating an item pickup
		if (this.itemPickupTime > 0) {
			this.workOnItemPickup(delta);
			return;
		}

		const distance = moveTowards(this, this.destinationPosition, 1);

		// Attempt to move again if the hero is at his position
		const hasArrived = distance <= 1;
		if (hasArrived) {
			this.tryMove(root);
		}

		this.tryEmitPosition();
	}

	tryEmitPosition() {
		if (this.lastX === this.position.x && this.lastY === this.position.y) {
			return;
		}

		this.lastX = this.position.x;
		this.lastY = this.position.y;

		events.emit('HERO_POSITION', this.position);
	}

	workOnItemPickup(delta) {
		this.itemPickupTime -= delta;
		this.body.animations.play('pickUpDown');

		if (this.itemPickupTime <= 0) {
			this.itemPickupShell.destroy();
		}
	}

	onPickupItem({ image, position }) {
		// Make sure we land right on the item
		this.destinationPosition = position.duplicate();

		// Start the pickup animation
		this.itemPickupTime = 1000;

		this.itemPickupShell = new GameObject({});
		this.itemPickupShell.addChild(
			new Sprite({
				resource: image,
				position: new Vector2(0, -18)
			})
		);
		this.addChild(this.itemPickupShell);
	}
}
