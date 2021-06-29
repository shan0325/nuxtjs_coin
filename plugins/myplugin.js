import Vue from 'vue';
import { TradingVue, Overlay } from 'trading-vue-js';

console.log('마이 플러그인 실행');

// 전역 메소드 추가
Vue.prototype.$myMethod = function () {
	console.log('마이 메소드 실행');
};

Vue.prototype.$overlay = Overlay;

Vue.component('TradingVue', TradingVue);
