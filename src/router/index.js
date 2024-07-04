import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import PageView from '../views/PageView.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/test',
      name: 'test',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/TestView.vue')
    },
    {
      path: '/page',
      name: 'page',
      // route level code-splitting
      // this generates a separate chunk (page.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: PageView
    },
    {
      path: '/scene',
      name: 'scene',
      // route level code-splitting
      // this generates a separate chunk (page.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AFrameScene.vue')
    },
    {
      path: '/village',
      name: 'village',
      // route level code-splitting
      // this generates a separate chunk (page.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/VillageView.vue')
    },
    {
      path: '/laser',
      name: 'laser',
      // route level code-splitting
      // this generates a separate chunk (page.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/LaiserView.vue')
    },
    {
      path: '/test2',
      name: 'test2',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/TestView2.vue')
    },
  ]
})

export default router
