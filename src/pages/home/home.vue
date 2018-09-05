<template lang="pug">
  view.container
    view.title {{title}}
    view.desc {{desc}}
  
    navigator(
      url="/pages/todo/todo"
    ) Todos
</template>

<script>
export default Page({
  data: {
    title: 'MINA VUE',
    desc: '用Vue单文件组件的方式开发小程序'
  },

  onLoad() {
    console.log('on page load.')
  }
})
</script>

<style lang="scss">
  .container {
    padding: 15rpx 30rpx;

    .title {
      font-size: 48rpx;
      font-weight: bold;
    }

    .desc {
      font-size: 36rpx;
    }

    navigator {
      color: blue;
      text-decoration: underline;
      margin-top: 50rpx;
    }
  }
</style>

