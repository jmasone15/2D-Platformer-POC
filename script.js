const boundaries = {
	left: 5,
	right: window.innerWidth - 55,
	top: 5,
	bottom: window.innerHeight - 55
};

const playerLocation = {
	left: 5,
	top: boundaries.bottom
};

const player = document.getElementById('player');

const updatePlayerDOM = () => {
	player.setAttribute(
		'style',
		`left: ${playerLocation.left}px; top: ${playerLocation.top}px`
	);
};

document.addEventListener('keydown', ({ key }) => {
	console.log(key);

	switch (key) {
		case 'ArrowRight':
			playerLocation.left += 3;
			break;
		case 'ArrowLeft':
			playerLocation.left -= 3;
			break;

		default:
			break;
	}

	updatePlayerDOM();
});

updatePlayerDOM();

// https://www.w3schools.com/graphics/game_movement.asp
