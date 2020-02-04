import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import coolArrow from './assets/CoolArrow.vue'
import Navigator from './assets/navigator.vue'
import sexySlider from './assets/sexySlider.vue'
Vue.component('slider', sexySlider)
Vue.component('arrow', coolArrow)
Vue.component('navigator', Navigator)

Vue.config.productionTip = false

new Vue({
  vuetify,
  render: h => h(App)
}).$mount('#app')
