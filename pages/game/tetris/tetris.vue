<template>
	<v-container fluid>
		<canvas id="canvas" width="300px" height="600px"></canvas>
	</v-container>
</template>

<script>
export default {
	data() {
		return {
			ctx: null,
			width: 300,
			height: 600,
			block: {
				cols: 10,
				rows: 20,
				size: 30,
			},
			shapes: [
				{
					seq: 1,
					type: 'I',
					color: '#f44336',
					startPosX: 4,
					mat: [[[1], [1], [1], [1]], [[1, 1, 1, 1]]],
				},
				{
					seq: 2,
					type: 'J',
					color: '#e91e63',
					startPosX: 4,
					mat: [
						[
							[0, 1],
							[0, 1],
							[1, 1],
						],
						[
							[1, 1, 1],
							[0, 0, 1],
						],
						[
							[1, 1],
							[1, 0],
							[1, 0],
						],
						[
							[1, 0, 0],
							[1, 1, 1],
						],
					],
				},
				{
					seq: 3,
					type: 'L',
					color: '#9c27b0',
					startPosX: 4,
					mat: [
						[
							[1, 0],
							[1, 0],
							[1, 1],
						],
						[
							[0, 0, 1],
							[1, 1, 1],
						],
						[
							[1, 1],
							[0, 1],
							[0, 1],
						],
						[
							[1, 1, 1],
							[1, 0, 0],
						],
					],
				},
				{
					seq: 4,
					type: 'O',
					color: '#00bcd4',
					startPosX: 4,
					mat: [
						[
							[1, 1],
							[1, 1],
						],
					],
				},
				{
					seq: 5,
					type: 'T',
					color: '#009688',
					startPosX: 4,
					mat: [
						[
							[1, 1, 1],
							[0, 1, 0],
						],
						[
							[1, 0],
							[1, 1],
							[1, 0],
						],
						[
							[0, 1, 0],
							[1, 1, 1],
						],
						[
							[0, 1],
							[1, 1],
							[0, 1],
						],
					],
				},
				{
					seq: 6,
					type: 'Z',
					color: '#cddc39',
					startPosX: 4,
					mat: [
						[
							[1, 1, 0],
							[0, 1, 1],
						],
						[
							[0, 1],
							[1, 1],
							[1, 0],
						],
					],
				},
				{
					seq: 7,
					type: 'S',
					color: '#795548',
					startPosX: 4,
					mat: [
						[
							[0, 1, 1],
							[1, 1, 0],
						],
						[
							[1, 0],
							[1, 1],
							[0, 1],
						],
					],
				},
			],
			shape: {
				isMake: false,
				obj: null,
				posX: 0,
				posY: 0,
				direction: 0,
				isBottomCollisioned: false,
				isRightCollisioned: false,
				isLeftCollisioned: false,
				isUpCollisioned: false,
			},
			speed: 1,
			board: null,
			buildedBoard: null,
			reqAni: null,
		};
	},
	mounted() {
		this.ctx = document.getElementById('canvas').getContext('2d');
		this.board = Array.from(Array(this.block.rows), () =>
			new Array(this.block.cols).fill(0),
		);

		this.draw();

		document.addEventListener('keydown', this.keyDownHandler, false);
		document.addEventListener('keyup', this.keyUpHandler, false);
	},
	methods: {
		keyDownHandler(e) {
			if (e.keyCode === 39) {
				// right
				const matrix = this.shape.obj.mat[this.shape.direction];
				this.checkRightEventCollision();
				if (
					this.shape.posX + matrix[0].length < this.block.cols &&
					!this.shape.isRightCollisioned
				) {
					this.shape.posX += 1;
				}
			} else if (e.keyCode === 37) {
				// left
				this.checkLeftEventCollision();
				if (this.shape.posX > 0 && !this.shape.isLeftCollisioned) {
					this.shape.posX -= 1;
				}
			} else if (e.keyCode === 38) {
				// up
				let nextDirection = 0;
				if (this.shape.direction < this.shape.obj.mat.length - 1) {
					nextDirection = this.shape.direction + 1;
				}

				const matrix = this.shape.obj.mat[nextDirection];
				this.checkUpEventCollision(nextDirection);
				if (
					this.shape.posX + matrix[0].length <= this.block.cols &&
					this.shape.posX >= 0 &&
					!this.shape.isUpCollisioned
				) {
					this.shape.direction = nextDirection;

					const matrix = this.shape.obj.mat[this.shape.direction];
					if (this.shape.posX + matrix[0].length > this.block.cols) {
						this.shape.posX = this.block.cols - matrix[0].length;
					}
					if (this.shape.posY + matrix.length > this.block.rows) {
						this.shape.posY = this.block.rows - matrix.length;
					}
				}
			} else if (e.keyCode === 40) {
				// down
				this.speed = 10;
			} else if (e.keyCode === 32) {
				// space
				const matrix = this.shape.obj.mat[this.shape.direction];
				this.shape.posY = this.block.rows - matrix.length;
			}
		},
		keyUpHandler(e) {
			if (e.keyCode === 40) {
				// down
				this.speed = 1;
			}
		},
		draw() {
			// 기존 실행되고있는 requestAnimationFrame 취소
			// cancelAnimationFrame(this.reqAni);

			this.ctx.clearRect(0, 0, this.width, this.height);
			this.drawBackground();
			this.start();

			// this.reqAni = requestAnimationFrame(this.draw);
			this.reqAni = setTimeout(this.draw, 300 / this.speed);
		},
		start() {
			this.makeShape(); // 랜덤 도형 생성
			this.initBoard(); // 초기화
			this.checkBottomCollision(); // 아래 충돌 확인
			this.setBoard(); // 보드 셋팅

			if (this.shape.isBottomCollisioned) {
				this.buildedBoard = JSON.parse(JSON.stringify(this.board));
				this.shape.isMake = false;
				this.shape.posY = 0;
			} else {
				this.shape.posY += 1;
			}

			// this.printBoard(this.board);
			this.drawShape();
		},
		setBoard() {
			const matrix = this.shape.obj.mat[this.shape.direction];
			for (let i = 0; i < matrix.length; i++) {
				for (let j = 0; j < matrix[i].length; j++) {
					if (matrix[i][j] === 1) {
						if (
							this.shape.posY + matrix.length <=
							this.block.rows
						) {
							this.board[this.shape.posY + i][
								this.shape.posX + j
							] = this.shape.obj.seq;
						}
					}
				}
			}
		},
		checkLeftEventCollision() {
			const matrix = this.shape.obj.mat[this.shape.direction];
			const nextLeftPosX = this.shape.posX - 1;

			this.shape.isLeftCollisioned = false;

			if (this.buildedBoard) {
				for (let i = 0; i < matrix.length; i++) {
					for (let j = 0; j < matrix[i].length; j++) {
						if (matrix[i][j] === 1) {
							// 왼쪽 도형 충돌 확인
							if (
								this.buildedBoard[this.shape.posY + i][
									nextLeftPosX + j
								] > 0
							) {
								console.log('왼쪽 도형 충돌');
								this.shape.isLeftCollisioned = true;
								return;
							}
						}
					}
				}
			}
		},
		checkRightEventCollision() {
			const matrix = this.shape.obj.mat[this.shape.direction];
			const nextRightPosX = this.shape.posX + 1;

			this.shape.isRightCollisioned = false;

			if (this.buildedBoard) {
				for (let i = 0; i < matrix.length; i++) {
					for (let j = 0; j < matrix[i].length; j++) {
						if (matrix[i][j] === 1) {
							// 오른쪽 도형 충돌 확인
							if (
								this.buildedBoard[this.shape.posY + i][
									nextRightPosX + j
								] > 0
							) {
								console.log('오른쪽 도형 충돌');
								this.shape.isRightCollisioned = true;
								return;
							}
						}
					}
				}
			}
		},
		checkUpEventCollision(nextDirection) {
			this.shape.isUpCollisioned = false;
			const nextMatrix = this.shape.obj.mat[nextDirection];

			if (
				this.shape.posY + (nextMatrix.length - 1) >
				this.block.rows - 1
			) {
				console.log('도형 변경 바닥 충돌');
				this.shape.isUpCollisioned = true;
				return;
			}

			if (this.buildedBoard) {
				for (let i = 0; i < nextMatrix.length; i++) {
					for (let j = 0; j < nextMatrix[i].length; j++) {
						if (nextMatrix[i][j] === 1) {
							// 도형 변경 충돌 확인
							if (
								this.buildedBoard[this.shape.posY + i][
									this.shape.posX + j
								] > 0
							) {
								console.log('도형 변경 충돌');
								this.shape.isUpCollisioned = true;
								return;
							}
						}
					}
				}
			}
		},
		checkBottomCollision() {
			const matrix = this.shape.obj.mat[this.shape.direction];
			const nextPosY = this.shape.posY + 1;

			this.shape.isBottomCollisioned = false;
			if (nextPosY + (matrix.length - 1) > this.block.rows - 1) {
				console.log('바닥 충돌');
				this.shape.isBottomCollisioned = true;
				return;
			}

			if (this.buildedBoard) {
				for (let i = 0; i < matrix.length; i++) {
					for (let j = 0; j < matrix[i].length; j++) {
						if (matrix[i][j] === 1) {
							// 아래 도형 충돌 확인
							if (
								this.board[nextPosY + i][this.shape.posX + j] >
								0
							) {
								console.log('아래 도형 충돌');
								this.shape.isBottomCollisioned = true;
								return;
							}
						}
					}
				}
			}
		},
		initBoard() {
			for (let i = 0; i < this.board.length; i++) {
				this.board[i].fill(0);
			}

			if (this.buildedBoard) {
				this.cloneBoard(this.buildedBoard, this.board);
			}
		},
		makeShape() {
			if (!this.shape.isMake) {
				const randomNum = this.getRandomInt(0, this.shapes.length - 1);
				this.shape.obj = this.shapes[randomNum];
				this.shape.posX = this.shape.obj.startPosX;
				this.shape.isMake = true;
				this.shape.direction = 0;
				// console.log(this.shape.obj);
			}
		},
		drawShape() {
			for (let i = 0; i < this.board.length; i++) {
				for (let j = 0; j < this.board[i].length; j++) {
					if (this.board[i][j] > 0) {
						this.ctx.beginPath();
						this.ctx.fillStyle =
							this.shapes[this.board[i][j] - 1].color;
						this.ctx.fillRect(
							j * this.block.size,
							i * this.block.size,
							this.block.size,
							this.block.size,
						);
						this.ctx.closePath();
					}
				}
			}
		},
		cloneBoard(source, target) {
			for (let i = 0; i < source.length; i++) {
				for (let j = 0; j < source[i].length; j++) {
					target[i][j] = source[i][j];
				}
			}
		},
		printBoard(board) {
			let line = '';
			for (let i = 0; i < board.length; i++) {
				for (let j = 0; j < board[i].length; j++) {
					line += board[i][j] + ' ';
				}
				line += '\n';
			}
			console.log(line);
		},
		drawBackground() {
			this.ctx.beginPath();
			this.ctx.strokeStyle = '#efefef';

			for (let i = 1; i < this.block.cols; i++) {
				this.ctx.moveTo(i * this.block.size, 0);
				this.ctx.lineTo(i * this.block.size, this.height);
				this.ctx.stroke();
			}

			for (let i = 1; i < this.block.rows; i++) {
				this.ctx.moveTo(0, i * this.block.size);
				this.ctx.lineTo(this.width, i * this.block.size);
				this.ctx.stroke();
			}
			this.ctx.closePath();
		},
		getRandomInt(min, max) {
			min = Math.ceil(min);
			max = Math.floor(max);
			return Math.floor(Math.random() * (max - min + 1)) + min; // 최댓값도 포함, 최솟값도 포함
		},
	},
};
</script>

<style scoped>
canvas {
	background-color: #fff;
}
</style>
