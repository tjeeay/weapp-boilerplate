<template lang="pug">
  view.container
    view.title {{title}}
    view.desc {{desc}}
  
    view.btn-nav(
      bindtap="navTodo"
    ) Todos
</template>

<script>
export default Page({
  data: {
    title: 'MINA VUE',
    desc: '用Vue单文件组件的方式开发小程序'
  },

  onLoad () {
    console.log('on page load.')
  },

  navTodo (e) {
    wx.$switchTab('todo/todo')
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

    .btn-nav {
      color: blue;
      text-decoration: underline;
      margin-top: 50rpx;
    }
  }
</style>

