import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import moment from "moment";
moment.locale("zh-cn");


Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  router
}).$mount('#app')


