import VueJwtDecode from 'vue-jwt-decode';

export const state = () => ({
	authStatus: '',
	token: '',
	user: {},
	clientId: 'spring',
	secret: '1234',
});

export const getters = {
	getAuthorized: state => !!state.token,
	getAuthstatus: state => state.authStatus,
	getBasicAuth: state => 'Basic ' + btoa(state.clientId + ':' + state.secret),
};

export const mutations = {
	setAuthStatusRequest: state => {
		state.authStatus = 'loading';
	},
	setAuthStatusSuccess(state, { token }) {
		state.authStatus = 'success';
		state.token = token;
	},
	setAuthStatusError(state) {
		state.authStatus = 'error';
	},
	setLogout(state) {
		state.authStatus = '';
		state.token = '';
	},
};

export const actions = {
	async login({ commit, getters }, payload) {
		commit('setAuthStatusRequest');

		const data = new FormData();
		data.append('isManager', 'Y');
		data.append('grant_type', 'password');
		data.append('username', payload.userId);
		data.append('password', payload.password);

		const config = {
			headers: {
				'Content-type': 'application/x-www-form-urlencoded',
				Authorization: getters.getBasicAuth,
			},
		};

		try {
			const response = await this.$axios.$post(
				'/oauth/token',
				data,
				config,
			);

			const token = response.access_token;

			// 토큰을 localStorage에 저장
			localStorage.setItem('token', token);
			this.$axios.defaults.headers.common.Authorization =
				'Bearer ' + token;

			commit('setAuthStatusSuccess', { token });
			return response;
		} catch (error) {
			const errorData = error.response.data;
			if (
				errorData &&
				errorData.error_description === 'Bad credentials'
			) {
				throw new Error('로그인 정보를 다시 확인해주세요');
			}
			console.error(error);
			throw new Error(
				'시스템 오류가 발생하였습니다. 잠시후 다시 시도해주세요',
			);
		}
	},
	logout({ commit }) {
		return new Promise(resolve => {
			localStorage.removeItem('token');
			delete this.$axios.defaults.headers.common.Authorization;
			commit('setLogout');
			resolve();
		});
	},
	refreshtoken({ state, getters, commit }) {
		return new Promise((resolve, reject) => {
			commit('setAuthStatusRequest');

			const token = state.token;
			const decodeToken = VueJwtDecode.decode(token);
			// console.log(decodeToken)

			const data = new FormData();
			data.append('userId', decodeToken.user_name);

			// let data = {userId: decodeToken.user_name, token: token};
			const config = {
				headers: {
					'Content-type': 'application/x-www-form-urlencoded',
					Authorization: getters.getBasicAuth,
				},
			};

			this.$axios
				.post('/spring-admin/auth/token/refresh', data, config)
				.then(response => {
					const token = response.data.access_token;

					// 토큰을 localstorage에 저장
					localStorage.setItem('token', token);
					this.$axios.defaults.headers.common.Authorization =
						'Bearer ' + token;

					commit('setAuthStatusSuccess', { token });
					resolve(token);
				})
				.catch(error => {
					console.error(error);
					commit('setAuthStatusError');
					localStorage.removeItem('token');
				});
		});
	},
	// autoRefreshToken({ dispatch }) {
	// 	setInterval(function () {
	// 		// code goes here that will be run every 20 minutes.
	// 		dispatch('refreshtoken').then(response => {
	// 			console.log(response);
	// 		});
	// 	}, 5000);
	// },
};
