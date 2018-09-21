<script>
import './lib/extend.js'
import tokenManager from './lib/token-manager.js'
import regeneratorRuntime from './lib/regenerator/runtime-module'

export default App({
  config: {
    homepage: 'pages/home/home',
    window: {
      navigationBarTitleText: 'MINA VUE DEMO',
      navigationBarTextStyle: 'black',
      navigationBarBackgroundColor: '#fff'
    },
    tabBar: {
      color: "#000",
      selectedColor: "#000",
      backgroundColor: "#fff",
      list: [{
        text: "首页",
        pagePath: "pages/home/home",
        iconPath: "./assets/images/icon/tab-home.png",
        selectedIconPath: "./assets/images/icon/tab-home-selected.png"
      }, {
        text: "TODO",
        pagePath: "pages/todo/todo",
        iconPath: "./assets/images/icon/tab-todo.png",
        selectedIconPath: "./assets/images/icon/tab-todo-selected.png"
      }]
    }
  },
  async onLaunch() {
    console.log('on app launch.')
      let system=await wx.$getSystemInfo()
      console.log(system)
    try {
      await wx.$checkSession()
      console.log('session_key 未过期，并且在本生命周期一直有效')
    } catch (error) {
      console.log('session_key 已经失效，需要重新执行登录流程')
      tokenManager.getAccessToken()
    }
  },
})
</script>

<style lang="scss">
@import './assets/style/base.scss';
@import './assets/style/components.scss';
</style>

