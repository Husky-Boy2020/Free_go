import Vue from 'vue'
// 导入根组件 App.vue
import App from './App.vue'
// 导入 路由
import router from './router'
// 导入 ElementUI
import './plugins/element.js'
// 导入字体图标
import './assets/font/iconfont.css'
// 导入全局样式表
import './assets/css/global.css'
// 导入 axios
import axios from 'axios'
import TreeTable from 'vue-table-with-tree-grid'
// 导入 vue-quill-editor 富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// 导入 vue-quill-editor 富文本编辑器样式
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme
// 导入 NProgress 宝对应的js 和 css文件
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'




// Vue 原型上挂在 axios  配置基准地址
axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'
//添加请求拦截器
// 在 request 拦截器中 展示进度条 NProgress.start()
axios.interceptors.request.use((config) => {
  NProgress.start()
  // console.log(config);
  // 请求头 添加 token
  config.headers.Authorization = window.sessionStorage.getItem('token')
  // 最后必须 return config
  return config
})
// 在 response 拦截器中 隐藏进度条 NProgress.done()
axios.interceptors.response.use((config) => {
  NProgress.done()
  return config
})
Vue.prototype.$http = axios

Vue.config.productionTip = false

// 定义全局 tree-table 组件
Vue.component('tree-table', TreeTable)
// 将富文本编辑器注册为全局可用组件
Vue.use(VueQuillEditor)

// 定义一个全局过滤器 格式化时间戳
Vue.filter('dateFormat', function (originVal) {
  const dt = new Date(originVal * 1000)

  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')

  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

new Vue({
  // 挂在路由
  router,
  // 渲染根组件
  render: h => h(App)
}).$mount('#app')
