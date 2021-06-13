<template>
	<div>
		<v-row align="center">
			<v-col cols="12" align="center">
				<div class="mt-5 pb-6 font-weight-bold text-h4">
					CURRENT
					<span class="red--text">TIME</span>
				</div>
				<clock />
			</v-col>
		</v-row>
		<v-row align="center">
			<v-col cols="12" align="center">
				<fox />
			</v-col>
		</v-row>
	</div>
</template>

<script>
import clock from '@/components/codepen/clock.vue';
import fox from '@/components/codepen/fox.vue';
export default {
	components: {
		clock,
		fox,
	},
};
</script>
