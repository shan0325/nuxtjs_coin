<template>
	<v-row class="d-inline">
		<v-row class="d-inline">
			<v-col cols="5">
				<v-textarea
					filled
					auto-grow
					label="Child Component"
					rows="4"
					row-height="30"
					shaped
					@input="addContent"
				></v-textarea>
			</v-col>
		</v-row>
	</v-row>
</template>

<script>
export default {
	methods: {
		addContent(content) {
			this.$emit('emitContent', content);
			// this.$store.state.test.content = content;
			// this.$store.commit('test/setContent', content);
		},
	},
};
</script>
