<template>
	<v-container>
		<v-card>
			<v-card-title>
				<p>{{ title }}</p>
			</v-card-title>
			<v-card-text>
				<market-ticker-component
					:market-param="market"
					@market="showDetailBus"
				/>
				<market-list-component @market="showDetailBus" />
			</v-card-text>
		</v-card>
	</v-container>
</template>

<script>
import MarketListComponent from '@/components/market/MarketListComponent.vue';
import MarketTickerComponent from '@/components/market/MarketTickerComponent.vue';
export default {
	components: {
		MarketListComponent,
		MarketTickerComponent,
	},
	data() {
		return {
			title: '코인 목록',
			market: null,
		};
	},
	methods: {
		showDetailBus(market) {
			this.market = market;
		},
	},
};
</script>
