<template>
	<v-data-table
		:headers="headers"
		:items="market.all"
		:items-per-page="100"
		class="elevation-1"
		:search="search"
	>
		<template #top>
			<v-text-field
				v-model="search"
				label="검색은 여기서"
				class="mx-4"
			></v-text-field>
		</template>
		<template #body="{ items }">
			<tbody>
				<tr
					v-for="(item, i) in items"
					:key="i"
					@click="showDetail(item.market)"
				>
					<td>{{ item.market }}</td>
					<td>{{ item.korean_name }}</td>
					<td>{{ item.english_name }}</td>
				</tr>
			</tbody>
		</template>
	</v-data-table>
</template>

<script>
export default {
	data() {
		return {
			api: {
				all: 'https://api.upbit.com/v1/market/all',
				ticker: 'https://api.upbit.com/v1/ticker',
			},
			market: {
				all: [],
			},
			headers: [
				{ text: 'market', value: 'market' },
				{ text: 'korean_name', value: 'korean_name' },
				{ text: 'english_name', value: 'english_name' },
			],
			search: null,
		};
	},
	created() {
		this.getMarketList()
			.then(response => {
				if (response) {
					this.market.all = response.filter(res =>
						res.market.includes('KRW'),
					);
				}
			})
			.catch(error => {
				console.log(error);
			});
	},
	methods: {
		async getMarketList() {
			return await this.$axios.$get(this.api.all);
		},
		showDetail(market) {
			this.$emit('market', market);
		},
	},
};
</script>
