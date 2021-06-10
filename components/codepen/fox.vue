<template>
	<div class="codepen_fox">
		<div class="fox">
			<div class="head">
				<div class="eye"></div>
				<div class="eye"></div>
			</div>
			<div class="ear"></div>
			<div class="ear"></div>
			<div class="nose"></div>
			<div class="body"></div>
			<div class="tail"></div>
		</div>

		<a href="https://twitter.com/cecelabomfim" class="author"
			>Marcela Bomfim</a
		>
	</div>
</template>

<script>
export default {};
</script>

<style>
.codepen_fox,
.codepen_fox:after,
.codepen_fox:before {
	box-sizing: border-box;
	margin: 0;
	padding: 0;
	-webkit-transition: all 100ms ease-in;
	transition: all 100ms ease-in;
}
.codepen_fox {
	background: #f9ece8;
}
.codepen_fox .fox {
	width: 215px;
	height: 275px;
	display: block;
	position: absolute;
	top: 50%;
	left: 50%;
	-webkit-transform: translate(-50%, -50%);
	transform: translate(-50%, -50%);
}
.codepen_fox .fox .head {
	width: 184px;
	height: 184px;
	display: block;
	background: #ff7373;
	border-radius: 50%;
	position: absolute;
	z-index: 2;
	top: 0px;
	right: 0px;
	overflow: hidden;
}
.codepen_fox .fox .head:before,
.codepen_fox .fox .head:after {
	content: '';
	width: 184px;
	height: 184px;
	display: block;
	background: #fff;
	border-radius: 50%;
	position: absolute;
	z-index: 1;
	bottom: -92px;
}
.codepen_fox .fox .head:before {
	left: -92px;
}
.codepen_fox .fox .head:after {
	right: -92px;
}
.codepen_fox .fox .head .eye {
	width: 18px;
	height: 9px;
	display: block;
	background: #000;
	border-radius: 18px 18px 0 0;
	position: absolute;
	z-index: 2;
	bottom: 40px;
	animation: piscar 5s step-start 0s infinite;
	-webkit-animation: piscar 5s step-start 0s infinite;
}
.codepen_fox .fox .head .eye:nth-child(odd) {
	left: 37px;
	transform: rotate(45deg);
	-moz-transform: rotate(45deg);
	-webkit-transform: rotate(45deg);
}
.codepen_fox .fox .head .eye:nth-child(even) {
	right: 37px;
	transform: rotate(-45deg);
	-moz-transform: rotate(-45deg);
	-webkit-transform: rotate(-45deg);
}
.codepen_fox .fox .ear {
	width: 93px;
	height: 93px;
	display: block;
	background: #ff9090;
	position: absolute;
	top: 0px;
}
.codepen_fox .fox .ear:nth-child(odd) {
	border-radius: 0 93px 0 0;
	left: 31px;
}
.codepen_fox .fox .ear:nth-child(even) {
	border-radius: 93px 0 0 0;
	right: 0px;
}
.codepen_fox .fox .nose {
	width: 27px;
	height: 27px;
	display: block;
	background: #000;
	border-radius: 50%;
	position: absolute;
	z-index: 3;
	top: 169px;
	right: 78px;
}
.codepen_fox .fox .body {
	width: 107px;
	height: 214px;
	display: block;
	background: #ff7373;
	border-radius: 0 214px 214px 0;
	position: absolute;
	z-index: 1;
	bottom: 0px;
	right: 0px;
}
.codepen_fox .fox .tail {
	width: 215px;
	height: 107px;
	display: block;
	background: #ff7373;
	border-radius: 0 0 214px 214px;
	position: absolute;
	z-index: 1;
	bottom: 0px;
	right: 0px;
	overflow: hidden;
}
.codepen_fox .fox .tail:before {
	content: '';
	width: 57px;
	height: 57px;
	display: block;
	background: #fff;
	border-radius: 50%;
	position: absolute;
	top: -30px;
	left: -30px;
}

.codepen_fox .fox:hover .head,
.codepen_fox .fox:hover .ear {
	transform: rotate(15deg);
	-moz-transform: rotate(15deg);
	-webkit-transform: rotate(15deg);
}
.codepen_fox .fox:hover .ear:nth-child(odd) {
	left: 48px;
}
.codepen_fox .fox:hover .ear:nth-child(even) {
	right: -3px;
	top: 20px;
}
.codepen_fox .fox:hover .nose {
	width: 24px;
	height: 24px;
	top: 165px;
	right: 103px;
}
.codepen_fox a.author {
	font-size: 12px;
	text-decoration: none;
	color: #f47c7c;
	position: fixed;
	bottom: 10px;
	right: 10px;
}

@keyframes piscar {
	15% {
		height: 1px;
	}
	45% {
		height: 9px;
	}
	50% {
		height: 1px;
	}
}
@-webkit-keyframes piscar {
	15% {
		height: 1px;
	}
	45% {
		height: 9px;
	}
	50% {
		height: 1px;
	}
}
</style>
