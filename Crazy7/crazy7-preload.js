async function setup() {
	world = new World(0, 0, 32);
	world.offset.x = 10;
	world.offset.y = 40;

	blocks = new Group();
	blocks.spriteSheet = await loadImage(QuintOS.dir + '/img/blocks.png');

	for (let i = 0; i < 8; i++) {
		blocks.addAni('block-' + i, { pos: [i, 0] });
	}
}
