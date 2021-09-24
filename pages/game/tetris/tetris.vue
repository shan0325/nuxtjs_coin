<template>
	<v-container fluid>
		<v-row>
			<v-col align="right">
				<v-card class="pa-2 mb-3" tile outlined width="300">
					{{ shape.number }} SCORE {{ score }} 점
				</v-card>
				<canvas id="canvas" width="300px" height="600px"></canvas>
			</v-col>
			<v-col align="left">
				<v-card
					class="pa-2 mb-3"
					tile
					outlined
					width="100"
					align="center"
				>
					NEXT
				</v-card>
				<canvas id="infoCanvas" width="100px" height="150px"></canvas>
			</v-col>
		</v-row>
	</v-container>
</template>

<script>
export default {
	data() {
		return {
			ctx: null,
			width: 300,
			height: 600,
			infoCtx: null,
			infoWidth: 100,
			infoHeight: 150,
			block: {
				cols: 10,
				rows: 20,
				size: 30,
			},
			shapes: [
				{
					seq: 1,
					type: 'I',
					color: '#fbb0ac',
					startPosX: 4,
					mat: [[[1], [1], [1], [1]], [[1, 1, 1, 1]]],
				},
				{
					seq: 2,
					type: 'J',
					color: '#96e0ed',
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
					color: '#c5d3d6',
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
					color: '#e3c1f1',
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
					color: '#a7ece2',
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
					color: '#e0c6c3',
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
					color: '#867761',
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
				number: 0,
				isMake: false,
				obj: null,
				nextObj: null,
				posX: 0,
				posY: 0,
				direction: 0,
				isDownCollisioned: false,
				isRightCollisioned: false,
				isLeftCollisioned: false,
				isUpCollisioned: false,
				beforeUpNumber: 0,
				beforeSpaceNumber: 0,
			},
			speed: 3,
			defaultSpeed: 3,
			downSpeed: 20,
			score: 0,
			board: null,
			buildedBoard: null,
			reqAni: null,
		};
	},
	mounted() {
		CanvasRenderingContext2D.prototype.roundRect = function (
			x,
			y,
			width,
			height,
			radius,
		) {
			if (width < 2 * radius) radius = width / 2;
			if (height < 2 * radius) radius = height / 2;
			this.beginPath();
			this.moveTo(x + radius, y);
			this.arcTo(x + width, y, x + width, y + height, radius);
			this.arcTo(x + width, y + height, x, y + height, radius);
			this.arcTo(x, y + height, x, y, radius);
			this.arcTo(x, y, x + width, y, radius);
			this.closePath();
			return this;
		};

		this.ctx = document.getElementById('canvas').getContext('2d');
		this.infoCtx = document.getElementById('infoCanvas').getContext('2d');
		this.board = Array.from(Array(this.block.rows), () =>
			new Array(this.block.cols).fill(0),
		);

		this.shape.isUpCollisioned = true;
		this.draw();

		document.addEventListener('keydown', this.keyDownHandler, false);
		document.addEventListener('keyup', this.keyUpHandler, false);
	},
	beforeDestroy() {
		if (this.reqAni) {
			// cancelAnimationFrame(this.reqAni);
			clearTimeout(this.reqAni);
		}
	},
	methods: {
		keyDownHandler(e) {
			if (e.keyCode === 13) {
				this.shape.isUpCollisioned = false;
				this.shape.number = 0;
				this.shape.isMake = false;
				this.shape.obj = null;
				this.shape.nextObj = null;
				this.speed = 3;
				this.defaultSpeed = 3;
				this.score = 0;
				this.buildedBoard = null;
				this.draw();
			} else if (e.keyCode === 39) {
				// right
				const matrix = this.shape.obj.mat[this.shape.direction];
				this.checkRightEventCollision();
				if (
					this.shape.posX + matrix[0].length < this.block.cols &&
					!this.shape.isRightCollisioned
				) {
					this.shape.posX += 1;
					this.start(false);
				}
			} else if (e.keyCode === 37) {
				// left
				this.checkLeftEventCollision();
				if (this.shape.posX > 0 && !this.shape.isLeftCollisioned) {
					this.shape.posX -= 1;
					this.start(false);
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
					this.start(false);
				}
			} else if (e.keyCode === 40) {
				// down
				this.speed = this.downSpeed;
			} else if (e.keyCode === 32) {
				// space
				if (this.shape.beforeSpaceNumber === this.shape.number) {
					return;
				}

				const matrix = this.shape.obj.mat[this.shape.direction];
				let spacePosY = 0;
				if (this.buildedBoard) {
					for (
						let k = this.shape.posY;
						k <= this.block.rows - matrix.length;
						k++
					) {
						if (spacePosY > 0) break;
						for (let i = 0; i < matrix.length; i++) {
							if (spacePosY > 0) break;
							for (let j = 0; j < matrix[i].length; j++) {
								if (matrix[i][j] === 1) {
									if (
										this.buildedBoard[k + i][
											this.shape.posX + j
										] > 0
									) {
										spacePosY = k - 1;
										break;
									}
								}
							}
						}
					}
					this.shape.posY =
						spacePosY === 0
							? this.block.rows - matrix.length
							: spacePosY;
				} else {
					this.shape.posY = this.block.rows - matrix.length;
				}
				this.start(false);
				this.shape.beforeSpaceNumber = this.shape.number;
			}
		},
		keyUpHandler(e) {
			if (e.keyCode === 40) {
				// down
				this.speed = this.defaultSpeed;
			}
		},
		draw() {
			if (this.shape.isUpCollisioned) {
				this.drawEnterButton();
				if (this.reqAni) {
					clearTimeout(this.reqAni);
				}
				return;
			}

			this.start(true);

			// this.reqAni = requestAnimationFrame(this.draw);
			this.reqAni = setTimeout(this.draw, 1000 / this.speed);
		},
		start(isEnableEndOfSetting) {
			this.ctx.clearRect(0, 0, this.width, this.height);
			this.drawBackground();
			this.makeShape(); // 랜덤 도형 생성
			this.initBoard(); // 초기화
			this.drawBuildedBoard(); // 쌓인 보드 렌더링
			this.checkDownCollision(this.shape.posY + 1); // 아래 충돌 확인
			this.drawShape(); // 도형 렌더링
			this.setBoard(); // 만들어진 도형 보드 셋팅
			// this.printBoard(this.board);
			this.calcScore(); // 스코어 계산

			if (isEnableEndOfSetting) {
				if (this.shape.isDownCollisioned) {
					this.buildedBoard = JSON.parse(JSON.stringify(this.board));
					this.shape.isMake = false;
					this.shape.posY = 0;
					this.setSpeedUp(); // 속도 증가
					this.makeShape(); // 랜덤 도형 생성
				} else {
					this.shape.posY += 1;
				}
			}
		},
		calcScore() {
			for (let i = 0; i < this.board.length; i++) {
				let isFillRow = true;
				for (let j = 0; j < this.board[i].length; j++) {
					if (this.board[i][j] === 0) {
						isFillRow = false;
					}
				}
				if (isFillRow) {
					this.score += 10;
					if (i > 0) {
						for (let k = i; k > 0; k--) {
							for (let j = 0; j < this.board[k - 1].length; j++) {
								this.board[k][j] = this.board[k - 1][j];
							}
						}
					}
				}
			}
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
		checkDownCollision(nextPosY) {
			const matrix = this.shape.obj.mat[this.shape.direction];

			this.shape.isDownCollisioned = false;
			this.shape.isUpCollisioned = false;
			if (nextPosY + (matrix.length - 1) > this.block.rows - 1) {
				console.log('바닥 충돌');
				this.shape.isDownCollisioned = true;
				this.shape.posY = this.block.rows - matrix.length;
				return;
			}

			if (this.buildedBoard) {
				for (let i = 0; i < matrix.length; i++) {
					for (let j = 0; j < matrix[i].length; j++) {
						if (matrix[i][j] === 1) {
							// 아래 도형 충돌 확인
							if (
								this.buildedBoard[nextPosY + i][
									this.shape.posX + j
								] > 0
							) {
								console.log('아래 도형 충돌');
								this.shape.isDownCollisioned = true;

								if (this.shape.posY <= 0) {
									this.shape.isUpCollisioned = true;
								}
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
				if (this.shape.nextObj) {
					this.shape.obj = this.shape.nextObj;
					const randomNum = this.getRandomInt(
						0,
						this.shapes.length - 1,
					);
					this.shape.nextObj = this.shapes[randomNum];
				} else {
					const randomNum = this.getRandomInt(
						0,
						this.shapes.length - 1,
					);
					this.shape.obj = this.shapes[randomNum];
					const nextRandomNum = this.getRandomInt(
						0,
						this.shapes.length - 1,
					);
					this.shape.nextObj = this.shapes[nextRandomNum];
				}

				this.shape.number++;
				this.shape.posX = this.shape.obj.startPosX;
				this.shape.isMake = true;
				this.shape.direction = 0;
				// console.log(this.shape);

				this.infoCtx.clearRect(0, 0, this.infoWidth, this.infoHeight);
				const nextMatrix = this.shape.nextObj.mat[0];
				const startX =
					(this.infoWidth - this.block.size * nextMatrix[0].length) /
					2;
				const startY =
					(this.infoHeight - this.block.size * nextMatrix.length) / 2;
				for (let i = 0; i < nextMatrix.length; i++) {
					for (let j = 0; j < nextMatrix[i].length; j++) {
						if (nextMatrix[i][j] === 1) {
							this.infoCtx.beginPath();
							this.infoCtx.fillStyle = this.shape.nextObj.color;
							this.infoCtx.fillRect(
								startX + j * this.block.size,
								startY + i * this.block.size,
								this.block.size,
								this.block.size,
							);
							this.infoCtx.closePath();
						}
					}
				}
			}
		},
		setSpeedUp() {
			if (!this.shape.isMake) {
				if (this.shape.number % 10 === 0) {
					this.speed++;
					this.defaultSpeed++;
				}
			}
		},
		drawShape() {
			const matrix = this.shape.obj.mat[this.shape.direction];
			for (let i = 0; i < matrix.length; i++) {
				for (let j = 0; j < matrix[i].length; j++) {
					if (matrix[i][j] === 1) {
						this.ctx.beginPath();
						this.ctx.fillStyle = this.shape.obj.color;
						this.ctx.fillRect(
							(this.shape.posX + j) * this.block.size,
							(this.shape.posY + i) * this.block.size,
							this.block.size,
							this.block.size,
						);
						this.ctx.closePath();
					}
				}
			}
		},
		drawBuildedBoard() {
			if (this.buildedBoard) {
				for (let i = 0; i < this.buildedBoard.length; i++) {
					for (let j = 0; j < this.buildedBoard[i].length; j++) {
						if (this.buildedBoard[i][j] > 0) {
							this.ctx.beginPath();
							this.ctx.fillStyle =
								this.shapes[this.buildedBoard[i][j] - 1].color;
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
			}
		},
		drawBoard() {
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
		drawEnterButton() {
			this.ctx.beginPath();
			this.ctx.fillStyle = '#000';
			this.ctx.globalAlpha = '0.7';
			this.ctx.fillRect(0, 0, this.width, this.height);

			const grd = this.ctx.createLinearGradient(0, 0, 300, 0);
			grd.addColorStop(0, '#ee0979');
			grd.addColorStop(1, '#ff6a00');

			this.ctx.fillStyle = grd;
			this.ctx.globalAlpha = '1.0';
			this.ctx.roundRect(
				(this.width - 120) / 2,
				(this.height - 50) / 2,
				120,
				50,
				10,
			);
			this.ctx.fill();

			this.ctx.fillStyle = '#fff';
			this.ctx.font = '15px sans-serif';
			this.ctx.fillText('ENTER', 128, 305);
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
