const gameArea = {
	element: document.createElement('canvas'),
	start: function () {
		this.element.setAttribute('id', 'game-area');
		this.context = this.element.getContext('2d');
		document.body.appendChild(this.element);
	}
};

gameArea.start();
console.log(gameArea);
