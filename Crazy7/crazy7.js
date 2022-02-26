let schedule, playerDropped, dropTime, dropDelay, nextBlock, dropBlock;
let score, startTime, isGameOver, levelDelayTime;

let keyHeld = {
	ArrowDown: 0,
};

let board = [];

for (let row = 0; row < 11; row++) {
	board.push([]);
	for (let col = 0; col < 5; col++) {
		board[row].push(" ");
	}
}

// start of game
function startGame() {
	logBoard();
	score = 0;

	text("up next: ", 4, 18);
	text("score: ", 10, 18);
	text(score + "     ", 12, 18);

	schedule = [0, 0];
	blocks.createSprite("block-0", 0, 2);
	dropBlock = blocks[0];
	dropBlock.num = 0;
	nextBlock = blocks.createSprite("block-0", 1, 7);

	dropTime = 0;
	levelDelayTime = 1000;
	dropDelay = levelDelayTime;
	playerDropped = false;

	startTime = Date.now();
	isGameOver = false;
	gameCycle();
}
startGame();

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
	let playTime = Date.now() - startTime;
	if (playTime > 5000) {
		if (levelDelayTime > 750) {
			levelDelayTime /= 1.3;
		} else if (levelDelayTime > 500) {
			levelDelayTime /= 1.2;
		} else if (levelDelayTime > 250) {
			levelDelayTime /= 1.05;
		} else if (levelDelayTime > 150) {
			levelDelayTime /= 1.001;
		}
		startTime = Date.now();
		log(levelDelayTime);
	}
	if (isGameOver == false) {
		gameCycle();
	}
}

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
			score += sum;
			text(score, 12, 18);
		} else if (dropBlock.row == 0) {
			log("game over");
			isGameOver = true;
			gameOver();
			return false;
		}

		// make new dropBlock
		let num = schedule[schedule.length - 1];
		blocks.createSprite("block-" + num, 0, 2);
		dropBlock = blocks[blocks.length - 1];
		dropBlock.num = num;

		// show next block
		schedule.push(Math.floor(Math.random() * 8));
		num = schedule[schedule.length - 1];
		nextBlock = blocks.createSprite("block-" + num, 1, 7);
	}
	return shouldDrop;
}

function playerDrop() {
	if (isGameOver) return;
	playerDropped = true;
	if (!dropCheck()) return;
	dropBlock.row++;
	let now = Date.now();
	dropDelay = now - dropTime;
	dropTime = now;
}

function draw() {
	background(0);

	for (let row = 0; row < 11; row++) {
		for (let col = 0; col < 5; col++) {
			if ((col + row) % 2 == 0) {
				fill(150);
			} else {
				fill(200);
			}
			rect(10 + 32 * col, 40 + 32 * row, 32, 32);
		}
	}

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
	if (isGameOver) return;
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

async function gameOver() {
	await alert("Game Over", 14, 18, 10);
	for (let row = 0; row < 11; row++) {
		for (let col = 0; col < 5; col++) {
			if (board[row][col] !== " ") {
				board[row][col].remove();
				board[row][col] = " ";
			}
		}
	}
	nextBlock.remove();
	blocks.removeSprites();

	startGame();
}
