log("hi");

let world = createTiles(32, 10, 40);

let blocks = world.createGroup("blocks");
blocks.spriteSheet = loadImage(QuintOS.dir + "/img/blocks.png");

for (let i = 0; i < 8; i++) {
	blocks.loadAni("block-" + i, { pos: [0, i] });
}
