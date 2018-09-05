<template lang="pug">
  view.item {{item}}
</template>

<script>
export default Component({
  properties: {
    item: String
  }
})
</script>

<style lang="scss">
  .item {
    background: #fff;
    margin: 15rpx 0;
  }
</style>

