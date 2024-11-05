class Resources {
	constructor() {
		// Everything we plan to download.
		this.toLoad = {
			sky: '/assets/sprites/sky.png',
			ground: '/assets/sprites/ground.png',
			hero: '/assets/sprites/hero-sheet.png',
			shadow: '/assets/sprites/shadow.png',
			rod: '/assets/sprites/rod.png'
		};

		// A bucket to keep all of our images.
		this.images = {};

		// Load each image
		Object.keys(this.toLoad).forEach((key) => {
			const img = new Image();
			img.src = this.toLoad[key];
			this.images[key] = {
				image: img,
				isLoaded: false
			};
			img.onload = () => {
				this.images[key].isLoaded = true;
			};
		});
	}
}

// Create one instance for the whole app to use
const resources = new Resources();
export default resources;
