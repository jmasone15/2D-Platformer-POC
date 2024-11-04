import Vector2 from './Vector2.js';

export default class GameObject {
	constructor({ position }) {
		this.position = position ?? new Vector2(0, 0);
		this.children = [];
	}

	// First entry point of the loop
	stepEntry(delta, root) {
		// Call updates on all children first
		this.children.forEach((child) => child.stepEntry(delta, root));

		// Call any implemented Step code.
		this.step(delta, root);
	}

	// Called one every frame
	step(_delta) {
		// ...
	}

	// Draw Entry
	draw(ctx, x, y) {
		// My attempt at fixing the stuttering of hero
		const drawPosX = Math.round(x + this.position.x);
		const drawPosY = Math.round(y + this.position.y);

		// Render Image
		this.drawImage(ctx, drawPosX, drawPosY);

		// Pass on to children
		this.children.forEach((child) => child.draw(ctx, drawPosX, drawPosY));
	}

	drawImage(draw, drawPosX, drawPosY) {
		// ...
	}

	// Other Game Objects are nestable inside this one
	addChild(gameObject) {
		this.children.push(gameObject);
	}

	removeChild(gameObject) {
		this.children = this.children.filter((g) => {
			return gameObject !== g;
		});
	}
}
