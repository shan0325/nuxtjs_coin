<template>
	<trading-vue
		:data="chart"
		:width="width"
		:height="height"
		:color-back="colors.colorBack"
		:color-grid="colors.colorGrid"
		:color-text="colors.colorText"
	>
	</trading-vue>
</template>

<script>
import TradingVue from 'trading-vue-js';
import Data from '@/data/data.json';

export default {
	components: { TradingVue },
	data() {
		return {
			chart: Data,
			width: window.innerWidth,
			height: window.innerHeight,
			colors: {
				colorBack: '#fff',
				colorGrid: '#eee',
				colorText: '#333',
			},
		};
	},
	mounted() {
		window.addEventListener('resize', this.onResize);
	},
	beforeDestroy() {
		window.removeEventListener('resize', this.onResize);
	},
	methods: {
		onResize(event) {
			this.width = window.innerWidth;
			this.height = window.innerHeight;
		},
	},
};
</script>
