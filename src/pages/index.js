import VueRouter from 'vue-router';

import Login from './Login';
import Home from './Home';
import Task from './Task/Task';
import DetailTask from './Task/DetailTask';
import Profile from './Profile/Profile';
import EditProfile from './Profile/EditProfile.vue';

export const routes = [
  { path: '/', exact: true, component: Home, icon: 'home', name: 'Home', meta: { requiresAuth: true } },
  { path: '/task', exact: true, component: Task, icon: 'psychology', name: 'Task', meta: { requiresAuth: true } },
  { path: '/task/:id', exact: true, component: DetailTask, icon: 'psychology', name: 'DetailTask', meta: { requiresAuth: true } },
  { path: '/profile', exact: true, component: Profile, icon: 'psychology', name: 'Profile', meta: { requiresAuth: true } },
  { path: '/edit-profile', exact: true, component: EditProfile, icon: 'psychology', name: 'EditProfile', meta: { requiresAuth: true } },
  { path: '/login', exact: true, component: Login, icon: 'question_answer', name: 'Login' },
  { path: '*', redirect: '/' },
];

const router = new VueRouter({
  routes,
  mode: 'history',
});

// Middleware untuk proteksi rute
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('api_token');
  if (to.matched.some(record => record.meta.requiresAuth) && !token) {
    next('/login');
  } else {
    next();
  }
});

export default router;
