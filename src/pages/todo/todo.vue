<template lang="pug">
  view.container
    view.title {{title}}
    todo-list(
      todos="{{todos}}"
    )
</template>

<script>
export default Page({
  $route: 'pages/todo/todo',

  config: {
    usingComponents: {
      'todo-list': '../../components/todo-list/todo-list'
    }
  },

  data: {
    title: 'TODOs',
    todos: [
      '1. 完善样板项目',
      '2. 扩展、封装底层逻辑',
      '3. 移植常用组件',
      '4. Enjoy coding'
    ]
  },

  onPreload ({ route, query }) {
    this.$set(route, new Promise(resolve => setTimeout(_ => resolve('test'), 500)))
  },

  onLoad (query) {
    this.$get(this.$route).then(data => {
      console.log('preload data: ', data)
    })
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
  }
</style>

