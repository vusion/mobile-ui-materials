import Vue from 'vue';
import App from './App';
import { router } from './router';

new window.Vue({
  router,
  el: '#app',
  render: h => h(App)
});
