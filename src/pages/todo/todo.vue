<template lang="pug">
  view.container
    view.title {{title}}
    todo-list(
      todos="{{todos}}"
    )
</template>

<script>
import regeneratorRuntime  from '../../lib/regenerator/runtime-module.js'

export default Page({
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

  onPreload (query) {
    return new Promise(resolve => {
      setTimeout(_ => resolve('test'), 1500)
    })
  },

  async onLoad (query) {
    const data = await this.$getPreload()
    console.log('preload data: ', data)
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

