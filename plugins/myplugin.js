import Vue from 'vue';

console.log('마이 플러그인 실행');

// 전역 메소드 추가
Vue.prototype.$myMethod = function () {
	console.log('마이 메소드 실행');
};
