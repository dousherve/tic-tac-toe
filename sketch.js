function setup() {
	createCanvas(600, 600);

	setupGame();
}

function draw() {
	background(51);

	drawGrid();
	drawElements();
}

function mouseClicked() {
	if (mouseX > width || mouseX < 0 || mouseY > height || mouseY < 0) {
		return;
	}

	tick();
}