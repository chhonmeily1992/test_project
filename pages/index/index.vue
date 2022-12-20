<template>
<!-- 	<view class="content">
		<image class="logo" src="/static/logo.png"></image>
		<view class="text-area">
			<text class="title">{{title}}</text>
		</view>
	</view> -->
	<div>
		<Navbar/>
		<b-alert show>Default Alert</b-alert>
		
		    <b-alert variant="success" show>Success Alert</b-alert>
		
		    <b-alert v-model="showDismissibleAlert" variant="danger" dismissible>
		      Dismissible Alert!
		    </b-alert>
		
		    <b-alert
		      :show="dismissCountDown"
		      dismissible
		      variant="warning"
		      @dismissed="dismissCountDown=0"
		      @dismiss-count-down="countDownChanged"
		    >
		      <p>This alert will dismiss after {{ dismissCountDown }} seconds...</p>
		      <b-progress
		        variant="warning"
		        :max="dismissSecs"
		        :value="dismissCountDown"
		        height="4px"
		      ></b-progress>
		    </b-alert>
		
		    <b-button @click="showAlert" variant="info" class="m-1">
		      Show alert with count-down timer
		    </b-button>
		    <b-button @click="showDismissibleAlert=true" variant="info" class="m-1">
		      Show dismissible alert ({{ showDismissibleAlert ? 'visible' : 'hidden' }})
		    </b-button>
	</div>
</template>

<script>
	import Navbar from '../../components/Navbar.vue';
	export default {
		components: {
			Navbar
		},
		data() {
			return {
				title: 'Hello',
				dismissSecs: 10,
				dismissCountDown: 0,
				showDismissibleAlert: false
			}
		},
		onLoad() {

		},
		methods: {
			countDownChanged(dismissCountDown) {
				this.dismissCountDown = dismissCountDown
			},
			showAlert() {
				this.dismissCountDown = this.dismissSecs
			}
		}
	}
</script>

<style>
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.logo {
		height: 200rpx;
		width: 200rpx;
		margin-top: 200rpx;
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 50rpx;
	}

	.text-area {
		display: flex;
		justify-content: center;
	}

	.title {
		font-size: 36rpx;
		color: #8f8f94;
	}
</style>
