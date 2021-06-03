<template>
	<v-dialog v-model="dialogDetail" scrollable max-width="600">
		<v-card>
			<v-toolbar color="primary">
				<span class="headline white--text">{{ marketParam }}</span>
			</v-toolbar>
			<v-card-text>
				<div class="d-flex align-center py-2">
					<strong class="text-h5 font-weight-bold grey--text">
						{{ priceComma(market.ticker.trade_price) }}
					</strong>
				</div>
				<v-divider></v-divider>
				<div class="text-subtitle-1 font-weight-medium mt-2">
					거래량 {{ priceComma(market.ticker.acc_trade_volume_24h) }}
				</div>
				<div class="text-subtitle-1 font-weight-medium mt-2">
					거래금 {{ priceComma(market.ticker.acc_trade_price_24h) }}
				</div>
				<div class="text-subtitle-1 font-weight-medium mt-2">
					시가 {{ priceComma(market.ticker.opening_price) }}
				</div>
				<div class="text-subtitle-1 font-weight-medium mt-2">
					고가 {{ priceComma(market.ticker.high_price) }}
				</div>
				<div class="text-subtitle-1 font-weight-medium mt-2">
					저가 {{ priceComma(market.ticker.low_price) }}
				</div>
				<div class="text-subtitle-1 font-weight-medium mt-2">
					종가 {{ priceComma(market.ticker.prev_closing_price) }}
				</div>
			</v-card-text>
		</v-card>
	</v-dialog>
</template>

<script>
export default {
	props: {
		marketParam: {
			type: String,
			default: null,
		},
	},
	data() {
		return {
			api: {
				ticker: {
					url: 'https://api.upbit.com/v1/ticker',
				},
				candles: {
					minutes: {
						url: 'https://api.upbit.com/v1/candles/minutes',
						minutes: 1,
						count: 200,
					},
				},
			},
			market: {
				ticker: {},
				minutes: [],
			},
			dialogDetail: false,
			detailTitle: '상세',
			subject: '코인',
			detailInterval: null,
		};
	},
	watch: {
		marketParam(value) {
			if (value) {
				this.getDetail();
				this.detailInterval = setInterval(() => {
					this.getDetail();
				}, 500);
				this.dialogDetail = true;
			}
		},
		dialogDetail(value) {
			if (!value) {
				clearInterval(this.detailInterval);
				this.$emit('market', null);
			}
		},
	},
	methods: {
		getDetailApi() {
			return this.$axios.$get(
				`${this.api.ticker.url}?markets=${this.marketParam}`,
			);
		},
		getCandlesMinutes() {
			return this.$axios.$get(
				`${this.api.candles.minutes.url}/1?market=${this.marketParam}&count=${this.api.candles.minutes.count}`,
			);
		},
		getDetail() {
			this.getDetailApi()
				.then(response => {
					this.market.ticker = response[0];
					this.getCandlesMinutes()
						.then(response => {
							this.market.minutes = response;
						})
						.catch(error => {
							console.log(error);
						});
				})
				.catch(error => {
					console.log(error);
				});
		},
		priceComma(price) {
			return price ? Number(price).toLocaleString() : '';
		},
		sleep(ms) {
			return new Promise((resolve, reject) => setTimeout(resolve, ms));
		},
	},
};
</script>
