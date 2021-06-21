<template>
	<v-container>
		<v-row>
			<v-col align="center">
				<v-card class="my-12" max-width="374">
					<v-img
						height="250"
						src="https://cdn.vuetifyjs.com/images/cards/cooking.png"
					></v-img>
					<v-card-title>Parent Component</v-card-title>
					<v-card-text>
						<v-row align="center" class="mx-0">
							<v-rating
								:value="4.5"
								color="amber"
								dense
								half-increments
								readonly
								size="14"
							></v-rating>
							<div class="grey--text ms-4">4.5 (413)</div>
						</v-row>
						<div class="my-4 text-subtitle-1">
							$ • Italian, Cafe
						</div>
						<div v-html="content"></div>
					</v-card-text>
				</v-card>

				<v-divider class="mx-4"></v-divider>

				<child @emitContent="addContent" />
			</v-col>
		</v-row>
	</v-container>
</template>

<script>
import child from '~/components/test/vuexTest/child.vue';
export default {
	components: {
		child,
	},
	data() {
		return {
			content: null,
		};
	},
	computed: {
		getContent() {
			return this.$store.getters['test/getContent'];
		},
	},
	methods: {
		addContent(content) {
			this.content = content.split('\n').join('<br/>');
		},
	},
};
</script>
