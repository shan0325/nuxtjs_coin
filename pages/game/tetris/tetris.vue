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
					type: 'I',
					startPosX: 4,
					mat: [[[1], [1], [1], [1]], [[1, 1, 1, 1]]],
				},
				{
					type: 'J',
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
					type: 'L',
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
					type: 'O',
					startPosX: 4,
					mat: [
						[
							[1, 1],
							[1, 1],
						],
					],
				},
				{
					type: 'T',
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
					type: 'Z',
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
					type: 'S',
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
			},
			board: null,
			beforeBoard: null,
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
	},
	methods: {
		keyDownHandler(e) {
			if (e.keyCode === 39) {
				const matrix = this.shape.obj.mat[this.shape.direction];
				if (this.shape.posX + matrix[0].length < this.block.cols) {
					this.shape.posX += 1;
				}
			} else if (e.keyCode === 37) {
				if (this.shape.posX > 0) {
					this.shape.posX -= 1;
				}
			}
		},
		draw() {
			// 기존 실행되고있는 requestAnimationFrame 취소
			// cancelAnimationFrame(this.reqAni);

			this.ctx.clearRect(0, 0, this.width, this.height);
			this.drawBackground();
			this.start();

			// this.reqAni = requestAnimationFrame(this.draw);
			this.reqAni = setTimeout(this.draw, 500);
		},
		start() {
			this.makeShape();

			for (let i = 0; i < this.board.length; i++) {
				this.board[i].fill(0);
			}

			if (this.beforeBoard) {
				this.cloneBoard(this.beforeBoard, this.board);
			}

			const matrix = this.shape.obj.mat[this.shape.direction];
			for (let i = 0; i < matrix.length; i++) {
				for (let j = 0; j < matrix[i].length; j++) {
					if (matrix[i][j] === 1) {
						this.board[this.shape.posY + i][
							this.shape.posX + j
						] = 1;
					}
				}
			}

			this.printBoard(this.board);
			this.drawShape();

			if (this.shape.posY + matrix.length >= this.block.rows) {
				this.beforeBoard = JSON.parse(JSON.stringify(this.board));
				this.shape.isMake = false;
				this.shape.posY = 0;
			} else {
				this.shape.posY += 1;
			}
		},
		makeShape() {
			if (!this.shape.isMake) {
				const randomNum = this.getRandomInt(0, this.shapes.length - 1);
				this.shape.obj = this.shapes[randomNum];
				this.shape.posX = this.shape.obj.startPosX;
				this.shape.isMake = true;
				console.log(this.shape.obj);
			}
		},
		drawShape() {
			for (let i = 0; i < this.board.length; i++) {
				for (let j = 0; j < this.board[i].length; j++) {
					if (this.board[i][j] === 1) {
						this.ctx.beginPath();
						this.ctx.fillStyle = '#999';
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
