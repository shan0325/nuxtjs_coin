export const state = () => ({
	content: '',
});

export const getters = {
	getContent(state) {
		return state.content;
	},
};

export const mutations = {
	setContent(state, content) {
		state.content = content;
	},
};
