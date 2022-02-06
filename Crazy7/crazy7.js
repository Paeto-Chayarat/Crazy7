// for (let i = 0; i < 5; i++) {
// 	blocks.createSprite("block-" + i, 0, i);
// }

let schedule = [0, 0];

blocks.createSprite("block-0", 0, 2);

let playerDropped = false;

let levelDelayTime = 2000;

let dropTime = 0;
let dropDelay = levelDelayTime;

let dropBlock = blocks[0];
dropBlock.num = 0;

let board = [];

for (let row = 0; row < 11; row++) {
	board.push([]);
	for (let col = 0; col < 5; col++) {
		board[row].push(" ");
	}
}
logBoard();

function logBoard() {
	let str = "";
	for (let row = 0; row < 11; row++) {
		for (let col = 0; col < 5; col++) {
			if (board[row][col] === " ") {
				str += " ";
			} else {
				str += board[row][col].num;
			}
			str += ",";
		}
		str += "\n";
	}
	log(str);
}

async function gameCycle() {
	await delay(dropDelay);
	if (!playerDropped && dropCheck()) {
		dropBlock.row++;
		dropTime = Date.now();
		dropDelay = levelDelayTime;
	} else {
		playerDropped = false;
	}
	gameCycle();
}
gameCycle();

let keyHeld = {
	ArrowDown: 0,
};

function dropCheck() {
	let shouldDrop = dropBlock.row < 10;

	// see if there's block underneath
	if (shouldDrop && board[dropBlock.row + 1][dropBlock.col] !== " ") {
		shouldDrop = false;
	}

	if (shouldDrop == false) {
		// record position of dropBlock on board
		board[dropBlock.row][dropBlock.col] = dropBlock;
		logBoard();

		// check column for multiple of 7
		let sum = 0;
		for (let row = 0; row < 11; row++) {
			if (board[row][dropBlock.col] !== " ") {
				sum += board[row][dropBlock.col].num;
			}
		}
		if (sum != 0 && sum % 7 == 0) {
			for (let row = 0; row < 11; row++) {
				if (board[row][dropBlock.col] !== " ") {
					board[row][dropBlock.col].remove();
					board[row][dropBlock.col] = " ";
				}
			}
		}

		// make new dropBlock
		let num = schedule[schedule.length - 1];
		blocks.createSprite("block-" + num, 0, 2);
		dropBlock = blocks[blocks.length - 1];
		dropBlock.num = num;

		// show next block
		schedule.push(Math.floor(Math.random() * 8));
	}
	return shouldDrop;
}

function playerDrop() {
	playerDropped = true;
	if (!dropCheck()) return;
	dropBlock.row++;
	let now = Date.now();
	dropDelay = now - dropTime;
	dropTime = now;
}

function draw() {
	background(0);

	if (isKeyDown("ArrowDown")) {
		keyHeld.ArrowDown++;
	} else {
		keyHeld.ArrowDown = 0;
	}

	if (keyHeld.ArrowDown > 20 && keyHeld.ArrowDown % 7 == 0) {
		playerDrop();
	}

	drawSprites();
}

function keyPressed() {
	if (
		key == "ArrowLeft" &&
		dropBlock.col > 0 &&
		board[dropBlock.row][dropBlock.col - 1] === " "
	) {
		dropBlock.col--;
	} else if (
		key == "ArrowRight" &&
		dropBlock.col < 4 &&
		board[dropBlock.row][dropBlock.col + 1] === " "
	) {
		dropBlock.col++;
	} else if (key == "ArrowDown") {
		playerDrop();
	}
}
