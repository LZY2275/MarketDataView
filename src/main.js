import Vue from 'vue'
import App from './App.vue'
import * as echarts from 'echarts'; //引入echarts
import TDesign from 'tdesign-vue';
import VueDND from 'awe-dnd'



// 引入组件库的少量全局样式变量
import 'tdesign-vue/es/style/index.css';

Vue.config.productionTip = false
//需要挂载到Vue原型上
Vue.prototype.$echarts = echarts
Vue.use(TDesign);
Vue.use(VueDND)

new Vue({
  render: h => h(App),
}).$mount('#app')
