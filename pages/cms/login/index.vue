<template>
	<v-main>
		<v-container fluid fill-height>
			<v-layout align-center justify-center>
				<v-flex xs12 sm8 md4>
					<v-card>
						<v-toolbar color="primary">
							<v-toolbar-title>Admin Panel</v-toolbar-title>
							<v-spacer />
						</v-toolbar>
						<v-card-text>
							<v-form>
								<v-text-field
									v-model="userId"
									prepend-icon="mdi-alien"
									:rules="[
										() =>
											!!userId ||
											'아이디는 필수 입력입니다.',
									]"
									label="아이디"
									required
									autofocus
								></v-text-field>
								<v-text-field
									v-model="password"
									prepend-icon="mdi-lock"
									:rules="[
										() =>
											!!password ||
											'비밀번호는 필수 입력입니다.',
									]"
									:append-icon="
										showPassword ? 'mdi-eye-off' : 'mdi-eye'
									"
									:type="showPassword ? 'text' : 'password'"
									label="비밀번호"
									counter
									required
									@keydown.enter="doLogin"
									@click:append="showPassword = !showPassword"
								></v-text-field>
							</v-form>
						</v-card-text>
						<v-card-actions>
							<v-btn
								block
								depressed
								large
								color="primary"
								@click="doLogin"
								>Login</v-btn
							>
						</v-card-actions>
						<v-snackbar
							v-model="snackbar"
							:color="color"
							:top="true"
						>
							{{ errorMessages }}
							<template #action="{ attrs }">
								<v-btn
									color="red"
									text
									v-bind="attrs"
									@click="snackbar = false"
								>
									Close
								</v-btn>
							</template>
						</v-snackbar>
					</v-card>
				</v-flex>
			</v-layout>
		</v-container>
	</v-main>
</template>

<script>
export default {
	layout: 'cms/login',
	data() {
		return {
			userId: '',
			password: '',
			errorMessages: 'Incorrect login info',
			snackbar: false,
			color: 'general',
			showPassword: false,
		};
	},
	methods: {
		doLogin() {
			const userId = this.userId;
			const password = this.password;

			if (userId === '') {
				this.errorMessages = '아이디는 필수 입력입니다.';
				this.snackbar = true;
				return;
			}
			if (password === '') {
				this.errorMessages = '비밀번호는 필수 입력입니다.';
				this.snackbar = true;
				return;
			}

			this.$store
				.dispatch('cms/login/login', { userId, password })
				.then(response => {
					// console.log(response);
					this.$router.push('/');
				})
				.catch(error => {
					this.errorMessages = error.message;
					this.snackbar = true;
				});
		},
	},
};
</script>
