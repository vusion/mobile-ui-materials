import Vue from 'vue';
// import Router from 'vue-router';

// Vue.use(Router);

const routes = [
  {
    name: 'mlogin',
    component: () => import('./view/login'),
    meta: {
      title: '登陆'
    }
  },
  {
    name: 'mnavi',
    component: () => import('./view/navi'),
    meta: {
      title: '导航'
    }
  },
  {
    name: 'muser',
    component: () => import('./view/user'),
    meta: {
      title: '导航'
    }
  }
];

// add route path
routes.forEach(route => {
  route.path = route.path || '/' + (route.name || '');
});

const router = new window.VueRouter({ routes });

router.beforeEach((to, from, next) => {
  const title = to.meta && to.meta.title;
  if (title) {
    document.title = title;
  }
  next();
});

export {
  router
};
