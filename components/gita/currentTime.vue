<template>
	<v-row justify="center" align="center" style="height: 35rem">
		<v-col cols="12" align="center">
			<div class="pb-4 font-weight-bold text-h4">
				CURRENT
				<span class="red--text">TIME</span>
			</div>
			<div class="font-weight-bold text-h1">
				<span>{{ hours }}:</span><span>{{ minutes }}:</span
				><span class="red--text">{{ seconds }}</span>
			</div>
		</v-col>
	</v-row>
</template>

<script>
export default {
	data() {
		return {
			title: 'CURRENT TIME',
			time: '',
			hours: '',
			minutes: '',
			seconds: '',
			timeInterval: null,
		};
	},
	created() {
		this.clockInterval();
	},
	destroyed() {
		clearInterval(this.timeInterval);
	},
	methods: {
		clockInterval() {
			this.makeClock();
			this.timeInterval = setInterval(() => this.makeClock(), 1000);
		},
		makeClock() {
			const curDate = new Date();
			const hours =
				curDate.getHours().toString().length === 1
					? `0${curDate.getHours()}`
					: curDate.getHours();
			const minutes =
				curDate.getMinutes().toString().length === 1
					? `0${curDate.getMinutes()}`
					: curDate.getMinutes();
			const seconds =
				curDate.getSeconds().toString().length === 1
					? `0${curDate.getSeconds()}`
					: curDate.getSeconds();

			this.time = `TIME ${hours}:${minutes}:${seconds}`;
			this.hours = `${hours}`;
			this.minutes = `${minutes}`;
			this.seconds = seconds;
		},
	},
};
</script>
