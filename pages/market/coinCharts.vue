<template>
	<v-container fluid>
		<v-row>
			<v-col cols="7">
				<div class="text-h4 font-weight-bold">{{ market }}</div>
				<v-radio-group
					v-model="search.selected"
					row
					class="mt-5"
					@change="updateChart"
				>
					<v-radio
						v-for="n in search.minutes"
						:key="n"
						:label="`${n}분`"
						:value="`m_${n}`"
					></v-radio>
				</v-radio-group>

				<v-radio-group
					v-model="search.selected"
					row
					class="mt-0"
					@change="updateChart"
				>
					<v-radio
						v-for="n in search.days"
						:key="n"
						:label="`${n}일`"
						:value="`d_${n}`"
					></v-radio>
				</v-radio-group>

				<v-radio-group
					v-model="search.selected"
					row
					class="mt-0"
					@change="updateChart"
				>
					<v-radio
						v-for="n in search.weeks"
						:key="n"
						:label="`${n}주`"
						:value="`w_${n}`"
					></v-radio>
				</v-radio-group>

				<div id="charts">
					<trading-vue
						:title-txt="market"
						:data="chartData"
						:overlays="overlays"
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
				<div><market-list-component @market="updateChartBus" /></div>
			</v-col>
		</v-row>
	</v-container>
</template>

<script>
import MarketListComponent from '@/components/market/MarketListComponent.vue';
import { TradingVue } from 'trading-vue-js';
import testOverlay from './testOverlay.vue';

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
				minutes: [1, 3, 5, 10, 15, 30],
				hours: [1, 4],
				days: [1],
				weeks: [1],
				months: [1],
				selected: '',
			},
			api: {
				candles: {
					minutes: {
						url: 'https://api.upbit.com/v1/candles/minutes',
					},
					days: {
						url: 'https://api.upbit.com/v1/candles/days',
					},
					weeks: {
						url: 'https://api.upbit.com/v1/candles/weeks',
					},
				},
			},
			chartData: {
				chart: {
					type: 'Candles',
					indexBased: true,
					data: [],
				},
				drawingMode: true,
				tools: {
					settings: {
						color: '#fff',
					},
				},
			},
			overlays: [testOverlay],
			chartInterval: null,
		};
	},
	mounted() {
		this.width = document.querySelector('#charts').offsetWidth;
		this.height = 500;
		window.addEventListener('resize', this.onResize);

		// document.onkeydown = function (event) {
		// 	if (event.keyCode === 116) {
		// 		alert('새로고침을 할 수 없습니다.');
		// 		event.keyCode = 2;
		// 		return false;
		// 	} else if (
		// 		event.ctrlKey &&
		// 		(event.keyCode === 78 || event.keyCode === 82)
		// 	) {
		// 		return false;
		// 	}
		// };

		this.updateChart();
	},
	beforeDestroy() {
		window.removeEventListener('resize', this.onResize);
		clearInterval(this.chartInterval);
	},
	methods: {
		getCandlesMinutesApi() {
			return this.$axios.$get(
				`${
					this.api.candles.minutes.url
				}/${this.search.selected.substring(2)}?market=${
					this.market
				}&count=200`,
			);
		},
		getCandlesDaysApi() {
			return this.$axios.$get(
				`${this.api.candles.days.url}?market=${this.market}&count=200`,
			);
		},
		getCandlesWeeksApi() {
			return this.$axios.$get(
				`${this.api.candles.weeks.url}?market=${this.market}&count=200`,
			);
		},
		updateChartBus(market) {
			this.market = market;
			this.updateChart();
		},
		updateChart() {
			clearInterval(this.chartInterval);
			this.updateCandlesData();
			this.chartInterval = setInterval(() => {
				this.updateCandlesData();
			}, 300);
		},
		updateCandlesData() {
			if (!this.search.selected) {
				this.search.selected = 'd_1';
			}

			const gubun = this.search.selected.substring(0, 1);
			if (gubun === 'm') {
				this.setCandlesData(this.getCandlesMinutesApi);
			} else if (gubun === 'd') {
				this.setCandlesData(this.getCandlesDaysApi);
			} else if (gubun === 'w') {
				this.setCandlesData(this.getCandlesWeeksApi);
			}
		},
		setCandlesData(getCandlesApi) {
			getCandlesApi()
				.then(response => {
					const chartData = response.map(data => {
						return [
							data.timestamp,
							data.opening_price,
							data.high_price,
							data.low_price,
							data.trade_price,
							data.candle_acc_trade_volume,
						];
					});
					this.chartData.chart.data = chartData.reverse();
				})
				.catch(error => {
					console.log(error);
				});
		},
		onResize(event) {
			this.width = document.querySelector('#charts').offsetWidth;
			this.height = 500;
		},
	},
};
</script>
