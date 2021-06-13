<template>
	<div id="charts">
		<trading-vue
			:data="market.minutes"
			:width="width"
			:height="height"
			:color-back="colors.colorBack"
			:color-grid="colors.colorGrid"
			:color-text="colors.colorText"
		>
		</trading-vue>
	</div>
</template>

<script>
import TradingVue from 'trading-vue-js';

export default {
	components: { TradingVue },
	data() {
		return {
			width: window.innerWidth,
			height: window.innerHeight,
			colors: {
				colorBack: '#fff',
				colorGrid: '#eee',
				colorText: '#333',
			},
			api: {
				candles: {
					minutes: {
						url: 'https://api.upbit.com/v1/candles/minutes',
						minutes: 1,
						count: 200,
					},
				},
			},
			market: {
				minutes: {
					chart: {
						type: 'Candles',
						indexBased: true,
						data: [],
					},
				},
			},
			detailInterval: null,
		};
	},
	mounted() {
		this.width = document.querySelector('#charts').offsetWidth;
		this.height = 500;
		window.addEventListener('resize', this.onResize);

		this.getDetail();
		// clearInterval(this.detailInterval);
		// this.detailInterval = setInterval(() => {
		// 	this.getDetail();
		// }, 500);
	},
	beforeDestroy() {
		window.removeEventListener('resize', this.onResize);
		clearInterval(this.detailInterval);
	},
	methods: {
		onResize(event) {
			this.width = document.querySelector('#charts').offsetWidth;
			this.height = 500;
		},
		getCandlesMinutes() {
			return this.$axios.$get(
				`${this.api.candles.minutes.url}/1?market=KRW-BTC&count=${this.api.candles.minutes.count}`,
			);
		},
		getDetail() {
			this.getCandlesMinutes()
				.then(response => {
					const result = response.map(data => {
						return [
							data.timestamp,
							data.opening_price,
							data.high_price,
							data.low_price,
							data.trade_price,
							data.candle_acc_trade_volume,
						];
					});
					this.market.minutes.chart.data = result;
				})
				.catch(error => {
					console.log(error);
				});
		},
	},
};
</script>
