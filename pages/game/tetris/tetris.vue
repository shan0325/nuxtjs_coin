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
					mat: [
						[0, 0, 1, 0, 0],
						[0, 0, 1, 0, 0],
						[0, 0, 1, 0, 0],
						[0, 0, 1, 0, 0],
						[0, 0, 1, 0, 0],
					],
				},
				{
					type: 'L',
					mat: [
						[0, 1, 0],
						[0, 1, 0],
						[0, 1, 1],
					],
				},
				{
					type: 'O',
					mat: [
						[1, 1],
						[1, 1],
					],
				},
				{
					type: 'T',
					mat: [
						[1, 1, 1],
						[0, 1, 0],
						[0, 1, 0],
					],
				},
				{
					type: 'Z',
					mat: [
						[1, 1, 0],
						[0, 1, 0],
						[0, 1, 1],
					],
				},
			],
			shape: {
				obj: null,
				posX: 0,
				posY: 0,
				isMake: false,
			},
			board: null,
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
				this.shapes.x += 30;
			} else if (e.keyCode === 37) {
				this.shapes.x -= 30;
			}
		},
		draw() {
			// 기존 실행되고있는 requestAnimationFrame 취소
			// cancelAnimationFrame(this.reqAni);

			this.ctx.clearRect(0, 0, this.width, this.height);
			this.drawBackground();
			this.drawShapes();

			// this.reqAni = requestAnimationFrame(this.draw);
			this.reqAni = setTimeout(this.draw, 1000);
		},
		drawShapes() {
			if (!this.isMake) {
				const randomNum = this.getRandomInt(0, this.shapes.length - 1);
				this.shape.obj = this.shapes[randomNum];
				this.isMake = true;

				console.log(this.shape.obj);
			}

			for (let i = 0; i < this.shape.obj.mat.length; i++) {
				for (let j = 0; j < this.shape.obj.mat[i].length; j++) {
					if (this.shape.obj.mat[i][j] === 1) {
						this.board[this.shape.posY + i][
							this.shape.posX + j
						] = 1;
					}
				}
			}
			this.shape.posY += 1;
			console.log(this.board);
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
