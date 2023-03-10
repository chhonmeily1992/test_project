import App from './App'


// #ifndef VUE3
import Vue from 'vue'
import BootstrapVue from "@/common/js/bootstrap-vue.min.js"
import BootstrapVueIcons from "@/common/js/bootstrap-vue-icons.min.js"
Vue.use(BootstrapVue, {})
Vue.use(BootstrapVueIcons)
Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
    ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif