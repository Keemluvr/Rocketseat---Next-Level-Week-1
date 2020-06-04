import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'

// Páginas
import Home from '../views/Home.vue'
import CreatePoint from '../views/CreatePoint.vue'

Vue.use(VueRouter)

  const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/create-point',
    name: 'create-point',
    component: CreatePoint
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
