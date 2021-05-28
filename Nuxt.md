# Nuxt.js
## Nuxt.js 프로젝트 생성
- npx 또는 npm 을 이용하여 프로젝트를 생성
- Nuxt팀에서 스캐폴딩해놓은 프로젝트 템플릿을 이용하여 프로젝트를 설치한다.
1. npx : Package Runneer(npm에서 다운받아 실행)
```
npx create-nuxt-app <project-name>
```
2. npm : Pacakge Manager(패키지 모듈 버전 관리)
```
npm init nuxt-app <project-name>
```
## Nuxt.js 디렉토리 구조
```
Nuxt
├─ assets/ 
├─ components/
│  └─ Logo.vue
├─ layouts/
│  └─ default.vue
├─ middleware/
├─ pages/
│  └─ index.vue
├─ plugins/
│  └─ README.md 
├─ static/
│  ├─ README.md
│  └─ favicon.ico
├─ store/
├────────────────────
├─ .vscode
│  └─ settings.json
├─ .editorconfig
├─ .eslintrc.js
├─ .gitignore
├─ .prettierrc
├─ nuxt.config.js
├─ package-lock.json
└─ package.json
```
- assets
	- css, image, font와 같은 리소스들을 포함한다.
- components 
	- 애플리케이션에서 사용될 컴포넌트들을 포함하며 해당 경로에 위치된 컴포넌트들은 Nuxt.js의 비동기 데이터 함수인 `asyncData` 또는 `fetch`를 사용할 수 없다.
- layouts
	- 애플리케이션 전체에 대한 레이아웃을 포함한다. 기본으로 `default.vue`가 생성되어 있을 것이고 상황에 맞게 layout을 생성할 수 있다.
	- `해당 디렉토리는 이름을 변경할 수 없다.`
- middleware
	- 애플리케이션에서 사용될 middleware를 포함한다. middleware는 페이지 또는 레이아웃이 렌더링 되기 전에 실행이 되며, middleware를 페이지나 레이아웃에 바인딩하였다면 해당 페이지나 레이아웃이 실행되기 전에 매번 실행된다.
- pages
	- 실제 애플리케이션의 페이지 구성을 포함하며 해당 디렉토리의 구조에 따라 `router`가 자동으로 생성된다.
	- `해당 디렉토리는 이름을 변경할 수 없다.`
- plugins
	- 애플리케이션에 바인딩 될 외부 혹은 내부 plugins를 포함한다.
	- plugins는 애플리케이션이 인스턴스 화 되기 전에 실행하며 전역적으로 구성 요소를 등록하고 함수 또는 상수를 삽입할 수 있다.
- static
	- 해당 디렉토리는 정적인 파일들을 포함한다. 구성에 따라서 `html`, `Javascript` 파일도 포함 시킬 수 있다. 
	- `해당 디렉토리는 이름을 변경할 수 없다.`
- store
	- 애플리케이션에서 사용될 vuex store 파일들을 포함한다. 기본적으로 비활성화 상태이고 store 디렉토리에 `index.js` 파일을 작성하면 store가 활성화된다. 
	- 구성에 따라서 모듈 형태의 store를 형성할 수 있다. 
	- `해당 디렉토리는 이름을 변경할 수 없다.`

## Nuxt.js 실행
### pacakge.json
```
...
"scripts": {
	"dev": "nuxt",
	"build": "nuxt build",
	"start": "nuxt start",
	"generate": "nuxt generate",
	...
}
...
```
1. dev
	- 개발 서버를 Hot-reloading 상태로 localhost:3000으로 실행된다.
```
npm run dev
```
2. build
	- Webpack을 통해 애플리케이션을 빌드한다.
```
npm run build
```

3. start
	- 프로덕션(nuxt 배포)모드로 서버를 시작한다.(build 실행 후 진행된다.)
```
npm run start 
```

4. generate
	- 애플리케이션을 빌드하고 모든 라우트를 HTML 파일로 생성한다.(정적 호스팅)
```
npm run generate
```

## Module
### Axios / Proxy

1. 모듈 설치 
> npm 으로 모듈 설치
```
npm i @nuxtjs/axios
npm i @nuxtjs/proxy
```
2. 모듈 Import
> nuxt.config.js파일에 설치된 모듈 import

**nuxt.config.js**
```
module.exports = {
    modules: [
        '@nuxtjs/axios'
    ],
    axios: {
        proxy: true,
		baseURL: 'http://localhost:8080'
    },
    proxy: {
		'/api/': {
			target: 'http://localhost:8080',
			pathRewrite: { '^/api:': '' }
		}
    }
}
```
---
- 출처 
	> https://kdydesign.github.io/2019/04/10/nuxtjs-tutorial/