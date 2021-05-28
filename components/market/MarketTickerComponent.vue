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
				ticker: 'https://api.upbit.com/v1/ticker',
			},
			market: {
				ticker: {},
			},
			dialogDetail: false,
			detailTitle: '상세',
			subject: '코인',
			detailInterval: null,
		};
	},
	watch: {
		marketParam() {
			if (this.marketParam) {
				this.getDetail();
				this.detailInterval = setInterval(() => {
					this.getDetail();
				}, 100);
				this.dialogDetail = true;
			}
		},
		dialogDetail(value) {
			if (!value) clearInterval(this.detailInterval);
		},
	},
	methods: {
		async getDetailApi() {
			return await this.$axios.$get(
				`${this.api.ticker}?markets=${this.marketParam}`,
			);
		},
		getDetail() {
			this.getDetailApi()
				.then(response => {
					this.market.ticker = response[0];
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
