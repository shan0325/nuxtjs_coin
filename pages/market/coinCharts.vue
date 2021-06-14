<template>
	<v-container fluid>
		<v-row>
			<v-col cols="7">
				<div class="text-h4 font-weight-bold">{{ market }}</div>
				<v-radio-group
					v-model="search.selected.minutes"
					row
					class="mt-5"
					@change="updateChartByMinutes"
				>
					<v-radio
						v-for="n in search.minutes"
						:key="n"
						:label="`${n}분`"
						:value="n"
					></v-radio>
				</v-radio-group>

				<v-radio-group v-model="search.selected.hours" row class="mt-0">
					<v-radio
						v-for="n in search.hours"
						:key="n"
						:label="`${n}시간`"
						:value="n"
					></v-radio>
				</v-radio-group>

				<div id="charts">
					<trading-vue
						:data="chartData"
						:width="width"
						:height="height"
						:color-back="colors.colorBack"
						:color-grid="colors.colorGrid"
						:color-text="colors.colorText"
					>
					</trading-vue>
				</div>
			</v-col>
			<v-col cols="5">
				<div><market-list-component @market="updateChart" /></div>
			</v-col>
		</v-row>
	</v-container>
</template>

<script>
import MarketListComponent from '@/components/market/MarketListComponent.vue';
import TradingVue from 'trading-vue-js';

export default {
	components: { MarketListComponent, TradingVue },
	data() {
		return {
			market: 'KRW-BTC',
			width: window.innerWidth,
			height: window.innerHeight,
			colors: {
				colorBack: '#fff',
				colorGrid: '#eee',
				colorText: '#333',
			},
			search: {
				minutes: [1, 3, 5, 10, 15],
				hours: [1, 4],
				day: [1],
				week: [1],
				month: [1],
				selected: {
					minutes: 5,
					hours: 1,
					day: 1,
					week: 1,
					month: 1,
				},
			},
			api: {
				candles: {
					minutes: {
						url: 'https://api.upbit.com/v1/candles/minutes',
						count: 200,
					},
				},
			},
			chartData: {
				chart: {
					type: 'Candles',
					indexBased: true,
					data: [],
				},
			},
			detailInterval: null,
		};
	},
	mounted() {
		this.width = document.querySelector('#charts').offsetWidth;
		this.height = 500;
		window.addEventListener('resize', this.onResize);

		this.getFirstChart();
		// clearInterval(this.detailInterval);
		// this.detailInterval = setInterval(() => {
		// 	this.getFirstChart();
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
				`${this.api.candles.minutes.url}/${this.search.selected.minutes}?market=${this.market}&count=${this.api.candles.minutes.count}`,
			);
		},
		getFirstChart() {
			this.updateChartByMinutes();
		},
		updateChart(market) {
			this.market = market;
			this.getFirstChart();
		},
		updateChartByMinutes() {
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
					this.chartData.chart.data = result;
				})
				.catch(error => {
					console.log(error);
				});
		},
	},
};
</script>
