log("hi");

let world = createTiles(16, 0, 50);

let blocks = world.createGroup("blocks");
blocks.spriteSheet = loadImage(QuintOS.dir + "/img/blocks.png");

for (let i = 0; i < 8; i++) {
	blocks.loadAni("block-" + i, { pos: [0, i] });
}
