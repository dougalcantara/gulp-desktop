import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: require('@/components/Home').default,
    },
    {
      path: '/projects',
      name: 'projects',
      component: require('@/components/Projects').default,
    },
    {
      path: '/configs',
      name: 'configs',
      component: require('@/components/Configs').default,
    },
    {
      path: '/marketplace',
      name: 'marketplace',
      component: require('@/components/Marketplace').default,
    },
    {
      path: '/settings',
      name: 'settings',
      component: require('@/components/Settings').default,
    },
    {
      path: '/help',
      name: 'help',
      component: require('@/components/Help').default,
    },
    {
      path: '*',
      redirect: '/',
    },
  ],
});
