<template>
	<view class="emptyBox">
		<image src="../static/icon/empty.png" class="emptyImg" mode=""></image>
		<view class="emptyFont">
			暂无数据
		</view>
	</view>
</template>

<script>
</script>

<style scoped lang="less">
	.emptyBox {
		display: flex;
		flex-direction: column;
		position: relative;
		align-items: center;
		width: 100vw;
		height: 300rpx;
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		transition: all 0.3s;
	}
	
	.emptyFont {
		font-size: 28rpx;
		color: #BFBFBF;
		margin-top: 40rpx;
	}
	
	.emptyImg {
		width: 420rpx;
		height: 246rpx;
	}
</style>
