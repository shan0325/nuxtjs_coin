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
			shapes: {
				x: 120,
				y: 0,
				I: {
					mat: [
						[0, 0, 1, 0, 0],
						[0, 0, 1, 0, 0],
						[0, 0, 1, 0, 0],
						[0, 0, 1, 0, 0],
						[0, 0, 1, 0, 0],
					],
				},
				L: {
					mat: [
						[0, 1, 0],
						[0, 1, 0],
						[0, 1, 1],
					],
				},
				O: {
					mat: [
						[1, 1],
						[1, 1],
					],
				},
				T: {
					mat: [
						[1, 1, 1],
						[0, 1, 0],
						[0, 1, 1],
					],
				},
				Z: {
					mat: [
						[1, 1, 0],
						[0, 1, 0],
						[0, 1, 1],
					],
				},
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

			this.draw();
		},
		draw() {
			// 기존 실행되고있는 requestAnimationFrame 취소
			cancelAnimationFrame(this.reqAni);

			this.ctx.clearRect(0, 0, this.width, this.height);
			this.drawBackground();
			// this.drawShapes();

			this.reqAni = requestAnimationFrame(this.draw);
		},
		drawShapes() {
			if (this.shapes.y >= this.height - 60) {
				this.shapes.x = 120;
				this.shapes.y = 0;
			}
			this.ctx.beginPath();
			this.ctx.fillStyle = '#999';
			this.shapes.y += 1;
			this.ctx.fillRect(this.shapes.x, this.shapes.y, 60, 60);
			this.ctx.closePath();
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
	},
};
</script>

<style scoped>
canvas {
	background-color: #fff;
}
</style>
