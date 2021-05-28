// <project root>/api/index.js
const express = require('express');

// express 인스턴스 생성
const app = express();

// 실제로는 /api 라우트를 처리하는 메소드가 된다.
app.get('/', function (req, res) {
	res.send('API root');
});

app.get('/hello', function (req, res) {
	res.send({ test: '123' });
});

// 모듈로 사용할 수 있도록 export
// 앱의 /api/* 라우트로 접근하는 모든 요청은 모두 app 인스턴스에게 전달된다.
module.exports = {
	path: '/api',
	handler: app,
};
