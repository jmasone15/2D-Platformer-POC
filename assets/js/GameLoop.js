export default class GameLoop {
	constructor(update, render) {
		this.lastFrameTime = 0;
		this.accumulatedTime = 0;
		this.timeStep = 1000 / 60; // 60 FPS

		this.update = update;
		this.render = render;

		this.rafId = null; // Request Animation Frame ID
		this.isRunning = false;
	}

	// timestamp parameter comes from requestAnimationFrame browser function.
	mainLoop = (timestamp) => {
		if (!this.isRunning) return;

		let deltaTime = timestamp - this.lastFrameTime;
		this.lastFrameTime = timestamp;

		// Accumulate all the time since the last frame;
		this.accumulatedTime += deltaTime;

		// Fixed time step updates.
		// If there's enough accumulated time to run one or more fixed updates
		while (this.accumulatedTime >= this.timeStep) {
			this.update(this.timeStep); // Here, we pass the fixed time step
			this.accumulatedTime -= this.timeStep;
		}

		// Render
		this.render();

		// requestAnimationFrame comes from the browser and...
		// fires right before the browser updates to the next frame.
		// Returns unique id that is save into this.rafId
		this.rafId = requestAnimationFrame(this.mainLoop);
	};

	start() {
		if (!this.isRunning) {
			this.isRunning = true;
			this.rafId = requestAnimationFrame(this.mainLoop);
		}
	}

	stop() {
		if (this.rafId) {
			cancelAnimationFrame(this.rafId);
		}
		this.isRunning = false;
	}
}
