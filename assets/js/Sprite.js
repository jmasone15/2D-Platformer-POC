import GameObject from './GameObject.js';
import Vector2 from './Vector2.js';

export default class Sprite extends GameObject {
	constructor({
		resource, // Image we want to draw.
		frameSize, // Size of the crop of the image.
		hFrames, // How the sprite is arranged horizontally.
		vFrames, // How the sprite is arranged vertically.
		frame, // Which frame we want to show.
		scale, // How large to draw this image.
		position, // Where to draw the image.
		animations
	}) {
		super({});
		this.resource = resource;
		this.frameSize = frameSize ?? new Vector2(16, 16);
		this.hFrames = hFrames ?? 1;
		this.vFrames = vFrames ?? 1;
		this.frame = frame ?? 0;
		this.frameMap = new Map();
		this.scale = scale ?? 1;
		this.position = position ?? new Vector2(0, 0);
		this.animations = animations ?? null;
		this.buildFrameMap();
	}

	buildFrameMap() {
		let frameCount = 0;
		for (let vertically = 0; vertically < this.vFrames; vertically++) {
			for (let horizontally = 0; horizontally < this.hFrames; horizontally++) {
				this.frameMap.set(
					frameCount,
					new Vector2(
						this.frameSize.x * horizontally,
						this.frameSize.y * vertically
					)
				);
				frameCount++;
			}
		}
	}

	step(delta) {
		if (!this.animations) {
			return;
		}

		this.animations.step(delta);
		this.frame = this.animations.frame;
	}

	drawImage(ctx, x, y) {
		if (!this.resource.isLoaded) {
			return;
		}

		// Find the correct sprite sheet frame to use.
		let frameCoordX = 0;
		let frameCoordY = 0;
		const frame = this.frameMap.get(this.frame);
		if (frame) {
			frameCoordX = frame.x;
			frameCoordY = frame.y;
		}

		const frameSizeX = this.frameSize.x;
		const frameSizeY = this.frameSize.y;

		ctx.drawImage(
			this.resource.image,
			frameCoordX,
			frameCoordY, // Top Y corner of frame.
			frameSizeX, // How much to crop from the sprite sheet (X).
			frameSizeY, // How much to crop from the sprite sheet (Y).
			x, // Where to place this on canvas tag X (0).
			y, // Where to place this on cavas tag Y (0).
			frameSizeX * this.scale, // How large to scale it (X).
			frameSizeY * this.scale // How large to scale it (Y).
		);
	}
}
