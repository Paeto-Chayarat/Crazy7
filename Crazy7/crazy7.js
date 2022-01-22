for (let i = 0; i < 8; i++) {
	blocks.createSprite("block-" + i, i, i);
}

function draw() {
	drawSprites();
}
