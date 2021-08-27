import Vue from 'vue';
import App from './App';
import { router } from './router';
Vue.config.devtools = true;
new window.Vue({
  router,
  el: '#app',
  render: h => h(App)
});
