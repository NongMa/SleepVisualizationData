import Vue from 'vue'
import App from './App.vue'
import router from './router'
import '@/assets/common.css'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/icon.css'
import commonHeader from './components/commonHeader.vue'
Vue.use(commonHeader)
Vue.component('common-header',commonHeader)
Vue.use(ElementUI);

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  router,
  components: {
    commonHeader
  }
}).$mount('#app')
