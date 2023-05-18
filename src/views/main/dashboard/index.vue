<template>
	<div class="home">
		<h2>欢迎进入运营平台</h2>
		<h3>{{ `${currentDate.toLocaleDateString()}` }}</h3>
		<!-- <qrcode :value="codeValue"></qrcode> -->
	</div>
</template>

<script setup>
import {ref} from 'vue'
// import Qrcode from 'qrcode.vue'

const currentDate = new Date();

// const codeValue = ref('https://www.baidu.com')

</script>

<style lang="scss" scoped>
.home {
	width: 95%;
	height: 90%;
	padding: 0 2.5%;
	background: url(@/assets/images/indexBg.png) no-repeat center;
	background-size: 70%;
}
</style>
